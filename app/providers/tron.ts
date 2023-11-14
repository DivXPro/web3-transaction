import * as TronWeb from 'tronweb';
import { getConfig } from '../config';

export const tronWeb = new TronWeb({
  fullHost: getConfig().network.tron.fullNode,
  headers: { 'TRON-PRO-API-KEY': getConfig().network.tron.apiKey },
  // privateKey: 'your private key',
});

export async function isTRC20Transfer(txID: string) {
  const transaction = await tronWeb.trx.getTransaction(txID);
  // 2. 接口名称是否为transfer
  if (transaction.raw_data.contract[0].function_selector !== 'transfer(address,uint256)') {
    return false;
  }
  return true;
}

export const isERC20Contract = isTRC20Contract
export function isTRC20Contract(contract) {
  const { abi } = contract;
  const functions = abi.filter((entry) => entry.type === 'function').map((entry) => entry.name);
  // 简单判断abi是否包含TRC20的方法
  return (
    functions.includes('transfer') &&
    functions.includes('transferFrom') &&
    functions.includes('approve')
  );
}
