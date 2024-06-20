import axios from "axios"

export interface ILogin {
    email: string,
    password: string
}

export interface IRegister extends ILogin {
    username: string
}

export interface IToken {
    token: string
}

// TODO: Add interceptor 

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
    try{
        const placeholderForregister = "http://127.0.0.1:3000/user/register"
        const body = { username: parameters.username, email: parameters.email, password: parameters.password}
        const result = await axios.post(placeholderForregister, body )
        console.log("RegisterUserRequest result: ",result)
        return result
    } catch(e) {
        console.log("oh ouh", e)
        return false
    }
}

export const validateTokenRequest = async (token: string) => {

    const placeholderForValidate = "http://127.0.0.1:3000/user/validate"
    const headers = { "Authorization": "Bearer "+token}
    console.log("headers: ",headers)
    const result = await axios.get(placeholderForValidate, { headers:  headers } )
    console.log("result: ",result)
    if(result.data){
        return true
    }
    return false
}