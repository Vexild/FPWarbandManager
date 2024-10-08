import express, {Response, Request} from "express";
import versionRoute from "./routes/VersionRouter";
import userRoute from "./routes/UserRouter";
import warbandRouter from "./routes/WarbandRouter";
import characterRouter from "./routes/CharacterRouter";
import itemRouter from "./routes/ItemRouter";
import stashRoute from "./routes/StashRoute";
import { InitializeDatabase } from "./db/DatabaseInit"
import { NoRouteFound } from "./middleware/NoRouteMiddleware"
import "dotenv/config"
import cors from "cors";


const app = express();
module.exports = app

//InitializeDatabase()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use("/", versionRoute)
app.use("/user", userRoute)
app.use("/warband", warbandRouter )
app.use("/character", characterRouter )
app.use("/item", itemRouter )
app.use("/stash", stashRoute )

app.get("/", (req: Request, res: Response) => {
    return res.status(200).send("Landing")
})

app.use(NoRouteFound)
app.listen(PORT, () => console.log(`Listening to port ${PORT}`))

export default app