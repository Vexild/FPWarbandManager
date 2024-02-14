import express, { Request, Response} from "express"
import { ICharacter, createCharacter, deleteCharacter, getAllCharacters, getCharactersByWarband, getSingleCharacter, updateCharacter } from "../controllers/CharacterController";
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

characterRoute.get("/bywarband/:id" , async (req: IAuthenticatedRequest, res: Response) => {
    try {
        const warband_id: number = Number(req.params.id)
        // All warband_id parameters require sanitation => should be a positive integer
        const result = await getCharactersByWarband(warband_id)
        if (result === 0){
            res.status(404).send("No warband found")
        }
        res.status(201).send(result)
    } catch (error) {
        res.status(400).send("Error during Character fetching\n"+error)
    }
})

characterRoute.get("/single/:id" , async (req: IAuthenticatedRequest, res: Response) => {
    try {
        const character_id: number = Number(req.params.id)
        // character id require sanitation => should be a positive integer
        const result = await getSingleCharacter(character_id)
        if (result === 0){
            res.status(404).send("No character found")
        } else {
            res.status(201).send(result)
        }
    } catch (error) {
        res.status(400).send("Error during Character fetching\n"+error)
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

characterRoute.put("/modify", userAuthentication , async (req: IAuthenticatedRequest, res: Response) => {
    try {
        const uuid = req.userToken?.uuid ? req.userToken.uuid : ""
        const character: ICharacter = req.body
        console.log("character: ",character)
        console.log("uuid: ",uuid)
        const result = await updateCharacter(character, uuid)
        console.log("result. ",result)
        if (result === 0){
            res.status(404).send("No character found")
        } else {
            console.log("result: ",result)
            res.status(201).json(result)
        }
    } catch (error) {
        res.status(400).send("Error during Character creation\n"+error)
    }
})

characterRoute.delete("/delete/:id", userAuthentication , async (req: IAuthenticatedRequest, res: Response) => {
    try {
        const uuid = req.userToken?.uuid ? req.userToken.uuid : ""
        const character_id = req.params.id
        const result = await deleteCharacter(character_id, uuid)
        if (result === 0){
            res.status(404).send(`No character with id ${character_id} belong to this user`)
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        res.status(400).send("Error during Character deletion\n"+error)
    }
})

export default characterRoute