"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHashNumb = exports.changeHashNumb = exports.delete_ = exports.withdrawApi = exports.bot_seting = exports.getWinner = exports.product3 = exports.product2 = exports.open = exports.login = exports.product1 = exports.product = exports.bind = exports.inster3 = exports.inster2 = exports.inster1 = exports.issue = exports.rewarded = exports.test1 = void 0;
const queryClass_1 = require("../mysql/queryClass");
const queryStr_1 = require("../mysql/queryStr");
const ton_1 = require("../bot/ton");
const bot_1 = require("../bot");
let globalIssue = 1; // 当前期数
let globalOpen = 1; // 活动是否启动
let globalProductLimit = 1; // 最低有效金额
let globalWintime = 1; // 开奖时间间隔
let globalProductN = 2; // 有效参与人数
let globalProductP = 1; // 中奖人数
let globalProductValue = 1; // 产品价值 
let globalLeiJiTime = new Date();
let globalRewardedNumber = 1; // 开奖循环次数
async function test1(request, reply) {
    // 1原生方式
    // let data = await  myQuery.query("select userid from user where id = ?",[1]) 
    //  myQuery.close() // 释放连接
    //  console.log(data)
    // 2 字段拼接sql字符串 注意 此工具不支持多表join
    // 1、select查询
    let myallQueryStr = new queryStr_1.AllQueryStr(queryClass_1.myQuery);
    // sqlStr 拼接好的查询sql字符串
    // parameterData 查询参数
    // queryResult 返回的数据   前提是exQuery 为 true
    let { sqlStr, parameterData, page, queryResult } = await myallQueryStr.createSelectSql({
        selectNameArr: ['account', 'password'],
        tableNameArr: ['admin'],
        // 条件数组
        wheres: [
            {
                key: 'account',
                act: '=',
                val: 'asd', // 值
                // 拼接代码是 `${key} ${act} = ${val} and `
            }
        ],
        // 排序 可选
        handleSort: {
            sortOrder: 'desc',
            sortColumnName: 'account', // 排序字段
            // defaultSortColumn: 'account',
            // defaultSortOrder: 'desc',
        },
        // 分页 可选
        handlePage: {
            page: 1,
            pageSize: 10
        },
        configure: {
            totalPage: true,
            exQuery: true // 是否直接运行查询语句
        }
    });
    console.log(sqlStr, parameterData);
    // let d = await myQuery.query(sqlStr, parameterData)
    // 判断执行情况 返回数据
    if (!queryResult.error) {
        const data = {
            code: 200,
            data: queryResult.rows
        };
        // res.json(data)
    }
    else {
        const data = {
            code: 500,
            data: null,
            msg: queryResult.msg
        };
        //  res.status(500).json(data)
    }
}
exports.test1 = test1;
// 设置开奖时间间隔条件判断
async function Hander(request) {
    return new Promise(async (resolve) => {
        resolve(await abcd1());
    });
    function abcd1() {
        return new Promise(async (resolve) => {
            setTimeout(async () => {
                // 有效次数
                // console.log(globalIssue,'globalIssue哈哈哈')
                let data = await queryClass_1.myQuery.query("SELECT * FROM adds WHERE issue= ? and isOkNumber = ? ", [globalIssue, 1]);
                let rows = data.rows;
                // rows = (rows as any[]).filter((item=>{
                //     // console.log(`${parseInt(item.val)}  >=  ${globalProductLimit} ???????????????)`)
                //     return parseInt(item.val) >= parseInt(globalProductLimit.toString())
                // }))
                // console.log(rows,'rows啊啊-----------------------------------啊',data,'data嗡嗡嗡')
                if (globalProductN == rows.length) {
                    // let i_
                    // for (let i = 0; i < rows.length; i++) {
                    //     i_ = i
                    //     console.log(rows[i].hash, 136)
                    //     const input = rows[i].hash;
                    //     const regex = /\d+/g;
                    //     const matches = input.match(regex);
                    //     const result = matches ? matches.join('') : null;
                    //     // console.log(result, 137)
                    //     rows[i].newHashNub = parseInt(result)
                    // }
                    rows.sort((a, b) => {
                        return b.winnerNumber - a.winnerNumber;
                    });
                    // 调用机器人开奖
                    let time1 = globalRewardedNumber * globalWintime;
                    // 修改中奖者状态
                    let dat = await queryClass_1.myQuery.query("SELECT * FROM set1 WHERE id= ? ", [1]);
                    //  中奖人数
                    globalProductP = dat.rows[0].productP;
                    //  console.log(globalProductP,'中奖人数')
                    for (let i_2 = 0; i_2 < globalProductP; i_2++) {
                        // console.log(rows,rows[i_2].adrress,i_2,'中奖者数据')
                        await queryClass_1.myQuery.query("update adds set winners = ? where hash = ? ", [1, rows[i_2].hash]);
                    }
                    let winRows = await queryClass_1.myQuery.query("select * from adds where winners = ? and issue = ?", [1, globalIssue]);
                    (0, bot_1.sendWinMsgByBot)((winRows.rows), time1, globalIssue, globalLeiJiTime);
                    // console.log("全局期数", globalIssue)
                    // await myQuery.query("update set1 set issue = ? ", [globalIssue + 1])
                    // let newVal  = await myQuery.query("select issue from set1", [])
                    // console.log('newVal',newVal)
                    // console.log(rows)
                    resolve(true);
                }
                if (globalProductN > rows.length) {
                    resolve(false);
                }
            }, globalWintime * 60000);
        });
    }
}
async function rewarded(request, reply) {
    return new Promise(async (resolve) => {
        globalRewardedNumber = 1;
        // 发送开始抢单提示
        (0, bot_1.sendStartMsgByBot)("", globalIssue, globalLeiJiTime);
        for (let i = 1; true; i++) {
            globalRewardedNumber = i;
            console.log(`第${globalIssue}期，第`, i, "次抢单");
            let isok = await Hander(request);
            if (isok) {
                // 开奖完成
                resolve(true);
                break;
            }
            if (globalOpen == 0) {
                break;
            }
        }
    });
}
exports.rewarded = rewarded;
async function issue(request, reply) {
    let dat = await queryClass_1.myQuery.query("SELECT * FROM set1 WHERE id= ? ", [1]);
    // 开启参与时间获取
    let nowTime = new Date();
    globalLeiJiTime = nowTime;
    // globalLeiJiTime
    // 设置全局变量
    globalIssue = dat.rows[0].issue; // 全局期数
    globalOpen = dat.rows[0].open; // 抢单开启状态
    globalProductLimit = dat.rows[0].productLimit; // 最低有效金额
    globalWintime = dat.rows[0].wintime; //设置时间间隔
    globalProductN = dat.rows[0].productN; //设置有效参与人数
    // = dat.rows[0].productN //设置时间间隔
    globalProductN;
    if (globalOpen == 0) {
        let obj = "抢单未开启";
        return { msg: obj };
    }
    function rewarded_() {
        return new Promise((resolve) => {
            setTimeout(async () => {
                let isOK = await rewarded(request, reply);
                resolve(isOK);
            }, globalWintime * 60000);
        });
    }
    let j_ = globalIssue;
    // for (let j = j_; true; j++) {
    if (globalOpen == 0) {
        return;
    }
    // j期数
    console.log("开始第", globalIssue, '期');
    // globalIssue = j // 设置全局变量 期数
    // if (globalIssue == 1) {
    //     let isOK = await rewarded(request, reply)
    //     if (isOK) {
    //         await myQuery.query("update set1 set issue = ?", [j])
    //     }
    // } else {
    //     let isOK = await rewarded_()
    //     if (isOK) {
    //         await myQuery.query("update set1 set issue = ?", [j])
    //         globalLeiJiTime =  new Date() 
    //     }
    // }
    let isOK = await rewarded(request, reply);
    if (isOK) {
        await queryClass_1.myQuery.query("update set1 set issue = ?", [globalIssue + 1]);
        globalLeiJiTime = new Date();
    }
    console.log("第", globalIssue, '期结束');
    // }
}
exports.issue = issue;
// 充值接口
async function inster1() {
    // let data = await  myQuery.query("SELECT * FROM binduers WHERE userid= ? and name =?",[1,'0']) 
    // //  myQuery.close() // 释放连接
    //  console.log(data)
    let data = await queryClass_1.myQuery.query("SELECT * FROM set1 WHERE id= ? ", [1]);
    console.log(data.rows[0].open, 3211);
    if (data.rows[0].open == 0) {
        let obj = "抢单未开启";
        console.log(data.rows[0].open, 3211);
        return obj;
    }
    let d = await (0, ton_1.getTransactions)(100, true);
    console.log(d, 'd');
    async function add(value, hash, userAddress, utime, winnerNumber, isOkNumber) {
        let myallQueryStr = new queryStr_1.AllQueryStr(queryClass_1.myQuery);
        let data = await queryClass_1.myQuery.query("select * from set1 where id =? ", [1]);
        let j_ = data.rows[0].issue;
        let { sqlStr, parameterData, queryResult } = await myallQueryStr.createInsertSql({
            // 要插入的字段
            values: [{
                    key: 'hash',
                    val: hash,
                    isMust: true,
                    notNull: true, //是否运允许 前端传了字段  但值是个null
                }, {
                    key: 'adrress',
                    val: userAddress,
                    isMust: true,
                    notNull: true,
                },
                {
                    key: 'val',
                    val: value,
                    isMust: true,
                    notNull: true,
                },
                {
                    key: 'issue',
                    val: globalIssue,
                    isMust: true,
                    notNull: true,
                },
                {
                    key: 'winnerNumber',
                    val: winnerNumber,
                    isMust: true,
                    notNull: true,
                },
                {
                    key: 'isOkNumber',
                    val: isOkNumber,
                    isMust: true,
                    notNull: true,
                }
            ],
            from: 'adds',
            configure: {
                exQuery: true // 仅仅拼接字符串还是直接运行
            },
        });
        console.log(sqlStr, parameterData, queryResult, '数据'); // 打印看看就懂
        // 调用机器人
        // sendReceiveMsgByBot("",globalIssue,queryResult)
        return queryResult.error;
    }
    async function handerTime() {
        for (let i = 0; true; i++) {
            await timeHander();
        }
    }
    function timeHander() {
        return new Promise(async (resolve) => {
            setTimeout(async () => {
                let d = await addfc();
                resolve(d);
            }, 5000);
        });
    }
    async function addfc() {
        let data = await queryClass_1.myQuery.query("SELECT * FROM set1 WHERE id= ? ", [1]);
        console.log(data.rows[0].open, 3211);
        if (data.rows[0].open == 0) {
            let obj = "抢单未开启";
            // console.log(data.rows[0].open, 3211)
            return obj;
        }
        // let datarow = (await myQuery.query("SELECT * FROM binduers ", []) as any)
        // console.log('datarows', datarow.rows[2].address)
        try {
            let d = await (0, ton_1.getTransactions)(50, true);
            // console.log(d, '查链数据')
            // for (let i = 0; i < datarow.rows.length; i++) {
            // console.log(i, 'i')
            for (let j = 0; j < d.length; j++) {
                // console.log(j, 'j', d[j].in_msg.source, 'd[j].in_msg.source', datarow.rows[i].address, 'datarow[i].address')
                // console.log('d[j]', d[j], '============', d[j].in_msg.source)
                // if (datarow.rows[i].address == d[j].in_msg.source) {
                // console.log(d[j].in_msg.value, 'd[j].in_msg.value', d[j].in_msg.value, 'd[j].in_msg.value', changeHash(d[j].transaction_id.hash), 'changeHash(d[j].transaction_id.hash)')
                let value = d[j].in_msg.value;
                let isOkNumber = value >= globalProductLimit ? 1 : 0;
                let hash = (0, ton_1.changeHash)(d[j].transaction_id.hash);
                let winnerNumber = extractLastNonZeroDigits(getHashNumb(hash));
                // console.log(winnerNumber,'截取数字后面六位！！！！！')
                let userAddress = d[j].in_msg.source;
                let utime = new Date(d[j].utime * 1000);
                let b2 = null;
                // console.log(utime,'链上时间',globalLeiJiTime,'本机时间======')
                if (globalLeiJiTime < utime) {
                    // console.log(value, hash, userAddress, '日期对了=====')
                    b2 = await add(value, hash, userAddress, utime, winnerNumber, isOkNumber);
                }
                else {
                    console.log('不行=======！！！！！');
                    return;
                }
                console.log(b2, 'b2');
                if (b2 == false) {
                    console.log('!!!!成立。。。。。。。。。');
                    let success = await queryClass_1.myQuery.query("SELECT * FROM adds where hash = ?", [hash]);
                    // console.log(success,'success')
                    // 转账hash数字
                    const input = (success.rows[0].hash);
                    const regex = /\d+/g;
                    const matches = input.match(regex);
                    const result1 = matches ? matches.join('') : null;
                    // console.log(result1, 137)
                    // 根据期数查询实时参与排名(得是有效才排名 否则不参与排名)
                    // 是否有效参与
                    let youXiaoCanYu = "";
                    if (success.rows[0].isOkNumber == 1) {
                        youXiaoCanYu = '是';
                    }
                    else {
                        youXiaoCanYu = '否';
                    }
                    // console.log(globalIssue,'全局期数')
                    let dataissue = await queryClass_1.myQuery.query("SELECT * FROM adds WHERE issue= ? and isOkNumber = ?  order by winnerNumber desc ", [globalIssue, 1]);
                    let rows = dataissue.rows;
                    if (rows.length) {
                        // 有效转账金额
                        // console.log(rows,'rows有吗？',dataissue,'查询你')
                        // let i_
                        // for (let i = 0; i < rows.length; i++) {
                        //     i_ = i
                        //     // console.log(rows[i].hash, 136)
                        //     const input = rows[i].hash;
                        //     const regex = /\d+/g;
                        //     const matches = input.match(regex);
                        //     const result:any = matches ? matches.join('') : null;
                        //     let hashNumber = extractLastNonZeroDigits(result)
                        //     console.log(hashNumber, '后六位数字')
                        //     rows[i].newHashNub = hashNumber
                        // }
                        // rows = (rows as any[]).filter((item=>{
                        //     return item.val >= globalProductLimit
                        // }))
                        // rows.sort((a: any, b: any) => {
                        //     return b.winnerNumber - a.winnerNumber
                        // })
                        console.log(rows, '数字排名？？？============');
                        // 当前参与实时排名
                        let dangQianPaiMing = -1;
                        dangQianPaiMing = rows.findIndex(item => {
                            return item.hash == success.rows[0].hash;
                        });
                        // console.log(rows,'最新rows')
                        // 当期最高排名钱包地址
                        let fistadrress = rows[0].adrress;
                        // 当期最高排名哈希
                        let firsthash = rows[0].hash;
                        // 当期最高排名哈希数字
                        let fistnumber = (rows[0].winnerNumber);
                        // 剩余有效参与次数
                        // console.log(rows.length,rows,'剩余次数数组、、、、、、、、、',globalProductN)
                        let shengyu = globalProductN - rows.length;
                        // 时长计算
                        let startTime = globalLeiJiTime;
                        // 开始时间 
                        let endTime = new Date();
                        // 结束时间 
                        let timeDifference = endTime.getTime() - startTime.getTime();
                        // 计算差值（单位为毫秒） 
                        let minutesDifference = Math.floor(timeDifference / (1000 * 60));
                        // 将差值转换为分钟数 
                        console.log('输出分钟数间隔', minutesDifference); // 输出分钟数间隔
                        (0, bot_1.sendReceiveMsgByBot)('', globalIssue, success, youXiaoCanYu, result1, dangQianPaiMing, fistadrress, firsthash, fistnumber, shengyu, minutesDifference, globalLeiJiTime);
                    }
                    else {
                        // 无效转账金额
                        // console.log(rows,'rows有吗？',dataissue,'查询你')
                        // let i_
                        // for (let i = 0; i < rows.length; i++) {
                        //     i_ = i
                        //     // console.log(rows[i].hash, 136)
                        //     const input = rows[i].hash;
                        //     const regex = /\d+/g;
                        //     const matches = input.match(regex);
                        //     const result:any = matches ? matches.join('') : null;
                        //     let hashNumber = extractLastNonZeroDigits(result)
                        //     console.log(hashNumber, '后六位数字')
                        //     rows[i].newHashNub = hashNumber
                        // }
                        // rows = (rows as any[]).filter((item=>{
                        //     return item.val >= globalProductLimit
                        // }))
                        // rows.sort((a: any, b: any) => {
                        //     return b.winnerNumber - a.winnerNumber
                        // })
                        console.log(rows, '数字排名？？？============');
                        // 当前参与实时排名
                        let dangQianPaiMing = -1;
                        dangQianPaiMing = rows.findIndex(item => {
                            return item.hash == success.rows[0].hash;
                        });
                        // console.log(rows,'最新rows')
                        // 当期最高排名钱包地址
                        let fistadrress = null; // rows[0].adrress
                        // 当期最高排名哈希
                        let firsthash = null;
                        // 当期最高排名哈希数字
                        let fistnumber = null;
                        // 剩余有效参与次数
                        // console.log(rows.length,rows,'剩余次数数组、、、、、、、、、',globalProductN)
                        let shengyu = globalProductN - rows.length;
                        // 时长计算
                        let startTime = globalLeiJiTime;
                        // 开始时间 
                        let endTime = new Date();
                        // 结束时间 
                        let timeDifference = endTime.getTime() - startTime.getTime();
                        // 计算差值（单位为毫秒） 
                        let minutesDifference = Math.floor(timeDifference / (1000 * 60));
                        // 将差值转换为分钟数 
                        console.log('输出分钟数间隔', minutesDifference); // 输出分钟数间隔
                        await (0, bot_1.sendReceiveMsgByBot)('', globalIssue, success, youXiaoCanYu, result1, dangQianPaiMing, fistadrress, firsthash, fistnumber, shengyu, minutesDifference, globalLeiJiTime);
                    }
                }
                // } else {
                //     console.log('不成立。。。。。。。。。')
                // }
                // }
            }
        }
        catch (error) {
            console.log('error', error);
        }
    }
    handerTime();
}
exports.inster1 = inster1;
// 参与记录接口
async function inster2(request, reply) {
    let data = await queryClass_1.myQuery.query("SELECT * FROM adds", []);
    //  myQuery.close() // 释放连接
    console.log(data);
    return data;
}
exports.inster2 = inster2;
// 查询充值接口
async function inster3(request, reply) {
    let myallQueryStr = new queryStr_1.AllQueryStr(queryClass_1.myQuery);
    // sqlStr 拼接好的查询sql字符串
    // parameterData 查询参数
    // queryResult 返回的数据   前提是exQuery 为 true
    let { sqlStr, parameterData, page, queryResult } = await myallQueryStr.createSelectSql({
        selectNameArr: ['hash', 'adrress', 'val', 'issue', 'time'],
        tableNameArr: ['adds'],
        // 条件数组
        wheres: [
            {
                key: 'issue',
                act: '=',
                val: request.body.issue, // 值
                // 拼接代码是 `${key} ${act} = ${val} and `
            },
            {
                key: 'hash',
                act: '=',
                val: request.body.hash, // 值
                // 拼接代码是 `${key} ${act} = ${val} and `
            },
            {
                key: 'adrress',
                act: '=',
                val: request.body.adrress, // 值
                // 拼接代码是 `${key} ${act} = ${val} and `
            },
            {
                key: 'val',
                act: '=',
                val: request.body.val, // 值
                // 拼接代码是 `${key} ${act} = ${val} and `
            },
        ],
        // 排序 可选
        handleSort: {
            sortOrder: 'desc',
            sortColumnName: 'time',
            defaultSortColumn: 'time',
            defaultSortOrder: 'desc',
        },
        // 分页 可选
        handlePage: {
            page: request.body.page,
            pageSize: request.body.pageSize
        },
        configure: {
            totalPage: true,
            exQuery: true // 是否直接运行查询语句
        }
    });
    console.log(sqlStr, parameterData);
    // let data = await myQuery.query("SELECT * FROM adds", [])
    //  myQuery.close() // 释放连接
    // console.log(data)
    return {
        ...queryResult,
        page_: page
    };
}
exports.inster3 = inster3;
async function bind(userid, address, info) {
    let myallQueryStr = new queryStr_1.AllQueryStr(queryClass_1.myQuery);
    let { sqlStr, parameterData, queryResult } = await myallQueryStr.createInsertSql({
        // 要插入的字段
        values: [{
                key: 'userid',
                val: userid,
                isMust: true,
                notNull: true, //是否运允许 前端传了字段  但值是个null
            }, {
                key: 'address',
                val: address,
                isMust: true,
                notNull: true,
            },
            {
                key: 'info',
                val: JSON.stringify(info),
                isMust: true,
                notNull: true,
            }
        ],
        from: 'binduers',
        configure: {
            exQuery: true // 仅仅拼接字符串还是直接运行
        },
    });
    console.log(sqlStr, parameterData, queryResult); // 打印看看就懂
    if (!queryResult.error) {
        let data = {
            code: 200,
            data: queryResult.rows
        };
        // res.json(data)
    }
    else {
        let data = {
            code: 500,
            data: null,
            msg: queryResult.msg
        };
        // res.status(500).json(data)
    }
}
exports.bind = bind;
// 修改产品
async function product(request, reply) {
    // console.log(request.body.product,request.params)
    // 与inster 基本一样
    if (!request.body) {
        let obj = "不能为空";
        return obj;
    }
    let myallQueryStr = new queryStr_1.AllQueryStr(queryClass_1.myQuery);
    let { sqlStr, parameterData, queryResult } = await myallQueryStr.createUpdateSql({
        values: [{
                key: 'product',
                val: request.body.product,
                isMust: false,
                notNull: false,
            }, {
                key: 'productValue',
                val: request.body.productValue,
                isMust: false,
                notNull: false,
            },
            {
                key: 'productN',
                val: request.body.productN,
                isMust: false,
                notNull: false,
            },
            {
                key: 'productP',
                val: request.body.productP,
                isMust: false,
                notNull: false,
            },
            {
                key: 'issue',
                val: request.body.issue,
                isMust: false,
                notNull: false,
            },
            {
                key: 'productLimit',
                val: request.body.productLimit,
                isMust: false,
                notNull: false,
            },
            {
                key: 'wintime',
                val: request.body.wintime,
                isMust: false,
                notNull: false,
            },
            {
                key: 'open',
                val: request.body.open,
                isMust: false,
                notNull: false,
            }
        ],
        wheres: [{
                key: 'id',
                act: '=',
                val: 1,
                isMust: true
            }],
        from: 'set1',
        configure: {
            exQuery: true
        },
    });
    console.log('sqlStr111', sqlStr);
    if (!queryResult.error) {
        let data = {
            code: 200,
            data: queryResult.rows
        };
        // res.json(data)
    }
    else {
        let data = {
            code: 500,
            data: null,
            msg: queryResult.msg
        };
        // res.status(500).json(data)
    }
    let obj1 = { rows: queryResult.rows, msg: "修改成功" };
    return obj1;
}
exports.product = product;
// 查询产品
async function product1(request, reply) {
    let data = await queryClass_1.myQuery.query("SELECT * FROM set1 WHERE id= ? ", [1]);
    //  myQuery.close() // 释放连接
    console.log(data);
    return data;
}
exports.product1 = product1;
// 登录接口
async function login(request, reply) {
    let data = await queryClass_1.myQuery.query("SELECT * FROM uers WHERE id= ? ", [1]);
    //  myQuery.close() // 释放连接
    console.log(data);
    return data;
}
exports.login = login;
// 开启抢单接口
async function open(request, reply) {
    // 调用机器人
    return 11;
}
exports.open = open;
// 修改产品期数
async function product2(request, reply) {
    let data = await queryClass_1.myQuery.query("update set1 set issue = ?", [request.body.issue]);
    //  myQuery.close() // 释放连接
    console.log(data);
    return data;
}
exports.product2 = product2;
// 关闭抢单接口
async function product3(request, reply) {
    let data = await queryClass_1.myQuery.query("update set1 set open = ?", [0]);
    //  myQuery.close() // 释放连接
    globalOpen = 0;
    console.log(data);
    return data;
}
exports.product3 = product3;
// 中奖查询根据期
async function getWinner(request, reply) {
    let data;
    if (request.body.issue) {
        data = await queryClass_1.myQuery.query("select *  from adds where   winners = ? and issue = ? order by issue desc", [1, request.body.issue]);
    }
    else {
        data = await queryClass_1.myQuery.query("select *  from adds where   winners = ?  order by issue desc", [1]);
        //  myQuery.close() // 释放连接
    }
    console.log(data);
    return data;
}
exports.getWinner = getWinner;
// 查询bot_set
async function bot_seting() {
    let data = await queryClass_1.myQuery.query("select *  from bot_set ", []);
    // console.log(data)
    return data.rows[0];
}
exports.bot_seting = bot_seting;
async function withdrawApi(request, reply) {
    (0, ton_1.withdraw)();
    (0, ton_1.getBalance)();
    //  myQuery.close() // 释放连接
    return { msg: '成功' };
}
exports.withdrawApi = withdrawApi;
async function delete_(request, reply) {
    let myallQueryStr = new queryStr_1.AllQueryStr(queryClass_1.myQuery);
    let { sqlStr, parameterData, queryResult } = await myallQueryStr.createDeleteSql({
        // 删除条件
        wheres: [{
                key: 'account',
                act: '=',
                val: 'asd',
                isMust: true
            }],
        from: 'admin',
        configure: {
            exQuery: true
        },
    });
    if (!queryResult.error) {
        let data = {
            code: 200,
            data: queryResult.rows
        };
        // res.json(data)
    }
    else {
        let data = {
            code: 500,
            data: null,
            msg: queryResult.msg
        };
        // res.status(500).json(data)
    }
}
exports.delete_ = delete_;
function changeHashNumb(baseHash) {
    const input = (0, ton_1.changeHash)(baseHash);
    const regex = /\d+/g;
    const matches = input.match(regex);
    const result1 = matches ? matches.join('') : null;
    return result1;
}
exports.changeHashNumb = changeHashNumb;
function extractLastNonZeroDigits(number) {
    let str = number.toString();
    str = str.slice(-6);
    return parseInt(str);
}
function getHashNumb(hash) {
    const regex = /\d+/g;
    const matches = hash.match(regex);
    const result1 = matches ? matches.join('') : null;
    return result1;
}
exports.getHashNumb = getHashNumb;
