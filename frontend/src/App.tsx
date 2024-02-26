import { Container, Row } from 'react-bootstrap'
import {
  Link,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import './styles/App.css'
import { Landingpage } from './components/landingpage';
import { Profile } from './components/profile';
import { LoginPage } from './components/login';
import { Warband } from './components/warbands';

function App() {



  return (
    <>
      <Container className='center page-container'>
        <Row className="page-title bordered">
          <h1>Forbidden Builder</h1>
        </Row>
        <Row className='bordered navigation-row'>
          <Router>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/Warband">Warband</Link>


            <Routes>
              <Route path="/" element={<Landingpage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/warband" element={<Warband />} />
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
