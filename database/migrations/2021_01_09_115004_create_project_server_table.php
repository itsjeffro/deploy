<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Deploy\Models\Server;
use Deploy\Models\ProjectServer;

class CreateProjectServerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('project_server', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('project_id')->unsigned()->nullable();
            $table->integer('server_id')->unsigned()->nullable();
            $table->string('project_path')->nullable();

            $table->foreign('project_id')->references('id')->on('projects');
            $table->foreign('server_id')->references('id')->on('servers');
        });

        $servers = Server::get();

        foreach ($servers as $server) {
            ProjectServer::create([
                'project_id' => $server->project_id,
                'server_id' => $server->id,
                'project_path' => $server->project_path,
            ]);
        }

        Schema::table('servers', function (Blueprint $table) {
            $table->integer('project_id')->unsigned()->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('project_server');
    }
}