import './jobTicket.css'
import SignatureCanvas from 'react-signature-canvas'
import { Form, Row, Col, Label, FormGroup, Input, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BillingRow from './BillingRow';
import { useState } from 'react';

const JobTIcket = () => {
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    const [ticketBody, setTicketBody] = useState([])
    const [worker, setWorker] = useState('')
    const [billTo, setBillTo] = useState('')
    const [truckNum, setTruckNum] = useState(null)
    const [date, setDate] = useState(null)
    const [address, setAddress] = useState(null)
    const [jobInfo, setJobInfo] = useState([])
    let rowNum = 1

    const addRow = () => {
        let copy = [...ticketBody, rowNum]
        setTicketBody(copy)
    }

    let mappedRows = ticketBody.map((row, index) => {
        console.log(ticketBody)
        return <BillingRow
            index={index}
        />
    })

    return (
        <div id='job-ticket'>
            <Form onSubmit={console.log('submit')}>
                <Row>
                    <Col md={4} />
                    <Col md={3}>
                        <FormGroup>
                            <Label for="employeeList">
                                Employee Name:
                            </Label>
                            <Input
                                id="employeeName"
                                name="select"
                                placeholder="Who are you?"
                                type="select"
                                onChange={(event) => setWorker(event.target.value)}
                            >
                                <option></option>
                                <option>Rilyn</option>
                                <option>Kyle</option>
                                <option>Pat</option>
                                <option>Gordon</option>
                                <option>Kim</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <Label>Truck Number:</Label>
                        <Input type='number' onChange={(event) => setTruckNum(event.target.value)}></Input>
                    </Col>
                </Row>
                <Row>
                    <Col md={2} />
                    <Col md={3}>
                        <FormGroup>
                            <Label for="employeeList">
                                Bill to:
                            </Label>
                            <Input
                                id="billingName"
                                name="select"
                                placeholder="Billing name"
                                type="text"
                                onChange={(event) => setBillTo(event.target.value)}
                            ></Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="otherWorkers">
                                Other CA men on the job :
                            </Label>
                            <Input
                                id="otherWorkers"
                                type="checkbox"
                                onChange={(event) => console.log(event.target.value)}
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="date">
                                Date:
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                onChange={(event) => setDate(event.target.value)}
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={2} />
                </Row>

                <Row>
                    <Col md={4} />
                    <Col md={2}>
                        <FormGroup>
                            <Label for="address">
                                Address:
                            </Label>
                            <Input
                                id="address"
                                placeholder="Enter job address"
                                type="text"
                                onChange={(event) => setAddress(event.target.value)}
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="masterTicket">
                                Master Ticket:
                            </Label>
                            <Input
                                id="masterTicket"
                                type="checkbox"
                                onChange={(event) => console.log(event.target.value)}
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Table bordered striped responsive>
                    <thead>
                        <tr>
                            <th>Quote item</th>
                            <th>QTY</th>
                            <th>Length or DIA</th>
                            <th>Depth</th>
                            <th>Work code</th>
                            <th>Discription / equipment used</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mappedRows}
                    </tbody>
                </Table>
                <Button onClick={(event) => addRow()}> Add row </Button>
                {/* <Button id='addRowBtn' onClick={(event) => addRow()}>+</Button> */}
            </Form>

            <Button onClick={toggleModal} type='submit'>Submit</Button>

            <Modal isOpen={modal}>
                <ModalHeader toggle={toggleModal}>Signature form</ModalHeader>
                <ModalBody>
                    <sction id='workerInput'>
                        <h2>Job information:</h2>
                        <ul id='inputContainer'>
                            <li><span id='inputItem'>Who worked</span>:{worker}</li>
                            <li><span id='inputItem'>Bill to</span>:{billTo}</li>
                            <li><span id='inputItem'>Truck number</span>:{truckNum}</li>
                            <li><span id='inputItem'>Date</span>:{date}</li>
                            <li><span id='inputItem'>Address</span>:{address}</li>
                            <li><span id='inputItem'>Work completed</span>:{jobInfo}</li>
                        </ul>
                    </sction>
                    <section id='legalDisclaimer'>
                        <h2> Standard job conditions:</h2>
                        <ul>
                            <li>1. Layout of work by others prior to arrival of operator.</li>
                            <li>2. We cannot accept responsibility for damage to buried objects such as conduit, steel pipes, etc.</li>
                            <li>3. All prices based on a maximum work height of 8’. Scaffolding supplied and erected by others unless prior arrangements are made.</li>
                            <li>4. Water and power available within 150’ of work area. Parking for truck and power unit within 150’ of work area.</li>
                            <li>5. Traffic control, water and/or dust partition by others.</li>
                            <li>6. We reserve the right to bill all work on an hourly basis due to difficult working conditions and/or heavy reinforcing.</li>
                            <li> 7. If for any reason are unable to work due to no fault of our own, then we must charge for stand-by time.</li>
                            <li>8. Contractor is responsible for covering holes created by sawing and drilling.</li>
                            <li>9. In the event of non-payment of any amount, when due, purchaser agrees to pay all collection costs including reasonable attorney fees.</li>
                        </ul>
                    </section>

                    <SignatureCanvas penColor='black' id='sign'
                        canvasProps={{ width: 425, height: 200, className: 'sigCanvas' }} />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggleModal} type='submit'>Submit</Button>
                </ModalFooter>
            </Modal>
        </div>

    );
}

export default JobTIcket;