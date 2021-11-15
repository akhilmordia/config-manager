import { EnvironmentJoinVersion } from "../types/entities";
import { ConfigQueryParam } from "../types/common";

export class BaseConfigDriver {
    loadedConfigs: Map<string, Map<string, string | object>>;

    constructor() {
        this.loadedConfigs = new Map();
    }

    keyMaker = (p: ConfigQueryParam): string => p.appId + "_" + p.env + "_" + p.version;

    keySplitter = (p: string, splitter: string): ConfigQueryParam => {
        let keys = p.split(splitter);
        return { appId: keys[0], env: keys[1], version: keys[2] };
    };

    async getEnvironmentDefaultConfig(appId: string, environmentName: string) {}

    async getVersionConfig(env: string, version: string) {}

    async getAllConfigs(): Promise<EnvironmentJoinVersion[]> {
        return [];
    }

    async pollConfigChanges(): Promise<void> {}
}
