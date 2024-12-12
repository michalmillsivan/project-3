import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import { expect } from "chai";
import app from "../src/index.ts"; // Adjust to your app's entry point
import { toggleFollower } from "../src/services/followersService.ts";

chai.use(chaiHttp);

describe("POST /followers/toggle", () => {
    let toggleFollowerStub;

    before(() => {
        // Stub the `toggleFollower` function
        toggleFollowerStub = sinon.stub();
        sinon.replace({ toggleFollower }, "toggleFollower", toggleFollowerStub);
    });

    after(() => {
        // Restore the original implementation
        sinon.restore();
    });

    it("should return 200 and the toggle result when the operation is successful", async () => {
        const mockRequest = { user_id: 1, vacation_id: 101 };
        const mockResponseData = { success: true, message: "Toggled follower status" };

        // Simulate a successful toggle operation
        toggleFollowerStub.withArgs(mockRequest.user_id, mockRequest.vacation_id).resolves(mockResponseData);

        const res = await chai
            .request(app)
            .post("/followers/toggle")
            .send(mockRequest);

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(mockResponseData);
    });

    it("should return 500 if an error occurs while toggling the follower", async () => {
        const mockRequest = { user_id: 1, vacation_id: 101 };

        // Simulate an error in `toggleFollower`
        toggleFollowerStub.withArgs(mockRequest.user_id, mockRequest.vacation_id).rejects(new Error("Database error"));

        const res = await chai
            .request(app)
            .post("/followers/toggle")
            .send(mockRequest);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Error toggling follower" });
    });
});
