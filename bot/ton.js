"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdraw = exports.getBalance = exports.isContractDeployed = exports.isTONAddress = exports.formatHash = exports.changeHash = exports.generatePaymentLink = exports.test00 = exports.getTransactions = void 0;
const ton_1 = require("ton");
const sample_SampleTactContract_1 = require("./output/sample_SampleTactContract");
const ton_crypto_1 = require("ton-crypto");
const tonweb_1 = __importDefault(require("tonweb"));
/***
*  获取合约中的转入交易
 * @toWallet Address 合约地址
 * @limit number 返回的记录数 默认100
 * @filterSend bool 是否过滤传入交易， true：过滤出转入交易 false：不过滤 返回全部，默认false
 * @returns Promise<InvestReturnObj>
*/
async function getTransactions(limit = 100, filterIncome = false) {
    const endpoint = global.env.NETWORK === "mainnet"
        ? "https://toncenter.com/api/v2/jsonRPC"
        : "https://testnet.toncenter.com/api/v2/jsonRPC";
    let httpClient = new ton_1.HttpApi(endpoint, { apiKey: global.env.TONCENTER_TOKEN });
    // 钱包中获取最近 x 笔交易
    const transactions = await httpClient.getTransactions(ton_1.Address.parse(global.env.OWNER_WALLET), {
        limit: limit,
    });
    //   过滤，只留下传入的交易 如果交易的 out_msgs 为空
    let incomingTransactions = transactions;
    if (filterIncome) {
        incomingTransactions = transactions.filter((tx) => Object.keys(tx.out_msgs).length === 0);
    }
    return incomingTransactions;
}
exports.getTransactions = getTransactions;
async function test00() {
    const Address = tonweb_1.default.utils.Address;
    let addr = new Address("kQB1GCeqehyKc5sNDmg0Ttm16MjHRyRtOGknNY_3I7MiKHxx");
    let obj = {
        hashPart: addr.hashPart,
        isUserFriendly: addr.isUserFriendly,
        isUrlSafe: addr.isUrlSafe,
        isBounceable: addr.isBounceable,
        isTestOnly: addr.isTestOnly,
        wc: addr.wc,
        toString_isUserFriendly: addr.toString(true),
        toString_isUrlSafe: addr.toString(undefined, true),
        toString_isBounceable: addr.toString(undefined, undefined, true),
        toString_isTestOnly: addr.toString(undefined, undefined, undefined, true)
    };
    return obj;
}
exports.test00 = test00;
/***
*  创建交易连接
*/
function generatePaymentLink(toWallet, amount, comment, app) {
    if (app === "tonhub") {
        return `https://tonhub.com/transfer/${toWallet}?amount=${(0, ton_1.toNano)(amount)}&text=${comment}`;
    }
    return `https://app.tonkeeper.com/transfer/${toWallet}?amount=${(0, ton_1.toNano)(amount)}&text=${comment}`;
}
exports.generatePaymentLink = generatePaymentLink;
/***
*  转换hash格式
*/
function changeHash(base64Hash) {
    const hashBase64 = base64Hash;
    const hashBuffer = Buffer.from(hashBase64, "base64");
    const hash = hashBuffer.toString("hex");
    return hash;
}
exports.changeHash = changeHash;
/***
*  hash脱敏
*/
function formatHash(hash) {
    const prefix = hash.substring(0, 4);
    const suffix = hash.substring(hash.length - 8);
    const hiddenPart = "......";
    return `${prefix}${hiddenPart}${suffix}`;
}
exports.formatHash = formatHash;
/**
 * 判断是否正确的ton地址格式
 * @param str address
 * @returns boolean
 */
