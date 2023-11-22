import express, { Request, Response} from "express"
import { ICharacter, createCharacter, getAllCharacters, getCharactersByWarband, getCharactersBywarband } from "../controllers/CharacterController";
import { IAuthenticatedRequest, userAuthentication } from "../middleware/UserAuthenticationMiddleware";

const characterRoute = express.Router();

characterRoute.get("/all", async (req: Request, res: Response) => {
    try {

        // TODO: ad queryparameter to filter by 
        const result = await getAllCharacters()
        res.status(200).send(result)
    } catch (error) {
        res.status(404).send("Error during fetching characters\n"+error)
    }
})

characterRoute.get("/bywarband/:id", userAuthentication , async (req: IAuthenticatedRequest, res: Response) => {
    try {
        const warband_id: number = Number(req.params.id)
        // All warband_id parameters require sanitation => should be a positive integer
        const uuid = req.userToken?.uuid ? req.userToken.uuid : ""
        const result = await getCharactersByWarband(warband_id, uuid)
        if (result === 0){
            res.status(404).send("No warband found")
        }
        res.status(201).send(result)
    } catch (error) {
        res.status(400).send("Error during Character creation\n"+error)
    }
})

characterRoute.post("/new", userAuthentication , async (req: IAuthenticatedRequest, res: Response) => {
    try {
        const warband_id: number = req.body.warband_id
        const uuid = req.userToken?.uuid ? req.userToken.uuid : ""
        const characters: Array<ICharacter> = req.body.members
        await createCharacter(warband_id, uuid, characters)
        res.status(201).send(`Added ${characters.length} characters to warband id ${warband_id}`)
    } catch (error) {
        res.status(400).send("Error during Character creation\n"+error)
    }
})

export default characterRoute