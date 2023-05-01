import './ledger.css'
import axios from "axios"
import { useState, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MyWrappedComponent from './ComponentToPrint';
import EditComponent from './EditComponent';
import logo from '../../Assets/cut-all-logo.png'
import { useModal } from '../../hooks/useModal';
import TicketList from './TicketList';
import { useWorkerContext } from '../../hooks/useWorkerContext';

const Ledger = (props) => {
    const { API_URL, workerlist } = useWorkerContext()
    const [activeTicket, setActiveTicket] = useState(null)
    const componentRef = useRef(null);
    const [editMode, setEditMode] = useState(false)
    const { isOpen: ticketInfoModal, toggleModal: toggleTicketInfoModal } = useModal();
    const { isOpen: editTicketModal, toggleModal: toggleEditTicketModal } = useModal();

    const handlePrint = () => { window.print() }

    const handleSubmit = (data) => {
        axios.put(`${API_URL}ticket/${data._id}`, data)
            .then(res => console.log(res.data.message))
            .catch(err => console.log(err))

        activeTicket.jobInfo.forEach(async (line) => {
            axios.put(`${API_URL}serialNum/editJobInfo`, {
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
            .delete(`${API_URL}ticket/${activeTicket._id}`)
            .then(res => console.log(res))
        toggleEditTicketModal()
    }

    const workerList = ['Rilyn', 'Pat', 'Gordon', 'Kyle'];

    const mapapedWorkers = workerList.map((worker) => {
        return (
            < div key={worker} >
                <TicketList
                    worker={worker}
                    API_URL={API_URL}
                    setActiveTicket={setActiveTicket}
                    toggleTicketInfoModal={toggleTicketInfoModal} />
            </div>
        )
    })

    return (
        <div>
            <h1>List of job tickets on file</h1>
            <section className='ledger split' id='ticketContainer'>
                {mapapedWorkers}
            </section >

            <Modal fullscreen className='modal-width' id='mainModal' isOpen={ticketInfoModal} toggle={toggleTicketInfoModal}>
                <ModalHeader toggle={toggleTicketInfoModal}><img id='ticketLogo' src={logo} />{activeTicket ? `${activeTicket.worker}s Ticket for ${activeTicket.billTo} on ${activeTicket.date}, Ticket # ${activeTicket.ticketNum ? activeTicket.ticketNum : '-----'}` : 'Ticket Info'} </ModalHeader>
                <ModalBody id="ticketInfo">
                    <MyWrappedComponent editMode={editMode} value={activeTicket} ref={componentRef} />
                    <EditComponent editMode={editMode} editedData={activeTicket} API_URL={API_URL} setEditedData={setActiveTicket} />
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
        </div >
    );
}

export default Ledger;
