import { Response, Request, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface IAuthenticatedRequest extends Request {
    userToken?: IUserToken 
}
interface IUserToken {
    name?: string
    uuid: string
}

export const userAuthentication = (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {

    const authentication = req.get("Authorization")
    if (!authentication?.startsWith("Bearer ")){
        return res.status(401).send("Invalid Token")
    }

    const token = authentication.substring(7)
    const secret = String(process.env.SECRET)
    try {
        const decodedToken = jwt.verify(token, secret) as IUserToken
        console.log("Decoded: ",decodedToken)
        req.userToken = decodedToken
        next()
    } catch (error) {
        return res.status(401).send("Invalid token")
    }

}
