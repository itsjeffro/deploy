<?php

namespace Deploy\Deployment;

use Exception;

class CommandParser
{
    /** @var array */
    private $values;

    /**
     * CommandParser constructor.
     */
    public function __construct(array $values)
    {
        $this->values = $values;
    }

    /**
     * Parse commands into there correct value specified from the constructor.

     * @throws Exception
     */
    public function parseScript(string $script): string
    {
        $pattern = '/{{\s*(.+?)\s*}}(\r?\n)?/s';

        $callback = function($matches) {
            $whitespace = empty($matches[2]) ? '' : $matches[2].$matches[2];
            $variable = str_replace('$', '', $matches[1]);
            $commandValue = $this->resolveCommand($variable);

            return $commandValue.$whitespace;
        };

        return preg_replace_callback($pattern, $callback, $script);
    }

    /**
     * Parse commands into there correct value specified from the constructor.

     * @throws Exception
     */
    public function resolveCommand(string $command): string
    {
        if (!array_key_exists($command, $this->values)) {
            throw new Exception('Command "'.$command.'" is not defined.');
        }

        return $this->values[$command];
    }
}
