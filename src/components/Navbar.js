import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout'
import { Button, UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Label } from 'reactstrap';
import logo from '../Assets/cut-all-logo.png';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
    const { user } = useAuthContext()
    const { logout } = useLogout()

    const handleLogout = () => {
        logout()
    }

    return (
        <nav className='fullNav'>
            <Link to="/"><img className="cut-all-logo" alt='Cut all logo' src={logo} /></Link>
            <section className='link-container'>
                <Link className='link' to='/'>Inventory</Link>
                <Link className='link' to='/ledger'>Ledger</Link>
                <Link className='link' to='/serialNums'>Serial numbers</Link>
                <Link className='link' to='/timeSheet'>Time Sheet</Link>
                <Link className='link' to='/jobTicket'>Job ticket</Link>
            </section>
            <section className='auth-info'>
                {user && (
                    <div>
                        <AccountCircleIcon fontSize='large' />
                        <UncontrolledDropdown group>
                            <Button disabled color='light'>Actions</Button>
                            <DropdownToggle
                                caret
                                color="light"
                            />
                            <DropdownMenu id='userOptions'>
                                <div className="user-info">
                                    <AccountCircleIcon fontSize='large' />
                                    <span id='userName'>{user.firstName} {user.lastName}</span>
                                    <span id='userEmail'>{user.email}</span>
                                </div>
                                <DropdownItem onClick={() => handleLogout()} >
                                    Log out
                                </DropdownItem>
                                <DropdownItem>
                                    <Link to="/userProfile">Profile info</Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                )}
                {!user && (
                    <div className='loginNav'>
                        <AccountCircleIcon fontSize='large' />
                        <Link className='link' to='/login'>Log In</Link>
                    </div>
                )}
            </section>
        </nav>
    );
}

export default Navbar;