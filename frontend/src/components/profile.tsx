import { useEffect, useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import { Navigate } from 'react-router-dom'

export const Profile = () => {
    const [warbands, setWarbands] = useState([])
    const authContext = useAuthContext()
    const user = authContext.getUserInformation()

    return (
        <div>
            {!authContext.isLoggedIn() ?
                <Navigate to="/" replace />
                // TODO: When we lose the token, we should redirec to the front page and remove Profile from the navigation
                :
                <div>
                    <h1>Profile Page</h1>
                    <button onClick={() => console.log("opening edit mode")}>Edit</button>
                    <p>I am</p>
                    <p>{user.name}</p>
                    <p>And I command warbands</p>
                    <p>LIST OF WARBANDS</p>
                </div>
            }
        </div>
    )
}