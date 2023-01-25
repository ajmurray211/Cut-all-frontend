import './App.css';
import Home from './components/Main';
import { Link, Route, Routes } from 'react-router-dom';
import logo from './Assets/cut-all-logo.png';
import DrawPart from './components/drawPart/DrawPart';
import UsageGraph from './components/usageGraph/UsageGraph';
import JobTIcket from './components/jobTicket/JobTicket';
import Ledger from './components/ledger/Ledger';

function App() {
  // const API_URL = 'https://shielded-cove-45306.herokuapp.com/'
  const API_URL = 'http://localhost:8080/'

  return (
    <div className="App">
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

      <div>
        <Routes>
          <Route path='/' element={<Home API_URL={API_URL}/>}/>
          <Route path='/drawParts' element={<DrawPart API_URL={API_URL}/>}/>
          <Route path='/usageGraph' element={<UsageGraph API_URL={API_URL}/>}/>
          <Route path='/jobTicket' element={<JobTIcket API_URL={API_URL}/>}/>
          <Route path='/ledger' element={<Ledger API_URL={API_URL}/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;