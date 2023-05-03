import fastify from 'fastify'
import { test1 } from './controller/test'
import {bottest1} from './bot/ton'

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


// 路由配置↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
server.get('/ping', async (request, reply) => {
    return 'pong\n'
})
server.get('/testbot', async (request, reply) => {
  let obj = bottest1()
    return obj
})
server.get('/test/:userId', (request, reply) => {
    // http://127.0.0.1:8080/test/123 => {"userId":"123"}
    let obj = test1(request, reply)
    reply.send(obj)
})
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}  `)
})