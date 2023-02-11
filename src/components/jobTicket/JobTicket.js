import './jobTicket.css'
import Multiselect from 'multiselect-react-dropdown';
import FormGroupMUI from '@mui/material/FormGroup'
import { Alert, Form, Row, Col, Label, FormGroup, Input, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Switch, FormControlLabel, FormLabel, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import BillingRow from './BillingRow';
import JobDetails from './JobDetails';
import TimeSheet from './TimeSheet';
import axios from 'axios';

const JobTIcket = (props) => {
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    const [ticketBody, setTicketBody] = useState([])
    const [status, setStatus] = useState('');
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const [value, setValue] = useState({
        email: 'murray.aj.murray@gmail.com',
        worker: '',
        billTo: '',
        otherWorkers: [],
        truckNum: '',
        date: '',
        address: '',
        jobInfoHTML: null,
        jobInfo: [],
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
        confirmationName: null,
        CC: null,
        jobNum: null,
        poNum: null,
        milage: null,
        totalPaidTime: null,
        travelBegin: null,
        travelEnd: null,
        travelTotal: null,
        jobBegin: null,
        jobEnd: null,
        jobTotal: null,
        helperTimes: null,
        ticketNum: null,
        jobPerQuote: true,
        workAdded: false
    })
    let infoToHTML = []
    let workersList = ['Rilyn', 'Kyle', 'Pat', 'Gordon', 'Other']

    // set the current ticket number that will be logged when submitted
    useEffect(() => {
        axios
            .get(`${props.API_URL}ticket/topTicketNum`)
            .then((res) => {
                console.log(value)
                // let number = res.data[0].ticketNum !== null ? number = res.data[0].ticketNum + 1 : number = 1
                let number = res.data[0].ticketNum + 1
                setValue(values => ({
                    ...values,
                    ticketNum: number
                }))
            })
    }, [])

    // add the html varibles to values variable for emailing 
    const compileHTML = () => {
        let totalMins = 0
        let total = '-'
        let combined = infoToHTML.join(' ')
        if (value.jobTotal) {
            value.travelTotal != null ? totalMins = value.jobTotal.mins + value.travelTotal.mins : totalMins = value.jobTotal.mins
            let hr = Math.floor(totalMins / 60);
            let min = totalMins % 60
            total = `${hr}hrs. ${min}mins.`
        }

        setValue(values => ({
            ...values,
            jobInfoHTML: `<table style="border-collapse: collapse; width: 96.2382%; border-width: 1px; border-color: rgb(0, 0, 0);" border="1"><colgroup><col style="width:4%;"><col style="width: 4%;"><col style="width:7%;"><col style="width:4%;"><col style="width:7%;"><col style="width:4%;"></colgroup>
            <thead> 
            <tr> <th>QTY</th> <th>Length/DIA</th> <th>Depth</th> <th>Work Code</th> <th>Description</th> <th>Blade serial #</th> </tr>
            </thead>
            <tbody> ${combined} </tbody>
            </table>`,
            jobInfo: ticketBody,
            totalPaidTime: total
        }))
        console.log('compile html', value)
    }

    // sends the information in an email 
    const handleSubmit = (event) => {
        event.preventDefault()
        toggleModal()
        console.log(value, 'before email')
        postTicket()
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

    const postTicket = () => {
        axios.post(`${props.API_URL}ticket`, {
            ...value
        })
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
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
    const findTimes = (start, end) => {
        let d1 = Date.parse(`2023-01-15T${start}:00.000`);
        let d2 = Date.parse(`2023-01-15T${end}:00.000`);
        const milliseconds = Math.abs(d1 - d2);
        const secs = Math.floor(milliseconds / 1000);
        const mins = Math.floor(secs / 60);
        const minutes = mins % 60
        const hours = Math.floor(mins / 60);
        return {
            mins: mins,
            hours: hours,
            minutes: minutes,
            combined: `${hours}hr. ${minutes}min.`
        }
    }

    const handleSelect = (selectedList) => {
        setValue((values) => ({
            ...values,
            otherWorkers: selectedList
        }))
    };

    const handleRemove = (selectedList) => {
        setValue((values) => ({
            ...values,
            otherWorkers: selectedList
        }))
    };

    const handleChange = (e) => {
        const changeVal = (total, field) => {
            setValue(values => ({
                ...values,
                [e.target.name]: e.target.value,
                [field]: total,
            }))
        }

        if (e.target.name === 'jobEnd') {
            let total = findTimes(value['jobBegin'], e.target.value)
            changeVal(total, 'jobTotal')
        } else if (e.target.name === 'travelEnd') {
            let total = findTimes(value['travelBegin'], e.target.value)
            changeVal(total, 'travelTotal')
        } else if (e.target.name === 'otherWorkers') {
            let selected = [...e.target.selectedOptions].map(i => i.value)
            setValue(values => ({
                ...values,
                [e.target.name]: selected
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
    }

    // changes values of the job row when the user changes and imput field 
    const editRow = (i, key, val) => {
        let copy = [...ticketBody]
        copy[i][key] = val
        setTicketBody(copy)
    }

    // allows user to add more rows 
    const addRow = () => {
        let row = {
            'qty': '',
            'length': '',
            'depth': '',
            'workCode': '',
            'equipUsed': '',
            'serialNum': '',
        }
        let copy = [...ticketBody, row]
        setTicketBody(copy)
    }

    const mappedRows = ticketBody.map((row, index) => {
        let line = (`<tr> <td"> ${row.qty} </td> <td"> ${row.length}</td> <td"> ${row.depth} </td> <td"> ${row.workCode} </td>  <td">${row.equipUsed} </td> <td">${row.serialNum}</td> </tr>`)
        infoToHTML.push(line)
        return <BillingRow
            index={index}
            row={row}
            editRow={editRow}
        />
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
                        <Input name='milage' type='number' min={0} onChange={(event) => handleChange(event)}></Input>
                    </Col>
                    <Col md={2}>
                        <Label>Truck Number:</Label>
                        <Input name='truckNum' type='number' min={0} onChange={(event) => handleChange(event)}></Input>
                    </Col>
                    <Col md={2}>
                        <Label>Ticket Number:</Label>
                        <Input name='ticketNum' type='number' defaultValue={value.ticketNum} min={0} onChange={(event) => handleChange(event)}></Input>
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
                    <Col md={4}>
                        <p>Other CA men on the job</p>
                        <Multiselect
                            showArrow
                            isObject={false}
                            options={workersList}
                            selectedValues={value['otherWorkers']}
                            onSelect={handleSelect}
                            onRemove={handleRemove}
                        />
                    </Col>
                </Row>

                <Row>
                    <TimeSheet
                        className={value['otherWorkers'].length == 0 ? 'hide' : null}
                        namesList={value['otherWorkers']}
                        value={value}
                        setValue={setValue}
                        findTimes={findTimes}
                    />
                </Row>
                <Row>
                    <Col md={3} />
                    <Col md={3}>
                        <FormGroup>
                            <Label for="date">
                                Date:
                            </Label>
                            <Input
                                defaultValue={new Date()}
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
                            <th>Depth (in.)</th>
                            <th>Work code</th>
                            <th>Discription</th>
                            <th>Serial # of blade </th>
                        </tr>
                    </thead>
                    <tbody id='infoHolder'>
                        {mappedRows}
                    </tbody>
                </Table>
            </Form>

            <Button onClick={addRow}> Add row </Button>

            <Modal isOpen={modal} size='lg'>
                <ModalHeader toggle={toggleModal}>Signature form for ticket {value.ticketNum}</ModalHeader>
                <ModalBody id='jobDetails'>
                    <JobDetails
                        value={value}
                        ticketBody={ticketBody}
                        setValue={setValue}
                        handleChange={handleChange}
                        findTimes={findTimes}
                    />

                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleSubmit} type='submit'>Submit</Button>
                </ModalFooter>
            </Modal>

            <Table bordered striped responsive hover >
                <caption >
                    <h3>Time table</h3>
                </caption>
                <tbody>
                    <tr>
                        <th>Begin travel</th>
                        <td><Input type='time' name='travelBegin' onChange={handleChange}></Input></td>
                    </tr>
                    <tr>
                        <th>End travel</th>
                        <td><Input type='time' name='travelEnd' onChange={handleChange}></Input></td>
                    </tr>
                    <tr>
                        <th>Begin Job</th>
                        <td><Input type='time' name='jobBegin' onChange={handleChange}></Input></td>
                    </tr>
                    <tr>
                        <th>End job</th>
                        <td><Input type='time' name='jobEnd' onChange={handleChange}></Input></td>
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
                        <th><input type='number' min={0} name='wallSawing' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Hand Sawing</th>
                        <th><input type='number' min={0} name='handSawing' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Core drilling</th>
                        <th><input type='number' min={0} name='coreDrilling' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Slab Saw</th>
                        <th><input type='number' min={0} name='slabSaw' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Water control</th>
                        <th><input type='number' min={0} name='waterControl' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>J/ Hammer chipping</th>
                        <th><input type='number' min={0} name='hammerChipping' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Power Break/ Mini</th>
                        <th><input type='number' min={0} name='powerBreak' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Load Excevate</th>
                        <th><input type='number' min={0} name='loadExcevate' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Haul</th>
                        <th><input type='number' min={0} name='haul' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Hand Labor</th>
                        <th><input type='number' min={0} name='handLabor' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Dump Yards</th>
                        <th><input type='number' min={0} name='dumpYards' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Release</th>
                        <th><input type='number' min={0} name='release' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Standby</th>
                        <th><input type='number' min={0} name='standby' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Other</th>
                        <th><input type='number' min={0} name='other' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Down Time</th>
                        <th><input type='number' min={0} name='downTime' onChange={handleChange}></input></th>
                    </tr>
                    <tr>
                        <th>Mini breaker</th>
                        <th><input type='number' min={0} name='downTime' onChange={handleChange}></input></th>
                    </tr>
                </tbody>
            </Table>
            <section>
                <h2>Other job details:</h2>
                <textarea id='detailsArea' name='detailsNotCovered' onChange={handleChange} />
            </section>
            <FormGroupMUI row>
                <FormControlLabel
                    labelPlacement="top"
                    control={<Switch name='jobPerQuote' defaultChecked onClick={() => { setValue({ ...value, jobPerQuote: !value.jobPerQuote }) }} />}
                    label="Job per Quote"
                />
                <FormControlLabel
                    labelPlacement="top"
                    control={<Switch name='workAdded' onClick={() => { setValue({ ...value, workAdded: !value.workAdded }) }} />}
                    label="Work added"
                />
            </FormGroupMUI>

            <Button onClick={() => {
                toggleModal()
                compileHTML()
            }} >continue</Button>
        </div>
    );
}
export default JobTIcket;