import express, { Request, Response} from "express"
import { getAllCharacters } from "../controllers/CharacterController";

const characterRoute = express.Router();

characterRoute.get("/all", async (req: Request, res: Response) => {
    const result = await getAllCharacters()
    res.status(200).send(result)
})

export default characterRoute