import { getPublicWarbands, createWarband, getWarbandById, modifyWarband, deleteWarband } from "../controllers/WarbandController"
import express, {Request, Response} from "express";
import { IAuthenticatedRequest, userAuthentication } from "../middleware/UserAuthenticationMiddleware";

const warbandRoute = express.Router();

warbandRoute.get(("/publicWarbands"), async (_req: Request, res: Response) => {
    try {
        const publicWarbands = await getPublicWarbands()
        res.status(200).send(publicWarbands)
    } catch (error) {
        res.status(404).send("No warbands in dabatase")
    }   
    
})
warbandRoute.get(("/:id"), async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const warband = await getWarbandById(Number(id))
        res.status(200).send(warband)
    } catch (error) {
        res.status(404).send("No warbands in dabatase")
    }   
    
})

warbandRoute.post(("/new"), userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    // NOTE: We do not parse warband names as it would be rather limiting. Users can produce as many warbands as they like.
    try {
        const warband = req.body
        const uuid = req.userToken?.uuid ? req.userToken?.uuid : ""
        const result = await createWarband(warband, uuid)
        res.status(201).send(result)
    } catch (error) { 
        res.status(404).send("Error during Warband creation\n"+error)

    }
})

warbandRoute.put(("/modify"), userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        const warband = req.body
        const uuid = req.userToken?.uuid ? req.userToken?.uuid : ""
        const result = await modifyWarband(warband, uuid)
        res.status(201).send(result)
    } catch (error) { 
        res.status(404).send("Error during Warband creation\n"+error)

    }
})

warbandRoute.delete(("/delete/:id"), userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        const warband_id = req.params.id
        const uuid = req.userToken?.uuid ? req.userToken.uuid : ""
        if (uuid === ""){
            res.send(401).send("Missing ID")
        }
        const result = await deleteWarband(String(warband_id), uuid)
        if (result?.length == 0){
            return res.status(200).send(`No warband with id ${warband_id} existed on this user`)
        }
        res.status(200).send(`Warband with id ${warband_id} deleted`)
    } catch (error) { 
        res.status(404).send("Error during Warband deletion\n"+error)

    }
})

// TODO: get member of warband
// TODO: modify member of warband
// TODO: kill member of warband

// TODO: modify stash of warband


export default warbandRoute