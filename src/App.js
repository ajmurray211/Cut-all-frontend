import './App.css';
import Inventory from './components/inventory/Inventory';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import logo from './Assets/cut-all-logo.png';
import UsageGraph from './components/usageGraph/UsageGraph';
import JobTIcket from './components/jobTicket/JobTicket';
import Ledger from './components/ledger/Ledger';
import SerialNums from './components/serialNums/SerialNums';
import TimeSheet from './components/timeSheet/TimeSheet';
import Login from './components/authentication/Login'
import Register from './components/authentication/Register'
import { useAuthContext } from './hooks/useAuthContext';
import { useLogout } from './hooks/useLogout'
import { Button } from 'reactstrap';

function App() {
  // const API_URL = 'https://shielded-cove-45306.herokuapp.com/'
  const API_URL = 'http://localhost:8080/'
  const { user } = useAuthContext()
  const { logout } = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="App">
      <nav>
        <Link to="/"><img className="cut-all-logo" alt='Cut all logo' src={logo} /></Link>
        {user && (
        <section className='link-container'>
          <Link className='link' to='/'>Inventory</Link>
          <Link className='link' to='/ledger'>Ledger</Link>
          <Link className='link' to='/serialNums'>Serial numbers</Link>
          <Link className='link' to='/timeSheet'>Time Sheet</Link>
          {/* <Link className='link' to='/usageGraph'>Usage Graph</Link> */}
          <Link className='link' to='/jobTicket'>Job ticket</Link>
        </section>
        )}
        <section className='auth-info'>
          {user && (
            <div>
              <span>{user.email}</span>
              <Button onClick={handleLogout}>Log Out</Button>
            </div>
          )}
          {!user && (
            <div>
              <Link className='link' to='/login'>Log In</Link>
              <Link className='link' to='/register'>Register</Link>
            </div>
          )}
        </section>
        <p>Inventory system</p>
      </nav>

      <div>
        <Routes>
          <Route path='/' element={user ? <Inventory API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/login' element={!user ? <Login API_URL={API_URL} /> : <Navigate to='/' />} />
          <Route path='/register' element={!user ? <Register API_URL={API_URL} /> : <Navigate to='/' />} />
          <Route path='/serialNums' element={user ? <SerialNums API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/usageGraph' element={user ? <UsageGraph API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/jobTicket' element={user ? <JobTIcket API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/ledger' element={user ? <Ledger API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/timeSheet' element={user ? <TimeSheet API_URL={API_URL} /> : <Navigate to='/login' />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;