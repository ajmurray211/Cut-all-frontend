import './App.css';
import Inventory from './components/inventory/Inventory';
import { Link, Route, Routes } from 'react-router-dom';
import logo from './Assets/cut-all-logo.png';
import UsageGraph from './components/usageGraph/UsageGraph';
import JobTIcket from './components/jobTicket/JobTicket';
import Ledger from './components/ledger/Ledger';
import SerialNums from './components/serialNums/SerialNums';
import TimeSheet from './components/timeSheet/TimeSheet';

function App() {
  const API_URL = 'https://shielded-cove-45306.herokuapp.com/'
  // const API_URL = 'http://localhost:8080/'

  return (
    <div className="App">
      <nav>
        <Link to="/"><img className="cut-all-logo" alt='Cut all logo' src={logo} /></Link>
        <section className='link-container'>
          <Link className='link' to='/'>Inventory</Link>
          <Link className='link' to='/ledger'>Ledger</Link>
          <Link className='link' to='/serialNums'>Serial numbers</Link>
          <Link className='link' to='/timeSheet'>Time Sheet</Link>
          {/* <Link className='link' to='/usageGraph'>Usage Graph</Link> */}
          <Link className='link' to='/jobTicket'>Job ticket</Link>

        </section>
        <p>Inventory system</p>
      </nav>

      <div>
        <Routes>
          <Route path='/' element={<Inventory API_URL={API_URL} />} />
          <Route path='/serialNums' element={<SerialNums API_URL={API_URL} />} />
          <Route path='/usageGraph' element={<UsageGraph API_URL={API_URL} />} />
          <Route path='/jobTicket' element={<JobTIcket API_URL={API_URL} />} />
          <Route path='/ledger' element={<Ledger API_URL={API_URL} />} />
          <Route path='/timeSheet' element={<TimeSheet API_URL={API_URL} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;