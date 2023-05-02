import { FastifyReply, FastifyRequest } from "fastify";

export function test1(request:FastifyRequest, reply:FastifyReply){
    reply.send(request.params)
}