import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout'
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import logo from '../Assets/cut-all-logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user } = useAuthContext()
    const { logout } = useLogout()

    const handleLogout = () => {
        logout()
    }

    return (
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
                        <UncontrolledDropdown group>
                            <Button onClick={handleLogout} color="warning">
                                Logout
                            </Button>
                            <DropdownToggle
                                caret
                                color="warning"
                            />
                            <DropdownMenu>
                                <DropdownItem header> Other actions </DropdownItem>
                                <DropdownItem>
                                    <Link to="/ledger">Profile info</Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
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
    );
}

export default Navbar;