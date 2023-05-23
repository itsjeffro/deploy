<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProvidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('friendly_name');
            $table->string('url');
        });
        
        DB::table('providers')->insert([
            ['name' => 'Bitbucket', 'friendly_name' => 'bitbucket', 'url' => 'https://bitbucket.org/'],
            ['name' => 'Github', 'friendly_name' => 'github', 'url' => 'https://github.com/'],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('providers');
    }
}