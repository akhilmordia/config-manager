import dotenv from 'dotenv'
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

dotenv.config();
const PROTO_PATH = process.env.CONFIG_PROTO_PATH;
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const configProto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

const grpcWrapper = () => (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    descriptor.value = (_, callback) => {
        try {
            callback(null, fn(_.request))
        } catch (e) {
            callback({
                code: grpc.status.UNKNOWN,
                message: e.message,
            });
        }
    }
    return descriptor;
};

class ConfigService {

    // constructor() {
    //
    // }

    @grpcWrapper()
    get(params) {
        console.log(params)
        return {value: JSON.stringify(params)}
    }
}

(async () => {
    const configService = new ConfigService();
    // @ts-ignore
    server.addService(configProto.ConfigService.service, configService);
    server.bindAsync(
        "0.0.0.0:50051",
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            console.log("Server at port:", port);
            console.log("Server running at http://127.0.0.1:50051");
            server.start();
        }
    );
})()


