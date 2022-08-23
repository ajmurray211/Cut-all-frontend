import './App.css';
import Home from './components/Main';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Route, Routes} from 'react-router-dom'

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

      <div>
        <Routes>
          <Route path='/' element={<Home />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;