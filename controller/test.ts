import { FastifyReply, FastifyRequest } from "fastify";
import { myQuery } from "../mysql/queryClass";
import { AllQueryStr } from '../mysql/queryStr';

export async function test1(request: FastifyRequest, reply: FastifyReply) {
    // 1原生方式
    let data = await  myQuery.query("select userid from user where id = ?",[1]) 
     myQuery.close() // 释放连接
     console.log(data)

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

export async function inster(request: FastifyRequest, reply: FastifyReply) {

    let myallQueryStr = new AllQueryStr(myQuery);
    let { sqlStr, parameterData, queryResult } = await myallQueryStr.createInsertSql({
        // 要插入的字段
        values: [{
            key: 'account', // 字段名
            val: 'account3', // 插入的值  应该从前端来的数据获取 这里写死只做演示
            isMust: true, // 是否必填 如果前端没传这个字段 则返回错误给前端
            notNull: true, //是否运允许 前端传了字段  但值是个null
        }, {
            key: 'password',
            val: 'password3',
            isMust: true,
            notNull: true,
        },
        {
            key: 'belong_stores_name',
            val: 'belong_stores_name3',
            isMust: true,
            notNull: true,
        }
        ],
        from: 'admin', // 插入哪个表？
        configure: {
            exQuery: true // 仅仅拼接字符串还是直接运行
        },
    }
    )
    console.log(sqlStr, parameterData, queryResult) // 打印看看就懂

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

export async function update(request: FastifyRequest, reply: FastifyReply) {
 // 与inster 基本一样
    let myallQueryStr = new AllQueryStr(myQuery);
    let { sqlStr, parameterData, queryResult } = await myallQueryStr.createUpdateSql({
        values: [{
            key: 'account', // 要更新的字段
            val: 'account2e',
            isMust: true,
            notNull: true,
        }, {
            key: 'password',
            val: 'password2e',
            isMust: true,
            notNull: true,
        },
        {
            key: 'belong_stores_name',
            val: 'belong_stores_name2e',
            isMust: true,
            notNull: true,
        }
        ],
        wheres: [{ // 条件
            key: 'account',
            act: '=',
            val: 'account2e',
            isMust:true
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
export async function delete_(request: FastifyRequest, reply: FastifyReply) {

    let myallQueryStr = new AllQueryStr(myQuery);
    let { sqlStr, parameterData, queryResult } = await myallQueryStr.createDeleteSql({
        // 删除条件
        wheres: [{
            key: 'account',
            act: '=',
            val: 'asd',
            isMust:true
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