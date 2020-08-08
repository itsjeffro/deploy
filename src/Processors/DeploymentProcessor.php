<?php

namespace Deploy\Processors;

use Deploy\ProviderOauthManager;
use Deploy\Models\Deployment;
use Deploy\Models\Process;
use Deploy\Models\Project;
use Deploy\Events\DeploymentDeploying;
use Deploy\Events\DeploymentFinished;
use Deploy\Ssh\Client;
use Deploy\Deployment\Scripts;
use Deploy\ProviderRepository\Commit;
use Deploy\Deployment\Sequences;
use Deploy\Deployment\CommandParser;
use DateTime;
use Deploy\Contracts\Processors\ProcessorInterface;
use Deploy\Events\ProcessorErrorEvent;
use Deploy\ProviderOauth\ProviderOauthFactory;
use Exception;
use Symfony\Component\Process\Exception\ProcessFailedException;

class DeploymentProcessor extends AbstractProcessor implements ProcessorInterface
{
    /** @var Deployment */
    private $deployment;
    
    /** @var Project */
    private $project;
    
    /** @var string */
    private $time;
    
    /** @var array */
    private $output = [];
    
    /** @var Scripts */
    private $deploymentScripts;
    
    /**
     * @param ProviderOauthManager $providerOauthManager
     * @return void
     */
    public function __construct(ProviderOauthManager $providerOauthManager)
    {
        $this->providerOauthManager = $providerOauthManager;
        $this->time = (new DateTime())->format('YmdHis');
    }

    /**
     * Set project.
     *
     * @param Project $project
     * @return self
     */
    public function setProject($project)
    {
        $this->project = $project;
        $this->deploymentScripts = new Scripts($project);

        return $this;
    }

    /**
     * Set deployment associated with project.
     *
     * @param Project $project
     * @return self
     */
    public function setDeployment($deployment)
    {
        $this->deployment = $deployment;

        return $this;
    }

    /**
     * {@inheritDoc}
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
        } catch (ProcessFailedException | Exception $e) {
            $status = Deployment::FAILED;
            
            event(new ProcessorErrorEvent('Deployment issue', $this->deployment->project_id, $this->deployment, $e));
        }
        
        $this->updateRemainingProcessesAsCancelled($this->deployment);
        $this->updateDeploymentAsFinished($status);
    }

    /**
     * Run through each process in a sequence. Gather exit codes and output.
     *
     * @param  array $sequence
     * @return integer
     */
    public function runSequence(array $sequence)
    {
        $exitCode = 0;
        
        $processes = array_map(
            function ($process) {
                $client = new Client($this->getHost($process->server), $this->getScript($process));
                
                return [
                    $client->getProcess(),
                    $process
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
     * @param  \Deploy\Models\Project $project
     * @param  \Deploy\Models\Deployment $deployment
     * @return void
     */
    public function updateDeploymentCommitData(Project $project, Deployment $deployment)
    {
        $commit = new Commit($deployment->reference, $deployment->branch);
        $commitData = $commit->getByProject($project);
        
        $deployment->fill([
            'committer' => $commitData['display_name'],
            'committer_avatar' => $commitData['avatar_link'],
            'commit' => $commitData['hash'],
            'commit_url' => $commitData['commit_url'],
        ]);
        $deployment->save();
    }
    
    /**
     * Update deployment as deploying.
     *
     * @param  \Deploy\Models\Deployment $deployment
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
     * @param  integer $status
     * @return void
     */
    public function updateDeploymentAsFinished($status)
    {
        $deployment = $this->deployment;
        $deployment->fill([
            'status' => $status,
            'duration' => $this->calculateDuration($this->deployment),
        ]);
        $deployment->save();
        
        event(new DeploymentFinished($deployment));
        
        unset($deployment);
    }
    
    /**
     * Update any remaining processes as cancelled.
     *
     * @param  \Deploy\Models\Deployment $deployment
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
     * @param Deployment $deployment
     * @return integer
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
     * @param Process $process
     * @return string
     */
    public function getScript($process)
    {
        $commandParser = new CommandParser([
            'symlink'      => 'ln -nfs',
            'repository'   => $this->getProviderTarball(),
            'project'      => $process->server->project_path,
            'releases'     => $process->server->project_path . '/releases',
            'release'      => $process->server->project_path . '/releases/' . $this->time,
            'time'         => $this->time,
        ]);
        
        $script = $commandParser->parseScript($this->getHookScript($process));
        
        return implode(PHP_EOL, array_map('trim', explode(PHP_EOL, $script)));
    }
    
    /**
     * Return script for action or action hook.
     *
     * @param  \Deploy\Models\Process $process
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
            return '--header="Authorization: Bearer ' . $this->getAccessToken() . '" https://bitbucket.org/' . $this->project->repository . '/get/' . $this->deployment->commit . '.tar.gz';
        }
        
        if ($this->project->provider_id === 2) {
            return 'https://api.github.com/repos/' . $this->project->repository . '/tarball/' . $this->deployment->commit . '?access_token=' . $this->getAccessToken();
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
        $provider = $this->project
            ->provider
            ->friendly_name;

        $providerOauth = ProviderOauthFactory::create($provider);

        $oauth = $this->providerOauthManager
            ->setProvider($providerOauth)
            ->setUser($this->project->user);
    
        return $oauth->getAccessToken();
    }
}
