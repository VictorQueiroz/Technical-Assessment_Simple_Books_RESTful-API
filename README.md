# Simple RESTful API for managing a list of books

## Technologies used

- Node.js v22.17.1 (LTS)
- Fastify (`@fastify/fastify`) v5.4.0
- TypeScript v5.8.3
- TypeBox (`@sinclair/typebox`) v0.34.38
- Fastify Type Provider for TypeBox (`@fastify/type-provider-typebox`) v5.2.0
- Swagger for Fastify (`@fastify/swagger`) v9.5.1
- NVM v0.40.3

## Guide

### Configure

All the files that contain `*.secret.*` are ignored by default. The
`configuration.secret.ts` file is supposed to keep secret information, default
configurations.

Since this is an example, no secret information is required, but, it is ready to
use it for that purpose.

Copy `src/configuration.example.ts` to `src/configuration.secret.ts`. Then
configure according to your environment. For example:

```ts
import { IConfiguration } from "./types";

const configuration: IConfiguration = {
  listenOptions: { port: 3000, host: "0.0.0.0" }
};

export default configuration;
```

### Set NVM to use the compatible version of Node.js

```sh
nvm use
```

NVM will detect directly from the `.nvmrc` file at the root of the project.

### Install packages

```sh
cd Technical-Assessment_Simple_Books_RESTful-API/
npm install
```

### Compile

Compile it using the `tsc` command to make sure no compile-time errors arise:

```sh
npx tsc --build src test --force
```

`--force` is used here to build all the mentioned projects, including those that
appear to be up to date. See
[TypeScript: Documentation - tsc CLI Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html#compiler-options).

### Test

```sh
npm test
```

_The tests relies on the local server, please make sure the server is running
before running this command to avoid failures._

### Run

```sh
npm start
```

### Run in watch mode

```sh
npm run dev
```

If this command is executed, it will watch for changes in `src` directory and
restart the server whenever a change is detected by `tsx`.

### OpenAPI

After the server is running, an OpenAPI specification is available at
http://0.0.0.0:3000/openapi.

## Excercise requirements

Build a simple REST API to manage books.

Each Book entity should have the following properties:

- id
- title
- author
- publishedDate
- genre

The API should support create, read, update, and delete operations.

## Implementation details

- The business logic of the _Book_ entity is implemented in a separate folder
  for better separation of concerns (see
  [`src/modules/book`](src/modules/book)).
- Books creation is limited to force creating new books to fail at some point,
  and presenting a simple way to define configuration for a specific module.
  - The module configuration does not contain any secret information, so the
    file does not include a `.secret.ts` extension to avoid committing it.
- Tests were implemented using
  [Node.js Test runner](https://nodejs.org/docs/latest-v22.x/api/test.html).
- Test assertions were performed using
  [Node.js Assert](https://nodejs.org/docs/latest-v22.x/api/assert.html).
- Input/output validation was implemented using
  [TypeBox](https://sinclairt.github.io/typebox/).
- The API was implemented using [Fastify](https://www.fastify.io/).
- The OpenAPI specification relies on the schema built using
  [TypeBox](https://sinclairt.github.io/typebox/). It was generated using
  [Fastify Swagger](https://github.com/fastify/fastify-swagger).
- A separate `tsconfig.defaults.json` is included to help TypeScript version
  management.
  - As reference of a possible future scenario: If a newer version (e.g.
    TypeScript 6) is considered in the future, we can simply update the
    `tsconfig.defaults.json`, to understand what has changed, facilitating the
    migration.

## Other resources used in this project

- ChatGPT 4o
  - Research and consulting of different technologies to meet the API
    implementation requirements (e.g., Fastify, TypeBox).
  - Writing the initial test cases based on the OpenAPI JSON file
- Windsurf Pro plugin for Visual Studio Code
  - Writing the documentation of important functions
  - Code completion during development time
- Visual Studio Code v1.102.2
