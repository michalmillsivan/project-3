import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from '../src/index.ts';
import { getVacationById } from "../src/services/vacationsService.ts";
import { editVacation } from "../src/services/vacationsService.ts";
chai.use(chaiHttp);

describe("PUT /vacations/edit/:id", () => {
    let getVacationByIdStub;
    let editVacationStub;
    let fsExistsSyncStub;
    let fsUnlinkSyncStub;

    before(() => {
        // Stub the dependencies
        getVacationByIdStub = sinon.stub();
        editVacationStub = sinon.stub();
        fsExistsSyncStub = sinon.stub(fs, "existsSync");
        fsUnlinkSyncStub = sinon.stub(fs, "unlinkSync");

        sinon.replace(require("../path/to/your/module"), "getVacationById", getVacationByIdStub);
        sinon.replace(require("../path/to/your/module"), "editVacation", editVacationStub);
    });

    after(() => {
        // Restore the original functions
        sinon.restore();
    });

    it("should return 400 if any required fields are missing", async () => {
        const res = await chai
            .request(app)
            .put("/vacations/edit/1")
            .send({ destination: "Hawaii", description: "Beach trip" }); // Missing other fields

        expect(res).to.have.status(400);
        expect(res.body).to.deep.equal({ message: "Missing required vacation details." });
    });

    it("should return 404 if the vacation does not exist", async () => {
        const id = "1";

        getVacationByIdStub.withArgs(id).resolves(null); // No vacation found

        const res = await chai
            .request(app)
            .put(`/vacations/edit/${id}`)
            .send({
                destination: "Hawaii",
                description: "Beach trip",
                start_date: "2024-12-10",
                end_date: "2024-12-20",
                price: 2000,
            });

        expect(res).to.have.status(404);
        expect(res.body).to.deep.equal({ message: "Vacation not found." });
    });

    it("should replace old image if a new one is uploaded", async () => {
        const id = "1";
        const oldVacation = {
            destination: "Hawaii",
            description: "Beach trip",
            start_date: "2024-12-10",
            end_date: "2024-12-20",
            price: 2000,
        };
        const mockFile = {
            filename: "new_image.jpg",
            originalname: "new_image.jpg",
        };
        const newVacationDetails = {
            destination: "New York",
            description: "City trip",
            start_date: "2024-12-11",
            end_date: "2024-12-21",
            price: 3000,
        };
        const oldImagePath = path.join(__dirname, "../uploads/hawaii.jpg");
        const newImageName = "new_york.jpg";

        getVacationByIdStub.withArgs(id).resolves(oldVacation);
        fsExistsSyncStub.withArgs(oldImagePath).returns(true); // Simulate old image exists
        editVacationStub.resolves(); // Simulate successful edit

        const res = await chai
            .request(app)
            .put(`/vacations/edit/${id}`)
            .field("destination", newVacationDetails.destination)
            .field("description", newVacationDetails.description)
            .field("start_date", newVacationDetails.start_date)
            .field("end_date", newVacationDetails.end_date)
            .field("price", newVacationDetails.price)
            .attach("image", Buffer.from("file content"), mockFile.originalname); // Simulate file upload

        expect(fsUnlinkSyncStub.calledWith(oldImagePath)).to.be.true; // Check old image deletion
        expect(editVacationStub.calledWith(id, ...Object.values(newVacationDetails), newImageName)).to.be.true;
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: "Vacation updated successfully" });
    });

    it("should keep the old image if no new image is uploaded", async () => {
        const id = "1";
        const oldVacation = {
            destination: "Hawaii",
            description: "Beach trip",
            start_date: "2024-12-10",
            end_date: "2024-12-20",
            price: 2000,
        };
        const newVacationDetails = {
            destination: "New York",
            description: "City trip",
            start_date: "2024-12-11",
            end_date: "2024-12-21",
            price: 3000,
        };
        const oldImageName = "hawaii.jpg";

        getVacationByIdStub.withArgs(id).resolves(oldVacation);
        editVacationStub.resolves(); // Simulate successful edit

        const res = await chai
            .request(app)
            .put(`/vacations/edit/${id}`)
            .send(newVacationDetails);

        expect(fsUnlinkSyncStub.notCalled).to.be.true; // Ensure no file deletion
        expect(editVacationStub.calledWith(id, ...Object.values(newVacationDetails), oldImageName)).to.be.true;
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ message: "Vacation updated successfully" });
    });

    it("should return 500 if editVacation throws an error", async () => {
        const id = "1";
        const oldVacation = {
            destination: "Hawaii",
            description: "Beach trip",
            start_date: "2024-12-10",
            end_date: "2024-12-20",
            price: 2000,
        };
        const newVacationDetails = {
            destination: "New York",
            description: "City trip",
            start_date: "2024-12-11",
            end_date: "2024-12-21",
            price: 3000,
        };

        getVacationByIdStub.withArgs(id).resolves(oldVacation);
        editVacationStub.rejects(new Error("Database error")); // Simulate failure

        const res = await chai
            .request(app)
            .put(`/vacations/edit/${id}`)
            .send(newVacationDetails);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Error editing vacation" });
    });
});
