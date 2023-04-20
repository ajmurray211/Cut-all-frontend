import { useState } from "react";
import { ListGroupItem, Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useModal } from "../../hooks/useModal";

const PartInfo = (props) => {
    const { isOpen, toggleModal: toggle } = useModal();
    let data = []
    let maxNum = 25

    const mappedHistory = props.number.history.map(entry => {
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
            <li className="entry">Date: {date}, Depth: {depth}, Length: {runLength}</li>
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
                    Assigned User: {props.number.assignedTo == '' ? 'No user assigned yet.' : props.number.assignedTo}
                    <br/>
                    Created on: {props.number.createdAt? props.number.createdAt : 'Time Stamp not working on this part.'}
                    <ul id="entryContainer">
                        {mappedHistory}
                    </ul>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default PartInfo;