import './jobTicket.css'
import { Alert, Form, Row, Col, Label, FormGroup, Input, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import BillingRow from './BillingRow';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import JobDetails from './JobDetails';

const JobTIcket = () => {
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    const [ticketBody, setTicketBody] = useState([])
    const [status, setStatus] = useState('');
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    let infoToHTML = []
    const [value, setValue] = useState({
        fullName: 'TEST',
        email: 'murray.aj.murray@gmail.com',
        worker: '',
        billTo: '',
        otherWorkers: '',
        truckNum: '',
        date: '',
        address: '',
        canvas: null,
        jobInfo: null,
        travelBegin: null,
        travelEnd: null,
        travelTotal: null,
        jobBegin: null,
        jobEnd: null,
        jobTotal: null,
        wallSawing: null,
        coreDrilling: null,
        slabSaw: null,
        waterControl: null,
        hammerChipping: null,
        powerBreak: null,
        loadExcevate: null,
        haul: null,
        handLabor: null,
        dumpYards: null,
        release: null,
        standby: null,
        other: null,
        downTime: null,
        timeChart: null,
        confirmationName: null,
        CC: null,
        jobNum: null,
        poNum: null,
        totalPaidTime: null,
        milage: null,
        helperTravelBegin: null,
        helperTravelEnd: null,
        helperTravelTotal: null,
        helperJobBegin: null,
        helperJobEnd: null,
        helperJobTotal: null,
    })

    let row = {
        'itemNum': '',
        'qty': '',
        'length': '',
        'depth': '',
        'workCode': '',
        'equipUsed': '',
    }

    // add the html varibles to values variable for emailing 
    const compileHTML = () => {
        let combined = infoToHTML.join(' ')
        let total = value['jobTotal'] + value['travelTotal'] + value['helperTravelTotal'] + value['helperJobTotal']
        setValue(values => ({
            ...values,
            jobInfo: `<table  style="border-collapse: collapse; width: 96.2382%; border-width: 1px; border-color: rgb(0, 0, 0);" border="1"><colgroup><col style="width:7%;"><col style="width: 4%;"><col style="width:7%;"><col style="width:4%;"><col style="width:7%;"><col style="width: 4%;"><col style="width:7%;"><col style="width: 4%;"><col style="width:7%;"><col style="width: 4%;"><col style="width:7%;"><col style="width: 4%;"><col style="width:7%;"><col style="width: 4%;"></colgroup>
            <tbody> ${combined} </tbody>
            </table>`,
            totalPaidTime: total
        }))
    }

    // sends the information in an email 
    const handleSubmit = (event) => {
        event.preventDefault()
        toggleModal()
        console.log(value, 'before email')
        emailjs.send('service_v3kf86l', 'template_mdw8cd7', value, 'E5-2RW9TeJyvAH3_r')
            .then((result) => {
                setStatus(result.text);
                setSuccess(true)
            }, (error) => {
                setFail(true)
                setStatus('Error')
                console.log(error);
            });
    }

    // resets variables changing when status changes 
    useEffect(() => {
        if (status === 'OK') {
            setTimeout(() => {
                console.log(value, 'after email')
                setStatus('');
                setSuccess(false)
            }, 5000);
        }
        else if (status === 'Error') {
            setTimeout(() => {
                setStatus('');
                setFail(false)
            }, 5000);
        }
    }, [status]);

    // saves values when inputs changed by user 
    const handleChange = (e) => {
        // console.log(e)
        const findMins = (field) => {
            let d1 = Date.parse(`2023-01-15T${value[field]}:00.000`);
            let d2 = Date.parse(`2023-01-15T${e.target.value}:00.000`);
            const milliseconds = Math.abs(d1 - d2);
            const secs = Math.floor(milliseconds / 1000);
            const mins = Math.floor(secs / 60);
            return mins
        }
        
        if (e.target.name === 'jobEnd') {
            let total = findMins('jobBegin')
            setValue(values => ({
                ...values,
                [e.target.name]: e.target.value,
                jobTotal: total,
            }))
        } else if (e.target.name === 'travelEnd') {
            let total = findMins('travelBegin')
            setValue(values => ({
                ...values,
                [e.target.name]: e.target.value,
                travelTotal: total,
            }))
        } else if (e.target.name === 'helperTravelEnd') {
            let total = findMins('helperTravelBegin')
            setValue(values => ({
                ...values,
                [e.target.name]: e.target.value,
                helperTravelTotal: total,
            }))
        } else if (e.target.name === 'helperJobEnd') {
            let total = findMins('helperJobBegin')
            setValue(values => ({
                ...values,
                [e.target.name]: e.target.value,
                helperJobTotal: total,
            }))
        } else if (e.target.name === 'date') {
            let splitDate = e.target.value.split('-')
            let year = splitDate.shift()
            splitDate.push(year)
            let reFormatedDate = splitDate.join('/')
            setValue(values => ({
                ...values,
                [e.target.name]: reFormatedDate
            }))
        } else {
            setValue(values => ({
                ...values,
                [e.target.name]: e.target.value
            }))
        }
        console.log(value)
    }

    // changes values of the job row when the user changes and imput field 
    const editRow = (i, key, val) => {
        let copy = [...ticketBody]
        copy[i][key] = val
        setTicketBody[i][key](val)
    }

    // allows user to add more rows 
    const addRow = () => {
        let copy = [...ticketBody, row]
        setTicketBody(copy)
    }

    const mappedRows = ticketBody.map((row, index) => {
        let copy = [...ticketBody]
        copy[index]['itemNum'] = index + 1
        let line = (`<tr> <td"> Quote item </td> <td"> ${row.itemNum} </td> <td"> QTY </td> <td"> ${row.qty} </td> <td"> length or DIA </td> <td"> ${row.length}</td> <td">Depth </td> <td"> ${row.depth} </td> <td"> Work code </td> <td"> ${row.workCode} </td> <td"> Description / Equipment used </td> <td">${row.equipUsed} </td></tr>`)
        infoToHTML.push(line)
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
                {row.equipUsed}
            </li>
        )
    })

    return (
        <div id='job-ticket'>
            <Alert color='success' isOpen={success}>You have submitted a job ticket!</Alert>
            <Alert color='danger' isOpen={fail}>There was a problem with the submission check all the data fields!</Alert>
            <Form>
                <Row>
                    <Col md={3} />
                    <Col md={2}>
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
                        <Label>Milage:</Label>
                        <Input name='milage' type='number' onChange={(event) => handleChange(event)}></Input>
                    </Col>
                    <Col md={2}>
                        <Label>Truck Number:</Label>
                        <Input name='truckNum' type='number' onChange={(event) => handleChange(event)}></Input>
                    </Col>
                </Row>
                <Row>
                    <Col md={3} />
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
                            <Label for="employeeList">
                                other CA men on the job:
                            </Label>
                            <Input
                                id="otherWorkers"
                                name="otherWorkers"
                                type="select"
                                onChange={(event) => handleChange(event)}
                            >
                                <option></option>
                                <option>Gordon</option>
                                <option>Pat</option>
                                <option>Kyle</option>
                                <option>Rilyn</option>
                                <option>other</option>
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md={3} />
                    <Col md={6} className={value['otherWorkers'] == '' ? 'hide' : null}>
                        <Table bordered striped responsive hover >
                            <caption >
                                <h3>Time table for other CA workers on the job</h3>
                            </caption>
                            <tbody>
                                <tr>
                                    <th>Begin travel</th>
                                    <td><Input type='time' name='helperTravelBegin' id='helper' onChange={handleChange}></Input></td>
                                </tr>
                                <tr>
                                    <th>End travel</th>
                                    <td><Input type='time' name='helperTravelEnd' id='helper' onChange={handleChange}></Input></td>
                                </tr>
                                <tr>
                                    <th>Begin Job</th>
                                    <td><Input type='time' name='helperJobBegin' id='helper' onChange={handleChange}></Input></td>
                                </tr>
                                <tr>
                                    <th>End job</th>
                                    <td><Input type='time' name='helperJobEnd' id='helper' onChange={handleChange}></Input></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col md={3} />
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
                    <Col md={3}>
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

                </Row>

                <Table bordered striped responsive>
                    <thead id='info'>
                        <tr>
                            <th>QTY</th>
                            <th>Length or DIA</th>
                            {/* <th>Serial # of blade </th> */}
                            <th>Depth (in.)</th>
                            <th>Work code</th>
                            <th>Discription / equipment used</th>
                        </tr>
                    </thead>
                    <tbody id='infoHolder'>
                        {mappedRows}
                    </tbody>
                </Table>
            </Form>

            <Button onClick={(event) => addRow()}> Add row </Button>

            <Modal isOpen={modal} size='lg'>
                <ModalHeader toggle={toggleModal}>Signature form</ModalHeader>
                <ModalBody id='jobDetails'>
                    <JobDetails
                        value={value}
                        mappedjobInfo={mappedjobInfo}
                        setValue={setValue}
                        infoToHTML={infoToHTML}
                        handleChange={handleChange}
                    />

                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleSubmit} type='submit'>Submit</Button>
                </ModalFooter>
            </Modal>

            <Table bordered striped responsive >
                <caption >
                    <h3>Time table</h3>
                </caption>
                <tbody>
                    <tr>
                        <th>Begin travel</th>
                        <th><Input type='time' name='travelBegin' onChange={handleChange}></Input></th>
                    </tr>
                    <tr>
                        <th>End travel</th>
                        <th><Input type='time' name='travelEnd' onChange={handleChange}></Input></th>
                    </tr>

                    <tr>
                        <th>Begin Job</th>
                        <th><Input type='time' name='jobBegin' onChange={handleChange}></Input></th>
                    </tr>
                    <tr>
                        <th>End job</th>
                        <th><Input type='time' name='jobEnd' onChange={handleChange}></Input></th>
                    </tr>

                </tbody>
            </Table>

            <Table bordered striped responsive >
                <thead>
                    <h2>Hours Spent (min)</h2>
                </thead>
                <tbody>
                    <tr>
                        <th>Wall Sawing</th>
                        <th><input type='number' step={15} min={0} name='wallSawing' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Hand Sawing</th>
                        <th><input type='number' step={15} min={0} name='handSawing' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Core drilling</th>
                        <th><input type='number' step={15} min={0} name='coreDrilling' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Slab Saw</th>
                        <th><input type='number' step={15} min={0} name='slabSaw' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Water control</th>
                        <th><input type='number' step={15} min={0} name='waterControl' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>J/ Hammer chipping</th>
                        <th><input type='number' step={15} min={0} name='hammerChipping' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Power Break/ Mini</th>
                        <th><input type='number' step={15} min={0} name='powerBreak' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Load Excevate</th>
                        <th><input type='number' step={15} min={0} name='loadExcevate' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Haul</th>
                        <th>
                            {/* <div> */}
                            <input type='number' step={15} min={0} name='haul' onChange={handleChange}></input>
                            {/* <div class="spinners">
                                <button class="spinner increment" onClick={(e) => console.log(e)}>&#9650;</button>
                                <button class="spinner decrement">&#9660;</button>
                            </div> */}
                        </th>
                    </tr>
                    <tr>
                        <th>Hand Labor</th>
                        <th><input type='number' step={15} min={0} name='handLabor' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Dump Yards</th>
                        <th><input type='number' step={15} min={0} name='dumpYards' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Release</th>
                        <th><input type='number' step={15} min={0} name='release' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Standby</th>
                        <th><input type='number' step={15} min={0} name='standby' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Other</th>
                        <th><input type='number' step={15} min={0} name='other' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Down Time</th>
                        <th><input type='number' step={15} min={0} name='downTime' onChange={handleChange}></input></th>
                    </tr>
                    {/* <tr>
                        <th>Mini breaker</th>
                        <th><input type='number' min={0} name='downTime' onChange={handleChange}></input></th>
                    </tr> */}
                </tbody>
            </Table>

            <Button onClick={() => {
                toggleModal()
                compileHTML()
            }} >continue</Button>
        </div>
    );
}
export default JobTIcket;