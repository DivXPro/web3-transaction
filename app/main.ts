import { program } from 'commander';
import { startTransferTask } from './transferTask';

async function bootstrap() {
  program
      .option('-f, --first <number>', 'first block height')
      .option('-l, --last <number>', 'last block height')
      .option('-m, --multi <number>', 'multi process default 1')

  program.parse(process.argv);
  const options = program.opts();
  const firstBlock = parseInt(options.first);
  const lastBlock = parseInt(options.last);
  const multiProcess = parseInt(options.multi ?? 1);
  startTransferTask(firstBlock, lastBlock, multiProcess);
}

bootstrap();
