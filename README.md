# Node.js TypeScript Boilerplate with Dependency Injection

This is a lightweight boilerplate for building Node.js applications using TypeScript and dependency injection. It includes a pre-configured setup with Jest for testing and a modular structure to help you get started quickly.

## Features

-   **TypeScript**: Fully typed with strict mode enabled.
-   **Dependency Injection**: Modular and testable code using dependency injection (manual or with a library like tsyringe).
-   **Jest Testing**: Pre-configured with support for `.test.ts` and `.spec.ts` files.
-   **Scalable Structure**: Organized for growth with services, controllers, and tests.
-   **TypeORM**: Connect MySQL database with TypeORM and ready to use decorators such as `CustomRepository` or `InjectCustomRepo` includes database migrations.

## Project Structure

```
node-di-template/
├── src/
│   ├── __tests__/          # Test files (*.test.ts or *.spec.ts)
│   ├── configs/            # Application configs and constants (first time setup)
│   ├── controllers/        # Request handlers and business logic entry points
|   |── entities            # database entities
|   |── migrations          # database migrations
│   ├── utils/              # Utility files (use multiple times whole app)
│   ├── app.ts              # Application entry point
│   └── server.ts           # Express server handlers
├── jest.config.ts          # Jest configuration
├── package.json            # Dependencies and scripts
├── tsconfig.build.json     # TypeScript build configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Dependency Injection

This boilerplate uses a simple dependency injection pattern. Controller are defined in src/controllers/ and injected service into controllers or other components. For example:

**Example Service** (`src/controllers/app.controller.ts`)

```ts
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHealthCheck() {
        return this.appService.getHealthCheck();
    }

    @TransformResponse(ClassTransformResponseResult)
    @ValidateRequest(ClassValidateRequestData)
    @Get("Example/:ExampleID")
    healthCheck() {
        return { message: "OK" };
    }
}
```

for more details `ClassTransformResponseResult` use [class-transformer](https://github.com/typestack/class-transformer) to transform response data and `ClassValidateRequestData` use [class-validator](https://github.com/typestack/class-validator) as validate request library.

## Testing

Tests are located in `src/__tests__/`. Jest is configured to recognize both `.test.ts` and `.spec.ts` files.

**Example Service** (`src/__tests__/app.controller.spec.ts`)

```ts
describe("App Controller", () => {
    let appServer: Application;

    beforeAll(async () => {
        const server = Test(AppServer).mockInjections();

        await server.InitializeAppServer([AppController]);
        // set application server instance after initialization
        appServer = server.getApplication();
    });

    it("should get healthz", async () => {
        const response = await request(appServer).get(`${DEFAULT_PATH}/Check`);

        expect(response.body).toEqual({
            code: 200,
            data: { message: "OK" },
        });
    });
});

```
## TypeORM Decorators
Use these helpful decorators to connect database with TypeORM connection such as `CustomRepository`, `InjectCustomRepo`, and `InjectRepository`

**Example**

```ts
@CustomRepository(Entity)
export class CustomRepository extends Repository<Entity> {}

@Service()
export class SomeService {
    constructor(
        @InjectCustomRepo(CustomRepository)
        private readonly customRepo: CustomRepository,
        // or
        @InjectRepository(Entity)
        private readonly entityRepo: Repository<Entity>
    ) {}
}
```


## Keywords

Node.js, Express, TypeScript, Object-Oriented, Dependency Injection, Boilerplate, Jest, Testing, Modular, Scalable, MIT License

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. For more information about the MIT License, visit the [Open Source Initiative](https://opensource.org/licenses/MIT).
