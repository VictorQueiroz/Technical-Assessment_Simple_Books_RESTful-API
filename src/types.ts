import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyListenOptions
} from "fastify";
import { IncomingMessage, Server, ServerResponse } from "node:http";

export interface IConfiguration {
  listenOptions: FastifyListenOptions;
}

export type AppFastifyInstance = FastifyInstance<
  Server<typeof IncomingMessage, typeof ServerResponse>,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;
