import "reflect-metadata";

import { ClassConstructor } from "class-transformer";
import { container } from "tsyringe";

import * as dotenv from "dotenv";

dotenv.config();

type TestResolveInstance<T = any> = {
    type: string | symbol | ClassConstructor<T>;
    instance?: any;
    service?: ClassConstructor<T>;
};

export const Test = <T>(injectable: ClassConstructor<T>) => ({
    /**
     * to mock all injections services or values
     */
    mockInjections: (injects?: TestResolveInstance[]) => {
        if (injects) {
            injects.forEach(({ type, instance, service }) => {
                const token =
                    typeof type === "function"
                        ? Reflect.get(type, "name")
                        : type;

                if (service) {
                    // Register services as class
                    container.register(token, { useClass: service });
                } else if (instance) {
                    // Register services as value
                    container.register(token, { useValue: instance });
                } else {
                    throw new Error(
                        "service or value property is require in mockConstructor function",
                    );
                }
            });
        }

        return container.resolve(injectable);
    },
});
