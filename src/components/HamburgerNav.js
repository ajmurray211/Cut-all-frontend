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
                            <span>{user.email}</span>
                            <UncontrolledDropdown group>
                                <Button disabled color="warning">
                                    Actions
                                </Button>
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
                            <Link className='link' to='/login'>Log In</Link>
                        </div>
                    )}
                </section>
                <NavbarToggler onClick={toggleNavbar} className="me-2" />
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