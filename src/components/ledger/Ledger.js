import axios from "axios"
import { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Popover, PopoverBody, PopoverHeader, InputGroup, InputGroupText, Input, Label, UncontrolledPopover } from 'reactstrap';
import EditTicket from './EditTicket';
import logo from '../../Assets/cut-all-logo.png'
import { useModal } from '../../hooks/useModal';
import TicketList from './TicketList';
import { useWorkerContext } from '../../hooks/useWorkerContext';
import { PDFViewer } from '@react-pdf/renderer';
import PdfRenderer from "../PdfRenderer";
import searchicon from "../../Assets/searchicon.png";

const Ledger = (props) => {
    const { API_URL, workerList } = useWorkerContext()
    const [activeTicket, setActiveTicket] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const { isOpen: ticketInfoModal, toggleModal: toggleTicketInfoModal } = useModal();
    const { isOpen: deleteConfirmation, toggleModal: toggleDeleteConfirmation } = useModal();
    const [searchVal, setSearchVal] = useState('')
    const [topTicket, setTopTicket] = useState(0);

    useEffect(() => {
        axios
            .get(`${API_URL}ticket/topTicketNum`)
            .then((res) => {
                let number = res.data.data.ticketNum - 1
                console.log(number)
                setTopTicket(number)
            })
    }, [])

    const handleChange = (event) => {
        event.preventDefault()
        setSearchVal(event.target.value)
    }

    const handleUpdate = (data) => {
        axios.put(`${API_URL}ticket/${data._id}`, data)
            .then(res => {
                console.log(res.data.message);
                window.location.reload(); // Reload the page
            }).catch(err => console.log(err))

        activeTicket.jobInfo.forEach(async (line) => {
            axios.put(`${API_URL}serialNum/editJobInfo`, {
                serialNum: line.serialNum,
                date: activeTicket.date,
                runLength: parseInt(line.length),
                depth: parseInt(line.depth)
            })
                .then(res => console.log(res))
        })
    }

    const handleDelete = () => {
        axios
            .delete(`${API_URL}ticket/${activeTicket._id}`)
            .then(res => console.log(res))
        window.location.reload(); // Reload the page
    }

    const mapapedWorkers = workerList.map((worker, i) => {
        return (
            <div className="ticketList" key={worker.firstName} >
                <TicketList
                    topTicket={topTicket}
                    worker={worker.firstName}
                    API_URL={API_URL}
                    setActiveTicket={setActiveTicket}
                    toggleTicketInfoModal={toggleTicketInfoModal}
                    searchVal={searchVal}
                />
            </div>
        )
    })

    return (
        <div>
            <section id="viewerSection">
                <div className="">
                    {/* <h1>List of job tickets on file</h1> */}
                </div>
                <div className="searchContainer">
                    <div>
                        <p>Ticket number: {activeTicket ? activeTicket.ticketNum : ''}</p>
                        <p>Customer: {activeTicket ? activeTicket.billTo : ''}</p>
                    </div>
                    <div>
                        <form className="me-2" id="filter-item" >
                            <input id="ledgerSearchbar" className="searchbar" type='text' placeholder="Search by company or ticket #" onChange={handleChange} value={searchVal} />
                            <button className="search-submit" type="submit">
                                <img src={searchicon} alt="Search Icon" />
                            </button>
                        </form>
                    </div>
                </div>
                <div id="viewerContainer">

                    <PDFViewer className="pdfViwer" style={{ width: '100%', height: '100%' }}>
                        {activeTicket ? <PdfRenderer value={activeTicket} /> : 'There was a problem '}
                    </PDFViewer>
                </div>
                <div className="pdfButtonsContainer">
                    <Button size="lg" color='warning' className={editMode ? 'hide' : 'show'} onClick={() => setEditMode(!editMode)}>Edit</Button>
                    <Button id="deletionConfirmation" size="lg" color='danger'>Delete</Button>
                </div>
            </section>

            <section id="ticketSection">
                <div>
                    <div></div>
                    <div>
                        <form className="me-2" id="filter-item" >
                            <input id="ledgerSearchbar" className="searchbar" type='text' placeholder="Search by company or ticket #" onChange={handleChange} value={searchVal} />
                            <button className="search-submit" type="submit">
                                <img src={searchicon} alt="Search Icon" />
                            </button>
                        </form>
                    </div>
                </div>
                <div className='ledger split' id='ticketContainer'>
                    {mapapedWorkers}
                </div >
            </section>

            <UncontrolledPopover
                isOpen={deleteConfirmation}
                trigger="focus"
                target="deletionConfirmation"
                placement="top"
                toggle={toggleDeleteConfirmation}
            >
                <PopoverHeader toggle={toggleDeleteConfirmation}>
                    Deletion confirmation
                </PopoverHeader>
                <PopoverBody>
                    <strong>
                        Are you sure that you want to delete this job ticket? There will be no recovery possible once deleted.
                    </strong>
                    <br />
                    <Button color="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </PopoverBody>
            </UncontrolledPopover>
        </div >
    );
}

export default Ledger;


{/* 
            <Modal fullscreen className='modal-width' id='mainModal' isOpen={ticketInfoModal}>
                <ModalHeader toggle={() => {
                    toggleTicketInfoModal()
                    setEditMode(false)
                }}>
                    <img
                        id='ticketLogo'
                        src={logo} />
                    {activeTicket ? `${activeTicket.worker}s Ticket for ${activeTicket.billTo} on ${activeTicket.date}, Ticket # ${activeTicket.ticketNum ? activeTicket.ticketNum : '-----'}` : 'Ticket Info'}
                </ModalHeader>
                <ModalBody id="ticketInfo">
                    {editMode ? (
                        <EditTicket editMode={editMode} editedData={activeTicket} API_URL={API_URL} setEditedData={setActiveTicket} />
                    ) : (
                        <PDFViewer style={{ width: '100%', height: '100%' }}>
                            <PdfRenderer value={activeTicket} />
                        </PDFViewer>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" className={editMode ? 'hide' : 'show'} onClick={toggleTicketInfoModal}>close</Button>
                    <Button color='warning' className={editMode ? 'hide' : 'show'} onClick={() => setEditMode(!editMode)}>Edit</Button>
                    <Button color='success' className={editMode ? 'show' : 'hide'} type='submit' onClick={() => {
                        handleUpdate(activeTicket)
                        setEditMode(!editMode)
                        toggleTicketInfoModal()
                    }}>Save</Button>
                </ModalFooter>
            </Modal> */}