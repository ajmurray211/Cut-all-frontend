import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout'
import { Button, UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Label } from 'reactstrap';
import logo from '../Assets/cut-all-logo.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import userIcon from '../Assets/userIcon.png'

const Navbar = () => {
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const handleLogout = () => {
        logout()
    }

    return (
        <nav className='fullNav'>
            <Link to="/"><img className="cut-all-logo" alt='Cut all logo' src={logo} /></Link>
            {/* {user && ( */}
            <section className='link-container'>
                <Link className='link' to='/'>Inventory</Link>
                <Link className='link' to='/ledger'>Ledger</Link>
                <Link className='link' to='/serialNums'>Serial numbers</Link>
                <Link className='link' to='/timeSheet'>Time Sheet</Link>
                <Link className='link' to='/jobTicket'>Job ticket</Link>
            </section>
            {/* )} */}
            <section className='auth-info'>
                {user && (
                    <div>
                        <img src={userIcon} alt='user icon' />
                        <UncontrolledDropdown group>
                            <Button disabled color='warning'>{user.email}</Button>
                            <DropdownToggle
                                caret
                                color="warning"
                            />
                            <DropdownMenu>
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
                    <div>
                        <img src={userIcon} alt='user icon' />

                        <Link className='link' to='/login'>Log In</Link>
                    </div>
                )}
            </section>
        </nav>
    );
}

export default Navbar;