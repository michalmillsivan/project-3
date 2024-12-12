import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from '../src/index.ts';


const { expect } = chai;

chai.use(chaiHttp);

describe("GET /vacations", () => {
    let getVacationsStub;
    let getRoleFromTokenStub;

    before(() => {
        // Stub functions
        getVacationsStub = sinon.stub();
        getRoleFromTokenStub = sinon.stub();

        // Replace the actual implementations with stubs
        sinon.replace(require("../path/to/your/module"), "getVacations", getVacationsStub);
        sinon.replace(require("../path/to/your/module"), "getRoleFromToken", getRoleFromTokenStub);
    });

    after(() => {
        // Restore original implementations
        sinon.restore();
    });

    it("should return 401 if no authorization header is provided", async () => {
        const res = await chai.request(app).get("/vacations");
        expect(res).to.have.status(401);
        expect(res.body).to.deep.equal({ message: "Unauthorized: Missing or invalid token." });
    });

    it("should return 401 if authorization header is invalid", async () => {
        const res = await chai.request(app).get("/vacations").set("Authorization", "InvalidToken");
        expect(res).to.have.status(401);
        expect(res.body).to.deep.equal({ message: "Unauthorized: Missing or invalid token." });
    });

    it("should return 500 if getVacations throws an error", async () => {
        const mockToken = "mockToken";
        const mockRole = "user";

        getRoleFromTokenStub.withArgs(mockToken).returns(mockRole);
        getVacationsStub.throws(new Error("Database error"));

        const res = await chai.request(app)
            .get("/vacations")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Error fetching vacations" });
    });

    it("should return a list of vacations if authorized", async () => {
        const mockToken = "mockToken";
        const mockRole = "user";
        const mockVacations = [
            { id: 1, destination: "Hawaii", price: 2000 },
            { id: 2, destination: "Paris", price: 1500 }
        ];

        getRoleFromTokenStub.withArgs(mockToken).returns(mockRole);
        getVacationsStub.resolves(mockVacations);

        const res = await chai.request(app)
            .get("/vacations")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ vacations: mockVacations });
    });
});
