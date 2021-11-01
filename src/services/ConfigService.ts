import { runSQL } from "../drivers/mysql";
import { Environment, Version } from "../types/entities";
import { grpcBasicFunction } from "../utils/grpc";
import { merge } from "lodash";
//todo: do we need lodash? evaluate using spread only.

type ConfigQueryParam = {
    appId: string;
    env: string;
    version: string;
    key: string;
};

const keyMaker = (p: ConfigQueryParam): string =>
    p.appId + "_" + p.env + "_" + p.version;

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
        const versionConfig = JSON.parse(versionData?.config || null);
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
        const defaultEnvironmentConfig = JSON.parse(
            environment?.defaultConfig || null
        );
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
