import express, {Response, Request} from "express"
import { registerUser, getAllUsers, validateUser, getUser, updateUser } from "../controllers/UserController"
import { IAuthenticatedRequest, userAuthentication } from "../middleware/UserAuthenticationMiddleware"

const userRoute = express.Router()

export interface RegUser extends User {
    email: string
}

export interface User {
    email: string,
    password: string,
}

userRoute.post("/register", async (req: Request, res: Response) => {
    const user = req.body as RegUser
    console.log("user: ",user)
    // TODO: sanitizer middleware
    try {
        const token = await registerUser(user)
        return res.status(200).send(token)
    } catch (error) {
        console.error("Error during registering user")
        return res.status(400).send("Email already exists")
    }

})

userRoute.post("/login", async (req: Request, res: Response) => {
    console.log(req.body)
    const user: User = { email: req.body.email, password: req.body.password }
    await validateUser(user)
        .then( (token) => {
            console.log("Token: ",token)
            res.status(200).send(token)
        })
        .catch( () => {
            res.status(401).send("Invalid email or password")
        })
})

userRoute.get("/id/:id", userAuthentication,  async (req: IAuthenticatedRequest, res: Response) => {
    const user_id = req.params.id
    console.log(user_id)
    if (user_id === undefined) {
        return res.status(401).send("Missing id parameter")
    }
    await getUser(user_id)
        .then( (user) => {
            return res.status(200).send(user)
        })
        .catch( (error: Error) => {
            return res.status(404).send(error)
        })
})

userRoute.put("/update", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    const user = req.body as RegUser
    await updateUser(user)
        .then( () => {
            res.status(201).send("User updated")
        })
        .catch( (error: Error) => {
            res.status(401).send(error)
        })
})

// TODO: delete user

// Rquires Admin authentication
userRoute.get("/all", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    const users = await getAllUsers()
    return res.status(200).send(users)
})

export default userRoute