
import * as mysql from 'mysql2'
export interface ResultType {
    code: number,
    error: boolean,
    msg: any,
    rows: Array<any>,
    fields?:object
}
export class queryClass {
    pool:any;
    PoolParameter;
    constructor(Parameter:any) {
        this.PoolParameter = Parameter;
    }
    setPoolParameter(Parameter:any) {
        this.PoolParameter = Parameter
    }
    createPool() {
        //创建连接池
        this.pool = mysql.createPool({
            ...this.PoolParameter
        });
    }
    public async startTransaction() {
        if (!this.pool) {
            await this.createPool();
        }
        await this.pool.beginTransaction((err:any) => {
            if (err) console.log(err);
        })
    }
    public async commit() {
        return new Promise((resolve, reject) => {
            this.pool.commit(async (err:any) => {

                if (err) {
                    console.log('提交事务 err =', err)
                    return reject(err)
                } else {

                    resolve('success')
                }

            })
        })

    }
    public async close() {
        if (this.pool) {
            this.pool.release()
        }


        // this.pool.end()
    }
    public async rollback() {
        await this.pool.rollback((err:any) => {

            if (err) {
                return err
            } else {
                this.pool.rollback()
                return err
            }
        })
    }
    async query(sql: string, queryData: Array<any>):Promise<ResultType> {
        if (!this.pool) {
            await this.createPool();
        }
        if (typeof this.pool.query == 'undefined') {
            await this.createPool();
        }
        return new Promise<ResultType>((resolve, reject) => {
            this.pool.query(sql, queryData, function (err = false, rows: [] = [], fields:any) {

                if (err) {
                    let result = {
                        code: 500,
                        error: true,
                        msg: err,
                        rows: rows,
                        // fields: fields
                    }
                    console.log('result.err=', result)
                    resolve(result);
                } else {
                    let result = {
                        code: 200,
                        error: false,
                        msg: err,
                        rows: rows,
                        // fields: fields
                    }
                    resolve(result);
                }

            })
        })
    }

}

let myQuery = new queryClass({
    host: '184.168.123.91',
    user: 'root',
    database: 'ton',
    password: "Jackluojie58@",
    waitForConnections: true, //连接超额是否等待
    connectionLimit: 10, //一次创建的最大连接数
    queueLimit: 0 //可以等待的连接的个数
})
// let myQuery = new queryClass({
//     host: '103.56.115.196',
//     user: 'ton',
//     database: 'ton',
//     password: "ZhBFKWyJA52Wm2Hj",
//     waitForConnections: true, //连接超额是否等待
//     connectionLimit: 10, //一次创建的最大连接数
//     queueLimit: 0 //可以等待的连接的个数
// })
export { myQuery }