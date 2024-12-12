import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import { expect } from "chai";
import app from "../src/index.ts"; // Adjust to your app's entry point
import { addFollower } from "../src/services/followersService.ts";

chai.use(chaiHttp);

describe("POST /followers", () => {
    let addFollowerStub;

    before(() => {
        // Stub the `addFollower` function
        addFollowerStub = sinon.stub();
        sinon.replace({ addFollower }, "addFollower", addFollowerStub);
    });

    after(() => {
        // Restore the original implementation
        sinon.restore();
    });

    it("should return 200 and the added follower data when the request is successful", async () => {
        const mockFollower = { user_id: 1, vacation_id: 101 };
        const mockResponseData = { user_id: 1, vacation_id: 101 };

        // Simulate successful response from `addFollower`
        addFollowerStub.withArgs(mockFollower.user_id, mockFollower.vacation_id).resolves(mockResponseData);

        const res = await chai
            .request(app)
            .post("/followers")
            .send(mockFollower);

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ users: mockResponseData });
    });

    it("should return 500 if an error occurs while adding a follower", async () => {
        const mockFollower = { user_id: 1, vacation_id: 101 };

        // Simulate an error in `addFollower`
        addFollowerStub.withArgs(mockFollower.user_id, mockFollower.vacation_id).rejects(new Error("Database error"));

        const res = await chai
            .request(app)
            .post("/followers")
            .send(mockFollower);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Error fetching users" });
    });
});
