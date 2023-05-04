import { InlineKeyboard } from "grammy";

export default async function handleStart(ctx:any) {
    // 创建一个内联键盘
  const menu = new InlineKeyboard()
    .text("Buy dumplings🥟", "buy")
    // 换行
    .row()
    .url("Article with a detailed explanation of the bot's work", "/develop/dapps/payment-processing/accept-payments-in-a-telegram-bot-js/");

  await ctx.reply(
    `Hello stranger!
Welcome to the best Dumplings Shop in the world <tg-spoiler>and concurrently an example of accepting payments in TON</tg-spoiler>`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}