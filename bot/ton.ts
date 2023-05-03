import { Address, HttpApi, fromNano, toNano } from "ton";

/*** 
*  获取合约中的转入交易
 * @toWallet Address 合约地址
 * @limit number 返回的记录数
 * @filterSend bool 是否过滤传入交易， true：过滤出转入交易 false：不过滤 返回全部，默认false
 * @returns Promise<InvestReturnObj>
*/

export async function verifyTransactionExistance(toWallet: Address,limit:number, filterIncome?: boolean) {
    const endpoint =
        process.env.NETWORK === "mainnet"
            ? "https://toncenter.com/api/v2/jsonRPC"
            : "https://testnet.toncenter.com/api/v2/jsonRPC";
    let httpClient = new HttpApi(
        endpoint,
        { apiKey: process.env.TONCENTER_TOKEN }

    )
    // 钱包中获取最近 100 笔交易
    const transactions = await httpClient.getTransactions(toWallet, {
        limit: limit,
    });

    //   过滤，只留下传入的交易 如果交易的 out_msgs 为空
    let incomingTransactions = transactions;
    if (filterIncome) {
        incomingTransactions = transactions.filter(
            (tx) => Object.keys(tx.out_msgs).length === 0
        );
       
    }
    return incomingTransactions
  
}
/*** 
*  创建交易连接
*/
export function generatePaymentLink(toWallet:Address, amount:bigint, comment:any, app:any) {
    if (app === "tonhub") {
      return `https://tonhub.com/transfer/${toWallet}?amount=${toNano(
        amount
      )}&text=${comment}`;
    }
    return `https://app.tonkeeper.com/transfer/${toWallet}?amount=${toNano(
      amount
    )}&text=${comment}`;
  }

export async function bottest1() {
    let address = Address.parse(process.env.OWNER_WALLET!)
    let d = await verifyTransactionExistance(address, 100,true)


    console.log('d', d);
    return d
    // verifyTransactionExistance()
}

