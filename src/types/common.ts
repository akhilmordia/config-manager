import { BaseConfigDriver } from "../drivers/BaseConfigDriver";
import { MySQLConfigDriver } from "../drivers/MysqlConfigDriver";

export type JSONValue = string | number | JSONValue[] | boolean;

export type JSONParsedObject = ILooseObject<JSONValue>;

export interface ILooseObject<T = unknown> {
    [key: string]: T;
}

export type ConfigQueryParam = {
    appId: string;
    env: string;
    version: string;
    key?: string;
};

export type Driver = BaseConfigDriver | MySQLConfigDriver;
