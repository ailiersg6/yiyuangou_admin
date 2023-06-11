"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes1 = void 0;
const test_1 = require("../controller/test");
const routes1 = async (fastify) => {
    // 抢单开始开关接口
    fastify.post('/open', async (request, reply) => {
        let obj = await (0, test_1.open)(request, reply);
        console.log(obj, 2);
        reply.send(obj);
        // return {...obj}
    });
    // 充值接口
    fastify.post('/add', async (request, reply) => {
        let obj = await (0, test_1.inster1)();
        // console.log(obj)
        reply.send(obj);
    });
    // 参与记录函数
    fastify.post('/add1', async (request, reply) => {
        let obj = await (0, test_1.inster2)(request, reply);
        console.log(obj);
        reply.send(obj);
    });
    // 充值接口查询
    fastify.post('/add2', async (request, reply) => {
        let obj = await (0, test_1.inster3)(request, reply);
        console.log(obj);
        reply.send(obj);
    });
    // 最新一期开奖
    fastify.post('/rewarded', async (request, reply) => {
        let obj = await (0, test_1.issue)(request, reply);
        console.log(obj, 2);
        reply.send(obj);
        // return {...obj}
    });
    // 中奖记录查询
    fastify.post('/getWinner', async (request, reply) => {
        let obj = await (0, test_1.getWinner)(request, reply);
        console.log(obj, 2);
        reply.send(obj);
        // return {...obj}
    });
    // 修改产品接口
    fastify.patch('/product', async (request, reply) => {
        let obj = await (0, test_1.product)(request, reply);
        console.log(obj, 2);
        reply.send(obj);
        // return {...obj}
    });
    // 关闭抢单接口
    fastify.post('/product3', async (request, reply) => {
        let obj = await (0, test_1.product3)(request, reply);
        console.log(obj, 2);
        reply.send(obj);
        // return {...obj}
    });
    // 修改期数接口
    fastify.patch('/product2', async (request, reply) => {
        let obj = await (0, test_1.product2)(request, reply);
        console.log(obj, 2);
        reply.send(obj);
        // return {...obj}
    });
    // 查询产品接口
    fastify.post('/product1', async (request, reply) => {
        let obj = await (0, test_1.product1)(request, reply);
        console.log(obj, 2);
        reply.send(obj);
        // return {...obj}
    });
    // 查询bot_set
    fastify.post('/bot_seting', async (request, reply) => {
        let obj = await (0, test_1.bot_seting)();
        console.log(obj, 2);
        reply.send(obj);
        // return {...obj}
    });
    // 用户登录接口
    fastify.post('/login', async (request, reply) => {
        let obj = await (0, test_1.login)(request, reply);
        console.log(obj, 2);
        reply.send(obj);
        // return {...obj}
    });
    fastify.get('/watch', async (request, reply) => {
        return 'pong\n';
    });
    // 绑定tg
    fastify.get('/test11', (request, reply) => {
        // http://127.0.0.1:8080/test/123 => {"userId":"123"}
        let obj = (0, test_1.bind)(123, "oxdadw", "{}");
        reply.send(obj);
    });
    // 合约提现到自己发布合约钱包接口
    fastify.post('/withdraw1', async (request, reply) => {
        let obj = await (0, test_1.withdrawApi)(request, reply);
        console.log(obj, 2);
        reply.send(obj);
        // return {...obj}
    });
    fastify.get('/bot/sendWin', (request, reply) => {
        // http://127.0.0.1:8080/test/123 => {"userId":"123"}
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
        reply.send('sendWinMsgByBot');
    });
};
exports.routes1 = routes1;
