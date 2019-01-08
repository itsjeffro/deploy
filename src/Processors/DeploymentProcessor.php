<?php

namespace Deploy\Processors;

use DateTime;
use Deploy\Deployment\CommandParser;
use Deploy\Deployment\Scripts;
use Deploy\Deployment\Sequences;
use Deploy\Events\DeploymentDeploying;
use Deploy\Events\DeploymentFinished;
use Deploy\Models\Deployment;
use Deploy\Models\Process;
use Deploy\Models\Project;
use Deploy\ProviderRepository\Commit;
use Deploy\Ssh\Client;
use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Exception\ProcessFailedException;

class DeploymentProcessor extends AbstractProcessor
{
    /**
     * @var \Deploy\Models\Deployment
     */
    private $deployment;

    /**
     * @var \Deploy\Models\Project
     */
    private $project;

    /**
     * @var string
     */
    private $time;

    /**
     * @var array
     */
    private $output = [];

    /**
     * @var \Deploy\Deployment\Scripts
     */
    private $deploymentScripts;

    /**
     * Instantiate constructor.
     *
     * @param \Deploy\Models\Deployment $deployment
     * @param \Deploy\Models\Project    $project
     *
     * @return void
     */
    public function __construct($deployment, $project)
    {
        $this->deploymentScripts = new Scripts($project);
        $this->deployment = $deployment;
        $this->project = $project;
        $this->time = (new DateTime())->format('YmdHis');
    }

    /**
     * {@inheritdoc}
     */
    public function fire()
    {
        $status = Deployment::FINISHED;

        $this->updateDeploymentCommitData($this->project, $this->deployment);
        $this->updateDeploymentAsDeploying($this->deployment);

        try {
            $sequences = (new Sequences($this->deployment))->getSequences();

            foreach ($sequences as $sequence) {
                $exitCode = $this->runSequence($sequence);

                if ($exitCode > 0) {
                    $status = Deployment::FAILED;
                    break;
                }
            }
        } catch (ProcessFailedException $e) {
            $status = Deployment::FAILED;

            Log::info($e->getTraceAsString());
        } catch (Exception $e) {
            $status = Deployment::FAILED;

            Log::info($e->getTraceAsString());
        }

        $this->updateRemainingProcessesAsCancelled($this->deployment);
        $this->updateDeploymentAsFinished($status);
    }

    /**
     * Run through each process in a sequence. Gather exit codes and output.
     *
     * @param array $sequence
     *
     * @return int
     */
    public function runSequence(array $sequence)
    {
        $exitCode = 0;

        $processes = array_map(
            function ($process) {
                $client = new Client($this->getHost($process->server), $this->getScript($process));

                return [
                    $client->getProcess(),
                    $process,
                ];
            },
            $sequence['processes']
        );

        foreach ($processes as $process) {
            $host = $process[0];
            $process = $process[1];

            $process->started_at = (new DateTime())->format('Y-m-d H:i:s');
            $process->status = Process::RUNNING;
            $process->save();

            $host->run(function ($type, $output) use ($process) {
                $this->output[$process->id][] = $output;
            });
        }

        foreach ($processes as $process) {
            $host = $process[0];
            $process = $process[1];

            $exitCode += $host->getExitCode();

            $process->status = $host->getExitCode() > 0 ? Process::FAILED : Process::FINISHED;
            $process->output = isset($this->output[$process->id]) ? implode('', $this->output[$process->id]) : '';
            $process->finished_at = (new DateTime())->format('Y-m-d H:i:s');
            $process->save();
        }

        unset($processes);

        return $exitCode;
    }

    /**
     * Update the deployment with the fetched commit data.
     *
     * @param \Deploy\Models\Project    $project
     * @param \Deploy\Models\Deployment $deployment
     *
     * @return void
     */
    public function updateDeploymentCommitData(Project $project, Deployment $deployment)
    {
        $commit = new Commit($deployment->reference, $deployment->branch);
        $commitData = $commit->getByProject($project);

        $deployment->fill([
            'committer'        => $commitData['display_name'],
            'committer_avatar' => $commitData['avatar_link'],
            'commit'           => $commitData['hash'],
            'commit_url'       => $commitData['commit_url'],
        ]);
        $deployment->save();
    }

    /**
     * Update deployment as deploying.
     *
     * @param \Deploy\Models\Deployment $deployment
     *
     * @return null
     */
    public function updateDeploymentAsDeploying($deployment)
    {
        $deployment->fill([
            'status' => 3,
        ]);
        $deployment->save();

        event(new DeploymentDeploying($deployment));

        unset($deployment);
    }

    /**
     * Update deployment as finished.
     *
     * @param int $status
     *
     * @return void
     */
    public function updateDeploymentAsFinished($status)
    {
        $deployment = $this->deployment;
        $deployment->fill([
            'status'   => $status,
            'duration' => $this->calculateDuration($this->deployment),
        ]);
        $deployment->save();

        event(new DeploymentFinished($deployment));

        unset($deployment);
    }

    /**
     * Update any remaining processes as cancelled.
     *
     * @param \Deploy\Models\Deployment $deployment
     *
     * @return void
     */
    public function updateRemainingProcessesAsCancelled($deployment)
    {
        $processes = $deployment->processes()
            ->where('status', 0)
            ->get();

        foreach ($processes as $process) {
            $process->status = Process::CANCELLED;
            $process->save();
        }
    }

    /**
     * Calculate duration from step progress.
     *
     * @param array $deployment
     *
     * @return int
     */
    public function calculateDuration($deployment)
    {
        $duration = 0;

        foreach ($deployment->processes as $process) {
            $duration += (strtotime($process->finished_at) - strtotime($process->started_at));
        }

        return $duration;
    }

    /**
     * Return process' parsed script.
     *
     * @param array $process
     *
     * @return string
     */
    public function getScript($process)
    {
        $commandParser = new CommandParser([
            'symlink'      => 'ln -nfs',
            'repository'   => $this->getProviderTarball(),
            'project'      => $process->server->project_path,
            'releases'     => $process->server->project_path.'/releases',
            'release'      => $process->server->project_path.'/releases/'.$this->time,
            'time'         => $this->time,
        ]);

        $script = $commandParser->parseScript($this->getHookScript($process));

        return implode(PHP_EOL, array_map('trim', explode(PHP_EOL, $script)));
    }

    /**
     * Return script for action or action hook.
     *
     * @param \Deploy\Models\Process $process
     *
     * @return string
     */
    public function getHookScript($process)
    {
        if ($process->hook_id) {
            return $process->hook->script;
        }

        if ($process->action_id === 1) {
            return $this->deploymentScripts->stepCloneRelease();
        }

        if ($process->action_id === 2) {
            return $this->deploymentScripts->stepActivateRelease();
        }

        if ($process->action_id === 3) {
            return $this->deploymentScripts->stepCleanUp();
        }
    }

    /**
     * Get link for provider tarball.
     *
     * @return string
     */
    public function getProviderTarball()
    {
        if ($this->project->provider_id === 1) {
            return '--header="Authorization: Bearer '.$this->getAccessToken().'" https://bitbucket.org/'.$this->project->repository.'/get/'.$this->deployment->commit.'.tar.gz';
        }

        if ($this->project->provider_id === 2) {
            return 'https://api.github.com/repos/'.$this->project->repository.'/tarball/'.$this->deployment->commit.'?access_token='.$this->getAccessToken();
        }

        return '';
    }

    /**
     * Return provider access token from project user.
     *
     * @return string
     */
    protected function getAccessToken()
    {
        return $this->project
            ->user
            ->tokenByProvider($this->project->provider_id)
            ->id;
    }
}
