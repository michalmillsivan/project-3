import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from '../src/index.ts';
import { deleteVacation } from "../src/services/vacationsService.ts";
import jwtDecode from "jwt-decode";

chai.use(chaiHttp);

describe("DELETE /vacations/delete/:id", () => {
    let deleteVacationStub;
    let jwtDecodeStub;

    before(() => {
        // Stub the dependencies
        deleteVacationStub = sinon.stub();
        jwtDecodeStub = sinon.stub();

        sinon.replace(require("../path/to/your/module"), "deleteVacation", deleteVacationStub);
        sinon.replace(require("jwt-decode"), "default", jwtDecodeStub);
    });

    after(() => {
        // Restore the original functions
        sinon.restore();
    });

    it("should return 403 if the user is not an admin", async () => {
        const id = "1";
        const mockToken = "mockToken";

        jwtDecodeStub.withArgs(mockToken).returns({ role: "user" }); // Non-admin role

        const res = await chai
            .request(app)
            .delete(`/vacations/delete/${id}`)
            .set("Authorization", mockToken);

        expect(res).to.have.status(403);
        expect(res.body).to.deep.equal({ message: "User is not admin" });
    });

    it("should return 500 if deleteVacation throws an error", async () => {
        const id = "1";
        const mockToken = "mockToken";

        jwtDecodeStub.withArgs(mockToken).returns({ role: "admin" }); // Admin role
        deleteVacationStub.rejects(new Error("Database error")); // Simulate failure

        const res = await chai
            .request(app)
            .delete(`/vacations/delete/${id}`)
            .set("Authorization", mockToken);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Error deleting vacation" });
    });

    it("should delete the vacation and return 200 on success", async () => {
        const id = "1";
        const mockToken = "mockToken";

        jwtDecodeStub.withArgs(mockToken).returns({ role: "admin" }); // Admin role
        deleteVacationStub.resolves(); // Simulate successful deletion

        const res = await chai
            .request(app)
            .delete(`/vacations/delete/${id}`)
            .set("Authorization", mockToken);

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: "Vacation deleted successfully" });
    });
});
