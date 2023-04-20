import './ledger.css'
import axios from "axios"
import { useState, useEffect, useRef, useMemo } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import MyWrappedComponent from './ComponentToPrint';
import EditComponent from './EditComponent';
import logo from '../../Assets/cut-all-logo.png'
import searchicon from "../../Assets/searchicon.png";
import { useModal } from '../../hooks/useModal';
import { useDataFetcher } from '../../hooks/useDataFetcher';

const Ledger = (props) => {
    const [activeTicket, setActiveTicket] = useState(null)
    const componentRef = useRef(null);
    const [rilynTickets, setRilynTickets] = useState([])
    const [kyleTickets, setKyleTickets] = useState([])
    const [patTickets, setPatTickets] = useState([])
    const [gordonTickets, setGordonTickets] = useState([])
    const [otherTickets, setOtherTickets] = useState([])
    const [editMode, setEditMode] = useState(false)
    const { isOpen: ticketInfoModal, toggleModal: toggleTicketInfoModal } = useModal();
    const { isOpen: editTicketModal, toggleModal: toggleEditTicketModal } = useModal();
    const { getData, data: tickets, error, loading } = useDataFetcher();

    useEffect(() => {
        getData(`${props.API_URL}ticket`)
    }, [])

    // other functions
    const handlePrint = () => { window.print() }

    const handleSubmit = (data) => {
        axios.put(`${props.API_URL}ticket/${data._id}`, data)
            .then(res => console.log(res.data.message))
            .catch(err => console.log(err))

        activeTicket.jobInfo.forEach(async (line) => {
            axios.put(`${props.API_URL}serialNum/editJobInfo`, {
                serialNum: line.serialNum,
                date: activeTicket.date,
                runLength: parseInt(line.length),
                depth: parseInt(line.depth)
            })
                .then(res => console.log(res))
            console.log(line)
        })
    }

    const handleDelete = () => {
        axios
            .delete(`${props.API_URL}ticket/${activeTicket._id}`)
            .then(res => console.log(res))
        toggleEditTicketModal()
        getData(`${props.API_URL}ticket`)
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
            } else {
                handleSplitTickets('Other', ticket);
            }
        }
    }, [tickets]);

    let mappedSeperateTickets = (who) => {
        let mapped = who.map((ticket) => {
            return (
                <li className='ticket'><Button onClick={() => {
                    setActiveTicket(ticket)
                    toggleTicketInfoModal()
                }}>{ticket.billTo} - {ticket.date} - Ticket # {ticket.ticketNum ? ticket.ticketNum : '-----'}</Button></li>
            )
        })
        return mapped
    }

    return (
        <div>
            <h1>List of job tickets on file</h1>
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

            <Modal fullscreen className='modal-width' id='mainModal' isOpen={ticketInfoModal} toggle={toggleTicketInfoModal}>
                <ModalHeader toggle={toggleTicketInfoModal}><img id='ticketLogo' src={logo} />{activeTicket ? `${activeTicket.worker}s Ticket for ${activeTicket.billTo} on ${activeTicket.date}, Ticket # ${activeTicket.ticketNum ? activeTicket.ticketNum : '-----'}` : 'Ticket Info'} </ModalHeader>
                <ModalBody id="ticketInfo">
                    <MyWrappedComponent editMode={editMode} value={activeTicket} ref={componentRef} />
                    <EditComponent editMode={editMode} editedData={activeTicket} API_URL={props.API_URL} setEditedData={setActiveTicket} />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" className={editMode ? 'hide' : 'show'} onClick={toggleTicketInfoModal}>close</Button>
                    <Button color='primary' className={editMode ? 'hide' : 'show'} onClick={() => handlePrint()}>Print</Button>
                    <Button color='warning' className={editMode ? 'hide' : 'show'} onClick={() => setEditMode(!editMode)}>Edit</Button>
                    <Button color='success' className={editMode ? 'show' : 'hide'} type='submit' onClick={() => {
                        handleSubmit(activeTicket)
                        setEditMode(!editMode)
                    }}>Save</Button>
                    <Button color='danger' className={editMode ? 'hide' : 'show'} onClick={handleDelete}>Delete</Button>
                </ModalFooter>
            </Modal>

            <Modal
                isOpen={editTicketModal}
                toggle={toggleEditTicketModal}
                onClosed={toggleTicketInfoModal}
            >
                <ModalHeader>Nested Modal title</ModalHeader>
                <ModalBody>
                    Are you sure that you want to delete {activeTicket ? activeTicket.worker : ''}s job ticket for {activeTicket ? activeTicket.billTo : ''} completed on {activeTicket ? activeTicket.date : ''}. Once deleted it will be gone forever.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggleEditTicketModal}>
                        cancel
                    </Button>{' '}
                    <Button color="danger" onClick={toggleEditTicketModal}>
                        Delete
                    </Button>
                </ModalFooter>
            </Modal>
        </div>


    );
}

export default Ledger;