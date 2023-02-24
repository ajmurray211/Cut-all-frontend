import { useState } from "react";
import { ListGroupItem, Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PartInfo = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    let data = []
    let maxNum = 25

    const mappedHistory = props.number.history.map(entry => {
        if (Math.max(parseInt(entry.runLength), parseInt(entry.depth)) > maxNum) {
            maxNum = Math.max(parseInt(entry.runLength), parseInt(entry.depth))
        }
        data.push({
            name: entry.date,
            Depth: entry.depth,
            Length: entry.runLength
        })
        return (
            <li className="entry">Date: {entry.date}, Depth: {entry.depth}, Length: {entry.runLength}</li>
        )
    })

    return (
        <div className="entry">
            <Button color='primary' onClick={toggle}> #{props.number.serialNum}, {props.number.tool}</Button>
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