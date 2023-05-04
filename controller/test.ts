import { FastifyReply, FastifyRequest } from "fastify";
import { myQuery } from "../mysql/queryClass";
import { AllQueryStr } from '../mysql/queryStr';

export async function test1(request:FastifyRequest, reply:FastifyReply){
    myQuery.query("select userid from user where id = ?",[1])
    let allQueryStr = new AllQueryStr(myQuery)
    let { queryWhereStr, queryData, isExist, where } =allQueryStr.getQueryWhereStr(
        [
            {
                key: 'account',
                act: '=',
                val: 'asd',
            },
        ]
    )

    let d = await myQuery.query(`SELECT *
    FROM admin ${where} ${queryWhereStr}`, queryData)
    reply.send(request.params)
}