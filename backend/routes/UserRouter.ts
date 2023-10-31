import express, {Response, Request} from "express"
import { registerUser } from "../controllers/UserController"


const router = express.Router()

export interface RegUser {
    userName: string,
    password: string,
    email: string
}

router.post("/register", async (req: Request, res: Response) => {

    const user = req.body as RegUser
    // sanitizer middleware
    try {
        const token = await registerUser(user)
        return res.status(200).send(token)
    } catch (error) {
        console.error("Error during registering user")
        return res.status(400).send(error)
    }

})