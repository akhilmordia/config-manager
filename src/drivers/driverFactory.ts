import { MySQLConfigDriver } from "./MysqlConfigDriver";
import { Driver } from "../types/common";

//todo: handle unknown driver
export const getConfigDriver = (driver: string): Driver => {
    if (driver === "MYSQL") {
        return new MySQLConfigDriver();
    }
};
