import { createClient, ClientOption } from '@nebula-contrib/nebula-nodejs';
import {Account, Transfer} from '../services/transfer';
import { getConfig } from '../config';

const option: ClientOption = getConfig().nebulaGraph;

export const graphClient = createClient(option);

export function addTransfer(transfer: Transfer) {
  const nGQL = `INSERT EDGE transfer (txID, network, contract, \`from\`, \`to\`, amount, transferTime, result) VALUES "${transfer.from}"->"${transfer.to}": ("${transfer.txID}", "${transfer.network}", "${transfer.contract}", "${transfer.from}", "${transfer.to}", ${transfer.amount}, ${transfer.transferTime}, "${transfer.result}")`;
  return graphClient.execute(nGQL);
}

export function addAccount(account: Account) {
  const nGQL = `INSERT VERTEX IF NOT EXiSTS account (hex, network, owner) VALUES "${account.address}": ("${account.hex}", "${account.network}", "${account.owner}")`
  return graphClient.execute(nGQL);
}

