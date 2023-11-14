import { isTRC20Contract, tronWeb } from '../providers/tron';
import {TronServer} from './tronServer';

export interface Transfer {
  txID: string
  network: string
  contract: string
  from: string
  to: string
  amount: string
  transferTime: number
  result: string
}

export interface Account {
  address: string
  hex: string
  network: string
  owner?: string
}

export async function fetchTransferEvent(tokenAddr: string) {
  const contract = await tronWeb.contract().at(tokenAddr);
  const tronServer = new TronServer(tronWeb);

  if (isTRC20Contract(contract)) {
    const options = {
      eventName: 'Transfer',
    };
    contract.Transfer().watch(options, (error, result) => {
      if (error) {
        return console.error('Error with "method" event:', error);
      }
      if (result) {
        console.log('TRC20 ?', result.transaction);
      }
    });
  }
}
