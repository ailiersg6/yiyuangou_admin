"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReceiveMsgByBot = exports.sendStartMsgByBot = exports.sendWinMsgByBot = exports.sendUserMsgByBot = exports.initBot = void 0;
const grammy_1 = require("grammy");
const conversations_1 = require("@grammyjs/conversations");
const start_1 = __importDefault(require("./start"));
const menu_1 = require("@grammyjs/menu");
const queryClass_1 = require("../mysql/queryClass");
let gropId = -916038823; // 群id
// 创建一个简单的菜单。
const menu = new menu_1.Menu("my-menu-identifier")
    .text("充值", (ctx) => ctx.reply("You pressed A!"))
    .text("提现", (ctx) => ctx.reply("You pressed B!"));
let bot;
async function initBot() {
    try {
        console.log("BOT_TOKEN", global.env.BOT_TOKEN);
        bot = new grammy_1.Bot(global.env.BOT_TOKEN, {
            client: {
                timeoutSeconds: 60,
                sensitiveLogs: true
            }
        });
        // 安装会话插件。
        bot.use((0, grammy_1.session)({
            initial() {
                // 暂时返回一个空对象
                return {};
            },
        }));
        // 安装对话插件。
        bot.use(((0, conversations_1.conversations)()));
        bot.use(((0, conversations_1.createConversation)(start_1.default)));
        // 安装菜单
        bot.use(menu);
        // 处理 /start 命令。
        bot.command("start", async (ctx) => {
            await ctx.conversation.enter("handleStart");
        });
        // 处理 /withdrawal 提现 命令。
        // bot.command("withdrawal", async (ctx: any) => {
        //   await ctx.conversation.enter("withdrawal");
        // });
        bot.command("balance", async (ctx) => {
            // 查询余额
            await ctx.reply("balance");
        });
        // 内联键盘
        const markup = {
            inline_keyboard: [
                [
                    //global.env
                    { text: '开始', url: `${global.env.BOT_LINK}` },
                    // { text: '提现', url: `https://t.me/${global.env}` }
                ]
            ]
        };
        // 处理其他的消息。
        bot.on("message", async (ctx) => {
            console.log("ctx.message.chat", ctx.message);
            if (ctx.message.chat.type == "group") {
                // 消息来自组
                console.log("当前消息来自组", ctx.message.chat.id);
                gropId = ctx.message.chat.id;
                if (ctx.message["text"]) {
                    const myRegex = /^[A-Z]\d{2}$/; // 匹配 A-Z 开头的 3 位字符串，第二三位为数字
                    if (myRegex.test(ctx.message.text)) {
                        // 发送开奖信息
                        return;
                        ctx.reply(`
         开奖成功！当前 100 USDT a场
      当前游戏期号: 1683273334 期
          中奖号码: 57 
          中奖用户: 系统中奖 
          超时60s 系统自动开奖
         
          ➖➖➖➖➖➖➖➖➖➖➖
          开启时间: 2023-05-05 15:55:34
          首购时间: 2023-05-05 15:59:32
          结束时间: 2023-05-05 16:00:34
          区块时间: 2023-05-05 16:00:36
          开奖滞后: 1034 毫秒
          ton区块块高: 50886634
          ton区块哈希: 00000000030877ead3eb67b1230d4a9b191a41c14bdc1d0ebffeb156322345f7
                   `, { reply_markup: markup });
                    }
                }
                // sendWinMsgByBot(gropId,"开奖信息") 
            }
        });
        // 文本输入栏中显示建议的命令列表。 命令名称必须消息开头
        await bot.api.setMyCommands([
            { command: "start", description: "开始" },
            // { command: "balance", description: "余额" },
            // { command: "withdrawal", description: "提现" },
        ]);
        // 错误处理
        bot.catch((err) => {
            const ctx = err.ctx;
            console.error(`Error while handling update ${ctx.update.update_id}:`);
            const e = err.error;
            if (e instanceof grammy_1.GrammyError) {
                console.error("Error in request:", e.description);
            }
            else if (e instanceof grammy_1.HttpError) {
                console.error("Could not contact Telegram:", e);
            }
            else {
                console.error("Unknown error:", e);
            }
        });
        bot.start({
            timeout: 60
        });
        // setTimeout(() => { 
        //   sendWinMsgByBot("5806825040", "asd")
        //  }, 4000);
    }
    catch (error) {
        console.log('error!', error);
    }
}
exports.initBot = initBot;
/**
 * 通过bot向用户发送消息
 * @param chat_id
 * @param 消息文本
 */
async function sendUserMsgByBot(chat_id, msg) {
    try {
        const bot = new grammy_1.Bot(global.env.BOT_TOKEN, {
            client: {
                timeoutSeconds: 60,
                sensitiveLogs: true
            }
        });
        await bot.api.sendMessage(chat_id, msg);
        return new Date();
    }
    catch (error) {
        console.log("sendUserMsgByBot", error);
    }
}
exports.sendUserMsgByBot = sendUserMsgByBot;
/**
 * 通过bot群发送开奖广播 带按钮
 * @param 消息文本
 */
