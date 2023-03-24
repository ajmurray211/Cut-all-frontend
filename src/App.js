import './App.css';
import Inventory from './components/inventory/Inventory';
import { Route, Routes, Navigate } from 'react-router-dom';
import UsageGraph from './components/usageGraph/UsageGraph';
import JobTIcket from './components/jobTicket/JobTicket';
import Ledger from './components/ledger/Ledger';
import SerialNums from './components/serialNums/SerialNums';
import TimeSheet from './components/timeSheet/TimeSheet';
import Login from './components/authentication/Login'
import Register from './components/authentication/Register'
import { useAuthContext } from './hooks/useAuthContext';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';

function App() {
  const API_URL = 'https://shielded-cove-45306.herokuapp.com/'
  // const API_URL = 'http://localhost:8080/'
  const { user } = useAuthContext()

  return (
    <div className="App">
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={<Inventory API_URL={API_URL} />} />
          <Route path='/login' element={<Login API_URL={API_URL} />} />
          <Route path='/register' element={<Register API_URL={API_URL} />} />
          <Route path='/serialNums' element={<SerialNums API_URL={API_URL} />} />
          <Route path='/usageGraph' element={<UsageGraph API_URL={API_URL} />} />
          <Route path='/jobTicket' element={<JobTIcket API_URL={API_URL} />} />
          <Route path='/ledger' element={<Ledger API_URL={API_URL} />} />
          <Route path='/timeSheet' element={<TimeSheet API_URL={API_URL} />} />
          <Route path='/userProfile' element={<UserProfile API_URL={API_URL} />} />
        </Routes>
      </div>
      {/* <div>
        <Routes>
          <Route path='/' element={user ? <Inventory API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/login' element={!user ? <Login API_URL={API_URL} /> : <Navigate to='/' />} />
          <Route path='/register' element={!user ? <Register API_URL={API_URL} /> : <Navigate to='/' />} />
          <Route path='/serialNums' element={user ? <SerialNums API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/usageGraph' element={user ? <UsageGraph API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/jobTicket' element={user ? <JobTIcket API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/ledger' element={user ? <Ledger API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/timeSheet' element={user ? <TimeSheet API_URL={API_URL} /> : <Navigate to='/login' />} />
          <Route path='/userProfile' element={user ? <UserProfile API_URL={API_URL} /> : <Navigate to='/login' />} />
        </Routes>
      </div> */}
    </div>
  );
}

export default App;