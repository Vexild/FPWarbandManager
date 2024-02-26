import { Button } from "react-bootstrap"

export const Landingpage = () => {

    return (
        <>
            <h1>Welcome to Forbidden Builder</h1>
            <p>This is a non-official roster builder for Kevin Rahman's Forbidden Psalm miniature game. It includes easy way to build your roster of 5 scoundrels and save any changes you'd otherwise would keep track on paper. Forbidden Builder does not include any rulings or dice-bots. Database does include some weapon data wihch is necessary for the warband building.</p>
            <div>
                <Button>Create Quick Warband</Button>
                <p>Create quick warband without register. Data is saved in local browser</p>
            </div>
            <div>
                <Button>Login</Button>
            </div>
        </>
    )
}