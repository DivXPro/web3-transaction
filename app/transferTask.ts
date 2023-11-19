import {tronWeb} from './providers/tron';
import {TronServer} from './services/tronServer';
import {addAccount, addTransfer} from './store/graphClient';
import {errorLogger, logger} from './log/logger';

let count = 0;
async function fetchTransferFromBlock(block: number, tokenContracts: string[]) {
    const tronServer = new TronServer(tronWeb);
    try {
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
        logger.info(`${transfers.length} transfers at block #${block}, total ${count} got`);
    } catch (error) {
        errorLogger.info(error);
    }
}

async function fetchTransferRange(startBlock: number, endBlock: number, tokenContracts: string[], multi: number = 1) {
    let multiProcess = [];
    const foward = startBlock <= endBlock;
    for (let block = startBlock; foward ? block <= endBlock : block >= endBlock; block += foward ? 1 : -1) {
        if (multiProcess.length < multi) {
            multiProcess.push(fetchTransferFromBlock(block, tokenContracts))
        }
        if (multiProcess.length === multi || block == endBlock) {
            const result = await Promise.all(multiProcess)
            multiProcess = [];
        }
    }
    logger.info('Fetch transfers from tron completed');
}

export function startTransferTask(first: number, last: number, multi?: number) {
    logger.info(`
        ################################################################
        #####                                                      #####
        ##### Start fetch transfers from block ${first} to ${last} #####
        #####                                                      #####
        ################################################################
    `);
    fetchTransferRange(first, last, ['TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'], multi);
}

