import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import { Request, Response } from 'express'
import { usersEndpoints } from './controllers/usersEndpoints';
import { vacationsEndpoints } from './controllers/vacationsEndpoints';
import { followersEndpoints } from './controllers/followersEndpoints';
import { authenticateToken } from './services/authService';
import { authEndpoints } from './controllers/authEndpoint';
import path from 'path'


dotenv.config()
const app = express()
console.log("Hello from index.ts the app is running");

const port = process.env.PORT 

app.use(express.json());
app.use(bodyParser.json());
app.use(cors())

app.get("/health-check", (req: Request, res: Response) => {
    res.json({ message: "Server is up - Docker/Not" });
    
});


app.use("/uploads", express.static(path.join(__dirname, "../src/uploads")));
app.use("/auth", usersEndpoints)
app.use(authenticateToken)

app.use("/vacations", vacationsEndpoints)
app.use("/followers", followersEndpoints)
app.use("/authentication", authEndpoints)
export default app;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
