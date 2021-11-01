export type Environment = {
    id: number;
    appId: number;
    name: string;
    defaultConfig: string;
    updatedAt: Date;
};

export type Version = {
    id: number;
    environmentId: number;
    name: string;
    config: string;
    updatedAt: Date;
};
