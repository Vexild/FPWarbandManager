import { Field, Form, Formik, useFormik } from "formik"
import { useState, useContext } from "react"
import { Button, Container, Image, Row } from "react-bootstrap"
import { ILogin, IRegister, loginUserRequest, registerUserRequest } from "../utils/userController"
import skull_image from "../assets/Black_skull.svg"
import "../styles/global.css"


export const LoginPage = () => {

    const [showRegister, SetShowRegister] = useState(false)
    const [registerLoad, setRegisterLoad] = useState(false)
    const [loading, setLoading] = useState(false)

    //const context = useContext(userContext)
    const handleLogin = async (values: ILogin) => {
        setLoading(true)

        const token = await loginUserRequest(values)
        console.log("Token: ",token)
        // if token not false, call context here and store it 
        if (token) {
            console.log("we got token:", token.data)
        }
        setLoading(false)

    }
 
    const loginComponent = () => {
        return( 
            <Row className="form">
                <h1>Login</h1>
                <Formik
                    initialValues={{email: "", password: ""}}
                    onSubmit={ async (values: ILogin) => {
                        console.log("Logging values: ",values)
                        await handleLogin(values)
                    }}>
                    <Form>
                        <Row>
                            <label htmlFor="email">Email</label>
                            <Field type="email" id="email" name="email" />
                            <label htmlFor="loginpassword">Password</label>
                            <Field type="password" id="password" name="password"/>
                        </Row>
                        <Row>
                            { loading ? (
                                <Image className="spinner" src={skull_image} width={40}/>               
                                ) : (
                                    <Button type="submit">Login</Button>
                                    )}
                        </Row>
                        <Row>
                            <p className="clickable-text" onClick={() => SetShowRegister(true)}> Already registered? Login Here.</p>
                        </Row>
                    </Form>
                </Formik>
            </Row>  
        )
    }

    const registerComponent = () => {
        return(
            <Row className="form">
                <h1>Register</h1>
                <Formik
                    initialValues={{email: "", password: "", username: ""}}
                    onSubmit={ async (values: IRegister) => {
                        console.log("registering values: ",values)
                        await registerUserRequest(values)
                    }}> 
                    <Form>
                        <Row>
                            <label htmlFor="username">User name</label>
                            <Field type="username" name="username" id="username"/>
                            <label htmlFor="email">Email</label>
                            <Field type="email" name="email" id="email"/>
                            <label htmlFor="password">Password</label>
                            <Field type="password" name="password" id="password"/>
                        </Row>
                        <Row>
                            { registerLoad ? (
                                <Image className="spinner" src={skull_image} width={40}/>               
                                ) : (
                                    <Button type="submit">Register</Button>
                                    )}  
                        </Row>
                        <Row>
                            <p>No account? Register here.</p>
                            <Button onClick={() => SetShowRegister(false)}>Login</Button>
                        </Row>
                    </Form>
                </Formik>
            </Row>
        )
    }

    return (
        <Container>
            { showRegister ? (  
                registerComponent()
            ) : (
                loginComponent()
            )}
        </Container>
    )
}