"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const test_1 = require("./controller/test");
const botRouer_1 = require("./routers/botRouer");
const apiRouter_1 = require("./routers/apiRouter");
const index_1 = require("./bot/index");
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
const server = (0, fastify_1.default)();
server.setErrorHandler((error, request, reply) => {
    // 记录错误信息
    console.error(error);
    // 返回一个友好的错误响应
    reply.status(500).send({ error: 'Internal Server Error' });
});
(0, test_1.bot_seting)().then(data => {
    console.log("data", data);
    if (!data) {
        console.log("无法获取设置", data);
        return;
    }
    global.env.OWNER_WALLET = data.OWNER_WALLET;
    global.env.TONCENTER_TOKEN = data.TONCENTER_TOKEN;
    global.env.BOT_LINK = data.BOT_LINK;
    global.env.BOT_NAME = data.BOT_NAME;
    global.env.BOT_TOKEN = data.BOT_TOKEN;
    global.env.NETWORK = data.NETWORK;
    global.env.MNEMONIC = data.MNEMONIC;
    console.log("global.str1", global.env);
    // 接收转账 
    (0, test_1.inster1)();
    (0, index_1.initBot)(); // 初始化机器人
});
server.register(fastifyCors, {
    origin: '*',
    credentials: true,
});
server.register(botRouer_1.routes);
server.register(apiRouter_1.routes1);
server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}  `);
});
