<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeployRefreshTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deploy_refresh_tokens', function (Blueprint $table) {
            $table->string('id', 100)->primary();
            $table->string('deploy_access_token_id', 100)->index();
            $table->boolean('revoked');
            $table->dateTime('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('deploy_refresh_tokens');
    }
}
