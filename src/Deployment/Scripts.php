<?php

namespace Deploy\Deployment;

class Scripts
{
    /**
     * The number of releases to keep on the project's server.
     * @var int
     */
    const DEFAULT_RELEASES = 5;

    /**
     * Instantiate DeploymentScripts.
     *
     * @param object $project
     */
    public function __construct($project)
    {
        $this->project = $project;
    }

    /**
     * Script step, Clone New Release.
     *
     * @return string
     */
    public function stepCloneRelease()
    {
        return '
            if [ ! -d {{ project }} ]; then
                echo "Creating project path.";
                mkdir -p {{ project }};
            fi

            cd {{ project }}

            if [ ! -d {{ releases }} ]; then
                echo "Creating releases directory.";
                mkdir {{ releases }};
            fi

            cd {{ project }}

            mkdir {{ release }}

            cd {{ release }}

            wget -O release.tar.gz {{ repository }}
            tar --strip-components=1 -zxf release.tar.gz
            rm release.tar.gz

            ' . $this->linkFolders($this->project->folders->toArray()) . '
        ';
    }

    /**
     * Script step, Activate New Release.
     *
     * @return string
     */
    public function stepActivateRelease()
    {
        return '
            echo "Activating new release: {{ time }}";
            cd {{ project }} && {{ symlink }} {{ release }} current
        ';
    }

    /**
     * Script step, Clean Up.
     *
     * @return string
     */
    public function stepCleanUp()
    {
        $releasesToKeep = $this->project->releases ?? self::DEFAULT_RELEASES;

        return '
            cd {{ project }}

            echo "Number of releases to keep: ' . $releasesToKeep . '";

            purging=$(ls -dt {{ releases }}/* | tail -n +' . ($releasesToKeep + 1) . ')

            if [ "$purging" != "" ]; then
                echo "Purging old releases:";
                echo "$purging";

                rm -rf $purging;

                echo "Purged old releases.";
            else
                echo "No releases found for purging at this time";
            fi
        ';
    }

    /**
     * Return script to link project folders.
     *
     * @param  array $folders
     * @return string
     */
    protected function linkFolders(array $folders)
    {
        if (empty($folders)) {
            return '';
        }

        $folderScripts = '';

        foreach ($folders as $folder) {
            $folderScripts .= '

                cd {{ release }}

                echo "Linking [{{ release }}/' . $folder['from'] . '] to [{{ project }}/' . $folder['to'] . ']";

                {{ symlink }} {{ project }}/' . $folder['to'] . ' ' . $folder['from'] . '

            ';
        }

        return $folderScripts;
    }
}