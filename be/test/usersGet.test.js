import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import { expect } from "chai";
import app from '../src/index.ts';
import { getUsers } from "../src/services/usersService.ts";

chai.use(chaiHttp);

describe("GET /users", () => {
    let getUsersStub;

    before(() => {
        // Stub the `getUsers` function
        getUsersStub = sinon.stub();

        // Replace the actual implementation of `getUsers` with the stub
        sinon.replace({ getUsers }, "getUsers", getUsersStub);
    });

    after(() => {
        // Restore the original implementation
        sinon.restore();
    });

    it("should return 200 and the list of users when the request is successful", async () => {
        const mockUsers = [
            { id: 1, name: "Alice", email: "alice@example.com" },
            { id: 2, name: "Bob", email: "bob@example.com" },
        ];

        // Simulate successful response from `getUsers`
        getUsersStub.resolves(mockUsers);

        const res = await chai.request(app).get("/users");

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ users: mockUsers });
    });

    it("should return 500 if an error occurs while fetching users", async () => {
        // Simulate an error in `getUsers`
        getUsersStub.rejects(new Error("Database error"));

        const res = await chai.request(app).get("/users");

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Error fetching users" });
    });
});