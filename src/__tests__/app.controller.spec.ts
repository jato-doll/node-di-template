import { Application } from "express";
import request from "supertest";

import { AppServer } from "../server";
import { DEFAULT_PATH } from "../configs/constants.config";
import { AppController } from "../controllers/app.controller";
import { Test } from "../utils/unit-test.util";

describe("App Controller", () => {
    let appServer: Application;

    beforeAll(async () => {
        const server = Test(AppServer).mockInjections();

        await server.InitializeAppServer([AppController]);
        // set application server instance after initialization
        appServer = server.getApplication();
    });

    it("should get healthz", async () => {
        const response = await request(appServer).get(
            `${DEFAULT_PATH}/Check`,
        );

        expect(response.body).toEqual({
            code: 200,
            data: { message: "OK" },
        });
    });

    it("should get favicon.ico", async () => {
        const response = await request(appServer).get(
            `${DEFAULT_PATH}/Favicon.ico`,
        );

        expect(response.body).toEqual({
            code: 200,
            data: null,
        });
    });

    it("should be get home path", async () => {
        const response = await request(appServer).get(`${DEFAULT_PATH}/`);

        expect(response.body).toEqual({
            code: 200,
            data: { message: "OK" },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
