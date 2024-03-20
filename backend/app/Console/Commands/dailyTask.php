<?php

namespace App\Console\Commands;
// require __DIR__ . '/../../autoload.php';

use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Mike42\Escpos\Printer;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

class dailyTask extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'trail:reset';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'To daily reset the queue on every 00:00 (12:00AM)';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // return 0;
        DB::table('tbldepartmenlist')->insertGetId(['deptName'=>'Test','prefix'=>'T']); // insert something
        \Log::info("Cron is working fine!");
        $this->info('Custom task executed successfully!');
    }
}
