import argon2 from "argon2"
import { RegUser } from "../routes/UserRouter"
import { executeQuery } from "./DatabaseController"
// create User
// Update user
// Delete user
// retun token
// hash pass


export const registerUser = async (user: RegUser) => {
    
    const hashedPassword = await argon2.hash(user.password)
    const params = [ user.userName, hashedPassword, user.email]
    const query = `
        INSERT INTO user (userName, password, email) VALUES {$1, $2, $3}`
    try {
        const result = executeQuery(query, params)
        console.log("Registering Result: ", result)
        return result
    } catch (error) {
        throw new Error("User already exists")
    }
}


// export const InitDatabase = (user: RegUser) => {


// }

// export const createUser = (user: RegUser) => {
    

// }