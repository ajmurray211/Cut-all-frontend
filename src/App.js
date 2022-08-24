import './App.css';
import Home from './components/Main';
import { Navbar, NavItem, NavLink, Nav, NavbarBrand, NavbarText } from 'reactstrap';
import { Route, Routes } from 'react-router-dom';
import logo from './Assets/cut-all-logo.png';
import DrawPart from './components/drawPart/DrawPart';
import UsageGraph from './components/usageGraph/UsageGraph';

function App() {
  return (
    <div className="App">
      {/* <nav>
        <Nav pills tabs>
          <NavItem active className=''>
            <NavLink href='/'> Home </NavLink>
            <NavLink href='/drawParts'> Draw Parts </NavLink>
            <NavLink href='/usageGraph'> Usage Graph </NavLink>
          </NavItem>
        </Nav>
      </nav> 
      <div className="header-container">
        <img className="cut-all-logo" src={logo} />
        <h2 style={{ fontSize: 40 }}>Inventory System</h2>
      </div> */}

      <Navbar>
        <NavbarBrand href="/"><img className="cut-all-logo" alt='Cut all logo' src={logo} /></NavbarBrand>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink href="/drawParts">Draw Parts</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/usageGraph">UsageGraph </NavLink>
          </NavItem>
        </Nav>
        <NavbarText>Inventory System</NavbarText>
      </Navbar>

      <div>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/drawParts' element={<DrawPart />}></Route>
          <Route path='/usageGraph' element={<UsageGraph />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;