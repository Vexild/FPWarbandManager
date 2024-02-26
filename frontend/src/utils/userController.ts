import axios from "axios"

export interface ILogin {
    email: string,
    password: string
}

export interface IRegister extends ILogin {
    username: string
}

export const loginUserRequest = async (parameters: ILogin) => {
    try{
        const placeholderForregister = "http://127.0.0.1:3000/user/login"
        const body = {email: parameters.email, password: parameters.password}
        const result = await axios.post(placeholderForregister, body )
        return result
    } catch(e) {
        console.log("Oh ouh", e)
        return false

    }
}

export const registerUserRequest = async (parameters: IRegister) => {
    const placeholderForregister = "localhost:3000/user/register"
    const body = { username: parameters.username, email: parameters.email, password: parameters.password}
    const result = await axios.post(placeholderForregister, body )
    console.log("RegisterUserRequest result: ",result)
    return result
}