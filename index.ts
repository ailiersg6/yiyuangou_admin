import fastify from 'fastify'
import { test1 } from './controller/test'
import {bottest1} from './bot/ton'
import { routes } from './routers/botRouer'
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


server.register(routes)

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}  `)
})