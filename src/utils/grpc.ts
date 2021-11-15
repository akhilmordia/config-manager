import * as grpc from "@grpc/grpc-js";

// type params = Record<string, any>;
type Params = Record<string, { request: object }>;

interface GrpcCallback {
    <T>(arg: { code: grpc.status; message: string }, arg2?: T): T;
}

export const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

export const grpcBasicFunction = () => (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value;
    descriptor.value = async (params: Params, callback: GrpcCallback) => {
        try {
            callback(null, await fn(params.request));
        } catch (e) {
            callback({
                code: grpc.status.UNKNOWN,
                message: e.message,
            });
        }
    };
    return descriptor;
};
