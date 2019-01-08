<?php

namespace Deploy\Deployment;

class CommandParser
{
    /**
     * @var array
     */
    private $values;

    /**
     * @param array $values
     */
    public function __construct(array $values)
    {
        $this->values = $values;
    }

    /**
     * Parse commands into theor correct value specified from the constructor.
     *
     * @param array $script
     *
     * @return string
     */
    public function parseScript($script)
    {
        $pattern = '/{{\s*(.+?)\s*}}(\r?\n)?/s';

        $callback = function ($matches) {
            $whitespace = empty($matches[2]) ? '' : $matches[2].$matches[2];
            $variable = str_replace('$', '', $matches[1]);
            $commandValue = $this->resolveCommand($variable);

            return $commandValue.$whitespace;
        };

        return preg_replace_callback($pattern, $callback, $script);
    }

    /**
     * Parse commands into theor correct value specified from the constructor.
     *
     * @param string $command
     *
     * @throws \Exception
     *
     * @return string
     */
    public function resolveCommand($command)
    {
        if (!array_key_exists($command, $this->values)) {
            throw new \Exception('Command "'.$command.'" is not defined.');
        }

        return $this->values[$command];
    }
}
