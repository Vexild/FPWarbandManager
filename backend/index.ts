import express, {Response, Request} from "express";
import versionRoute from "./routes/VersionRoute";
import { InitializeDatabase } from "./middleware/DatabaseInit"
import "dotenv/config"

InitializeDatabase()

const app = express();
const PORT = process.env.PORT

app.use("/", versionRoute)

app.get("/", (req: Request, res: Response) => {
    return res.status(200).send("Landing")
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`))
