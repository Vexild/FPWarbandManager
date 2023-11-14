import express, {Request, Response} from "express";

const router = express();
router.get("/campaigns", (_req: Request ,res: Response) =>{
    // TODO: Get all public campaings
    const version = process.env.VERSION ? process.env.VERSION : "";
    console.log(version);
    res.status(200).send(`Version ${version}`)
});

// TODO: Create campaign
// TODO: Modify campaign

// TODO: Invite warband to campaign


export default router;