import { keccak256, toUtf8Bytes, AbiCoder } from 'ethers';
import { tronWeb } from '../providers/tron';
import {Transfer} from "./transfer";

declare type Transaction = any;
declare type TransactionInfo = any;
declare type TransferTopics = [string, string, string];

const ADDRESS_PREFIX = '41';
export class TronServer {
  private provider;
  constructor(provider) {
    this.provider = provider;
  }

  async getBlockByNumber(height: number) {
    return tronWeb.trx.getBlockByNumber(height);
  }

  async getBlockByHash(hash: string) {
    return tronWeb.trx.getBlockByHash(hash);
  }

  async getTransactionFromBlock(heightOrHash: number | string): Promise<Array<Transaction>> {
    const block = await tronWeb.trx.getBlockByNumber(heightOrHash);
    return block.transactions ?? [];
  }

  async getTransactionInfo(txID: string) :Promise<TransactionInfo> {
    return tronWeb.trx.getTransactionInfo(txID);
  }

  isOriginalTransfer(transaction: Transaction) {
    return transaction.raw_data.contract[0].type === 'TransferContract';
  }
  isAssetTransfer(transaction: Transaction) {
    return transaction.raw_data.contract[0].type === 'TransferAssetContract';
  }

  isTransfer(transactionInfo: TransactionInfo) {
    const func = '0x' + transactionInfo.log?.[0]?.topics?.[0];
    return (func === keccak256(toUtf8Bytes('Transfer(address,address,uint256)')));
  }


  async getTransferFromBlock(block: number, tokenContracts?: string[]) {
    const transactions = await this.getTransactionFromBlock(block);
    const transfers: Transfer[] = []
    for (const tx of transactions) {
      if (tx.raw_data.contract[0].type === 'TriggerSmartContract') {
        const txInfo = await this.getTransactionInfo(tx.txID);
        if (this.isTransfer(txInfo) && tokenContracts.some(contract => tronWeb.address.toHex(contract) === txInfo.contract_address)) {
          const event = TronServer.ParseTransferEvent(txInfo.log[0].topics, txInfo.log[0].data);
          transfers.push({
            txID: txInfo.id,
            network: 'tron',
            contract: tronWeb.address.fromHex(txInfo.contract_address),
            ...event,
            transferTime: Math.floor(tx.raw_data.expiration / 1000),
            block,
            result: txInfo.receipt.result
          })
        }
      }
    }
    return transfers;
  }


  static ParseTransferEvent(topics: TransferTopics, data: string) {
    const from = tronWeb.address.fromHex(ADDRESS_PREFIX + topics[1].substring(topics[1].length-40, topics[1].length));
    const to = tronWeb.address.fromHex(ADDRESS_PREFIX + topics[2].substring(topics[2].length-40, topics[2].length));
    const abiCoder = new AbiCoder();

    const amount = abiCoder.decode(['uint256'], '0x' + data, true).at(0)
    return {
      from,
      to,
      amount
    }
  }
}