function isTONAddress(str) {
    try {
        ton_1.Address.parse(str);
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.isTONAddress = isTONAddress;
/*
休眠函数sleep
调用 await sleep(1500)
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function main() {
    // const endpoint = await getHttpEndpoint({ network: "testnet" });
    //   const client = new TonClient({ endpoint });
    const client = new ton_1.TonClient({ endpoint: global.env.NETWORK === "mainnet"
            ? "https://toncenter.com/api/v2/jsonRPC"
            : "https://testnet.toncenter.com/api/v2/jsonRPC", apiKey: global.env.TONCENTER_TOKEN });
    //设置调用合约的gas扣费钱包
    const mnemonic = global.env.MNEMONIC; //扣费gas的钱包助记词
    const key = await (0, ton_crypto_1.mnemonicToWalletKey)(mnemonic.split(" "));
    const wallet = ton_1.WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    if (!await client.isContractDeployed(wallet.address)) {
        return console.log("wallet is not deployed 钱包连接失败");
    }
    // new Promise((resolve,reject)=>{
    // })
    const walletContract = client.open(wallet);
    //  let balance = await walletContract.getBalance();// 获取扣费钱包的余额
    const walletSender = walletContract.sender(key.secretKey);
    // open Counter instance by address 打开合约
    const counterAddress = ton_1.Address.parse(global.env.OWNER_WALLET);
    const counter = (new sample_SampleTactContract_1.SampleTactContract(counterAddress));
    const counterContract = client.open(counter);
    return { walletContract, counterContract, counterAddress, client, walletSender };
    const seqno = await walletContract.getSeqno();
    console.log("seqno", seqno);
    // open Counter instance by address 打开合约
    // const counterAddress = Address.parse("kQB1GCeqehyKc5sNDmg0Ttm16MjHRyRtOGknNY_3I7MiKHxx");
    // const counter = (new SampleTactContract(counterAddress));
    // const counterContract = client.open(counter);
    // // console.log("counterContract",counterContract)
    console.log("判断合约是否已经部署", await client.isContractDeployed(counterAddress));
    // 合约交易列表
    // console.log("getTransactions 合约交易列表:",(await  client.getTransactions(counterAddress,{limit:100})))
    // 合约状态
    //  console.log("getContractState 合约状态:", await client.getContractState(counterAddress))
    // console.log("getContractState 合约状态 最后交易hahs:", Buffer.from((await client.getContractState(counterAddress)).lastTransaction?.hash!,'base64').toString('hex'))
    // 合约余额
    console.log('合约余额', await counterContract.getBalance());
    // 调用合约函数
    console.log("调用合约函数 getOwner():", await counterContract.getDeployer());
    console.log("调用合约函数 getTransferrs():", await counterContract.getTransferrs());
    //  return
    // 发送消息 send(发送者的钱包,参数,要执行的消息体)
    // value: 1000n 是发送的交易金额 包含gas费 低了会超时
    //   await counterContract.send(walletSender, { value: 120000000n }, { $$type: "Add", amount: 120000000n });
    // 如果没有参数 第三个参数需要直接传string消息名
    return;
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
    console.log('合约余额', await counterContract.getBalance());
    // 合约状态
    // console.log("getContractState", await client.getContractState(counterAddress))
}
/***
*  判断合约是否已经被部署
*/
async function isContractDeployed() {
    const counterAddress = ton_1.Address.parse(global.env.OWNER_WALLET);
    let obj = await main();
    if (obj) {
        return await obj.client.isContractDeployed(counterAddress);
    }
    else {
        console.log('建立连接可能失败');
        return false;
    }
}
exports.isContractDeployed = isContractDeployed;
/***
*  获取合约余额
*/
async function getBalance() {
    let obj = await main();
    if (obj) {
        let d = await obj.counterContract.getBalance();
        console.log('getBalance =', d);
        return d.toString();
    }
}
exports.getBalance = getBalance;
/***
*  合约提现
*/
async function withdraw() {
    let obj = await main();
    if (obj) {
        let d = await obj.counterContract.getDeployer();
        console.log(d);
        await obj.counterContract.send(obj.walletSender, { value: 10000000n }, "withdraw all");
    }
}
exports.withdraw = withdraw;
