import fastify from 'fastify'
import { test1 } from './controller/test'
const server = fastify()

server.get('/ping', async (request, reply) => {
    return 'pong\n'
})
server.get('/test/:userId', (request, reply) => {
    // http://127.0.0.1:8080/test/123 => {"userId":"123"}
    let obj = test1(request, reply)
    reply.send(obj)
})

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address} `)
})