async function sendWinMsgByBot(rows, time1, globalIssue, globalLeiJiTime) {
    //NFT达到了有效转账次数之后(也就是最后一次有效转账过后的时候)，机器人发送通知格式，(并且这条信息需要置顶，替换掉开启NFT那条置顶消息，也就是pin到频道)
    try {
        let data = await queryClass_1.myQuery.query("SELECT * FROM set1 WHERE id= ? ", [1]);
        // 期数
        let data2 = await queryClass_1.myQuery.query("select * from set1 where id =? ", [1]);
        let j_ = data.rows[0].issue;
        let data3 = await queryClass_1.myQuery.query("select * from set1 where id =? ", [1]);
        let j_1 = data3.rows[0].issue;
        // let j_2 = data3.rows[0].productLimit
        let data4 = await queryClass_1.myQuery.query("SELECT * FROM adds WHERE issue= ? and isOkNumber = ?", [j_1, 1]);
        let youxiao = data4.rows.length;
        // 总转账金额
        let sumVal = await queryClass_1.myQuery.query("SELECT SUM(val) as val FROM adds WHERE issue = ?", [j_]);
        let zongshichangtime = '';
        // 内联键盘
        // const markup = {
        //   inline_keyboard: [
        //     [
        //       { text: '参与', url: `${global.env.BOT_LINK}` },
        //       // { text: '提现', url: 'https://t.me/yiyuangou2_bot' }
        //     ]
        //   ]
        // };
        let winList = ``;
        // 前三名
        for (let i = 0; i < rows.length; i++) {
            winList += `   
转账时间：${formatDate(new Date(rows[i].time))}
转账地址：<code>${rows[i].adrress}</code>
接收地址：<code>${(global.env.OWNER_WALLET)}</code>
转账哈希：<code>${(rows[i].hash)}</code>
转账哈希数字后六位：${(rows[i].winnerNumber)}
      `;
        }
        let msg = `
    期数：NFT-TON-${globalIssue}
NFT名称：${data.rows[0].product}
NFT金额：${data.rows[0].productValue}
币种：TON
最低转账金额：${data.rows[0].productLimit / 1000000000} TON
总转账金额：${sumVal.rows[0].val / 1000000000} TON
总有效转账次数：${youxiao}
NFT夺宝开启时间：${formatDate(globalLeiJiTime)}
总时长：${time1} 分钟
合约状态：关闭

以下为当期中奖者：
${winList}
注！！！
请暂停使用TON钱包(TonKeeper,TonWallet)进行转账，耐心等待下一期NFT夺宝开启，感谢您的参与！
    `;
        // 按钮
        const markup = {
            inline_keyboard: [
                [
                    // { text: '参与', url: `${global.env.BOT_LINK}` },
                    { text: '点击验证结果', url: `https://tonscan.org/tx/${rows[0].hash}` }
                ],
                [
                    { text: '机器人', url: `${global.env.BOT_LINK}` },
                    { text: '官方频道', url: `https://t.me/duobao` },
                ]
            ]
        };
        let bot = new grammy_1.Bot(global.env.BOT_TOKEN, {
            client: {
                timeoutSeconds: 60,
                sensitiveLogs: true
            }
        });
        if (gropId == 0) {
            console.log("发送不成功 群组id =", gropId);
        }
        else {
            await bot.api.sendMessage(gropId, msg, { parse_mode: "HTML", reply_markup: markup });
            return new Date();
        }
    }
    catch (error) {
        console.log("sendUserMsgByBot", error);
    }
}
exports.sendWinMsgByBot = sendWinMsgByBot;
/**
 * 发送启动夺宝消息
 * @param 消息文本
 */
