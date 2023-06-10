
import { myQuery, queryClass, ResultType } from './queryClass'
export interface where {
    key: string,
    act: string,
    val: any,
    isMust?: boolean,
    allowEmptyStr?: boolean
}
export interface valuesInsert {
    key: string,
    val: any,
    isMust?: boolean,/** 是否必须 */
    notNull?: boolean
}
export interface values {
    key: string,
    val: any,
    act?: any,
    isMust?: boolean,
    notNull?: boolean
}
export interface Sort {
    sortOrder: any,
    sortColumnName: any,
    defaultSortColumn?: any,
    defaultSortOrder?: any
}

export interface pageType {
    page: any,
    pageSize: any,
    totalRowCount?: any,
}
export interface configureType {
    totalPage?: boolean,
    exQuery?: boolean
}
export interface sqlConfigType {
    selectNameArr: Array<string>,
    tableNameArr: Array<string>,
    wheres: Array<where>,
    handleSort?: Sort,
    handlePage?: pageType,
    configure?: configureType
}
export interface createInsertSqlType {

    values: Array<values>,
    from: string,
    configure?: configureType
}
export interface createUpdateSqlType {

    values: Array<values>,
    wheres: Array<where>,
    from: string,
    configure?: configureType
}
export interface createDeleteSqlType {
    wheres: Array<where>,
    from: string,
    configure?: configureType
}

