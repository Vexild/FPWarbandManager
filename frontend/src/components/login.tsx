import { Field, Form, Formik } from "formik"
import { useState } from "react"
import { Button, Col, Container, Image, Row } from "react-bootstrap"
import { ILogin, IRegister, loginUserRequest, registerUserRequest } from "../api/userController"
import skull_image from "../assets/Black_skull.svg"
import "../styles/global.css"
import { useAuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"


export const LoginPage = () => {

    const [showRegister, SetShowRegister] = useState(false)
    const [loading, setLoading] = useState(false)

    const authContext = useAuthContext()
    const navigate = useNavigate()

    //const context = useContext(userContext)
    const handleLogin = async (values: ILogin) => {
        setLoading(true)
        const token = await loginUserRequest(values)
        if (token) {
            authContext.login(token.data)
            setLoading(false)
            navigate("/")
        }
        setLoading(false)
        
    }

    const handleRegister = async (values: IRegister) => {
        setLoading(true)
        const token = await registerUserRequest(values)
        if (token) {
            authContext.login(token.data)
            setLoading(false)
            navigate("/")
        }
        // redirect to front page
        setLoading(false)
    }

    // TODO: Create Validation function and add an endpoint to it.

    const loginComponent = () => {
        return (
            <Container className="form">
                <Row className="justify-content-md-center">
                    <h1>Login</h1>
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        onSubmit={async (values: ILogin) => {
                            console.log("Logging values: ", values)
                            await handleLogin(values)
                        }}>
                        <Form>
                            <Row>
                                <Col md={8}>
                                    <label htmlFor="email">Email</label>
                                    <Field type="email" id="email" name="email" />
                                </Col>
                                <Col>
                                    <label htmlFor="loginpassword">Password</label>
                                    <Field type="password" id="password" name="password" />
                                </Col>
                                <Col>
                                    {loading ? (
                                        <Image className="spinner" src={skull_image} width={40} />
                                    ) : (
                                        <Button type="submit">Login</Button>
                                    )}
                                </Col>
                                <Col>
                                    <p className="clickable-text" onClick={() => SetShowRegister(true)}> Already registered? Login Here.</p>
                                </Col>
                            </Row>
                        </Form>
                    </Formik>
                </Row>
            </Container>
        )
    }

    const registerComponent = () => {
        return (
            <Row className="form">
                <h1>Register</h1>
                <Formik
                    initialValues={{ email: "", password: "", username: "" }}
                    onSubmit={async (values: IRegister) => {
                        console.log("registering values: ", values)
                        await handleRegister(values)
                    }}>
                    <Form>
                        <Container>
                            <Row >

                                <Col md={8}>
                                    <label htmlFor="username">User name</label>
                                    <Field type="username" name="username" id="username" />
                                </Col>
                                <Col >
                                    <label htmlFor="email">Email</label>
                                    <Field type="email" name="email" id="email" />
                                </Col>
                                <Col >
                                    <label htmlFor="password">Password</label>
                                    <Field type="password" name="password" id="password" />
                                </Col>
                                <Col>
                                    {loading ? (
                                        <Image className="spinner" src={skull_image} width={40} />
                                    ) : (
                                        <Button type="submit">Register</Button>
                                    )}
                                </Col>
                                <Col>
                                    <p className="clickable-text" onClick={() => SetShowRegister(false)}>No account? Register here.</p>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                </Formik>
            </Row>
        )
    }

    return (
        <Container>
            {showRegister ? (
                registerComponent()
            ) : (
                loginComponent()
            )}
        </Container>
    )
}