import { useEffect, useState } from 'react';
import { Button, Container, Dropdown, Row } from 'react-bootstrap'
import {
  Link,
  BrowserRouter as Router,
  Route,
  Routes,
  redirect,
} from "react-router-dom";
import './styles/App.css'
import { Landingpage } from './components/landingpage';
import { Profile } from './components/profile';
import { LoginPage } from './components/login';
import { Warband } from './components/warbands';
import { useAuthContext } from './context/AuthContext';

function App() {

  const authContext = useAuthContext()

  useEffect(() =>{
    console.log("App, Token: ",authContext.isLoggedIn())
  },[])

  const handleLogout = () => {
    console.log("Logout")
    authContext.logout()
    redirect("/")
  }
  
  return (
    <>
        <Container className='center page-container'>
          <Row className="page-title bordered">
          {authContext.token != null ? (
            <p className='loggedInIndicator'>{authContext.user} LoggedIn!</p>
          ) : (<></>)
        }
          
          <h1 className='medievalsharp-regular'>Forbidden Builder</h1>
          </Row>
          <Row className='bordered navigation-row'>
            <Router>
              <Link to="/">Home</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/Warband">Warband</Link>
              {
                authContext.token === null ? 
                <Link to="/login">Login</Link> :
                <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1"><Button onClick={() => handleLogout()}>Logout</Button></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
              }

              <Routes>
                <Route path="/" element={<Landingpage />} />
                <Route path="/warband" element={<Warband />} />
                <Route path="/login" element={<LoginPage />} /> :
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Router>

          </Row >
          <Row className='footer'>
            <p>footer</p>
          </Row>
        </Container >
    </>
  )
}

export default App
