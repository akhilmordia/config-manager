import dotenv from "dotenv";

dotenv.config();
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { grpcBasicFunction, options } from "./utils/grpc";
import { ConfigService } from "./services/ConfigService";
import { ConfigQueryParam } from "./types/common";

class ConfigService_Grpc {
    static service = new ConfigService(process.env.DRIVER);

    @grpcBasicFunction()
    async Get(params: ConfigQueryParam) {
        const response = await ConfigService_Grpc.service.Get(params);
        return { value: JSON.stringify(response) };
    }
}

const PROTO_PATH = process.env.CONFIG_PROTO_PATH;
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const configProto = grpc.loadPackageDefinition(packageDefinition);
const configService = new ConfigService_Grpc();
const server = new grpc.Server();
// @ts-ignore
server.addService(configProto.ConfigService.service, configService);
server.bindAsync(
    `${process.env.GRPC_SERVER_HOST}:${process.env.GRPC_SERVER_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        console.log("Server is running at port:", port);
        server.start();
    }
);
