<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateDeployAccessTokensTableId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deploy_access_tokens', function (Blueprint $table) {
            $table->string('id', 255)->change();
        });

        Schema::table('deploy_refresh_tokens', function (Blueprint $table) {
            $table->string('id', 255)->change();
            $table->string('deploy_access_token_id', 255)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deploy_access_tokens', function (Blueprint $table) {
            $table->string('id', 100)->change();
        });

        Schema::table('deploy_refresh_tokens', function (Blueprint $table) {
            $table->string('id', 100)->change();
            $table->string('deploy_access_token_id', 100)->change();
        });
    }
}
