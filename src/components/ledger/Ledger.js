import axios from "axios"
import { useState, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ActiveTicket from './ActiveTicket';
import EditTicket from './EditTicket';
import logo from '../../Assets/cut-all-logo.png'
import { useModal } from '../../hooks/useModal';
import TicketList from './TicketList';
import { useWorkerContext } from '../../hooks/useWorkerContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFGenerator from "./PdfGenerator";

const Ledger = (props) => {
    const { API_URL, workerlist } = useWorkerContext()
    const [activeTicket, setActiveTicket] = useState(null)
    const componentRef = useRef(null);
    const [editMode, setEditMode] = useState(false)
    const { isOpen: ticketInfoModal, toggleModal: toggleTicketInfoModal } = useModal();
    const { isOpen: editTicketModal, toggleModal: toggleEditTicketModal } = useModal();
    const workerList = ['Rilyn', 'Pat', 'Kyle','Gordon' ];


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
                    <ActiveTicket editMode={editMode} value={activeTicket} ref={componentRef} />
                    <EditTicket editMode={editMode} editedData={activeTicket} API_URL={API_URL} setEditedData={setActiveTicket} />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" className={editMode ? 'hide' : 'show'} onClick={toggleTicketInfoModal}>close</Button>
                    <PDFDownloadLink document={< PDFGenerator value={activeTicket} />} fileName={activeTicket && `Ticket #${activeTicket.ticketNum}.pdf`} >
                        {({ blob, url, loading, error }) =>
                            loading ? 'Loading document...' : <Button className={editMode ? 'hide' : 'show'} color='success'>Download PDF</Button>
                        }
                    </PDFDownloadLink >
                    <Button color='warning' className={editMode ? 'hide' : 'show'} onClick={() => setEditMode(!editMode)}>Edit</Button>
                    <Button color='success' className={editMode ? 'show' : 'hide'} type='submit' onClick={() => {
                        handleSubmit(activeTicket)
                        setEditMode(!editMode)
                    }}>Save</Button>
                    <Button color='danger' className={editMode ? 'hide' : 'show'} onClick={handleDelete}>Delete</Button>
                </ModalFooter>
            </Modal>
        </div >
    );
}

export default Ledger;