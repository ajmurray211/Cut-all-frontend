import './App.css';
import Home from './components/Main';
import { Navbar, NavItem, NavLink, Nav, NavbarBrand, NavbarText } from 'reactstrap';
import { Link, Route, Routes } from 'react-router-dom';
import logo from './Assets/cut-all-logo.png';
import DrawPart from './components/drawPart/DrawPart';
import UsageGraph from './components/usageGraph/UsageGraph';
import JobTIcket from './components/jobTicket/JobTicket';

function App() {
  return (
    <div className="App">
      <Navbar color='primary'>
        {/* <NavbarBrand href="/"><img className="cut-all-logo" alt='Cut all logo' src={logo} /></NavbarBrand> */}
        <Link to="/"><img className="cut-all-logo" alt='Cut all logo' src={logo} /></Link>
        <Nav className="me-auto" navbar>
          <NavItem >
            {/* <NavLink href="/drawParts">Draw Parts</NavLink> */}
            <Link className='link' to='/drawParts'>Draw parts</Link>
          </NavItem>
          <NavItem>
            <NavLink href="/usageGraph" disabled>UsageGraph </NavLink>
            {/* <Link className='link' to='/usageGraph'>Usage Graph</Link> */}
          </NavItem>
          <NavItem>
            <NavLink href="/jobTicket" disabled>Job Ticket </NavLink>
            {/* <Link className='link' to='/jobTicket'>Job ticket</Link> */}
          </NavItem>
        </Nav>
        <NavbarText>Inventory System</NavbarText>
      </Navbar>

      <div>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/drawParts' element={<DrawPart />}></Route>
          <Route path='/usageGraph' element={<UsageGraph />}></Route>
          <Route path='/jobTicket' element={<JobTIcket />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;