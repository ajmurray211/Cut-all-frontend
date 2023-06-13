import { useState } from "react";
import { ListGroupItem, Button, Modal, ModalBody, ModalFooter, Offcanvas, OffcanvasHeader, OffcanvasBody, Alert } from "reactstrap";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useModal } from "../../hooks/useModal";
import axios from "axios";
import { useWorkerContext } from "../../hooks/useWorkerContext";
import useAlert from "../../hooks/useAlert";

const PartInfo = (props) => {
    const { API_URL, workerList } = useWorkerContext()
    const { isOpen, toggleModal: toggle } = useModal();
    const { isOpen: deleteModal, toggleModal: toggleDelete } = useModal();
    const { alertType: deleteAlertType, message: deleteMessage, isOpen: deleteRequestOpen, showAlert: showDelete } = useAlert()
    const [submitted, setSubmitted] = useState(false)

    let data = []
    let maxNum = 25

    const handleDlete = async () => {
        setSubmitted(true)
        await axios.delete(`${API_URL}serialNum/${props.number._id}`)
            .then((res) => {
                console.log(res)
                showDelete(res.status, res.data.message)
                setTimeout(() => {
                    setSubmitted(false)
                    window.location.reload();
                }, 8000);
            })
            .catch(err => {
                console.log(err)
                showDelete(err.status, err.data.message)
            })
    }

    const convertTime = (timestamp) => {
        const date = new Date(timestamp);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const formattedDate = `${month}/${day}/${year}`;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return `${formattedDate} at ${formattedTime}`;
    };

    const mappedHistory = props.number.history.map((entry, i) => {
        let { depth, runLength, date } = entry

        // remove quotes from user entries if present
        if (runLength.includes('”') || runLength.includes("’") || runLength.includes("'") || runLength.includes('"')) {
            let newLength = runLength.slice(0, -1)
            runLength = newLength
        }
        if (depth.includes('”') || depth.includes("’") || depth.includes("'") || depth.includes('"')) {
            depth = depth.slice(0, -1)
        }

        if (entry)
            if (Math.max(parseInt(runLength), parseInt(depth)) > maxNum) {
                maxNum = Math.max(parseInt(runLength), parseInt(depth))
            }

        data.push({
            name: date,
            Depth: depth,
            Length: runLength
        })
        return (
            <li key={i} className="entry">Date: {date}, Depth: {depth}' , Length: {runLength}"</li>
        )
    })

    return (
        <div className="entry">
            <Button color='primary' onClick={toggle}> #{props.number.serialNum}, {props.number.name}</Button>
            <Modal isOpen={isOpen} fullscreen className="serialNums partInfo">
                <ModalBody>
                    <ResponsiveContainer
                        width='95%'
                        height='50%'>
                        <LineChart
                            className='chart'
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="5 5" />
                            <XAxis dataKey="name" />
                            <YAxis tickCount={7} domain={[0, maxNum]} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Depth" stroke="#8884d8" />
                            <Line type="monotone" dataKey="Length" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                    Serial number: {props.number.serialNum},
                    <br />
                    Manufacturer: {props.number.manufacture},
                    <br />
                    Spec number: {props.number.specNum}
                    <br />
                    Assigned User: {props.number.assignedTo == ('' || null) ? 'No user assigned yet.' : props.number.assignedTo}
                    <br />
                    Created on: {props.number.createdAt ? convertTime(props.number.createdAt) : 'Time Stamp not working for this item.'}
                    <ul id="entryContainer">
                        {mappedHistory}
                    </ul>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggle}>Close</Button>
                    <Button color="danger" onClick={toggleDelete}>Delete</Button>
                </ModalFooter>
            </Modal>
            <Offcanvas
                isOpen={deleteModal}
                direction="top"
                toggle={toggleDelete}
            >
                <OffcanvasHeader toggle={toggleDelete}>
                    Deletion confirmation
                </OffcanvasHeader>
                <OffcanvasBody>
                    <Alert color={deleteAlertType} isOpen={deleteRequestOpen}>{deleteMessage}</Alert>
                    <strong>
                        Are you sure that you want to delete this Serial number? There will be no recovery possible once deleted.
                    </strong>
                    <br />
                    <Button color="danger" disabled={submitted} onClick={handleDlete}>
                        Delete
                    </Button>
                </OffcanvasBody>
            </Offcanvas>
        </div>
    );
}

export default PartInfo;