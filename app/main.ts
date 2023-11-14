import { program } from 'commander';
import { startTransferTask } from './transferTask';

async function bootstrap() {
  program
      .option('-f, --first <number>', 'first block height')
      .option('-l, --last <number>', 'last block height')
  program.parse(process.argv);
  const options = program.opts();
  startTransferTask(options.first, options.last);
}

bootstrap();
