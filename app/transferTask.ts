import {tronWeb} from './providers/tron';
import {TronServer} from './services/tronServer';
import {addAccount, addTransfer} from './store/graphClient';
import {logger} from './log/logger';

let count = 0;
async function fetchTransferFromBlock(block: number, tokenContracts: string[]) {
    const tronServer = new TronServer(tronWeb);
    const transfers = await tronServer.getTransferFromBlock(block, tokenContracts);
    for (const transfer of transfers) {
        await addTransfer(transfer);
        await addAccount({
            address: transfer.from,
            hex: tronWeb.address.toHex(transfer.from),
            network: transfer.network,
        });
        await addAccount({
            address: transfer.to,
            hex: tronWeb.address.toHex(transfer.to),
            network: transfer.network,
        });
    }
    count += transfers.length;
    logger.info(`found ${transfers.length} transfers at block #${block}, total ${count} got`);
}

async function fetchTransferRange(startBlock: number, endBlock: number, tokenContracts: string[]) {
    for (let block = startBlock; block <= endBlock; block ++) {
        await fetchTransferFromBlock(block, tokenContracts);
    }
    logger.info('Fetch transfers from tron completed');
}

export function startTransferTask() {
    logger.info('Start fetch transfers from tron');
    fetchTransferRange(20000, 30000, ['TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t']);
}