async function sendStartMsgByBot(obj, globalIssue, globalLeiJiTime) {
    // 启动NFT夺宝发送到频道的内容，和机器人通知(并且这条信息需要置顶，也就是pin到频道
    let data = await queryClass_1.myQuery.query("SELECT * FROM set1 WHERE id= ? ", [1]);
    try {
        let bot = new grammy_1.Bot(global.env.BOT_TOKEN, {
            client: {
                timeoutSeconds: 60,
                sensitiveLogs: true
            }
        });
        let msg = `
    期数：NFT-TON-${globalIssue}
NFT名称：${data.rows[0].product}
NFT金额：${data.rows[0].productValue}
币种：TON
最低转账金额：${data.rows[0].productLimit / 1000000000} TON
有效转账次数：${data.rows[0].productN}
NFT夺宝开启时间：${formatDate(globalLeiJiTime)}
时长：${data.rows[0].wintime} 分钟
合约状态：开启

合约地址(点击即可复制)：<code>${global.env.OWNER_WALLET}</code>

请使用TON钱包(TonKeeper,TonWallet)进行转账，低于最低转账金额的订单将不计算排名与有效次数，金额恕不退回。在时长范围内达到有效次数即刻开奖，未达到有效转账次数的情况下将会自动延长一倍时长。

`;
        // 按钮
        const markup = {
            inline_keyboard: [
                [
                    // { text: '参与', url: `${global.env.BOT_LINK}` },
                    { text: '点击验证结果', url: `https://tonscan.org/` }
                ],
                [
                    { text: '机器人', url: `${global.env.BOT_LINK}` },
                    { text: '官方频道', url: `https://t.me/duobao` },
                ]
            ]
        };
        if (gropId == 0) {
            console.log("发送不成功 群组id =", gropId);
        }
        else {
            await bot.api.sendMessage(gropId, msg, { parse_mode: "HTML", reply_markup: markup });
            return new Date();
        }
    }
    catch (error) {
        console.log("sendUserMsgByBot", error);
    }
}
exports.sendStartMsgByBot = sendStartMsgByBot;
/**
 * 发送接收到转账的消息到群里
 * @param 消息文本
 */
async function sendReceiveMsgByBot(obj, globalIssue, queryResult, youXiaoCanYu, result1, dangQianPaiMing, fistadrress, firsthash, fistnumber, shengyu, minutesDifference, globalLeiJiTime) {
    console.log('queryResult', queryResult);
    // 开启状态中任何地址转账到合约地址需要发送到频道的内容
    let data = await queryClass_1.myQuery.query("SELECT * FROM set1 WHERE id= ? ", [1]);
    let data4 = await queryClass_1.myQuery.query("SELECT * FROM adds WHERE id= ?", [0]);
    let info = '';
    let endMsg = ``;
    if (shengyu == 0) {
        info = `（本期结束 请耐心等待开奖）`;
        endMsg = `
注！！！
请暂停使用TON钱包(TonKeeper,TonWallet)进行转账，耐心等待开奖与派奖，感谢您的参与！
  `;
    }
    else {
        endMsg = `
合约地址(点击即可复制)：<code>${global.env.OWNER_WALLET}</code>

请使用TON钱包(TonKeeper,TonWallet)进行转账夺宝，低于最低转账金额的转账记录将不计算排名与有效次数，金额恕不退回。在时长范围内达到有效次数即刻开奖，未达到有效转账次数的情况下将会自动延长一倍时长。
`;
    }
    try {
        let bot = new grammy_1.Bot(global.env.BOT_TOKEN, {
            client: {
                timeoutSeconds: 60,
                sensitiveLogs: true
            }
        });
        let msg = `
    期数：NFT-TON-${globalIssue}
NFT名称：${data.rows[0].product}
NFT金额：${data.rows[0].productValue}
币种：TON
最低转账金额：${data.rows[0].productLimit / 1000000000} TON
有效转账次数：${data.rows[0].productN}
NFT夺宝开启时间：${formatDate(globalLeiJiTime)}
时长：${data.rows[0].wintime} 分钟
合约状态：开启中

转账时间：${formatDate(queryResult.rows[0].time)}
转账钱包地址：<code>${(queryResult.rows[0].adrress)}</code>
接收钱包地址：<code>${(global.env.OWNER_WALLET)}</code>
转账币种：TON
转账金额：${(queryResult.rows[0].val / 1000000000)} TON
是否有效：${youXiaoCanYu}
转账哈希：<code>${(queryResult.rows[0].hash)}</code>
转账哈希值数字后六位：${(queryResult.rows[0].winnerNumber)}
当期排名：${dangQianPaiMing == -1 ? '无效参与' : (dangQianPaiMing + 1)}
剩余有效转账次数：${shengyu} ${info}
当期NFT开启时长：${minutesDifference}分钟

当期最高排名钱包地址：<code>${fistadrress == null ? '无' : fistadrress}</code>
当期最高排名哈希：<code>${firsthash == null ? '无' : firsthash}</code>
当期最高排名哈希数字后六位：${(fistnumber == null ? '无' : fistnumber)}
${endMsg}
`;
        // 按钮
        const markup = {
            inline_keyboard: [
                [
                    // { text: '参与', url: `${global.env.BOT_LINK}` },
                    { text: '点击验证结果', url: `https://tonscan.org/tx/${queryResult.rows[0].hash}` }
                ],
                [
                    { text: '机器人', url: `${global.env.BOT_LINK}` },
                    { text: '官方频道', url: `https://t.me/duobao` },
                ]
            ]
        };
        if (gropId == 0) {
            console.log("发送不成功 群组id =", gropId);
        }
        else {
            await bot.api.sendMessage(gropId, msg, { parse_mode: "HTML", reply_markup: markup });
            return new Date();
        }
    }
    catch (error) {
        console.log("sendUserMsgByBot", error);
    }
}
exports.sendReceiveMsgByBot = sendReceiveMsgByBot;
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}