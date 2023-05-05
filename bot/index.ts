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


export async function initBot() {
  try {
    const bot = new Bot(process.env.BOT_TOKEN!, {
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

    console.log("BOT_TOKEN", process.env.BOT_TOKEN)


    // 创建一个简单的菜单。
    const menu = new Menu("my-menu-identifier")
      .text("A", (ctx) => ctx.reply("You pressed A!")).row()
      .text("B", (ctx) => ctx.reply("You pressed B!"));
    bot.use(menu);


    // 处理 /start 命令。
    bot.command("start", async (ctx: any) => {

      await ctx.conversation.enter("handleStart");
    });
    bot.command("menu", async (ctx) => {
      // 发送菜单。
      await ctx.reply("Check out this menu:", { reply_markup: menu });
    });

    bot.command("balance", async (ctx) => {
      // 发送菜单。
      await ctx.reply("balance");
    });

    // 处理其他的消息。
    bot.on("message", (ctx) => {
      console.log('msg', ctx.message.text)
      ctx.reply("Got another message!")
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

  } catch (error) {
    console.log('error', error)
  }
}
