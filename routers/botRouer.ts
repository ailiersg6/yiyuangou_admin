import fastify, { FastifyInstance } from 'fastify'
import { test1 } from '../controller/test'
import { sendWinMsgByBot } from '../bot'


export const routes = async (fastify: FastifyInstance) => {
    
    fastify.get('/', async (request, reply) => {
        return { hello: 'world' }
    })
    fastify.get('/ping', async (request, reply) => {
        return 'pong\n'
    })
    
    fastify.get('/test/:userId', (request, reply) => {
        // http://127.0.0.1:8080/test/123 => {"userId":"123"}
        let obj = test1(request, reply)
        reply.send(obj)
    })
    fastify.get('/bot/s1endWin', (request, reply) => {
        // http://127.0.0.1:8080/test/123 => {"userId":"123"}
        sendWinMsgByBot(`
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
        `)
        reply.send('sendWinMsgByBot')
    })
   
}


