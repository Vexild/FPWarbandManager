import express, {Request, Response} from "express";

const router = express();
router.get("/version", (_req: Request ,res: Response) =>{
    const version = process.env.VERSION ? process.env.VERSION : "";
    console.log(version);
    res.status(200).send(`Version ${version}`)
});

export default router;