import express, {Response} from "express"
import { IAuthenticatedRequest, userAuthentication } from "../middleware/UserAuthenticationMiddleware"
import { addStashedItem, getStashedItems, removeStashedItem } from "../controllers/StashController"


const stashRoute = express.Router()


stashRoute.get("/get/:warband_id", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // TODO: WE need sanitation for all inputs here
        const warband_id = req.params.warband_id
        const result = await getStashedItems(warband_id)
        return res.status(200).send(result)
    } catch (error) {
        return res.status(400).send(error)
    }
})

stashRoute.post("/add", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // TODO: WE need sanitation for all inputs here
        const { warband_id, item_ids } = req.body
        const uuid = req.userToken?.uuid ? req.userToken?.uuid : ""
        const result = await addStashedItem(warband_id, item_ids, uuid)
        return res.status(200).send(`Items ${result} stashed`)
    } catch (error) {
        return res.status(400).send(error)
    }
})

stashRoute.delete("/delete", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // TODO: WE need sanitation for all inputs here
        const { warband_id, stashed_item_index_ids } = req.body
        const uuid = req.userToken?.uuid ? req.userToken?.uuid : ""
        const result = await removeStashedItem(warband_id, stashed_item_index_ids, uuid)
        if (result.length === 0) {
            return res.status(200).send("No items found, none deleted")
        }
        return res.status(200).send("Items deleted")
    } catch (error) {
        return res.status(400).send(error)
    }
})

export default stashRoute