export type JSONValue = string | number | JSONValue[] | boolean;

export type JSONParsedObject = ILooseObject<JSONValue>;

export interface ILooseObject<T = unknown> {
    [key: string]: T;
}
