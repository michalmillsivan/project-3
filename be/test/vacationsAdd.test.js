import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from '../src/index.ts'; 
import { addVacation } from "../src/services/vacationService.ts";

chai.use(chaiHttp);

describe("POST /vacations/add", () => {
    let getRoleFromTokenStub;
    let addVacationStub;

    before(() => {
        // Stub the dependencies
        getRoleFromTokenStub = sinon.stub();
        addVacationStub = sinon.stub();

        sinon.replace(require("../path/to/your/module"), "getRoleFromToken", getRoleFromTokenStub);
        sinon.replace(require("../path/to/your/module"), "addVacation", addVacationStub);
    });

    after(() => {
        // Restore the original functions
        sinon.restore();
    });

    it("should return 401 if no authorization header is provided", async () => {
        const res = await chai.request(app).post("/vacations/add");
        expect(res).to.have.status(401);
        expect(res.body).to.deep.equal({ message: "Unauthorized: Missing or invalid token." });
    });

    it("should return 403 if the user is not an admin", async () => {
        const mockToken = "mockToken";

        getRoleFromTokenStub.withArgs(mockToken).returns("user"); // Non-admin role

        const res = await chai
            .request(app)
            .post("/vacations/add")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(res).to.have.status(403);
        expect(res.body).to.deep.equal({ message: "Forbidden: User is not admin." });
    });

    it("should return 400 if no image file is provided", async () => {
        const mockToken = "mockToken";

        getRoleFromTokenStub.withArgs(mockToken).returns("admin"); // Admin role

        const res = await chai
            .request(app)
            .post("/vacations/add")
            .set("Authorization", `Bearer ${mockToken}`)
            .send({ destination: "Hawaii", description: "Beach trip", start_date: "2024-12-10", end_date: "2024-12-20", price: 2000 });

        expect(res).to.have.status(400);
        expect(res.body).to.deep.equal({ message: "Image file is required." });
    });

    it("should return 201 if a vacation is successfully added", async () => {
        const mockToken = "mockToken";
        const mockFile = {
            filename: "image.jpg",
        };
        const vacationData = {
            destination: "Hawaii",
            description: "Beach trip",
            start_date: "2024-12-10",
            end_date: "2024-12-20",
            price: 2000,
        };

        getRoleFromTokenStub.withArgs(mockToken).returns("admin"); // Admin role
        addVacationStub.resolves(); // Simulate successful addition

        const res = await chai
            .request(app)
            .post("/vacations/add")
            .set("Authorization", `Bearer ${mockToken}`)
            .field("destination", vacationData.destination)
            .field("description", vacationData.description)
            .field("start_date", vacationData.start_date)
            .field("end_date", vacationData.end_date)
            .field("price", vacationData.price)
            .attach("image", Buffer.from("file content"), mockFile.filename); // Simulate file upload

        expect(res).to.have.status(201);
        expect(res.body).to.deep.equal({ message: "Vacation added successfully!" });
    });

    it("should return 500 if addVacation throws an error", async () => {
        const mockToken = "mockToken";
        const mockFile = {
            filename: "image.jpg",
        };
        const vacationData = {
            destination: "Hawaii",
            description: "Beach trip",
            start_date: "2024-12-10",
            end_date: "2024-12-20",
            price: 2000,
        };

        getRoleFromTokenStub.withArgs(mockToken).returns("admin"); // Admin role
        addVacationStub.rejects(new Error("Database error")); // Simulate failure

        const res = await chai
            .request(app)
            .post("/vacations/add")
            .set("Authorization", `Bearer ${mockToken}`)
            .field("destination", vacationData.destination)
            .field("description", vacationData.description)
            .field("start_date", vacationData.start_date)
            .field("end_date", vacationData.end_date)
            .field("price", vacationData.price)
            .attach("image", Buffer.from("file content"), mockFile.filename); // Simulate file upload

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({ message: "Database error" });
    });
});
