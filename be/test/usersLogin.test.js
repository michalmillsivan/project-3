import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { expect } from "chai";
import app from "../src/index.ts"; // Adjust to your app's entry point
import { loginUser } from "../src/services/usersService.ts";
import { z } from "zod";

chai.use(chaiHttp);

describe("POST /login", () => {
    let loginUserStub;
    let jwtSignStub;

    before(() => {
        // Stub the `loginUser` and `jwt.sign` functions
        loginUserStub = sinon.stub();
        jwtSignStub = sinon.stub(jwt, "sign");
    });

    after(() => {
        // Restore the original implementations
        sinon.restore();
    });

    it("should return 400 if the input data is invalid", async () => {
        const invalidLoginData = {
            email: "not-an-email", // Invalid email format
            password: "short", // Could fail schema validation if constraints exist
        };

        const res = await chai.request(app).post("/login").send(invalidLoginData);

        expect(res).to.have.status(400);
        expect(res.body).to.be.an("array"); // Zod validation errors are returned as an array
        expect(res.body[0]).to.have.property("message");
    });

    it("should return 401 if the login credentials are invalid", async () => {
        const invalidLoginData = {
            email: "john.doe@example.com",
            password: "wrongPassword",
        };

        // Simulate no user found
        loginUserStub.withArgs(invalidLoginData.email, invalidLoginData.password).resolves(null);

        const res = await chai.request(app).post("/login").send(invalidLoginData);

        expect(res).to.have.status(401);
        expect(res.body).to.deep.equal({ message: "Invalid email or password" });
    });

    it("should return 200 and a token if the login is successful", async () => {
        const validLoginData = {
            email: "john.doe@example.com",
            password: "correctPassword",
        };

        const mockUser = {
            email: validLoginData.email,
            role: "user",
            first_name: "John",
            user_id: 1,
        };

        const mockToken = "mock.jwt.token";

        // Simulate a successful login and token generation
        loginUserStub.withArgs(validLoginData.email, validLoginData.password).resolves(mockUser);
        jwtSignStub.returns(mockToken);

        const res = await chai.request(app).post("/login").send(validLoginData);

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({
            token: mockToken,
            user: {
                email: mockUser.email,
                first_name: mockUser.first_name,
                user_id: mockUser.user_id,
            },
        });
    });

    it("should return 500 if an unexpected error occurs", async () => {
        const validLoginData = {
            email: "john.doe@example.com",
            password: "correctPassword",
        };

        // Simulate an unexpected error
        loginUserStub.rejects(new Error("Unexpected error"));

        const res = await chai.request(app).post("/login").send(validLoginData);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Something went wrong" });
    });
});
