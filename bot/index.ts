import dotenv from "dotenv";
import { Bot, Context, GrammyError, HttpError, Middleware, MiddlewareFn, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import handleStart from "./start";

// Use this token to access the HTTP API:
// 6228171766:AAHjdZ7s9v1qT9LgQpFvJ52vFQpXnwZXLCU

// import {
//   startPaymentProcess,
//   checkTransaction,
// } from "./bot/handlers/payment.js";
// import handleStart from "./bot/handlers/start.js";

export async function initBot() {
    // console.log("process.env.BOT_TOKEN",process.env.BOT_TOKEN)
    try {
    const bot = new Bot(process.env.BOT_TOKEN!,{client:{
        timeoutSeconds:5,
        sensitiveLogs:true
    }});

    console.log("BOT_TOKEN",process.env.BOT_TOKEN)
    // 用"你好！"来回复任意信息
    // 你现在可以在你的 bot 对象 `bot` 上注册监听器。
    // 当用户向你的 bot 发送消息时，grammY 将调用已注册的监听器。

    // 处理 /start 命令。
    bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
    // 处理其他的消息。
    bot.on("message", (ctx) => ctx.reply("Got another message!"));

    console.log('isInited',bot.isInited()) 
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
    // console.log('bot', bot)
  
// console.log("await bot.init()",await bot.botInfo)

//  console.log("await bot.init()",await bot.init())

    // 启动 bot。
  
   
    bot.start({
        timeout:10
    });
    console.log("bot.api.getMe()",await bot.api.getMyCommands()) 
   } catch (error) {
    console.log('error',error)
   }
}
