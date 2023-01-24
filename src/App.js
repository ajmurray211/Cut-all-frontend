import './App.css';
import Home from './components/Main';
import { Navbar, NavItem, NavLink, Nav, NavbarBrand, NavbarText } from 'reactstrap';
import { Link, Route, Routes } from 'react-router-dom';
import logo from './Assets/cut-all-logo.png';
import DrawPart from './components/drawPart/DrawPart';
import UsageGraph from './components/usageGraph/UsageGraph';
import JobTIcket from './components/jobTicket/JobTicket';
import Ledger from './components/ledger/Ledger';

function App() {
  return (
    <div className="App">
      <navbar>
        <nav>
          <Link to="/"><img className="cut-all-logo" alt='Cut all logo' src={logo} /></Link>
          <section className='link-container'>
            <Link className='link' to='/drawParts'>Draw parts</Link>
            <Link className='link' to='/usageGraph'>Usage Graph</Link>
            <Link className='link' to='/jobTicket'>Job ticket</Link>
            <Link className='link' to='/ledger'>Ledger</Link>
          </section>
          <p>Inventory system</p>
        </nav>
      </navbar>

      <div>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/drawParts' element={<DrawPart />}></Route>
          <Route path='/usageGraph' element={<UsageGraph />}></Route>
          <Route path='/jobTicket' element={<JobTIcket />}></Route>
          <Route path='/ledger' element={<Ledger />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;