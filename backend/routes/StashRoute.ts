import express, {Response, Request} from "express"
import { IAuthenticatedRequest, userAuthentication } from "../middleware/UserAuthenticationMiddleware"
import { addStashedItem, getNotAddedItems, removeStashedItem } from "../controllers/StashController"


const stashRoute = express.Router()

stashRoute.post("/add", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // TODO: WE need sanitation for all inputs here
        const { warband_id, stashed_item_ids } = req.body
        const uuid = req.userToken?.uuid ? req.userToken?.uuid : ""
        const result = await addStashedItem(warband_id, stashed_item_ids, uuid)
        return res.status(200).send(`Items ${result} stashed, but rest of the items do not exist`)
    } catch (error) {
        return res.status(400).send(error)
    }
})

// TODO: remove stash

stashRoute.delete("/delete", userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // TODO: WE need sanitation for all inputs here
        const { warband_id, stashed_item_index_ids } = req.body
        const uuid = req.userToken?.uuid ? req.userToken?.uuid : ""
        const result = await removeStashedItem(warband_id, stashed_item_index_ids, uuid)
        return res.status(200).send(`Items ${result} deleted, but rest of the items do not exist`)
    } catch (error) {
        return res.status(400).send(error)
    }
})

export default stashRoute