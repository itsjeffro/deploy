
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProcessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('processes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('server_name');
            $table->integer('server_id')->unsigned();
            $table->integer('project_id')->unsigned();
            $table->integer('deployment_id')->unsigned();
            $table->integer('action_id')->unsigned()->nullable();
            $table->integer('hook_id')->unsigned()->nullable();
            $table->integer('sequence');
            $table->integer('status')->default(0);
            $table->text('output')->nullable();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('finished_at')->nullable();
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
        Schema::dropIfExists('processes');
    }
}
