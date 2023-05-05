import { Bot, InlineKeyboard } from "grammy";
import { MyContext, MyConversation } from ".";
import { Address } from "ton";
import { isTONAddress } from "./ton";

export default async function handleStart(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply(`
  一元购游戏机器人已上线!欢迎使用
➖➖➖➖➖➖➖➖➖➖➖➖➖
个人用户指南:
1、命令: 绑定ton地址 Txxxxxxx(您的钱包地址)
2、向以下地址转入USDT, 自动充值到账(点击即可复制👇)
➖➖➖➖➖➖➖➖➖➖➖➖➖
<code>${process.env.OWNER_WALLET}</code>
➖➖➖➖➖➖➖➖➖➖➖➖➖
完成以上两步，即可进群游戏
➖➖➖➖➖➖➖➖➖➖➖➖➖
1、请务必在转账前，绑定您的波场地址，
2、否则充值无法到账，如遇被绑联系管理员。
3、多次绑定，即可更新
4、充值到账时间 = 区块确认60s + 个人信息缓存(0～60s)
5、机器人说明更新一下 不支持交易所直接绑定和充值 <a href="http://bitpie.com/">bitpie.com</a> 下载比特派钱包充值
`, { parse_mode: "HTML" });

// 让用户输入地址 如果输入错误 就循环输入 直到正确为止
  let address;
  do {
    address = await conversation.form.text();
    console.log('no',address)
  }while(!isTONAddress(address))
  // 绑定地址 
  let userid=await ctx.getChat()
  
  conversation.log(userid)
  
  // bind(userid,address,info)
 // const response = await conversation.external(() => bind(userid,address,info));
//  if(response){
//   ctx.reply(`
//   恭喜绑定ton地址成功！
// ton地址：${address}
//   `)
//  }else{
//   ctx.reply(`
//   该ton地址已经被绑定，请重新绑定.
// 或者联系管理员协调处理
//   `)
//  }
  return

  return

  if (isTONAddress(address)) {

    await ctx.reply("是地址")
  } else {
    await ctx.reply("不是地址")
  }

  // const movies: string[] = [];
  // for (let i = 0; i < 1; i++) {
  //   (await ctx.reply(`告诉我第 ${i + 1} 名！`));
  //   const titleCtx = await conversation.waitFor(":text");
  //   movies.push(titleCtx.msg.text);
  // }
  // await ctx.reply("这里有一个更好的排名！");
  // movies.sort();
  // await ctx.reply(movies.map((m, i) => `${i + 1}. ${m}`).join("\n"));
}