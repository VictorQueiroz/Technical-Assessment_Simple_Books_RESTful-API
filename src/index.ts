import Fastify from "fastify";
import {
  TypeBoxTypeProvider,
  TypeBoxValidatorCompiler
} from "@fastify/type-provider-typebox";
import configuration from "./configuration.secret";
import bookRoutes from "./modules/book/bookRoutes";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

(async () => {
  const fastify = Fastify({ logger: false })
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(fastifySwagger, {
    openapi: {
      jsonSchemaDialect: "draft2019-09",
      servers: [
        {
          url: `http://${configuration.listenOptions.host}:${configuration.listenOptions.port}`
        }
      ],
      info: {
        title: "Book API",
        description:
          "A simple CRUD API for managing in-memory books built with Fastify and TypeBox.",
        version: "0.0.1"
      }
    }
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/openapi",
    uiConfig: { docExpansion: "full", deepLinking: false }
  });

  bookRoutes(fastify);

  await fastify.ready();

  await fastify.listen(configuration.listenOptions);

  console.log(
    "Server is running at http://%s:%d!",
    configuration.listenOptions.host,
    configuration.listenOptions.port
  );
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
