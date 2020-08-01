<?php

namespace Deploy\Tests\Unit;

use Deploy\Deploy;
use Orchestra\Testbench\TestCase;

class DeployTest extends TestCase
{
    public function test_returns_available_keys()
    {
        $variables = Deploy::scriptVariables();

        $this->assertSame('array', gettype($variables));

        $this->assertArrayHasKey('warnings', $variables);
        $this->assertArrayHasKey('url', $variables);
        $this->assertArrayHasKey('path', $variables);
        $this->assertArrayHasKey('timezone', $variables);
        $this->assertArrayHasKey('broadcasting', $variables);
    }
}
