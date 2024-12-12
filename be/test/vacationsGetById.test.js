import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from '../src/index.ts';
import { getVacationById } from "../src/services/vacationsService.ts";

chai.use(chaiHttp);

describe("GET /vacations/:id", () => {
    let getVacationByIdStub;

    before(() => {
        // Stub the `getVacationById` function
        getVacationByIdStub = sinon.stub();

        sinon.replace(require("../path/to/your/module"), "getVacationById", getVacationByIdStub);
    });

    after(() => {
        // Restore the original implementation
        sinon.restore();
    });

    it("should return 404 if the vacation is not found", async () => {
        const id = "1";

        // Simulate no vacation found
        getVacationByIdStub.withArgs(id).resolves(null);

        const res = await chai.request(app).get(`/vacations/${id}`);

        expect(res).to.have.status(404);
        expect(res.body).to.deep.equal({ message: "Vacation not found" });
    });

    it("should return 500 if an error occurs while fetching the vacation", async () => {
        const id = "1";

        // Simulate an error in `getVacationById`
        getVacationByIdStub.withArgs(id).rejects(new Error("Database error"));

        const res = await chai.request(app).get(`/vacations/${id}`);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Error fetching vacation" });
    });

    it("should return the vacation details if it is found", async () => {
        const id = "1";
        const vacation = {
            id,
            destination: "Hawaii",
            description: "Beach trip",
            start_date: "2024-12-10",
            end_date: "2024-12-20",
            price: 2000,
        };

        // Simulate a successful fetch
        getVacationByIdStub.withArgs(id).resolves(vacation);

        const res = await chai.request(app).get(`/vacations/${id}`);

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(vacation);
    });
});
