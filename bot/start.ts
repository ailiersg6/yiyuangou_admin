import { Bot, InlineKeyboard } from "grammy";
import { MyContext, MyConversation } from ".";
import { Address } from "ton";
import { isTONAddress } from "./ton";
import { bind } from "../controller/test";

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

  // 让用户输入地址 如果输入错误 就循环输入 直到正确为止 最大循环2次
  let address = "";
  let i = 0;
  do {
    address = await conversation.form.text();

    if(!isTONAddress(address)){
      ctx.reply(`地址格式不正确`)
    }
 
    i++;
  } while (!isTONAddress(address) && i < 2)
  if(!isTONAddress(address)){
    setTimeout(() => {
      ctx.reply(`多次输入错误地址 请重新尝试`)
    }, 1000);
   
   return
  }
   // 发送等待提示
  await ctx.replyWithChatAction('typing'); 
  // 绑定地址 
  let userInfo = await ctx.getChat()
  // let obj1=await ctx.getChat()
  conversation.log('userInfo',userInfo)


  const response: any = await conversation.external(async () => await bind(userInfo.id, address, JSON.stringify(userInfo)));
  console.log('response', response)
  if (response && response.error) {
    if (response.sqlMessage.indexOf('Duplicate') != -1) {
      // Duplicate
      ctx.reply(`
       该ton地址已经被绑定.
  `)
    }
  }else{
    ctx.reply(`
    恭喜绑定ton地址成功！
  ton地址：${address}
    `)
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
  return


 

}