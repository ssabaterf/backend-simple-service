# Base Template for a Restful API using Express and MongoDB
Design and implementation of a Restful API using Express and MongoDB. Structured using hexagonal architecture.

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)

### Installing
- Clone the repository
- Install dependencies
```bash
npm install
```
- Run the project
```bash
npm run build
npm run start
```

## Development
### Prerequisites
- Run in development mode
```bash
npm run dev
```

## Configuration
Following the hexagonal architecture with folder structure Who/What, the configuration is located in the infrastructure layer.

In file src/Common/infraestructure/config/ApplicationConfig.ts you can find the configuration of the application, such as the port, the database connection, etc.

Default configuration:
```typescript
export interface Config {
  port: number;
  host: string;
  applicationName: string;
  database: DatabaseConfig;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string | null;
  password: string | null;
  dbname: string;
}
```

Example of .env file:
```bash
NODE_ENV=production
```

Example initialization of config:
```typescript
  const settings = new ApplicationConfig();
  settings.loadFromFiles("./config.json");
  settings.loadFromEnvironment();
```

The config first will be loaded from config.json file, and then from the environment variables. The environment variables will overwrite the config.json file. Inside loadFromEnvironment() method, you can see what variables are loaded from the environment and how are mapped to the config object.

## Logging
The logging system is built in top of winston library. Bosed on the node environment the transport layer is build for production ready or not.

The logs are saved in the logs folder, and the name of the file is the current date. The logs are saved in json format.

Also each log has a level, and a context can be assign in processing request, so you can filter the logs by level or context.

Each service must include the logger in the constructor, and then use it to log the events.

Example of use as dependency injection:
```typescript
const repository = new ExampleRepository(
    await db.getCollection("Examples"),
    new LoggerService(ExampleRepository.name, "info")
  );
````
### Output
 The output of the logs is a transport layer build inside the Common/infrastructure/logger folder. The transport layer is build based on the node environment. If the environment is production, the logs are saved in a file. If the environment is development, the logs are printed in the console.

 Changing the transport layer is easy, you only need to create a new transport layer and add it to the generateTransportsLayer() method in the infrastructure/logger/LoggerService.ts file.

### Format
{"elapsedTime":11,"level":"error","message":"Error retrieving example asda","requestId":"jhn9pst4jald2z8pmpcj9","service":"ExampleController","timestamp":"2023-08-03T12:34:41.209Z"}

elapsedTime: Time elapsed in milliseconds since the request was received until the log was generated.
level: Level of the log. Can be error, warn, info, verbose, debug, silly.
message: Message of the log.
requestId: Id of the request. This id is generated when the request is received.
service: Name of the service that generated the log.
timestamp: Timestamp of the log.

## API Extension
An Example Business Logic is included in the project. This example is a simple CRUD of an entity called Example. The entity has two fields, name and description. The entity is saved in a MongoDB database.

Based on this example, you can extend the API with your own business logic, following the same structure and hexagonal architecture.

### Folder Structure
The folder structure is based on the hexagonal architecture. Applying the pattern Who/What we can easilly group different layer of heaxagonal architecture under the same concept.

```bash
src
├── Example
│   ├── application
│   ├   ├── service/ExampleService.ts
│   ├── domain
│   │   ├── models/Example.ts
│   │   ├── dtos/ExampleDto.ts
│   │   ├── interfaces/ExampleInterfaces.ts
│   ├── infrastructure
│   │   ├── http/controllers/ExampleController.ts
│   │   ├── http/routes/ExampleRoutes.ts
│   │   ├── http/middleware/middleware.ts
│   │   ├── repositories/ExampleRepository.ts
```

The main folders are:
- **Application**: Contains the business logic of the application. The business logic is divided in services, and each service is responsible of a specific business logic.
- **Domain**: Contains the domain logic of the application. The domain logic is divided in dtos, models, interfaces. The models are the objects that are saved in the database, and the dtos are the objects that are send or returned in the response. The interfaces are the interfaces of the domain logic.
- **Infrastructure**: Contains the infrastructure logic of the application. The infrastructure logic is divided by the entrypoinst and outputpoints of the application. 
The entry with http with the controllers are the responsible of processing the request and returning the response. The http can also conatain the routing and middleware for the concept. The repositories are the responsible of saving and retrieving the entities from the database.
