import { Application } from "express";
import request from "supertest";

import { AppServer } from "../server";
import { DEFAULT_PATH, Inject } from "../configs/constants.config";
import { AppController } from "../controllers/app.controller";
import { Test } from "../utils/unit-test.util";

describe("App Controller", () => {
    let appServer: Application;

    const mockDataSource = {
        initialize: jest.fn(),
        runMigrations: jest.fn(),
    };

    beforeAll(async () => {
        const server = Test(AppServer).mockInjections([
            { type: Inject.DATASOURCE, instance: mockDataSource },
        ]);

        await server.InitializeAppServer([AppController]);
        // set application server instance after initialization
        appServer = server.getApplication();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it("should be get home path", async () => {
        const response = await request(appServer).get(DEFAULT_PATH);

        expect(response.body).toEqual({
            code: 200,
            data: { message: "OK" },
        });
    });

    it("should get healthz", async () => {
        const response = await request(appServer).get(
            `${DEFAULT_PATH}/Healthz`,
        );

        expect(response.body).toEqual({
            code: 200,
            data: { message: "OK" },
        });
    });

    it("should get favicon.ico", async () => {
        const response = await request(appServer).get("/Favicon.ico");

        expect(response.body).toEqual({
            code: 200,
            data: null,
        });
    });
});
