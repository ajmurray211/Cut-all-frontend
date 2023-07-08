import React, { useState } from 'react';
import {
    Collapse, Navbar, NavbarToggler, NavbarBrand,
    Nav, Button, DropdownToggle,
    DropdownMenu, DropdownItem, UncontrolledDropdown
} from 'reactstrap';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout'
import { Link } from 'react-router-dom';
import logo from '../Assets/cut-all-logo.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function HamburgerNav() {
    const [collapsed, setCollapsed] = useState(true);
    const { user } = useAuthContext()
    const { logout } = useLogout()

    const handleLogout = () => {
        logout()
    }

    const toggleNavbar = () => setCollapsed(!collapsed);

    return (
        <div className='hamburgerNav'>
            <Navbar color="faded" light>
                <NavbarBrand className="me-auto">
                    <img className="cut-all-logo" alt='Cut all logo' src={logo} />
                </NavbarBrand>
                <section className='auth-info'>
                    {user && (
                        <div>
                            <UncontrolledDropdown  group direction='down'>
                                <NavbarToggler onClick={toggleNavbar} className="me-2" />

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
                        <div>
                            <Link className='link' to='/login'>Log In</Link>
                        </div>
                    )}
                </section>
                <Collapse isOpen={!collapsed} navbar>
                    <Nav navbar>
                        <Link className='link' onClick={toggleNavbar} to='/'>Inventory</Link>
                        <Link className='link' onClick={toggleNavbar} to='/ledger'>Ledger</Link>
                        <Link className='link' onClick={toggleNavbar} to='/serialNums'>Serial numbers</Link>
                        <Link className='link' onClick={toggleNavbar} to='/timeSheet'>Time Sheet</Link>
                        <Link className='link' onClick={toggleNavbar} to='/jobTicket'>Job ticket</Link>
                    </Nav>
                </Collapse>

            </Navbar>
        </div>
    );
}

export default HamburgerNav;