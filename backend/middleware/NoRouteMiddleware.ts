import { Response, Request } from "express"

export const NoRouteFound = (req: Request, res: Response) => {
    return res.status(401).send("Nothing found")
}
