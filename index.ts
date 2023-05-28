import fastify from 'fastify'
import { test1 } from './controller/test'
import { routes } from './routers/botRouer'
import { routes1 } from './routers/apiRouter'
import {initBot} from './bot/index'
import { Bot, webhookCallback } from 'grammy'

// env环境变量设置↓↓↓↓↓↓↓↓↓↓
require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env.production' });
  } else {
    require('dotenv').config({ path: '.env.development' });
  }
console.log('当前环境=>',process.env.NETWORK); 
// ****↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑


const server = fastify()
server.setErrorHandler((error, request, reply) => {
  // 记录错误信息
  console.error(error);

  // 返回一个友好的错误响应
  reply.status(500).send({ error: 'Internal Server Error' });
  
});

initBot() // 初始化机器人



server.register(routes)
server.register(routes1)
server.listen({ port: 8080,host:"0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}  `)
})
