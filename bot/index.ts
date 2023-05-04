import dotenv from "dotenv";
import { Bot, Context, GrammyError, HttpError, Middleware, MiddlewareFn, session } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import handleStart from "./start";

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

async function greeting(conversation: MyConversation, ctx: MyContext) {
  // TODO: 编写对话
}
async function movie(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("你有多少部最喜欢的电影？");
  const count = await conversation.form.number();
  const movies: string[] = [];
  for (let i = 0; i < count; i++) {
    await ctx.reply(`告诉我第 ${i + 1} 名！`);
    const titleCtx = await conversation.waitFor(":text");
    movies.push(titleCtx.msg.text);
  }
  await ctx.reply("这里有一个更好的排名！");
  movies.sort();
  await ctx.reply(movies.map((m, i) => `${i + 1}. ${m}`).join("\n"));
}

export async function initBot() {
  try {

    const bot = new Bot(process.env.BOT_TOKEN!, {
      client: {
        timeoutSeconds: 5,
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
    bot.use((conversations()) as MiddlewareFn );
    bot.use((createConversation(movie)) as Middleware<Context>);

    console.log("BOT_TOKEN", process.env.BOT_TOKEN)

    // 处理 /start 命令。
    bot.command("start", async (ctx:any) => {
      await ctx.conversation.enter("movie");
    });
    // 处理其他的消息。
    bot.on("message", (ctx) => {
      console.log('msg', ctx.message)
      ctx.reply("Got another message!")
    });


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
      timeout: 10
    });

    console.log("bot.api.getMe()", await bot.api.getMyCommands())
  } catch (error) {
    console.log('error', error)
  }
}
