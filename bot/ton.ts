import { Address, HttpApi, TonClient, WalletContractV4, fromNano, toNano } from "ton";
import { SampleTactContract } from './output/sample_SampleTactContract';
import { mnemonicToWalletKey } from "ton-crypto";
import TonWeb from "tonweb";
/*** 
*  获取合约中的转入交易
 * @toWallet Address 合约地址
 * @limit number 返回的记录数 默认100
 * @filterSend bool 是否过滤传入交易， true：过滤出转入交易 false：不过滤 返回全部，默认false
 * @returns Promise<InvestReturnObj>
*/

export async function getTransactions(toWallet: Address, limit: number = 100, filterIncome: boolean = false) {
  const endpoint =
    process.env.NETWORK === "mainnet"
      ? "https://toncenter.com/api/v2/jsonRPC"
      : "https://testnet.toncenter.com/api/v2/jsonRPC";
  let httpClient = new HttpApi(
    endpoint,
    { apiKey: process.env.TONCENTER_TOKEN }
  )
  // 钱包中获取最近 x 笔交易
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
export async function test00() {
  const Address = TonWeb.utils.Address;
  let addr = new Address("kQB1GCeqehyKc5sNDmg0Ttm16MjHRyRtOGknNY_3I7MiKHxx")
  
  let obj = {
    hashPart:addr.hashPart,
    isUserFriendly:addr.isUserFriendly,
    isUrlSafe:addr.isUrlSafe,
    isBounceable:addr.isBounceable,
    isTestOnly:addr.isTestOnly,
    wc:addr.wc,
    toString_isUserFriendly:addr.toString(true),
    toString_isUrlSafe:addr.toString(undefined, true),
    toString_isBounceable:addr.toString(undefined,undefined, true),
    toString_isTestOnly:addr.toString(undefined,undefined,undefined, true)
    
  }
 return obj


}
/*** 
*  创建交易连接
*/
export function generatePaymentLink(toWallet: Address, amount: bigint, comment: any, app: any) {
  if (app === "tonhub") {
    return `https://tonhub.com/transfer/${toWallet}?amount=${toNano(
      amount
    )}&text=${comment}`;
  }
  return `https://app.tonkeeper.com/transfer/${toWallet}?amount=${toNano(
    amount
  )}&text=${comment}`;
}
/*** 
*  转换hash格式
*/
export function changeHash(base64Hash: string) {
  const hashBase64 = base64Hash;
  const hashBuffer = Buffer.from(hashBase64, "base64");
  const hash = hashBuffer.toString("hex");
  return hash
}

/*** 
*  hash脱敏
*/
export function formatHash(hash:string) {
  const prefix = hash.substring(0, 4);
  const suffix = hash.substring(hash.length - 8);
  const hiddenPart = "......";
  return `${prefix}${hiddenPart}${suffix}`;
}

/**
 * 判断是否正确的ton地址格式
 * @param str address
 * @returns boolean
 */
export function isTONAddress(str: string) {
  try {
    Address.parse(str)
    return true
  } catch (error) {
    return false

  }

}

/*
休眠函数sleep
调用 await sleep(1500)
 */
function sleep(ms: any) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  // const endpoint = await getHttpEndpoint({ network: "testnet" });
  //   const client = new TonClient({ endpoint });
  const client = new TonClient({ endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC", apiKey: "6fb9d0bdc255e5aef6c86f8f163046c2adb5a671bfe482ad15823ce25eee2a55" });

  //设置调用合约的gas扣费钱包
  const mnemonic = "rare wheat you season base faint head bind build embody dove jeans series drill degree diagram cliff plastic pyramid replace save february valid poet";//扣费gas的钱包助记词
  const key = await mnemonicToWalletKey(mnemonic.split(" "));

  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed 钱包连接失败");
  }

  // new Promise((resolve,reject)=>{


  // })


  const walletContract = client.open(wallet);
  //  let balance = await walletContract.getBalance();// 获取扣费钱包的余额
  const walletSender = walletContract.sender(key.secretKey);

  // open Counter instance by address 打开合约
  const counterAddress = Address.parse("kQB1GCeqehyKc5sNDmg0Ttm16MjHRyRtOGknNY_3I7MiKHxx");
  const counter = (new SampleTactContract(counterAddress));
  const counterContract = client.open(counter);

  return { walletContract, counterContract, counterAddress, client, walletSender }



  const seqno = await walletContract.getSeqno();
  console.log("seqno", seqno)


  // open Counter instance by address 打开合约
  // const counterAddress = Address.parse("kQB1GCeqehyKc5sNDmg0Ttm16MjHRyRtOGknNY_3I7MiKHxx");
  // const counter = (new SampleTactContract(counterAddress));
  // const counterContract = client.open(counter);
  // // console.log("counterContract",counterContract)

  console.log("判断合约是否已经部署", await client.isContractDeployed(counterAddress))

  // 合约交易列表
  // console.log("getTransactions 合约交易列表:",(await  client.getTransactions(counterAddress,{limit:100})))

  // 合约状态
  //  console.log("getContractState 合约状态:", await client.getContractState(counterAddress))
  // console.log("getContractState 合约状态 最后交易hahs:", Buffer.from((await client.getContractState(counterAddress)).lastTransaction?.hash!,'base64').toString('hex'))

  // 合约余额
  console.log('合约余额', await counterContract.getBalance())

  // 调用合约函数
  console.log("调用合约函数 getOwner():", await counterContract.getDeployer())
  console.log("调用合约函数 getTransferrs():", await counterContract.getTransferrs())
  //  return


  // 发送消息 send(发送者的钱包,参数,要执行的消息体)
  // value: 1000n 是发送的交易金额 包含gas费 低了会超时
  //   await counterContract.send(walletSender, { value: 120000000n }, { $$type: "Add", amount: 120000000n });
  // 如果没有参数 第三个参数需要直接传string消息名
  return
  // await counterContract.send(walletSender, { value: 10000000n }, "withdraw all"); 
  await counterContract.send(walletSender, { value: 20000000n }, null);

  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500); // 等待1.5秒再执行 
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed! 交易确认！");
  // 交易结束后 交易信息无法立即获取
  // 合约余额
  console.log('合约余额', await counterContract.getBalance())
  // 合约状态
  // console.log("getContractState", await client.getContractState(counterAddress))


}

/*** 
*  判断合约是否已经被部署
*/

export async function isContractDeployed() {
  const counterAddress = Address.parse("kQB1GCeqehyKc5sNDmg0Ttm16MjHRyRtOGknNY_3I7MiKHxx");
  let obj = await main()
  if (obj) {
    return await obj.client.isContractDeployed(counterAddress)
  }
  else {
    console.log('建立连接可能失败')
    return false
  }
}

/*** 
*  获取合约余额
*/

export async function getBalance() {
  let obj = await main()
  if (obj) {
    let d = await obj.counterContract.getBalance()

    return d.toString()
  }

}

/*** 
*  合约提现
*/

export async function withdraw() {
  let obj = await main()
  if (obj) {
    await obj.counterContract.send(obj.walletSender, { value: 10000000n }, "withdraw all");
  }

}
