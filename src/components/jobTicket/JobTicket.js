import './jobTicket.css'
import SignatureCanvas from 'react-signature-canvas'
import { Alert, Form, Row, Col, Label, FormGroup, Input, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BillingRow from './BillingRow';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const JobTIcket = () => {
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    const [ticketBody, setTicketBody] = useState([])
    const [status, setStatus] = useState('');
    const [show, setShow] = useState(false)
    const [value, setValue] = useState({
        fullName: 'TEST',
        email: 'murray.aj.murray@gmail.com',
        worker: '',
        billTo: '',
        otherWorkers: '',
        truckNum: '',
        date: '',
        address: ''
    })

    let row = {
        'itemNum': '',
        'qty': '',
        'length': '',
        'depth': '',
        'workCode': '',
        'equipUsed': '',
        'amount': ''
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        toggleModal()
        console.log(value, status)
        emailjs.send('service_v3kf86l', 'template_mdw8cd7', value, 'E5-2RW9TeJyvAH3_r')
            .then((result) => {
                setStatus(result.text);
                setShow(true)
            }, (error) => {
                setStatus(error.text);
            });
    }

    useEffect(() => {
        if (status === 'OK') {
            setTimeout(() => {
                setStatus('');
                setShow(false)
            }, 3000);
        }
    }, [status]);

    const handleChange = (e) => {
        setValue(values => ({
            ...values,
            [e.target.name]: e.target.value
        }))
    }

    const editRow = (i, key, val) => {
        let copy = [...ticketBody]
        copy[i][key] = val
        setTicketBody[i][key](val)
    }

    const addRow = () => {
        let copy = [...ticketBody, row]
        setTicketBody(copy)
    }

    const mappedRows = ticketBody.map((row, index) => {
        return <BillingRow
            index={index}
            row={row}
            editRow={editRow}
        />
    })

    const mappedjobInfo = ticketBody.map((row, index) => {
        return (
            <li>
                <span className='inputItem'> item</span> {index + 1}, <span className='inputItem'> QTY </span>: {row.qty}, <span className='inputItem'>length or DIA</span>: {row.length},
                <span className='inputItem'> Depth </span>: {row.depth}, <span className='inputItem'>Work code</span>: {row.workCode}, <span className='inputItem'>Discription / Equipment used</span>:
                {row.equipUsed}, <span className='inputItem'>Amount</span>: {row.amount}
            </li>
        )
    })

    return (
        <div id='job-ticket'>
            <Alert color='success' isOpen={show}>You have submitted a job ticket!</Alert>
            <Form>
                <Row>
                    <Col md={4} />
                    <Col md={3}>
                        <FormGroup>
                            <Label for="employeeList">
                                Employee Name:
                            </Label>
                            <Input
                                id="employeeName"
                                name="worker"
                                placeholder="Who are you?"
                                type="select"
                                onChange={(event) => handleChange(event)}
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
                        <Input name='truckNum' type='number' onChange={(event) => handleChange(event)}></Input>
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
                                name="billTo"
                                placeholder="Billing name"
                                type="text"
                                onChange={(event) => handleChange(event)}
                            ></Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <p>Other CA men on the job:</p>
                            <Label for='rilyn'>Rilyn :</Label>
                            <Input
                                value='Rilyn'
                                name="otherWorkers"
                                type="checkbox"
                                onChange={(event) => handleChange(event)}
                            >
                            </Input>
                            <Label for='kyle'>Kyle :</Label>
                            <Input
                                value='Kyle'
                                name="otherWorkers"
                                type="checkbox"
                                onChange={(event) => handleChange(event)}
                            >
                            </Input>
                            <Label for='pat'>Pat :</Label>
                            <Input
                                value='Pat'
                                name="otherWorkers"
                                type="checkbox"
                                onChange={(event) => handleChange(event)}
                            >
                            </Input>
                            <Label for='gordon'>Gordon :</Label>
                            <Input
                                value='Gordon'
                                name="otherWorkers"
                                type="checkbox"
                                onChange={(event) => handleChange(event)}
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
                                name="date"
                                type="date"
                                onChange={(event) => handleChange(event)}
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
                                name="address"
                                placeholder="Enter job address"
                                type="text"
                                onChange={(event) => handleChange(event)}
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
            </Form>

            <Button onClick={(event) => addRow()}> Add row </Button>
            <Button onClick={toggleModal} >continue</Button>

            <Modal isOpen={modal}>
                <ModalHeader toggle={toggleModal}>Signature form</ModalHeader>
                <ModalBody>
                    <sction id='workerInput'>
                        <h2>Job information:</h2>
                        <ul id='inputContainer'>
                            <li><span className='inputItem'>Who worked</span>:{value['worker']}</li>
                            <li><span className='inputItem'>Bill to</span>:{value['billTo']}</li>
                            <li><span className='inputItem'>Other CA men on the job</span>:{value['otherWorkers']}</li>
                            <li><span className='inputItem'>Truck number</span>:{value['truckNum']}</li>
                            <li><span className='inputItem'>Date</span>:{value['date']}</li>
                            <li><span className='inputItem'>Address</span>:{value['address']}</li>
                            <li><span className='inputItem'>Work completed</span>:
                                <ul>
                                    {mappedjobInfo}
                                </ul>
                            </li>
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
                            <li>7. If for any reason are unable to work due to no fault of our own, then we must charge for stand-by time.</li>
                            <li>8. Contractor is responsible for covering holes created by sawing and drilling.</li>
                            <li>9. In the event of non-payment of any amount, when due, purchaser agrees to pay all collection costs including reasonable attorney fees.</li>
                        </ul>
                    </section>

                    <Label for="confirmation">
                        I have reviewed the above information and confirm the information is correct:
                    </Label>
                    <SignatureCanvas penColor='black' id='confirmation'
                        canvasProps={{ width: 425, height: 200, className: 'sigCanvas' }} />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleSubmit} type='submit'>Submit</Button>
                </ModalFooter>
            </Modal>

        </div>

    );
}

export default JobTIcket;