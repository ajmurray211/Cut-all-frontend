import './App.css';
import Home from './components/Main';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Route, Routes} from 'react-router-dom';
import logo from './Assets/cut-all-logo.png';

function App() {
  return (
    <div className="App">
      <nav>
        <Nav horizontal='end' pills tabs className='nav'>
          <NavItem active>
            <NavLink href='/'> Home </NavLink>
          </NavItem>
        </Nav>
      </nav>
      <div className="header-container">
        <img className="cut-all-logo" src={logo}/>
        <h2 style={{ fontSize: 40 }}>Inventory System</h2>
      </div>
      <div>
        <Routes>
          <Route path='/' element={<Home />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;