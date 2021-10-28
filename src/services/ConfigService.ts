import { grpcBasicFunction } from "../utils/grpc";

export class ConfigService {
    // constructor() {
    //
    // }

    @grpcBasicFunction()
    get(params: object): object {
        console.log(params);
        return { value: JSON.stringify(params) };
    }
}
