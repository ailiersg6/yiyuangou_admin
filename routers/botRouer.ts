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
    fastify.get('/bot/sendWin', (request, reply) => {
        // http://127.0.0.1:8080/test/123 => {"userId":"123"}
        sendWinMsgByBot("A70")
        reply.send('sendWinMsgByBot')
    })
   
}


