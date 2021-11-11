import { runSQL } from "../drivers/mysql";
import {
    Environment,
    EnvironmentJoinVersion,
    Version,
} from "../types/entities";
import { grpcBasicFunction } from "../utils/grpc";
import { merge } from "lodash";

const cron = require("node-cron");
//todo: do we need lodash? evaluate using spread only.

type ConfigQueryParam = {
    appId: string;
    env: string;
    version: string;
    key: string;
};

const keyMaker = (p: ConfigQueryParam): string =>
    p.appId + "_" + p.env + "_" + p.version;

const keySplitter = (p: string, splitter: string): ConfigQueryParam => {
    let keys = p.split(splitter);
    return { appId: keys[0], env: keys[1], version: keys[2], key: "" };
};

const getConfigFromDb = async () => {
    let keys = allConfigs.keys();
    let environmentName = "";
    let appId = "";
    let versionsName = "";

    for (const value of keys) {
        let obj: ConfigQueryParam = keySplitter(value, "_");
        environmentName = environmentName + ", " + obj.env;
        appId = appId + ", " + obj.appId;
        versionsName = versionsName + ", " + obj.version;
    }
    environmentName = environmentName.replace(/^,\s+/, "");
    appId = appId.replace(/^,\s+/, "");
    versionsName = versionsName.replace(/^,\s+/, "");

    const data = await runSQL<EnvironmentJoinVersion[]>({
        sql: `SELECT environments.appId as appId, environments.name as environmentName , versions.name as version , 
                  environments.updatedAt as envUpdatedAt, versions.updatedAt as versionsUpdatedAt FROM environments
                  LEFT JOIN versions
                  ON versions.environmentId = environments.id
                  WHERE environments.appId in (?) AND environments.name in (?) AND versions.name in (?)`,
        queryParams: [appId, environmentName, versionsName],
    });
    return data;
};

let allConfigs = new Map();

class _ConfigService {
    constructor() {}

    async Get(params: ConfigQueryParam) {
        const { appId, env, version, key } = params;
        if (allConfigs.has(keyMaker(params))) {
            console.log("cache hit for key: " + key);
            return allConfigs.get(keyMaker(params)).get(key);
        }
        const mergedVersionConfig = await this.getVersionConfig({
            env,
            version,
        });
        const mergedEnvironmentConfig = await this.getEnvironmentConfig({
            appId,
            environmentName: env,
        });
        const config = merge(mergedEnvironmentConfig, mergedVersionConfig);
        allConfigs.set(keyMaker(params), new Map(Object.entries(config)));
        return config[key];
    }

    //todo: make this part of the driver interface and get this from driver.
    async getVersionConfig({ env, version }: { env: string; version: string }) {
        const versions = await runSQL<Version[]>({
            sql: `SELECT versions.* FROM versions
            INNER JOIN environments ON environments.id = versions.environmentId AND environments.name = ?
            WHERE versions.name = ? LIMIT 1`,
            queryParams: [env, version],
        });

        const versionData = versions.length ? versions[0] : null;
        const versionConfig = {
            ...JSON.parse(versionData?.config || null),
            versionsUpdatedAt: versionData.updatedAt,
        };
        return versionConfig;
    }

    //todo: make this part of the driver interface and get this from driver.
    async getEnvironmentConfig({
        appId,
        environmentName,
    }: {
        appId: string;
        environmentName: string;
    }) {
        const environments = await runSQL<Environment[]>({
            sql: "SELECT * FROM environments WHERE appId = ? AND name = ?",
            queryParams: [appId, environmentName],
        });

        const environment = environments.length ? environments[0] : null;
        // const defaultEnvironmentConfig = JSON.parse(
        //     environment?.defaultConfig || null
        // );
        const defaultEnvironmentConfig = {
            ...JSON.parse(environment?.defaultConfig || null),
            envUpdatedAt: environment.updatedAt,
        };

        return defaultEnvironmentConfig;
    }
}

//todo: update directory structure
export class ConfigService {
    static service = new _ConfigService();

    constructor() {}

    @grpcBasicFunction()
    async Get(params: ConfigQueryParam) {
        const response = await ConfigService.service.Get(params);
        return { value: JSON.stringify(response) };
    }
}

//todo: update directory structure
cron.schedule("*/10 * * * * *", async () => {
    try {
        let data = await getConfigFromDb();
        for (let index in data) {
            let key = keyMaker({
                appId: data[index].appId.toString(),
                env: data[index].environmentName.toString(),
                version: data[index].version,
                key: "",
            });
            let configData = allConfigs.get(key);

            let configEnvUpdatedAt = new Date(
                configData.get("envUpdatedAt")
            ).getTime();
            let configVersionsUpdatedAt = new Date(
                configData.get("versionsUpdatedAt")
            ).getTime();
            let dbEnvUpdatedAt = new Date(data[index].envUpdatedAt).getTime();
            let dbVersionsUpdatedAt = new Date(
                data[index].versionsUpdatedAt
            ).getTime();

            if (
                configEnvUpdatedAt != dbEnvUpdatedAt ||
                configVersionsUpdatedAt != dbVersionsUpdatedAt
            ) {
                console.log("delete key", key);
                allConfigs.delete(key);
            }
        }
    } catch (err) {
        console.error(err.message);
    }
});
