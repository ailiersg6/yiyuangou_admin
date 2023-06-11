"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ton_1 = require("./ton");
const test_1 = require("../controller/test");
async function handleStart(conversation, ctx) {
    await ctx.reply(`
  @duobao 夺宝游戏机器人已上线!欢迎使用
➖➖➖➖➖➖➖➖➖➖➖➖➖
个人用户指南:
1、确认NFT888夺宝状态为开启状态
2、用钱包向合约地址转入最低转账金额的TON(未达到有效转账金额的记录将无法进行排名), 自动参与当期NFT88夺宝
3、智能合约会第一时间将您的转账哈希值(hex)进行处理，提取出最后六位数字(忽略字母)来进行排名
4、确认您的转账哈希值最后六位数字和与其对应的排名
5、排名实时变动，如果排名处在第一名以外，请继续转账提高排名
➖➖➖➖➖➖➖➖➖➖➖➖➖
合约地址：
${global.env.OWNER_WALLET}
DNS合约地址：
<a href="nft88.ton">nft88.ton</a> 
➖➖➖➖➖➖➖➖➖➖➖➖➖
注意事项
➖➖➖➖➖➖➖➖➖➖➖➖➖
1、请务必在使用钱包转账前，确认NFT888夺宝是否在开启状态中
2、参与NFT888夺宝游戏暂时只支持TON钱包，请勿使用交易所直接转账到合约地址
3、游戏结束后请耐心等待NFT888的到账
➖➖➖➖➖➖➖➖➖➖➖➖➖
推荐钱包：
TonKeeper
官方网址： <a href="https://tonkeeper.com/">https://tonkeeper.com/</a> 
➖➖➖➖➖➖➖➖➖➖➖➖➖
交易查询：
TonScan
官方网址：<a href="https://tonscan.org/">https://tonscan.org/</a> 
➖➖➖➖➖➖➖➖➖➖➖➖➖
官方机器人：@duobao_official_bot
官方频道：@duobao
中文讨论群：@duobao_cn
负责人：@ky365vip
  
Tonkeeper (<a href="https://tonkeeper.com/">https://tonkeeper.com/</a> )
Your mobile wallet in The Open Network
`, { parse_mode: "HTML" });
    return;
    // 让用户输入地址 如果输入错误 就循环输入 直到正确为止 最大循环2次
    let address = "";
    let i = 0;
    do {
        address = await conversation.form.text();
        if (!(0, ton_1.isTONAddress)(address)) {
            ctx.reply(`地址格式不正确`);
        }
        i++;
    } while (!(0, ton_1.isTONAddress)(address) && i < 2);
    if (!(0, ton_1.isTONAddress)(address)) {
        setTimeout(() => {
            ctx.reply(`多次输入错误地址 请重新尝试`);
        }, 1000);
        return;
    }
    // 发送等待提示
    await ctx.replyWithChatAction('typing');
    // 绑定地址 
    let userInfo = await ctx.getChat();
    // let obj1=await ctx.getChat()
    conversation.log('userInfo', userInfo);
    const response = await conversation.external(async () => await (0, test_1.bind)(userInfo.id, address, JSON.stringify(userInfo)));
    console.log('response', response);
    if (response && response.error) {
        if (response.sqlMessage.indexOf('Duplicate') != -1) {
            // Duplicate
            ctx.reply(`
       该ton地址已经被绑定.
  `);
        }
    }
    else {
        ctx.reply(`
    恭喜绑定ton地址成功！
  ton地址：${address}
    `);
    }
    //   if (response) {
    //     ctx.reply(`
    //   恭喜绑定ton地址成功！
    // ton地址：${address}
    //   `)
    //   } else {
    //     ctx.reply(`
    //   该ton地址已经被绑定，请重新绑定.
    // 或者联系管理员协调处理
    //   `)
    //   }
    return;
}
exports.default = handleStart;
