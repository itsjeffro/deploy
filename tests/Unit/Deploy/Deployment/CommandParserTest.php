<?php

namespace Deploy\Tests\Unit\Deployment;

use PHPUnit\Framework\TestCase;
use Deploy\Deployment\CommandParser;

class CommandParserTest extends TestCase
{
    public function test_parse_command_one_line_script()
    {
        $commandParser = new CommandParser([
            'project_path' => '/var/www/html',
        ]);
        
        $script = 'cd {{ project_path }} && touch test.txt';
        
        $this->assertEquals(
            $commandParser->parseScript($script),
            'cd /var/www/html && touch test.txt'
        );
    }
}
