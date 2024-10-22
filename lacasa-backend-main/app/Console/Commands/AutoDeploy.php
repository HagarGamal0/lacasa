<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class AutoDeploy extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'git:deploy';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Git Deploy base';

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
        // exec('git add .');
        // exec('git commit -m "auto deploy"');
        // exec('git fetch');
        // exec('git pull --all');
        // $process = new Process(['sh ' .base_path() . '/deploy.sh']);
        // $process = new Process(['whoami']);
        $process = Process::fromShellCommandline(base_path() . '/deploy.sh');
        $process->run(function ($type, $buffer) {
            echo $buffer;
        });
    }
}
