import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import { expect } from "chai";
import app from "../src/index.ts"; // Adjust to your app's entry point
import { getFollowers } from "../src/services/followersService.ts";

chai.use(chaiHttp);

describe("GET /followers", () => {
    let getFollowersStub;

    before(() => {
        // Stub the `getFollowers` function
        getFollowersStub = sinon.stub();
        sinon.replace({ getFollowers }, "getFollowers", getFollowersStub);
    });

    after(() => {
        // Restore the original implementation
        sinon.restore();
    });

    it("should return 200 and the list of followers when the request is successful", async () => {
        const mockFollowers = [
            { user_id: 1, name: "Alice", followed: "Vacation1" },
            { user_id: 2, name: "Bob", followed: "Vacation2" },
        ];

        // Simulate successful response from `getFollowers`
        getFollowersStub.resolves(mockFollowers);

        const res = await chai.request(app).get("/followers");

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ users: mockFollowers });
    });

    it("should return 500 if an error occurs while fetching followers", async () => {
        // Simulate an error in `getFollowers`
        getFollowersStub.rejects(new Error("Database error"));

        const res = await chai.request(app).get("/followers");

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Error fetching users" });
    });
});
