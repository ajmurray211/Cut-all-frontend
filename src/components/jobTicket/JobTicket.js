import './jobTicket.css'
import Multiselect from 'multiselect-react-dropdown';
import FormGroupMUI from '@mui/material/FormGroup'
import { Alert, Form, Row, Col, Label, FormGroup, Input, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Switch, FormControlLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import BillingRow from './BillingRow';
import TimeSheet from './TimeSheet';
import axios from 'axios';
import { useModal } from '../../hooks/useModal';
import { useFindTimeDiff } from '../../hooks/useFindTimeDiff';
import { useWorkerContext } from '../../hooks/useWorkerContext';
import { PDFViewer } from '@react-pdf/renderer';
import PdfRenderer from '../PdfRenderer';
import { useAuthContext } from '../../hooks/useAuthContext';
import useAlert from '../../hooks/useAlert';

const JobTIcket = (props) => {
    const { API_URL, workerList } = useWorkerContext()
    const { user } = useAuthContext()
    const { isOpen, toggleModal } = useModal();
    const { isOpen: isConfimOpen, toggleModal: toggleConfim } = useModal();
    const { alertType, message, isOpen: postIsOpen, showAlert } = useAlert()
    const { findTimes } = useFindTimeDiff()
    const [ticketBody, setTicketBody] = useState([])
    const [value, setValue] = useState({
        worker: user ? user.firstName : '',
        billTo: '',
        otherWorkers: [],
        truckNum: user ? parseInt(user.truckNumber) : 0,
        date: '',
        address: '',
        jobInfo: [],
        handSawing: null,
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
        milage: 0,
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
        workAdded: false,
    })
    const [serialNumsList, setSerialNumsList] = useState([])
    let workersList = workerList.flatMap((worker) => (worker.firstName !== user?.firstName) ? worker.firstName : []);

    useEffect(() => {
        axios
            .get(`${API_URL}ticket/topTicketNum`)
            .then((res) => {
                let number = res.data.data.ticketNum + 1
                setValue(values => ({
                    ...values,
                    ticketNum: number
                }))
            })
    }, [])

    useEffect(() => {
        axios
            .get(`${API_URL}serialNum/numsList`)
            .then((res) => {
                res.data.data.map((num) => {
                    if (!serialNumsList.includes(num.serialNum)) {
                        let copy = serialNumsList
                        copy.push(num.serialNum)
                        setSerialNumsList(copy)
                    }
                })
            })
    }, [])

    const handleDataCompile = () => {
        let totalMins = 0
        let total = '-'
        if (value.jobTotal) {
            value.travelTotal != null ? totalMins = value.jobTotal.mins + value.travelTotal.mins : totalMins = value.jobTotal.mins
            let hr = Math.floor(totalMins / 60);
            let min = totalMins % 60
            total = `${hr}hrs. ${min}mins.`
        }
        setValue(values => ({
            ...values,
            jobInfo: ticketBody,
            totalPaidTime: total
        }))
    }

    const postTicket = async () => {
        try {
            await axios.post(`${API_URL}ticket`, {
                ...value
            })
                .then(res => {
                    console.log('hit alert', res)
                    showAlert(res.status, res.data.message)
                    setTimeout(() => {
                        toggleModal()
                        window.location.reload()
                    }, 8000);
                })
            for (const data of value.jobInfo) {
                let newDepth = data.depth;
                let newLength = data.length;
                if (data.qty) {
                    newDepth = parseInt(data.qty) * parseInt(data.depth);
                    newLength = parseInt(data.qty) * parseInt(data.length);
                }

                const { data: { data: [serialNumData] } } = await axios.get(`${API_URL}serialNum/${data.serialNum}`);

                const { history } = serialNumData;

                const duplicateDate = history.find(item => item.date === value.date);

                if (duplicateDate) {
                    const updatedHistory = history.map(item => {
                        if (item.date === duplicateDate.date) {
                            return {
                                ...item,
                                runLength: parseInt(item.runLength) + parseInt(newLength),
                                depth: parseInt(item.depth) + parseInt(newDepth),
                            };
                        }
                        return item;
                    });

                    await axios.put(`${API_URL}serialNum/update/1`, {
                        serialNum: data.serialNum,
                        history: updatedHistory
                    });
                    console.log('existing', duplicateDate, data, updatedHistory);
                } else {
                    await axios.put(`${API_URL}serialNum/update/2`, {
                        serialNum: data.serialNum,
                        assignedTo: value.worker,
                        history: [
                            {
                                runLength: newLength,
                                depth: newDepth,
                                date: value.date
                            }
                        ]
                    });
                    console.log('new date');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelect = (selectedList) => {
        setValue((values) => ({
            ...values,
            otherWorkers: selectedList
        }))
    };

    const handleRemove = (selectedList) => {
        console.log(selectedList)
        const updatedHelperValues = { ...value['helperTimes'] };
        for (const name in updatedHelperValues) {
            console.log(name)
            if (!selectedList.includes(name)) {
                delete updatedHelperValues[name];
            }
        }
        console.log(updatedHelperValues)

        setValue((values) => ({
            ...values,
            otherWorkers: selectedList,
            helperTimes: updatedHelperValues,
        }));
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

    const deleteRow = (index) => {
        let newBody = [...ticketBody]
        newBody.splice(index, 1);
        setTicketBody(newBody);
    };

    const mappedRows = ticketBody.map((row, index) => {
        return <BillingRow
            ticketBody={ticketBody}
            key={index}
            index={index}
            serialNumsList={serialNumsList}
            editRow={editRow}
            deleteRow={deleteRow}
        />
    })

    return (
        <div id='job-ticket'>
            <Form>
                <Row>
                    <Col md={2} />
                    <Col md={2}>
                        <FormGroup>
                            <Label for="employeeList">
                                Employee Name:
                            </Label>
                            <Input
                                id="employeeName"
                                name="worker"
                                placeholder="Who are you?"
                                type="text"
                                value={value.worker}
                                onChange={(event) => handleChange(event)}
                                list='workers'
                                autoComplete="on"
                            >

                            </Input>
                            <datalist id="workers">
                                {workersList.map((worker) => (
                                    <option value={worker} key={worker} />
                                ))}
                            </datalist>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <Label>Milage:</Label>
                        <Input value={value.milage} name='milage' type='number' min={0} onChange={(event) => handleChange(event)}></Input>
                    </Col>
                    <Col md={2}>
                        <Label>Truck Number:</Label>
                        <Input value={value.truckNum} name='truckNum' type='number' min={0} onChange={(event) => handleChange(event)}></Input>
                    </Col>
                    <Col md={2}>
                        <Label>Ticket Number:</Label>
                        <Input name='ticketNum' type='number' defaultValue={value.ticketNum} min={0} onChange={(event) => handleChange(event)}></Input>
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

                    <Col md={4}>
                        <p>Other CA men on the job</p>
                        <Multiselect
                            showArrow
                            isObject={false}
                            options={workersList}
                            selectedValues={value['otherWorkers']}
                            onSelect={handleSelect}
                            onRemove={handleRemove}
                            closeOnSelect
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
                    <Col md={2} />
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
                    <Col md={3}>
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

            <Modal toggle={toggleModal} fullscreen className='detailsModal' isOpen={isOpen} size='lg'>
                <ModalHeader toggle={toggleModal}>Confirmation for ticket {value.ticketNum}</ModalHeader>
                <ModalBody id='jobDetails'>
                    <Alert color={alertType} isOpen={postIsOpen}>{message}</Alert>

                    <PDFViewer style={{ width: '100%', height: '100%' }}>
                        <PdfRenderer value={value} />
                    </PDFViewer>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={postTicket} type='submit'>Submit</Button>
                </ModalFooter>
            </Modal>
            <Modal fullscreen className='confimModal' isOpen={isConfimOpen} size='lg'>
                <ModalHeader toggle={toggleConfim}>Signature form for ticket {value.ticketNum}</ModalHeader>
                <ModalBody id='jobDetails'>
                    <FormGroup>
                        <Label for='CC'>Contractor email:</Label>
                        <Input value={value.CC} id='CC' type='text' name='CC' onChange={handleChange} />
                        <br></br>
                        <Label for='CC'>PO number:</Label>
                        <Input value={value.poNum} id='CC' type='text' name='poNum' onChange={handleChange} />
                        <br></br>
                        <Label for='CC'>Job number:</Label>
                        <Input value={value.jobNum} id='CC' type='text' name='jobNum' onChange={handleChange} />
                        <br></br>
                        <Label for="confirmationName">
                            Typing your name acts as an e-signature:
                        </Label>
                        <Input value={value.confirmationName} type='text' name='confirmationName' id='confirmationName' onChange={handleChange} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button disabled={!value.confirmationName} onClick={() => {
                        handleDataCompile()
                        toggleModal()
                        toggleConfim()
                    }} >Continue</Button>
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
                </tbody>
            </Table>
            <section>
                <h2>Other job details:</h2>
                <textarea id='detailsArea' name='detailsNotCovered' onChange={handleChange} />
            </section>

            <Button onClick={toggleConfim} >continue</Button>
        </div>
    );
}
export default JobTIcket;