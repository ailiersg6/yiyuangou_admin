"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const ton_1 = require("../bot/ton");
const routes = async (fastify) => {
    fastify.get('/botTest', async (request, reply) => {
        let d = await (0, ton_1.getTransactions)(100);
        return d;
    });
    fastify.get('/botTest2', async (request, reply) => {
        let d = await (0, ton_1.test00)();
        return d;
    });
    fastify.get('/getbla', async (request, reply) => {
        let d = await (0, ton_1.getBalance)();
        return { hello: 'world', d };
    });
    // fastify.get('/bot/sendWin', (request, reply) => {
    //     // http://127.0.0.1:8080/test/123 => {"userId":"123"}
    //     sendWinMsgByBot(`
    // 开奖成功！当前 100 USDT a场
    // 当前游戏期号: 1683273334 期
    // 中奖号码: 57 
    // 中奖用户: 系统中奖 
    // 超时60s 系统自动开奖
    // ➖➖➖➖➖➖➖➖➖➖➖
    // 开启时间: 2023-05-05 15:55:34
    // 首购时间: 2023-05-05 15:59:32
    // 结束时间: 2023-05-05 16:00:34
    // 区块时间: 2023-05-05 16:00:36
    // 开奖滞后: 1034 毫秒
    // ton区块块高: 50886634
    // ton区块哈希: 00000000030877ead3eb67b1230d4a9b191a41c14bdc1d0ebffeb156322345f7
    //     `)
    //     reply.send('sendWinMsgByBot')
    // })
};
exports.routes = routes;
