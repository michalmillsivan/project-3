import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import { expect } from "chai";
import app from "../src/index.ts"; // Adjust to your app's entry point
import { register } from "../src/services/usersService.ts"; 
import { z } from "zod";

chai.use(chaiHttp);

describe("POST /register", () => {
    let registerStub;

    before(() => {
        // Stub the `register` function
        registerStub = sinon.stub();
        sinon.replace({ register }, "register", registerStub);
    });

    after(() => {
        // Restore the original implementation
        sinon.restore();
    });

    it("should return 400 if the input data is invalid", async () => {
        const invalidUserData = {
            first_name: "", // Invalid: first_name cannot be empty
            last_name: "Doe",
            email: "not-an-email",
            password: "short",
        };

        const res = await chai.request(app).post("/register").send(invalidUserData);

        expect(res).to.have.status(400);
        expect(res.body).to.be.an("array"); // Zod validation errors are returned as an array
        expect(res.body[0]).to.have.property("message");
    });

    it("should return 409 if the email already exists", async () => {
        const existingUserData = {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            password: "securePassword123",
        };

        // Simulate email already exists error
        registerStub.rejects(new Error("Email already exists"));

        const res = await chai.request(app).post("/register").send(existingUserData);

        expect(res).to.have.status(409);
        expect(res.body).to.deep.equal({ message: "Email already exists" });
    });

    it("should return 500 if an unexpected error occurs", async () => {
        const validUserData = {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            password: "securePassword123",
        };

        // Simulate an unexpected error
        registerStub.rejects(new Error("Unexpected error"));

        const res = await chai.request(app).post("/register").send(validUserData);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Something went wrong" });
    });

    it("should return 200 and a success message if registration is successful", async () => {
        const validUserData = {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            password: "securePassword123",
        };

        // Simulate successful registration
        registerStub.resolves(validUserData);

        const res = await chai.request(app).post("/register").send(validUserData);

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: "Registration successful" });
    });
});
