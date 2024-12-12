import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import { expect } from "chai";
import app from "../src/index.ts"; // Adjust to your app's entry point
import { getFollowersReport } from "../src/services/followersService.ts";

chai.use(chaiHttp);

describe("GET /followers/report", () => {
    let getFollowersReportStub;

    before(() => {
        // Stub the `getFollowersReport` function
        getFollowersReportStub = sinon.stub();
        sinon.replace({ getFollowersReport }, "getFollowersReport", getFollowersReportStub);
    });

    after(() => {
        // Restore the original implementation
        sinon.restore();
    });

    it("should return 200 and the followers report when the request is successful", async () => {
        const mockReport = [
            { vacation_id: 101, followers_count: 10 },
            { vacation_id: 102, followers_count: 5 },
        ];

        // Simulate a successful response from `getFollowersReport`
        getFollowersReportStub.resolves(mockReport);

        const res = await chai.request(app).get("/followers/report");

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ report: mockReport });
    });

    it("should return 500 if an error occurs while fetching the report", async () => {
        // Simulate an error in `getFollowersReport`
        getFollowersReportStub.rejects(new Error("Database error"));

        const res = await chai.request(app).get("/followers/report");

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Error fetching followers report" });
    });
});
