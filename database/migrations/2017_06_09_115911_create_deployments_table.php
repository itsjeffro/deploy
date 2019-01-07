<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDeploymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deployments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('project_id')->unsigned();
            $table->string('committer')->nullable();
            $table->string('committer_avatar')->nullable();
            $table->string('repository')->nullable();
            $table->string('reference')->nullable();
            $table->string('branch')->nullable();
            $table->string('commit')->nullable();
            $table->string('commit_url')->nullable();
            $table->integer('status')->nullable();
            $table->text('raw_output')->nullable();
            $table->dateTime('started_at')->nullable();
            $table->integer('duration')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('deployments');
    }
}