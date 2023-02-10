import './ledger.css'
import axios from "axios"
import { useState, useEffect, useRef, useMemo } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import MyWrappedComponent from './ComponentToPrint';
import logo from '../../Assets/cut-all-logo.png'
import searchicon from "../../Assets/searchicon.png";

const Ledger = (props) => {
    const [tickets, setTickets] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTicket, setActiveTicket] = useState(null)
    const [modal, setModal] = useState(false);
    const componentRef = useRef(null);
    const [searchVal, setSearchVal] = useState('')
    const [searchBy, setSearchBy] = useState(null)
    const [rilynTickets, setRilynTickets] = useState([])
    const [kyleTickets, setKyleTickets] = useState([])
    const [patTickets, setPatTickets] = useState([])
    const [gordonTickets, setGordonTickets] = useState([])
    const [otherTickets, setOtherTickets] = useState([])

    // controls for modals 
    const [nestedModal, setNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(false);
    const toggle = () => setModal(!modal);
    const toggleNested = () => {
        setNestedModal(!nestedModal);
        setCloseAll(false);
    };
    const toggleAll = () => {
        setNestedModal(!nestedModal);
        setCloseAll(true);
    }

    // gathering data functions
    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setTickets(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (searchVal === '') {
            getData(`${props.API_URL}ticket`)
        } else {
            getData(`${props.API_URL}ticket/search/?${searchBy}=${searchVal}`)
        }
    }, [searchVal])

    // other functions
    const handleDelete = () => {
        axios
            .delete(`${props.API_URL}ticket/${activeTicket._id}`)
            .then(res => console.log(res))
        toggleAll()
        getData(`${props.API_URL}ticket`)
    }

    const handleSearch = (e) => {
        setSearchBy(e.target.name)
        setSearchVal(e.target.value)
    }

    const handleSplitTickets = (worker, ticket) => {
        switch (worker) {
            case 'Pat':
                if (!patTickets.find(t => t.id === ticket.id)) {
                    setPatTickets(patTickets => [...patTickets, ticket]);
                }
                break;
            case 'Rilyn':
                if (!rilynTickets.find(t => t.id === ticket.id)) {
                    setRilynTickets(rilynTickets => [...rilynTickets, ticket]);
                }
                break;
            case 'Kyle':
                if (!kyleTickets.find(t => t.id === ticket.id)) {
                    setKyleTickets(kyleTickets => [...kyleTickets, ticket]);
                }
                break;
            case 'Gordon':
                if (!gordonTickets.find(t => t.id === ticket.id)) {
                    setGordonTickets(gordonTickets => [...gordonTickets, ticket]);
                }
                break;
            case 'Other':
                if (!otherTickets.find(t => t.id === ticket.id)) {
                    setOtherTickets(otherTickets => [...otherTickets, ticket]);
                }
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];
            if (ticket.worker === 'Pat') {
                handleSplitTickets('Pat', ticket);
            } else if (ticket.worker === 'Rilyn') {
                handleSplitTickets('Rilyn', ticket);
            } else if (ticket.worker === 'Gordon') {
                handleSplitTickets('Gordon', ticket);
            } else if (ticket.worker === 'Kyle') {
                handleSplitTickets('Kyle', ticket);
            } else if (ticket.worker === 'Other') {
                handleSplitTickets('Other', ticket);
            }
        }
    }, [tickets]);

    let mappedSeperateTickets = (who) => {
        let mapped = who.map((ticket) => {
            return (
                <li className='ticket'><Button onClick={() => {
                    setActiveTicket(ticket)
                    toggle()
                }}>{ticket.worker}s ticket for {ticket.billTo} on {ticket.date} Ticket # {ticket.ticketNum ? ticket.ticketNum : '-----'}</Button></li>
            )
        })
        return mapped
    }

    return (
        <div>
            <h1>List of job tickets on file</h1>
            {/* <section className="d-flex p-5 justify-content-center" id="filter-bar">
                <form className="me-2" id="filter-item"  > 
                    <input className="searchbar" type='text' placeholder="Search by name or ticket #" onChange={() => { console.log('hit') }} />
                    <button className="search-submit" type="submit">
                        <img src={searchicon} alt="Search Icon" />
                    </button>
                </form>

                <UncontrolledDropdown className="me-2" id="filter-item">
                    <DropdownToggle caret> Workers </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem name='worker' value='Rilyn' onClick={handleSearch}>Rilyn</DropdownItem>
                        <DropdownItem name='worker' value='Kyle' onClick={handleSearch}>Kyle</DropdownItem>
                        <DropdownItem name='worker' value='Pat' onClick={handleSearch}>Pat</DropdownItem>
                        <DropdownItem name='worker' value='Gordon' onClick={handleSearch}>Gordon</DropdownItem>
                        <DropdownItem name='worker' value='Other' onClick={handleSearch}>Other</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown className="me-2" id="filter-item">
                    <DropdownToggle caret > Ticket # </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem name='sort' value='dec' onClick={handleSearch}>High</DropdownItem>
                        <DropdownItem name='sort' value='acd' onClick={handleSearch}>Low</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                <Button className="me-2" id="filter-item" color="dark" onClick={() => getData(`${props.API_URL}ticket`)}>
                    Refresh
                </Button>
            </section> */}

            <section className='ledger split' id='ticketContainer'>
                <section>
                    <h1>Rilyn</h1>
                    {rilynTickets.length ? mappedSeperateTickets(rilynTickets) : 'No tickets currently stored'}
                </section>
                <section>
                    <h1>Pat</h1>
                    {patTickets.length ? mappedSeperateTickets(patTickets) : 'No tickets currently stored'}
                </section>
                <section>
                    <h1>Kyle</h1>
                    {kyleTickets.length ? mappedSeperateTickets(kyleTickets) : 'No tickets currently stored'}
                </section>
                <section>
                    <h1>Other</h1>
                    {otherTickets.length ? mappedSeperateTickets(otherTickets) : 'No tickets currently stored'}
                </section>
                <section>
                    <h1>Gordon</h1>
                    {gordonTickets.length ? mappedSeperateTickets(gordonTickets) : 'No tickets currently stored'}
                </section>
            </section>

            <Modal fullscreen className='modal-width' id='mainModal' isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}><img id='ticketLogo' src={logo} />{activeTicket ? `${activeTicket.worker}s Ticket for ${activeTicket.billTo} on ${activeTicket.date}, Ticket # ${activeTicket.ticketNum ? activeTicket.ticketNum : '-----'}` : 'Ticket Info'} </ModalHeader>
                <ModalBody id="ticketInfo">
                    <MyWrappedComponent value={activeTicket} ref={componentRef} />
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => componentRef.current.handlePrint()}>Print</Button>
                    <Button color="secondary" onClick={toggle}>
                        close
                    </Button>
                    <Button color='danger' onClick={toggleNested}>delete</Button>
                </ModalFooter>
            </Modal>

            <Modal
                isOpen={nestedModal}
                toggle={toggleNested}
                onClosed={closeAll ? toggle : undefined}
            >
                <ModalHeader>Nested Modal title</ModalHeader>
                <ModalBody>
                    Are you sure that you want to delete {activeTicket ? activeTicket.worker : ''}s job ticket for {activeTicket ? activeTicket.billTo : ''} completed on {activeTicket ? activeTicket.date : ''}. Once deleted it will be gone forever.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggleNested}>
                        cancel
                    </Button>{' '}
                    <Button color="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </ModalFooter>
            </Modal>
        </div>


    );
}

export default Ledger;