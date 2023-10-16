import axios from "axios"
import { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Popover, PopoverBody, PopoverHeader, InputGroup, InputGroupText, Input, Label, UncontrolledPopover } from 'reactstrap';
import EditTicket from './EditTicket';
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
    const { isOpen: deleteConfirmation, toggleModal: toggleDeleteConfirmation } = useModal();
    const [searchVal, setSearchVal] = useState('')
    const [topTicket, setTopTicket] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const topTicketResponse = await axios.get(`${API_URL}ticket/topTicketNum`);
                const topTicketId = topTicketResponse.data.data._id;
                const ticketResponse = await axios.get(`${API_URL}ticket/${topTicketId}`);
                const activeTicketData = ticketResponse.data.data;
                setActiveTicket(activeTicketData);
            } catch (error) {
                console.error(error);
            }
        };
        setEditMode(false)
        fetchData();
    }, []);

    const handleChange = (event) => {
        event.preventDefault()
        setSearchVal(event.target.value)
    }

    const handleUpdate = (data) => {
        axios.put(`${API_URL}ticket/${data._id}`, data)
            .then(res => {
                console.log(res.data.message);
            }).catch(err => console.log(err))

        activeTicket.jobInfo.forEach(async (line) => {
            console.log(line)
            axios.put(`${API_URL}serialNum/editJobInfo`, {
                serialNum: line.serialNum? line.serialNum : null,
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
                    editMode={editMode}
                    topTicket={topTicket}
                    worker={worker.firstName}
                    API_URL={API_URL}
                    setActiveTicket={setActiveTicket}
                    searchVal={searchVal}
                />
            </div>
        )
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('set ticket num')
    }

    return (
        <div className="ledgerPage body">
            <section id="ledgerTicketSection">
                <div className="ledgerSearchBarContainer">
                    <form onSubmit={handleSubmit} className="me-2" id="filter-item" >
                        <input id="ledgerSearchbar" className="searchbar" type='text' placeholder="Search by company or ticket #" onChange={handleChange} value={searchVal} />
                        <button className="search-submit" type="submit">
                            <img src={searchicon} alt="Search Icon" />
                        </button>
                    </form>
                </div>
                <div id='ticketContainer'>
                    {mapapedWorkers}
                </div >
            </section>

            <section id="ledgerViewerSection">
                <div className="ledgerTitle ">
                    <h1>Current selected ticket</h1>
                </div>
                <div className="pdfLedgerButtonsContainer">
                    <Button size="lg" color='warning' className={editMode ? 'hide' : 'show'} onClick={() => setEditMode(!editMode)}>Edit</Button>
                    <Button size="lg" color='success' className={editMode ? 'show' : 'hide'} type='submit' onClick={() => {
                        handleUpdate(activeTicket)
                        setEditMode(!editMode)
                    }}>Save</Button>
                    <Button disabled={editMode} id="deletionConfirmation" size="lg" color='danger'>Delete</Button>
                </div>

                <div id="viewerContainer">
                    {editMode ?
                        <div>
                            <EditTicket editMode={editMode} editedData={activeTicket} API_URL={API_URL} setEditedData={setActiveTicket} />
                        </div>
                        :
                        <PDFViewer className="pdfViwerLedger">
                            {activeTicket ? <PdfRenderer value={activeTicket} /> : 'There was a problem '}
                        </PDFViewer>
                    }
                </div>

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