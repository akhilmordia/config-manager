import mysql, { QueryOptions } from "mysql";

const pool = mysql.createPool({
    connectionLimit: +process.env.CONNECTION_LIMIT || 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

export async function runSQL<T>(input: {
    sql: string;
    queryParams?: (string | number | boolean)[];
    timeout?: number;
    connection?: string;
}): Promise<T> {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                const queryOptions: QueryOptions = {
                    sql: input.sql,
                };
                input.queryParams
                    ? (queryOptions.values = input.queryParams)
                    : null;
                input.timeout ? (queryOptions.timeout = input.timeout) : 5000; // default 5 secs.

                connection.query(queryOptions, (error, results) => {
                    connection.release();
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
            }
        });
    });
}
