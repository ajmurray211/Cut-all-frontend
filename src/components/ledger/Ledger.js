import './ledger.css'
import axios from "axios"
import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MyWrappedComponent from './ComponentToPrint';

const Ledger = () => {
    // const API_URL = 'https://shielded-cove-45306.herokuapp.com/'
    const API_URL = 'http://localhost:8080/'

    const [tickets, setTickets] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTicket, setActiveTicket] = useState(null)
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const componentRef = useRef(null);

    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setTickets(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getData(`${API_URL}ticket`)
    }, [])

    let mappedTickets = tickets.map((ticket) => {
        return (
            <li className='ticket'><Button onClick={() => {
                setActiveTicket(ticket)
                toggle()
            }}>{ticket.worker}s ticket for {ticket.billTo} on {ticket.date}</Button></li>
        )
    })

    return (
        <div>
            <h1>List of job tickets on file</h1>
            {tickets.length ? mappedTickets : 'No tickets currently stored'}

            <Modal fullscreen className='modal-width' id='mainModal' isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Ticket information</ModalHeader>
                <ModalBody  id="ticketInfo">
                    <MyWrappedComponent value={activeTicket} ref={componentRef} />
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => componentRef.current.handlePrint()}>Print</Button>
                    <Button color="secondary" onClick={toggle}>
                        close
                    </Button>
                </ModalFooter>
            </Modal>
        </div>


    );
}

export default Ledger;