export class AllQueryStr {
    /** 生成sql类  
     * let myallQueryStr = new AllQueryStr()
    */
    myQuery!: queryClass
    totalPage!: number
    queryResult!: ResultType
    page!: object
    constructor(myQuery: queryClass) {
        if (myQuery) {
            this.myQuery = myQuery
        }

    }
    /** 生成一般的 sqlect 查询 =>  select a,b,c from a1,b1 where...
     * @param {Array<string>} selectNameArr - 要查找的字段数组
     *  @param {Array<string>} tableNameArr - 表名数组
     * @param {Array<where>} tableNameArr - 条件json数组
     */
    async createSelectSql(sqlConfig: sqlConfigType): Promise<{ sqlStr: string; parameterData: Array<any>; page: object, queryResult: ResultType }> {
        let { selectNameArr, tableNameArr, wheres, handleSort, handlePage, configure } = sqlConfig
        let all = ``;
        if (selectNameArr && tableNameArr) {
            let { selectStr } = this.getSelectStr(selectNameArr, tableNameArr);
            all += selectStr
        }

        let parameterData = []
        if (wheres) {
            let { queryWhereStr, queryData, isExist, where } = this.getQueryWhereStr(wheres)
            all += ` ${where} ${queryWhereStr} `
            parameterData.push(...queryData)
        }


        if (handleSort) {
            let sorts = this.handleSort({ sortColumnName: handleSort.sortColumnName, sortOrder: handleSort.sortOrder }, handleSort.defaultSortColumn, handleSort.defaultSortOrder)
            all += ` order by ? ? `
            parameterData.push(...sorts)
        }


        if (configure && configure.totalPage) {
            let data = await this.myQuery.query(all, parameterData)
            this.totalPage = data.rows.length
        }


        if (handlePage) {
            let { carrPage, limitPage, pageSize, after, totalPageNum } = this.handlePage(handlePage.page, handlePage.pageSize, this.totalPage)
            all += ` limit ?,? `
            parameterData.push(...[limitPage, pageSize])
            this.page = { carrPage, pageSize, after, totalPage: totalPageNum }
        }

        // getSelectStr

        if (configure && configure.exQuery) {
            this.queryResult = await this.myQuery.query(all, parameterData)

        }

        return { sqlStr: all, parameterData, page: this.page, queryResult: this.queryResult };

    }
    /** 生成 inster 查询  */
    async createInsertSql(createInsertSqlObj: createInsertSqlType): Promise<{ sqlStr: string; parameterData: Array<any>; queryResult: ResultType }> {
        let { insertSql, queryData, MissingParameter } = this.getInsertWhereStr(createInsertSqlObj.values, createInsertSqlObj.from);
        if (MissingParameter.length > 0) {
            return {
                sqlStr: insertSql, parameterData: queryData, queryResult: {
                    code: 500,
                    msg: `缺少必须参数: ${MissingParameter.join(',')}`,
                    error: true,
                    rows: []
                }
            };
        }
        if (createInsertSqlObj.configure && createInsertSqlObj.configure.exQuery) {
            this.queryResult = await myQuery.query(insertSql, queryData)
        }

        return { sqlStr: insertSql, parameterData: queryData, queryResult: this.queryResult };
    }
    async createUpdateSql(createUpdateSqlObj: createUpdateSqlType): Promise<{ sqlStr: string; parameterData: Array<any>; queryResult: ResultType }> {
        let { updateSql, queryData, isExist, MissingParameter } = this.getUpdateWhereStr(
            createUpdateSqlObj.values, createUpdateSqlObj.wheres, createUpdateSqlObj.from
        )
        if (MissingParameter.length > 0) {
            return {
                sqlStr: updateSql, parameterData: queryData, queryResult: {
                    code: 500,
                    msg: `缺少必须参数: ${MissingParameter.join(',')}`,
                    error: true,
                    rows: []
                }
            };
        }

        if (createUpdateSqlObj.configure && createUpdateSqlObj.configure.exQuery) {
            this.queryResult = await myQuery.query(updateSql, queryData)
        }

        return { sqlStr: updateSql, parameterData: queryData, queryResult: this.queryResult };
    }
    async createDeleteSql(createDeleteSqlObj: createDeleteSqlType): Promise<{ sqlStr: string; parameterData: Array<any>; queryResult: ResultType }> {

        let { queryWhereStr, queryData, isExist, MissingParameter } = this.getQueryWhereStr(
            createDeleteSqlObj.wheres
        )

        if (MissingParameter.length > 0) {
            return {
                sqlStr: queryWhereStr, parameterData: queryData, queryResult: {
                    code: 500,
                    msg: `缺少必须参数: ${MissingParameter.join(',')}`,
                    error: true,
                    rows: []
                }
            };
        }

        let deleteSql = `delete from ${createDeleteSqlObj.from}  where ${queryWhereStr}`;

        if (createDeleteSqlObj.configure && createDeleteSqlObj.configure.exQuery) {
            this.queryResult = await myQuery.query(deleteSql, queryData)
        }

        return { sqlStr: deleteSql, parameterData: queryData, queryResult: this.queryResult };
    }
    /** 生成要查询的字段 =>  select a,b,c from a1,b1 */
    getSelectStr = (select: Array<string>, tableName: Array<string>) => {
        let str = `select `;
        select.forEach((name) => {
            str += `${name},`
        })
        str = str.substring(0, str.length - 1);

        str += ` from `

        tableName.forEach((name) => {
            str += `${name},`
        })
        str = str.substring(0, str.length - 1);
        str += ' '
        return { selectStr: str }

        // select a,b,c from a1,b1
    }
    getQueryWhereStr = (wheres: where[]) => {
        let sql = ``;
        let queryData: string[] = [];
        let MissingParameter: any = [];
        wheres.forEach((item) => {

            //允许空串
            let isTrue = false;
            if (item.allowEmptyStr) {
                isTrue = true;
            }
            else {
                if (item.val !== '') {
                    isTrue = true;
                } else {
                    isTrue = false;
                }
            }


            if (typeof (item.val) != 'undefined' && isTrue && item.val != null) {
                if (item.act == 'like') {
                    sql += `${item.key} ${item.act} ?  and `;
                    queryData.push(`%${item.val}%`)

                }
                else if (item.act == 'between') {
                    if (item.val[0]) {
                        if (item.val[1]) {
                            sql += `date(${item.key}) between ? and ? and `;
                            queryData.push(item.val[0])
                            queryData.push(item.val[1])
                        }

                    }
                }
                else {
                    sql += `${item.key} ${item.act} ? and `
                    queryData.push(item.val)
                }

            }
            else {
                if (item.isMust) {
                    MissingParameter.push(item.key)
                }

            }




        })
        if ('and ' == sql.substring(sql.length - 4)) {
            sql = sql.substring(0, sql.length - 4);
        }
        sql += ' '
        let queryWhereStr = sql;
        return {
            queryWhereStr, queryData, isExist: queryData.length > 0 ? true : false,
            where: queryData.length > 0 ? 'where' : '', MissingParameter
        };
    }
    getInsertWhereStr = (values: valuesInsert[], from: string) => {
        /**
    * @param values{value}数组
    */

        let valuesString = ``;
        let queryData: any[] = [];
        let sql = "";
        let MissingParameter: string[] = []
        values.forEach((item) => {
            if (item.notNull) {
                if (typeof (item.val) != 'undefined' && item.val != null && item.val !== '') {
                    valuesString += `${item.key},`;
                    queryData.push(item.val)

                } else {
                    if (item.isMust) {
                        MissingParameter.push(item.key)
                    }

                }
            } else {
                if (typeof (item.val) != 'undefined' && item.val != null) {
                    valuesString += `${item.key},`;
                    queryData.push(item.val)

                } else {
                    if (item.isMust) {
                        MissingParameter.push(item.key)
                    }

                }
            }

        })

        valuesString = valuesString.substring(0, valuesString.length - 1);
        let parameter = queryData.map(() => ('?')).toString()
        // parameter = parameter.substring(0,parameter.length-1);
        sql = `insert into ${from}(${valuesString}) values(${parameter})`;

        let insertSql = sql;
        return {
            insertSql, parameter, queryData, isExist: queryData.length > 0 ? true : false, MissingParameter
        };
    }
    getUpdateWhereStr = (values: values[], wheres: where[], from: string) => {
        let valuesString = ``;
        let queryData: string[] = [];
        let sql = "";
        let wheresSql = "";
        let MissingParameter: string[] = []
        values.forEach((item) => {
            if (item.notNull) {

                if (typeof (item.val) != 'undefined' && item.val != null && item.val !== '') {

                    if (item.act) {
                        if (item.act == '-') {
                            valuesString += `${item.key} = ${item.key} - ? ,`;
                        }
                    } else {
                        valuesString += `${item.key} = ? ,`;
                    }

                    queryData.push(item.val)

                } else {

                    if (item.isMust) {
                        MissingParameter.push(item.key)
                    }

                }
            } else {
                if (typeof (item.val) != 'undefined' && item.val != null) {
                    if (item.act) {
                        if (item.act == '-') {
                            valuesString += `${item.key} = ${item.key} - ? ,`;
                        }
                    } else {
                        valuesString += `${item.key} = ? ,`;
                    }
                    queryData.push(item.val)

                } else {
                    if (item.isMust) {
                        MissingParameter.push(item.key)
                    }

                }
            }
        })
        wheres.forEach((item) => {

            if (typeof (item.val) != 'undefined' && item.val !== '' && item.val != null) {
                if (item.act == 'like') {
                    wheresSql += `${item.key} ${item.act} ?  and `;
                    queryData.push(`%${item.val}%`)

                }
                else {
                    wheresSql += `${item.key} ${item.act} ? and `
                    queryData.push(item.val)
                }

            } else {
                if (item.isMust) {
                    MissingParameter.push(item.key)
                }
            }
        })

        valuesString = valuesString.substring(0, valuesString.length - 1);
        wheresSql = wheresSql.substring(0, wheresSql.length - 4);
        let parameter = queryData.map(() => ('?')).toString()
        sql = `update ${from} set ${valuesString} where ${wheresSql}`;


        let updateSql = sql;
        return {
            updateSql, parameter, queryData, isExist: queryData.length > 0 ? true : false, MissingParameter
        };
    }
    handlePage = (page: any, pageSize: any, totalRowCount?: any) => {//处理分页
        let carrPage = page;
        page = page ? parseInt(page.toString()) : 1;

        pageSize = pageSize ? parseInt(pageSize.toString()) : 10;

        page = (page - 1) * pageSize;
        let limitPage = page;
        let after: boolean = false;
        let totalPageNum = 0;
        if (totalRowCount) {
            let a = Math.ceil(parseInt(totalRowCount) / pageSize); //计算总页数
            let b = parseInt(carrPage ? carrPage : 1);
            after = b >= a ? false : true;
            totalPageNum = a;
        }
        return { carrPage, limitPage, pageSize, after, totalPageNum }
    }
    handleSort = (sort: Sort, defaultSortColumn: any, defaultSortOrder: any): [string, string] => {//处理排序
        if (sort.sortColumnName && sort.sortOrder) {
            return [sort.sortColumnName, sort.sortOrder]
            // return `${sort.sortColumnName} ${sort.sortOrder}`
        } else {
            return [defaultSortColumn, defaultSortOrder]
            // return `${defaultSortColumn} ${defaultSortOrder}`
        }

    }
}