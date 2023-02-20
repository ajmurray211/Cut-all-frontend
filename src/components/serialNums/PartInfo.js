import { useState } from "react";
import { ListGroupItem, Button, Collapse, Card, CardBody, CardTitle, CardText, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PartInfo = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    let data = []

    const mappedHistory = props.number.history.map(entry => {
        console.log(entry)
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
        <ListGroupItem >
            <Button color='primary' onClick={toggle}> #{props.number.serialNum}, {props.number.tool}</Button>
            <Modal isOpen={isOpen} fullscreen className="serialNums partInfo">
                <ModalBody >
                    <ResponsiveContainer
                        width='95%'
                        height={600}>
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
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Depth" stroke="#8884d8"  />
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
        </ListGroupItem>
    );
}

export default PartInfo;