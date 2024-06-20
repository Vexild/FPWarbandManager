import argon2 from "argon2"
import jwt from "jsonwebtoken"
import { User, RegUser } from "../routes/UserRouter"
import { executeQuery } from "./DatabaseController"

export const registerUser = async (user: RegUser) => {
    
    try {
        const hashedPassword = await argon2.hash(user.password)
        const params = [ user.username, hashedPassword, user.email]
        console.log("Parameters: ",params)
        const query = `
            INSERT INTO users (user_name, user_password, email) VALUES ($1, $2, $3) RETURNING user_uuid`
        console.log("query: ",query)
        const result = await executeQuery(query, params)
        const uuid = result.rows
        console.log("Registering Result: ", uuid)
        const token = createToken(user.username, String(uuid))
        return token
    } catch (error) {
        throw new Error("User already exists")
    }
}

export const validateUser = async (user: User) => {
    const query = `
        SELECT user_uuid, user_password FROM users WHERE email=($1)
    `
    const result = await executeQuery(query, [user.email])
    const hashedPassword = result.rows[0].user_password
    const uuid = result.rows[0].user_uuid
    return await argon2.verify(hashedPassword, user.password)
        .then(() => {
            const token = createToken(user.email, uuid)
            return token
        })
        .catch(() => {
            throw new Error("Error during validation")
        })
}
export const updateUser = async (user: RegUser) => {
    try {
        user.password = await argon2.hash(user.password)
        const query =`
            UPDATE users SET user_name = ($1), user_password = ($2) WHERE email = ($3) RETURNING user_id
        `
        const result = await executeQuery(query, [user.username, user.password, user.email])
        return result.rows

    } catch (error) {
        throw new Error("Error while updating user")
    }
}

export const getUser = async (id: string) => {
    try {
        const query =`
            SELECT user_id, user_name, email, created FROM users WHERE user_id = ($1)`
        const result = await executeQuery(query, [id])
        return result.rows
    } catch (error) {
        throw new Error("Error while fetching user")
    }
}

export const getAllUsers = async () => {
    try {
        const query = `
            SELECT user_id, user_name, email, created FROM users ORDER BY user_id ASC `
        const result = await executeQuery(query)
        console.log("All User rows: ",result.rows)
        return result.rows
    } catch (error) {
        throw new Error("Error while fetching users")
    }
}

const createToken = (name: string, uuid: string) => {
    const payload = { name: name, uuid: uuid}
    const secret = String(process.env.SECRET)
    const options = { expiresIn: "1h"}
    const token = jwt.sign(payload, secret, options)
    console.log("Token created: ",token)
    return token
}