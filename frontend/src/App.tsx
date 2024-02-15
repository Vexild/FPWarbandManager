
import { Container, Row} from 'react-bootstrap'
import {
  Link,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import './styles/App.css'
import { Landingpage } from './components/landingpage';
import { Profile } from './components/user/profile';
import { Login } from './components/login';

function App() {

  return (
    <>
      <Container className='center'>
        <Row className="page-title bordered">
          <h1>Forbidden Builder</h1>
        </Row>
        <Row className='navigation-row bordered'>
          <Router>
            <div>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/profile">Profile</Link>
            </div>
            <Row className="bordered">
                <Routes>
                  <Route path="/" element={<Landingpage/>}/>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/profile" element={<Profile/>}/>
                </Routes>
            </Row>
          </Router>
        </Row>
      </Container>
    </>
  )
}

export default App
