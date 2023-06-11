import fastify from 'fastify'
import { bot_seting, inster1, test1 } from './controller/test'
import { routes } from './routers/botRouer'
import { routes1 } from './routers/apiRouter'
import { initBot } from './bot/index'
import { Bot, webhookCallback } from 'grammy'
const fastifyCors = require('fastify-cors');
// env环境变量设置↓↓↓↓↓↓↓↓↓↓
require('dotenv').config();

// if (process.env.NODE_ENV === 'production') {
//     require('dotenv').config({ path: '.env.production' });
//   } else {
//     require('dotenv').config({ path: '.env.development' });
//   }
// console.log('当前环境=>',process.env.NETWORK); 
// ****↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


const server = fastify()
server.setErrorHandler((error, request, reply) => {
  // 记录错误信息
  console.error(error);

  // 返回一个友好的错误响应
  reply.status(500).send({ error: 'Internal Server Error' });

});
// 创建全局参数

declare global {
  var env: {
    OWNER_WALLET: string; // 合约地址，它将接受所有付款
    TONCENTER_TOKEN: string; // api key
    BOT_LINK: string; // 机器人跳转链接
    BOT_NAME: string; // 机器人名
    BOT_TOKEN: string; //  Telegram Bot 令牌
    NETWORK: 'mainnet'; // 主网
    MNEMONIC: string; // 钱包助记词
  }
}
bot_seting().then(data => {
  console.log("data", data)
  if (!data) {
    console.log("无法获取设置", data)
    return
  }

  global.env.OWNER_WALLET = data.OWNER_WALLET;
  global.env.TONCENTER_TOKEN = data.TONCENTER_TOKEN;
  global.env.BOT_LINK = data.BOT_LINK;
  global.env.BOT_NAME = data.BOT_NAME;
  global.env.BOT_TOKEN = data.BOT_TOKEN;
  global.env.NETWORK = data.NETWORK;
  global.env.MNEMONIC = data.MNEMONIC;

  console.log("global.str 1", global.env)

  // 接收转账 

  inster1()

  initBot() // 初始化机器人
})









server.register(fastifyCors, {
  origin: '*',
  credentials: true,
});

server.register(routes)
server.register(routes1)
server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}  `)
})
