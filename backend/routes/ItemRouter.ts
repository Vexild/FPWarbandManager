import express, {Response, Request} from "express"
import { IAuthenticatedRequest, userAuthentication } from "../middleware/UserAuthenticationMiddleware"
import { IItem, createItem, deleteCarriedItem, deleteItem, getAllItems, getSingleItems, updateCarriedItem, updateItem } from "../controllers/ItemController"

const itemRoute = express.Router()


itemRoute.post("/new", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // TODO: WE need sanitation for all inputs here
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


itemRoute.get("/single/:id", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try{
        const item_id = req.params.id
        // TODO add sanitation for params
        const item = await getSingleItems(Number(item_id))
        console.log(item)
        if (item === undefined) {
            return res.status(404).send("No item found")
        }
        return res.status(200).send(item)
    } catch (error) {
        res.status(400).send(error)
    }
})

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

itemRoute.put("/update", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // TODO: WE need sanitation for all inputs here
        const item = req.body as IItem
        const types = ["weapon", "armor", "item"]
        if (!types.includes(item.item_type)) {
            return res.status(400).send("Invalid type")
        }
        if (!item.item_id) {
            return res.status(400).send("Id missing")

        }
        console.log("item: ",item)
        const result = await updateItem(item)
        console.log("Result:",result)
        return res.status(200).send(result)
    } catch (error) {
        return res.status(400).send(error)
    }
})

itemRoute.post("/update/carried", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // TODO: WE need sanitation for all inputs here
        const character_id = req.body.character_id 
        const ids = req.body.item_ids 
        const uuid = req.userToken?.uuid ? req.userToken?.uuid : ""
        await updateCarriedItem(character_id, ids, uuid)
        return res.status(200).send(`Updated character ID ${character_id}`)
    } catch (error) {
        return res.status(400).send(error)
    }
})

itemRoute.delete("/update/carried", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // TODO: WE need sanitation for all inputs here
        const character_id = req.body.character_id 
        const carried_item_id = req.body.carried_item_id 
        const uuid = req.userToken?.uuid ? req.userToken?.uuid : ""

        await deleteCarriedItem(character_id, carried_item_id, uuid)
        return res.status(200).send(`Updated character ID ${character_id}`)
    } catch (error) {
        return res.status(400).send(error)
    }
})

itemRoute.delete("/delete/:id", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // TODO: WE need sanitation for all inputs here
        const item_id = req.params.id
        const result = await deleteItem(Number(item_id))
        console.log("Result:",result)
        if (result === undefined) {
            return res.status(404).send("Item never existed")
        }
        return res.status(200).send(`Deleted ${result.item_name}`)
    } catch (error) {
        return res.status(400).send(error)
    }
})


export default itemRoute