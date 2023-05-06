import dotenv from "dotenv";
import { Bot, Context, GrammyError, HttpError, Middleware, MiddlewareFn, session } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import handleStart from "./start";
import { Menu } from "@grammyjs/menu";
export type MyContext = Context & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;


let gropId: number = 0; // 群id

// 创建一个简单的菜单。
const menu = new Menu("my-menu-identifier")
  .text("充值", (ctx) => ctx.reply("You pressed A!"))
  .text("提现", (ctx) => ctx.reply("You pressed B!"));


// 安装菜单

// bot.start()
let bot: Bot;

export async function initBot() {
  try {

    console.log("BOT_TOKEN", process.env.BOT_TOKEN)
    bot = new Bot(process.env.BOT_TOKEN!, {
      client: {
        timeoutSeconds: 60,
        sensitiveLogs: true
      }
    });


    // 安装会话插件。
    bot.use(session({
      initial() {
        // 暂时返回一个空对象
        return {};
      },
    }) as any);

    // 安装对话插件。
    bot.use((conversations()) as MiddlewareFn);
    bot.use((createConversation(handleStart)) as Middleware<Context>);


    // 安装菜单
    bot.use(menu);
 


    // 处理 /start 命令。
    bot.command("start", async (ctx: any) => {

      await ctx.conversation.enter("handleStart");
    });


    bot.command("balance", async (ctx) => {
      // 发送菜单。
      await ctx.reply("balance");
    });

    // 处理其他的消息。
    bot.on("message", async (ctx) => {
      if (ctx.message.chat.type == "group") {
        // 消息来自组
        console.log("当前消息来自组", ctx.message.chat.id)
        gropId = ctx.message.chat.id
        if(ctx.message["text"]){
          const myRegex = /^[A-Z]\d{2}$/; // 匹配 A-Z 开头的 3 位字符串，第二三位为数字
          if(myRegex.test(ctx.message.text)){
         // 发送开奖信息
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
                   `, { reply_markup: menu });
            }
          }
 
        // sendWinMsgByBot(gropId,"开奖信息") 
        
      }
      console.log('msg', ctx.message)
    });

    // 文本输入栏中显示建议的命令列表。
    await bot.api.setMyCommands([
      { command: "start", description: "开始" },
      { command: "balance", description: "余额" },
    ]);


    // 错误处理
    bot.catch((err) => {
      const ctx = err.ctx;
      console.error(`Error while handling update ${ctx.update.update_id}:`);
      const e = err.error;
      if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
      } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
      } else {
        console.error("Unknown error:", e);
      }
    });


    bot.start({
      timeout: 60
    });

    // setTimeout(() => { 
    //   sendWinMsgByBot("5806825040", "asd")

    //  }, 4000);

  } catch (error) {
    console.log('error!', error)
  }

}
/**
 * 通过bot向用户发送消息
 * @param chat_id
 * @param 消息文本
 */
export function sendUserMsgByBot(chat_id: any, msg: string) {
  try {
    const bot = new Bot(process.env.BOT_TOKEN!, {
      client: {
        timeoutSeconds: 60,
        sensitiveLogs: true
      }
    });
    bot.api.sendMessage(chat_id, msg)
  } catch (error) {
    console.log("sendUserMsgByBot", error)
  }
}

/**
 * 通过bot群发送开奖广播 带充值和提现按钮
 * @param chat_id
 * @param 消息文本
 */
export function sendWinMsgByBot(msg: string) {
  try {
    // 先用这个机器人发送 类似 "A70" 之类的消息 在群里 
    // 机器人收到这个消息 执行命令广播开奖信息和菜单
    // 这个函数的机器人只负责触发 但有可能机器人无法触发 只能由真实用户触发
    // 因为api.sendMessage命令主动发消息无法带菜单
    if (gropId == 0) {
      console.log("发送不成功 群组id =",gropId)
    } else {
      bot.api.sendMessage(gropId, msg)
    }


  } catch (error) {
    console.log("sendUserMsgByBot", error)
  }
}


