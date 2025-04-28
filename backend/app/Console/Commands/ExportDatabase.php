<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ExportDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:export-database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export the database to a JSON file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
        $data = [];

        foreach ($tables as $table) {
            $data[$table->name] = DB::table($table->name)->get()->toArray();
        }

        $json = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents(storage_path('app/backup.json'), $json);

        $this->info('Database exported to storage/app/backup.json');
    }
}
