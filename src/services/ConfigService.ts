import { ConfigQueryParam, Driver } from "../types/common";
import { merge } from "lodash";
import { getConfigDriver } from "../drivers/driverFactory";

const cron = require("node-cron");

export class ConfigService {
    driver: Driver;

    constructor(driver: string) {
        this.driver = getConfigDriver(driver);
        cron.schedule("*/3 * * * * *", async () => {
            await this.driver.pollConfigChanges();
        });
    }

    async Get(params: ConfigQueryParam) {
        const { appId, env, version, key } = params;
        if (this.driver.loadedConfigs.has(this.driver.keyMaker(params))) {
            console.log("cache hit for key: " + key);
            return this.driver.loadedConfigs.get(this.driver.keyMaker(params)).get(key);
        }
        const versionConfig = await this.driver.getVersionConfig(env, version);
        const environmentConfig = await this.driver.getEnvironmentDefaultConfig(appId, env);
        const config = merge(environmentConfig, versionConfig);
        this.driver.loadedConfigs.set(this.driver.keyMaker(params), new Map(Object.entries(config)));
        return config[key];
    }
}
