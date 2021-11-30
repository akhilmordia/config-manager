from __future__ import print_function

import logging

import grpc
import config_pb2
import config_pb2_grpc


def run():
    # NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
    with grpc.insecure_channel('localhost:50052') as channel:
        stub = config_pb2_grpc.ConfigServiceStub(channel)
        response = stub.Get(config_pb2.GetParams(version= "1.0.0", appId= "1", env= "dev", key= "bookingSuccessTemplate"))

    print("Greeter client received: " + response.value)


if __name__ == '__main__':
    logging.basicConfig()
    run()