import mysql, { QueryOptions } from "mysql";
import { BaseConfigDriver } from "./BaseConfigDriver";
import { Environment, EnvironmentJoinVersion, Version } from "../types/entities";
import { ConfigQueryParam } from "../types/common";

export class MySQLConfigDriver extends BaseConfigDriver {
    pool;

    constructor() {
        super();
        this.pool = mysql.createPool({
            connectionLimit: +process.env.CONNECTION_LIMIT || 10,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });
    }

    async runSQL<T>(input: {
        sql: string;
        queryParams?: (string | number | boolean | string[])[];
        timeout?: number;
        connection?: string;
    }): Promise<T> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    const queryOptions: QueryOptions = {
                        sql: input.sql,
                    };
                    input.queryParams ? (queryOptions.values = input.queryParams) : null;
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

    async getVersionConfig(appId: string, env: string, version: string) {
        const versions = await this.runSQL<Version[]>({
            sql: `SELECT versions.id, versions.environmentId, versions.name, versions.config, versions.updatedAt 
            FROM versions
            INNER JOIN environments 
            ON environments.id = versions.environmentId
            WHERE environments.appId = ? AND environments.name = ? AND versions.name = ? LIMIT 1`,
            queryParams: [appId, env, version],
        });

        const versionData = versions.length ? versions[0] : null;
        return {
            ...JSON.parse(versionData?.config || "{}"),
            versionsUpdatedAt: versionData.updatedAt,
        };
    }

    async getEnvironmentDefaultConfig(appId: string, environmentName: string) {
        const environments = await this.runSQL<Environment[]>({
            sql: "SELECT `id`, `appId`, `name`, `defaultConfig`, `updatedAt` FROM environments WHERE appId = ? AND name = ?",
            queryParams: [appId, environmentName],
        });

        const environment = environments.length ? environments[0] : null;
        return {
            ...JSON.parse(environment?.defaultConfig || "{}"),
            envUpdatedAt: environment.updatedAt,
        };
    }

    async getAllConfigs() {
        // console.log("Loaded: ", this.loadedConfigs);
        if (this.loadedConfigs.size === 0) {
            return [];
        }
        let keys = this.loadedConfigs.keys();
        // console.log({ keys });
        let envs: string[] = [];
        let appIds: string[] = [];
        let versions: string[] = [];

        for (const value of keys) {
            //todo: validations are missing. Query might break.
            let obj: ConfigQueryParam = this.keySplitter(value, "_");
            envs.push(obj.env);
            appIds.push(obj.appId);
            versions.push(obj.version);
        }

        let sql = `
        SELECT environments.appId as appId, environments.name as environmentName, versions.name as version, 
        environments.updatedAt as envUpdatedAt, versions.updatedAt as versionsUpdatedAt FROM environments
        LEFT JOIN versions
        ON versions.environmentId = environments.id
        WHERE environments.appId in (?) AND environments.name in (?) AND versions.name in (?)`;

        // console.log(sql);
        return await this.runSQL<EnvironmentJoinVersion[]>({
            sql: sql,
            queryParams: [appIds, envs, versions],
        });
    }

    async pollConfigChanges() {
        console.log("pollConfigChanges called " + new Date());
        try {
            let data = await this.getAllConfigs();
            // console.log("All Config: ", data);
            for (let index in data) {
                let key = this.keyMaker({
                    appId: data[index].appId.toString(),
                    env: data[index].environmentName.toString(),
                    version: data[index].version.toString(),
                });
                if (!this.loadedConfigs.has(key)) {
                    continue;
                }
                let configData = this.loadedConfigs.get(key);
                // console.log(key, configData);
                let configEnvUpdatedAt = new Date(configData.get("envUpdatedAt").toString()).getTime();
                let configVersionsUpdatedAt = new Date(configData.get("versionsUpdatedAt").toString()).getTime();
                let dbEnvUpdatedAt = new Date(data[index].envUpdatedAt).getTime();
                let dbVersionsUpdatedAt = new Date(data[index].versionsUpdatedAt).getTime();
                if (configEnvUpdatedAt != dbEnvUpdatedAt || configVersionsUpdatedAt != dbVersionsUpdatedAt) {
                    console.log("delete key", key);
                    this.loadedConfigs.delete(key);
                }
            }
        } catch (err) {
            console.error(err.message, err.stack);
        }
    }
}
