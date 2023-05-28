import { FastifyReply, FastifyRequest } from "fastify";
import { myQuery } from "../mysql/queryClass";
import { AllQueryStr } from '../mysql/queryStr';


export async function test1(request: FastifyRequest, reply: FastifyReply) {
    // 1原生方式
    // let data = await  myQuery.query("select userid from user where id = ?",[1]) 
    //  myQuery.close() // 释放连接
    //  console.log(data)

    // 2 字段拼接sql字符串 注意 此工具不支持多表join

    // 1、select查询

    let myallQueryStr = new AllQueryStr(myQuery);
    // sqlStr 拼接好的查询sql字符串
    // parameterData 查询参数
    // queryResult 返回的数据   前提是exQuery 为 true
    let { sqlStr, parameterData, page, queryResult } = await myallQueryStr.createSelectSql(
        {
            selectNameArr: ['account', 'password'], //字段名
            tableNameArr: ['admin'], //表名
            // 条件数组
            wheres: [
                {
                    key: 'account', //字段名
                    act: '=', // 条件
                    val: 'asd', // 值
                    // 拼接代码是 `${key} ${act} = ${val} and `
                }
            ],
            // 排序 可选
            handleSort: {
                sortOrder: 'desc', // 排序顺序 desc asc 
                sortColumnName: 'account', // 排序字段
                // defaultSortColumn: 'account',
                // defaultSortOrder: 'desc',
            },
            // 分页 可选
            handlePage: {
                page: 1, // 页数由前端传递过来 page是返回第几页
                pageSize: 10
            },
            configure: {
                totalPage: true, // 是否返回总页数
                exQuery: true // 是否直接运行查询语句
            }
        },

    )
    console.log(sqlStr, parameterData)
    // let d = await myQuery.query(sqlStr, parameterData)

    // 判断执行情况 返回数据
    if (!queryResult.error) {
        const data = {
            code: 200,
            data: queryResult.rows
        }
        // res.json(data)
    } else {
        const data = {
            code: 500,
            data: null,
            msg: queryResult.msg
        }
        //  res.status(500).json(data)
    }
}
async function Hander(request:any) {
    return new Promise(async (resolve) => {
        // 查询有效次数
        let data1 = await myQuery.query("SELECT * FROM set WHERE id= ? ", [1])
        // 有效次数
        let a = data1.rows[0].productP
        // 间隔时间
        let b = data1.rows[0].wintime
        setTimeout(async () => {
            // 1原生方式
            let data = await myQuery.query("SELECT * FROM adds WHERE issue= ? ", [(request.params as any).id])
            //  myQuery.close() // 释放连接
            console.log(data, 11, data.rows)

            let rows: any = data.rows
            if (a == rows.length) {
                for (let i = 0; i < rows.length; i++) {
                    console.log(rows[i].hash, 136)

                    const input = rows[i].hash;
                    const regex = /\d+/g;
                    const matches = input.match(regex);
                    const result = matches ? matches.join('') : null;
                    console.log(result, 137)
                    rows[i].newHashNub = parseInt(result)

                }
                rows.sort((a: any, b: any) => {
                    return b.newHashNub - a.newHashNub
                })
                resolve(true)
            } if (a > rows.length) {
                resolve(false)
            }
        }, b * 60000);


    })
}
export async function rewarded(request: FastifyRequest, reply: FastifyReply) {

    // diankai
    let time = new Date() // 开始时间
    let endtime = new Date() // 结束时间
    let max = 10;
    for (let i = 0; i < max; i++) {
           let isok = await Hander(request)
           if(isok){
            // 开奖完成
           }
           else{
             max++
           }
       
    }



    // return data
    // 2 字段拼接sql字符串 注意 此工具不支持多表join

    // 1、select查询

    // let myallQueryStr = new AllQueryStr(myQuery);
    // // sqlStr 拼接好的查询sql字符串
    // // parameterData 查询参数
    // // queryResult 返回的数据   前提是exQuery 为 true
    // let { sqlStr, parameterData, page, queryResult } = await myallQueryStr.createSelectSql(
    //     {
    //         selectNameArr: ['account', 'password'], //字段名
    //         tableNameArr: ['admin'], //表名
    //         // 条件数组
    //         wheres: [
    //             {
    //                 key: 'account', //字段名
    //                 act: '=', // 条件
    //                 val: 'asd', // 值
    //                 // 拼接代码是 `${key} ${act} = ${val} and `
    //             }
    //         ],
    //         // 排序 可选
    //         handleSort: {
    //             sortOrder: 'desc', // 排序顺序 desc asc 
    //             sortColumnName: 'account', // 排序字段
    //             // defaultSortColumn: 'account',
    //             // defaultSortOrder: 'desc',
    //         },
    //         // 分页 可选
    //         handlePage: {
    //             page: 1, // 页数由前端传递过来 page是返回第几页
    //             pageSize: 10
    //         },
    //         configure: {
    //             totalPage: true, // 是否返回总页数
    //             exQuery: true // 是否直接运行查询语句
    //         }
    //     },

    // )
    // console.log(sqlStr, parameterData)
    // let d = await myQuery.query(sqlStr, parameterData)

    // // 判断执行情况 返回数据
    // if (!queryResult.error) {
    //     const data = {
    //         code: 200,
    //         data: queryResult.rows
    //     }
    //     // res.json(data)
    // } else {
    //     const data = {
    //         code: 500,
    //         data: null,
    //         msg: queryResult.msg
    //     }
    //     //  res.status(500).json(data)
    // }
}
export async function inster1(request: FastifyRequest, reply: FastifyReply) {
    // let data = await  myQuery.query("SELECT * FROM binduers WHERE userid= ? and name =?",[1,'0']) 
    // //  myQuery.close() // 释放连接
    //  console.log(data)

    let myallQueryStr = new AllQueryStr(myQuery);

    let { sqlStr, parameterData, queryResult } = await myallQueryStr.createInsertSql({
        // 要插入的字段
        values: [{
            key: 'hash', // 字段名
            val: '11146db7C32142e7B91B28De83242e8190F3b75', // 插入的值  应该从前端来的数据获取 这里写死只做演示
            isMust: true, // 是否必填 如果前端没传这个字段 则返回错误给前端
            notNull: true, //是否运允许 前端传了字段  但值是个null
        }, {
            key: 'adrress',
            val: '22614db73',
            isMust: true,
            notNull: true,
        },
        {
            key: 'val',
            val: '1',
            isMust: true,
            notNull: true,
        },
        {
            key: 'issue',
            val: '1',
            isMust: true,
            notNull: true,
        }
        ],
        from: 'adds', // 插入哪个表？
        configure: {
            exQuery: true // 仅仅拼接字符串还是直接运行
        },
    }
    )
    console.log(sqlStr, parameterData, queryResult) // 打印看看就懂
    return queryResult
    // if (!queryResult.error) {
    //     let data = {
    //         code: 200,
    //         data: queryResult.rows
    //     }
    //     // res.json(data)
    // } else {
    //     let data = {
    //         code: 500,
    //         data: null,
    //         msg: queryResult.msg
    //     }
    //     // res.status(500).json(data)
    // }


}
export async function bind(userid: number, address: string, info: any) {
    let myallQueryStr = new AllQueryStr(myQuery);

    let { sqlStr, parameterData, queryResult } = await myallQueryStr.createInsertSql({
        // 要插入的字段
        values: [{
            key: 'userid', // 字段名
            val: userid, // 插入的值  应该从前端来的数据获取 这里写死只做演示
            isMust: true, // 是否必填 如果前端没传这个字段 则返回错误给前端
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
        from: 'binduers', // 插入哪个表？
        configure: {
            exQuery: true // 仅仅拼接字符串还是直接运行
        },
    }
    )
    console.log(sqlStr, parameterData, queryResult) // 打印看看就懂

    // if (!queryResult.error) {
    //     let data = {
    //         code: 200,
    //         data: queryResult.rows
    //     }
    //     // res.json(data)
    // } else {
    //     let data = {
    //         code: 500,
    //         data: null,
    //         msg: queryResult.msg
    //     }
    //     // res.status(500).json(data)
    // }
}
// 修改产品
export async function product(request: any, reply: FastifyReply) {
    // console.log(request.body.product,request.params)
    // 与inster 基本一样
    if(!request.body){
        let obj ="不能为空"
        return obj
    }
    let myallQueryStr = new AllQueryStr(myQuery);
    let { sqlStr, parameterData, queryResult } = await myallQueryStr.createUpdateSql({
        values: [{
            key: 'product', // 要更新的字段
            val: request.body.product,
            isMust: false,
            notNull: false,
        }, {
            key: 'productValue',
            val: request.productValue,
            isMust: false,
            notNull: false,
        },
        {
            key: 'productP',
            val: request.productP,
            isMust: false,
            notNull: false,
        },
        {
            key: 'productLimit',
            val: request.productLimit,
            isMust: false,
            notNull: false,
        },
        {
            key: 'wintime',
            val: request.wintime,
            isMust: false,
            notNull: false,
        }
        ],
        wheres: [{ // 条件
            key: 'id',
            act: '=',
            val: 1,
            isMust: true
        }],
        from: 'set1',
        configure: {
            exQuery: true
        },
    }
    )


    if (!queryResult.error) {
        let data = {
            code: 200,
            data: queryResult.rows
        }
        // res.json(data)
    } else {
        let data = {
            code: 500,
            data: null,
            msg: queryResult.msg
        }
        // res.status(500).json(data)
    }


}
// 查询产品
export async function product1(request: FastifyRequest, reply: FastifyReply) {
    let data = await  myQuery.query("SELECT * FROM set1 WHERE id= ? ",[1]) 
    //  myQuery.close() // 释放连接
     console.log(data)
    return data
}
// 登录接口
export async function login(request: FastifyRequest, reply: FastifyReply) {
    let data = await  myQuery.query("SELECT * FROM uers WHERE id= ? ",[1]) 
    //  myQuery.close() // 释放连接
     console.log(data)
    return data
}
export async function delete_(request: FastifyRequest, reply: FastifyReply) {

    let myallQueryStr = new AllQueryStr(myQuery);
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
    }
    )

    if (!queryResult.error) {
        let data = {
            code: 200,
            data: queryResult.rows
        }
        // res.json(data)
    } else {
        let data = {
            code: 500,
            data: null,
            msg: queryResult.msg
        }
        // res.status(500).json(data)
    }
}