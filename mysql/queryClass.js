"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myQuery = exports.queryClass = void 0;
const mysql = __importStar(require("mysql2"));
class queryClass {
    constructor(Parameter) {
        this.PoolParameter = Parameter;
    }
    setPoolParameter(Parameter) {
        this.PoolParameter = Parameter;
    }
    createPool() {
        //创建连接池
        this.pool = mysql.createPool({
            ...this.PoolParameter
        });
    }
    async startTransaction() {
        if (!this.pool) {
            await this.createPool();
        }
        await this.pool.beginTransaction((err) => {
            if (err)
                console.log(err);
        });
    }
    async commit() {
        return new Promise((resolve, reject) => {
            this.pool.commit(async (err) => {
                if (err) {
                    console.log('提交事务 err =', err);
                    return reject(err);
                }
                else {
                    resolve('success');
                }
            });
        });
    }
    async close() {
        if (this.pool) {
            this.pool.release();
        }
        // this.pool.end()
    }
    async rollback() {
        await this.pool.rollback((err) => {
            if (err) {
                return err;
            }
            else {
                this.pool.rollback();
                return err;
            }
        });
    }
    async query(sql, queryData) {
        if (!this.pool) {
            await this.createPool();
        }
        if (typeof this.pool.query == 'undefined') {
            await this.createPool();
        }
        return new Promise((resolve, reject) => {
            this.pool.query(sql, queryData, function (err = false, rows = [], fields) {
                if (err) {
                    let result = {
                        code: 500,
                        error: true,
                        msg: err,
                        rows: rows,
                        // fields: fields
                    };
                    console.log('result.err=', result);
                    resolve(result);
                }
                else {
                    let result = {
                        code: 200,
                        error: false,
                        msg: err,
                        rows: rows,
                        // fields: fields
                    };
                    resolve(result);
                }
            });
        });
    }
}
exports.queryClass = queryClass;
let myQuery = new queryClass({
    host: '184.168.123.91',
    user: 'root',
    database: 'ton',
    password: "Jackluojie58@",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0 //可以等待的连接的个数
});
exports.myQuery = myQuery;
