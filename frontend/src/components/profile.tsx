import { useAuthContext } from "../context/AuthContext"
export const Profile = () => {
    const authContext = useAuthContext()
    const user = authContext.getUserInformation()
    console.log("USer: ",user)
    return (
        <div>
            <h1>Profile Page</h1>
            <p>Name</p>
        </div>
    )
}