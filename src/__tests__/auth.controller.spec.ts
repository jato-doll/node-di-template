import { Application } from "express";
import request from "supertest";

import { DEFAULT_PATH, Inject } from "../configs/constants.config";
import { AuthController } from "../controllers/auth/auth.controller";
import { AuthRepository } from "../controllers/auth/auth.repository";
import { BcryptLibService } from "../libs/bcrypt.service";
import { JWTLibService } from "../libs/jwt.service";
import { AppServer } from "../server";
import { Test } from "../utils/unit-test.util";

describe("App Controller", () => {
    let appServer: Application;

    const mockDataSource = {
        initialize: jest.fn(),
        runMigrations: jest.fn(),
        getRepository: jest.fn().mockReturnThis(),
        extend: jest.fn(),
    };

    const mockAuthRepo = {
        findUserEmail: jest.fn(),
        registerUser: jest.fn(),
    };

    const mockJWTLibService = {
        signToken: jest.fn(),
    };
    const mockBcryptLibService = {
        hashPassword: jest.fn(),
        comparePassword: jest.fn(),
    };

    beforeAll(async () => {
        const server = Test(AppServer).mockInjections([
            { type: Inject.DATASOURCE, instance: mockDataSource },
            { type: AuthRepository, instance: mockAuthRepo },
            { type: JWTLibService, instance: mockJWTLibService },
            { type: BcryptLibService, instance: mockBcryptLibService },
        ]);

        await server.InitializeAppServer([AuthController]);
        // set application server instance after initialization
        appServer = server.getApplication();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it("should be success when register", async () => {
        mockAuthRepo.findUserEmail.mockResolvedValueOnce(null);
        mockAuthRepo.registerUser.mockResolvedValueOnce(null);
        mockBcryptLibService.hashPassword.mockResolvedValueOnce("#");

        const response = await request(appServer)
            .post(`${DEFAULT_PATH}/Auth/Register`)
            .send({
                name: "John Doe",
                email: "john.d@gmail.com",
                password: "P4ssw0rD",
            });

        expect(response.body).toEqual({
            code: 201,
        });
    });

    it("should be success when login", async () => {
        mockAuthRepo.findUserEmail.mockResolvedValueOnce({});
        mockBcryptLibService.comparePassword.mockResolvedValueOnce(true);
        mockJWTLibService.signToken.mockResolvedValueOnce("access-token");

        const response = await request(appServer)
            .post(`${DEFAULT_PATH}/Auth/Login`)
            .send({
                email: "john.d@gmail.com",
                password: "P4ssw0rD",
            });

        expect(response.body).toEqual({
            code: 201,
            data: {
                accessToken: "access-token",
            },
        });
    });
});
