import { validateUser } from "../controllers/UserController"
import { getPublicWarbands, createWarband, getWarbandById, modifyWarband } from "../controllers/WarbandController"
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
    try {
        const warband = req.body
        warband.owner_id = req.userToken?.uuid
        await createWarband(warband)
        res.status(201).send(`Warband ${warband.warband_name} created`)
    } catch (error) { 
        res.status(404).send("Error during Warband creation\n"+error)

    }
})

warbandRoute.put(("/modify"), userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        const warband = req.body
        const result = await modifyWarband(warband, 2)
        res.status(201).send(result)
    } catch (error) { 
        res.status(404).send("Error during Warband creation\n"+error)

    }
})

warbandRoute.delete(("/delete/:id"), userAuthentication, async (req: IAuthenticatedRequest, res: Response) => {
    try {
        // const warband = req.body
        // const id = req.userToken
        // warband.id = id
        // //await createWarband(warband)
        // res.status(201).send(`Deleted warband ${warband.warband_name}`)
    } catch (error) { 
        res.status(404).send("Error during Warband creation\n"+error)

    }
})


// TODO: post warband
// TODO: update warband
// TODO: delete warband
// TODO: delete warband

// TODO: get member of warband
// TODO: modify member of warband
// TODO: kill member of warband

// TODO: modify stash of warband


export default warbandRoute