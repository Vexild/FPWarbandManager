import express, {Response, Request} from "express"
import { IAuthenticatedRequest, userAuthentication } from "../middleware/UserAuthenticationMiddleware"
import { IItem, createItem, getAllItems } from "../controllers/ItemController"

const itemRoute = express.Router()


itemRoute.post("/new", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // WE need sanitation for all inputs here
        const item = req.body as IItem
        const types = ["weapon", "armor", "item"]
        if (!types.includes(item.item_type)) {
            return res.status(400).send("Invalid type")
        }
        console.log("item: ",item)
        const result = await createItem(item)
        return res.status(200).send(result)
    } catch (error) {
        return res.status(400).send(error)
    }
})

// itemRoute.post("/login", async (req: Request, res: Response) => {
//     console.log(req.body)
//     const user: User = { userName: req.body.userName, password: req.body.password }
//     await validateUser(user)
//         .then( (token) => {
//             console.log("Token: ",token)
//             res.status(200).send(token)
//         })
//         .catch( () => {
//             res.status(401).send("Invalid username or password")
//         })
// })

// itemRoute.get("/id/:id", userAuthentication,  async (req: IAuthenticatedRequest, res: Response) => {
//     const user_id = req.params.id
//     console.log(user_id)
//     if (user_id === undefined) {
//         return res.status(401).send("Missing id parameter")
//     }
//     await getUser(user_id)
//         .then( (user) => {
//             return res.status(200).send(user)
//         })
//         .catch( (error: Error) => {
//             return res.status(404).send(error)
//         })
// })

// itemRoute.put("/update", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
//     const user = req.body as RegUser
//     await updateUser(user)
//         .then( () => {
//             res.status(201).send("User updated")
//         })
//         .catch( (error: Error) => {
//             res.status(401).send(error)
//         })
// })

// // TODO: delete user

// Rquires Admin authentication
itemRoute.get("/all", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    // TODO add sanitation for query params
    try{

        const showArtifacts = req.query.artifact ? req.query.artifact : "false"
        const priceAscending = req.query.order ? String(req.query.order).toUpperCase() : "ASC"
        const orders = ["ASC", "DESC"]
        const types = ["weapon", "armor", "item"]
        if (!orders.includes(String(priceAscending))) {
            return res.status(400).send("invalid order")
        }
        const type = req.query.type ? String(req.query.type) : ""
        if (type !== "" && !types.includes(type.toLocaleLowerCase())) {
            return res.status(400).send("invalid type")
        }
        // NExt: Include query parameters above
        const items = await getAllItems(
            showArtifacts,
            priceAscending,
            type
        )
        return res.status(200).send(items)
    } catch (error) {
        res.status(400).send(error)
    }
})

export default itemRoute