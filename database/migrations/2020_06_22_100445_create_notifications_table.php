<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deploy_notifications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('user_id')->nullable()->unsigned();
            $table->integer('project_id')->nullable()->unsigned();
            $table->string('subject');
            $table->string('type');
            $table->text('contents')->nullable();
            $table->integer('is_read')->default(0);
            $table->dateTime('read_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('project_id')->references('id')->on('projects');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
