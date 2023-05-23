<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deploy_notifications', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
        });

        Schema::table('deploy_notifications', function (Blueprint $table) {
            $table->integer('project_id')->unsigned()->nullable()->change();
            $table->integer('user_id')->unsigned()->nullable()->after('project_id');

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
        Schema::table('deploy_notifications', function (Blueprint $table) {
            $table->dropColumn('user_id');
        });
    }
}
