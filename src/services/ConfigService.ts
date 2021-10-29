import { runSQL } from "../drivers/mysql";
import { Environment, Version } from "../types/entities";
import { grpcBasicFunction } from "../utils/grpc";
// import merge from "../utils/mergeObject";
import { merge } from "lodash";

type ConfigQueryParam = {
    appId: string;
    env: string;
    version: string;
    key: string;
};

export class ConfigService {
    // constructor() {
    //
    // }

    @grpcBasicFunction()
    async Get(params: ConfigQueryParam) {
        const { appId, env, version, key } = params;
        console.log({ appId, env, version, key });

        const mergedVersionConfig = await ConfigService.getVersionConfig({
            env,
            version,
        });

        const mergedEvironmentConfig = await ConfigService.getEnivronmentConfig(
            {
                appId,
                environmentName: env,
            }
        );

        const config = merge(mergedEvironmentConfig, mergedVersionConfig);

        console.log("config", {
            mergedEvironmentConfig,
            mergedVersionConfig,
            config,
            val: config[key],
        });
        return { value: "config[key]" };
    }

    static async getVersionConfig({
        env,
        version,
    }: {
        env: string;
        version: string;
    }) {
        const versions = await runSQL<Version[]>({
            sql: `SELECT versions.* FROM versions
            INNER JOIN environments ON environments.id = versions.environmentId AND environments.name = ?
            WHERE versions.name = ? LIMIT 1`,
            queryParams: [env, version],
        });
        console.log("versions", versions);

        const versionData = versions.length ? versions[0] : null;
        const versionConfig = JSON.parse(versionData?.config || null);

        console.log({ versionConfig });
        return versionConfig;
    }

    static async getEnivronmentConfig({
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
        console.log("environments", environments);

        const environment = environments.length ? environments[0] : null;
        const defaultEnvironmentConfig = JSON.parse(
            environment?.defaultConfig || null
        );
        return defaultEnvironmentConfig;
    }
}
