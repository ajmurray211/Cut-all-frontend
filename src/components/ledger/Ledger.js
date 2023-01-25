import './ledger.css'
import axios from "axios"
import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MyWrappedComponent from './ComponentToPrint';

const Ledger = (props) => {

    const [tickets, setTickets] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTicket, setActiveTicket] = useState(null)
    const [modal, setModal] = useState(false);
    const componentRef = useRef(null);

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

    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setTickets(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getData(`${props.API_URL}ticket`)
    }, [])

    let mappedTickets = tickets.map((ticket) => {
        return (
            <li className='ticket'><Button onClick={() => {
                setActiveTicket(ticket)
                toggle()
            }}>{ticket.worker}s ticket for {ticket.billTo} on {ticket.date}</Button></li>
        )
    })

    const handleDelete = () => {
        axios
            .delete(`${props.API_URL}ticket/${activeTicket._id}`)
            .then(res => console.log(res))
        toggleAll()
        getData(`${props.API_URL}ticket`)
    }

    return (
        <div>
            <h1>List of job tickets on file</h1>
            {tickets.length ? mappedTickets : 'No tickets currently stored'}

            <Modal fullscreen className='modal-width' id='mainModal' isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Ticket information</ModalHeader>
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