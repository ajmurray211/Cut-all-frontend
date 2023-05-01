import { Form, Row, Col, FormGroup, Label, Input, Alert, Button, ModalBody, Modal, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PartInfo from './PartInfo';
import { useDataFetcher } from "../../hooks/useDataFetcher";
import { useModal } from '../../hooks/useModal';
import { useWorkerContext } from '../../hooks/useWorkerContext';

const SerialNums = (props) => {
    const { API_URL, workerlist } = useWorkerContext()
    const { getData: getToolName, data: toolName, error1, loading1 } = useDataFetcher();
    const { getData: getSerialNumbers, data: serialNumbers, error2, loading2 } = useDataFetcher();
    const { isOpen: modal, toggleModal } = useModal();
    const { isOpen: assignModal, toggleModal: toggleAssignModal } = useModal();
    const [submitted, setSubmitted] = useState(false)
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const [status, setStatus] = useState(null)
    const [coreNums, setCoreNums] = useState([])
    const [handNums, setHandNums] = useState([])
    const [wallNums, setWallNums] = useState([])
    const [asphltNums, setAsphltNums] = useState([])
    const [concreteNums, setConcreteNums] = useState([])
    const [otherNums, setOtherNums] = useState([])
    const [validInput, setValidInput] = useState(false)
    const [assignedToName, setAssignToName] = useState('')
    const [assignedToNumber, setAssignToNumber] = useState('')
    const [newSerialNumberData, setNewSerialNumberData] = useState({
        manufacture: null,
        name: null,
        specNum: null,
        serialNum: null
    })
    let currentSerialNums = []

    const validateInput = (val) => {
        setValidInput(currentSerialNums.includes(val))
    }

    useEffect(() => {
        getToolName(`${API_URL}parts/?format=json`)
        getSerialNumbers(`${API_URL}serialNum`)
    }, [])

    const mapParts = toolName.map((tool) => {
        return (
            <option key={tool.id}>{tool.name}</option>
        )
    })

    useEffect(() => {
        if (status === 201) {
            setTimeout(() => {
                setStatus('');
                setSuccess(false)
                toggleModal()
                getSerialNumbers(`${API_URL}serialNum`)
                setSubmitted(false)
            }, 5000);
        }
        else if (status === 'Error') {
            setTimeout(() => {
                setStatus('');
                setFail(false)
                toggleModal()
                getSerialNumbers(`${API_URL}serialNum`)
                setSubmitted(false)
            }, 5000);
        }
    }, [status]);

    const splitSerialNums = (num) => {
        switch (true) {
            case num.name.toLocaleLowerCase().includes('concrete'):
                if (!concreteNums.find(i => i.id === num.id)) {
                    setConcreteNums(data => [...data, num]);
                }
                break;
            case num.name.toLocaleLowerCase().includes('asphalt'):
                if (!asphltNums.find(i => i.id === num.id)) {
                    setAsphltNums(data => [...data, num]);
                }
                break;
            case num.name.toLocaleLowerCase().includes('wall '):
                if (!wallNums.find(i => i.id === num.id)) {
                    setWallNums(data => [...data, num]);
                }
                break;
            case num.name.toLocaleLowerCase().includes('hand'):
                if (!handNums.find(i => i.id === num.id)) {
                    setHandNums(data => [...data, num]);
                }
                break;
            case num.name.toLocaleLowerCase().includes('bit'):
                if (!coreNums.find(i => i.id === num.id)) {
                    setCoreNums(data => [...data, num]);
                }
                break;
            case num.name.toLocaleLowerCase().includes('consumable'):
                break;
            default:
                if (!otherNums.find(i => i.id === num.id)) {
                    setOtherNums(data => [...data, num]);
                }
                break;
        }
    }

    useEffect(() => {
        serialNumbers.forEach((num) => {
            splitSerialNums(num)
        })
    }, [serialNumbers]);

    const mappedSerialNums = (who) => {
        let mapped = who.map((number) => {
            currentSerialNums.push(number.serialNum)
            return (
                <PartInfo
                    number={number}
                />
            )
        })
        return mapped
    }


    const handleChange = (e) => {
        if (e.target.name == 'serialNum') {
            validateInput(e.target.value)
        }
        setNewSerialNumberData(data => ({
            ...data,
            [e.target.name]: e.target.value
        }))
    }

    const handlePost = () => {
        setSubmitted(true)
        axios.post(`${API_URL}serialNum`, newSerialNumberData)
            .then(res => {
                console.log(res)
                setStatus(res.status)
                setSuccess(true)
            })
            .catch(err => {
                setStatus(err.text)
                setFail(true)
            });
    }

    const handleAssign = async () => {
        await axios.put((`${API_URL}serialNum/update/2`), {
            assignedTo: assignedToName,
            serialNum: assignedToNumber
        })
            .then(res => console.log('response from assign', res))
            .catch(err => console.log('Error', err))

        toggleAssignModal()
        setAssignToName('')
        setAssignToNumber('')
        getSerialNumbers(`${API_URL}serialNum`)

    }

    return (
        <div>
            <div className='modalContainer'>
                <section>
                    <section className="d-flex p-5 justify-content-center" id="filter-bar">
                        <Button className="me-2" id="filter-item" color="danger" onClick={toggleModal}>
                            Add Item
                        </Button>
                    </section>

                    <Modal isOpen={modal} toggle={toggleModal} size='lg' centered>
                        <ModalHeader toggle={toggleModal}>Serial number addition</ModalHeader>
                        <ModalBody>
                            <Alert color='success' isOpen={success}>You have created a serial number!</Alert>
                            <Alert color='danger' isOpen={fail}>There was a problem with the submission!</Alert>

                            <Form>
                                <Row>
                                    <Col md={1} />
                                    <Col md={5}>
                                        <FormGroup>
                                            <Label for="manufacture">
                                                Manufactures:
                                            </Label>
                                            <Input
                                                id="manufacture"
                                                name="manufacture"
                                                type="select"
                                                onChange={handleChange}
                                            >
                                                <option></option>
                                                <option >Dixi diamond</option>
                                                <option>Con cut</option>
                                                <option>Blades direct</option>
                                                <option>Pro Link</option>
                                                <option>Hilti</option>
                                                <option>ICF</option>
                                                <option>Cut and core store</option>
                                                <option>Four core biz</option>
                                                <option>Diamond product</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col md={5}>
                                        <FormGroup>
                                            <Label for="toolList"> Tool: </Label>
                                            <Input
                                                id="toolList"
                                                name="name"
                                                type="select"
                                                onChange={handleChange}
                                            >
                                                <option></option>
                                                {mapParts}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col md={2} />
                                </Row>

                                <Row>
                                    <Col md={1} />
                                    <Col md={5}>
                                        <FormGroup>
                                            <Label for="specNum"> Spec number or serial: </Label>
                                            <Input
                                                id="specNum"
                                                name="specNum"
                                                placeholder="What is the serial or spec number?"
                                                type="text"
                                                onChange={handleChange}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={5}>
                                        <FormGroup >
                                            <Label for="serialNum">
                                                Cutall serial #
                                            </Label>
                                            <Input
                                                onChange={handleChange}
                                                value={newSerialNumberData.serialNum}
                                                invalid={validInput}
                                                id="serialNum"
                                                name="serialNum"
                                                type='text'
                                                placeholder='New cutall serial number'
                                            />
                                            <datalist id="serialNum">
                                                {currentSerialNums.map((serialNum) => (
                                                    <option value={serialNum} key={serialNum} />
                                                ))}
                                            </datalist>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={handlePost} type='submit' color='primary' disabled={validInput || submitted}>
                                Submit
                            </Button>
                        </ModalFooter>
                    </Modal>
                </section>

                <section>
                    <section className="d-flex p-5 justify-content-center" id="filter-bar">
                        <Button className="me-2" id="filter-item" color="danger" onClick={toggleAssignModal}>
                            Assign Number
                        </Button>
                    </section>

                    <Modal isOpen={assignModal} toggle={() => {
                        toggleAssignModal()
                        setAssignToName('')
                        setAssignToNumber('')
                    }} size='lg' centered>
                        <ModalHeader toggle={() => {
                            toggleAssignModal()
                            setAssignToName('')
                            setAssignToNumber('')
                        }}>Assign serial Number</ModalHeader>
                        <ModalBody>
                            <Alert color='success' isOpen={success}>You have created a serial number!</Alert>
                            <Alert color='danger' isOpen={fail}>There was a problem with the submission!</Alert>

                            <Form>
                                <Label for="assignToName">
                                    Name:
                                </Label>
                                <Input
                                    onChange={(e) => setAssignToName(e.target.value)}
                                    value={assignedToName}
                                    invalid={validInput}
                                    id="assignToName"
                                    name="assignToName"
                                    type='text'
                                    placeholder='Who is the blade going to?'
                                />
                                <Label for="assignToName">
                                    Serial Number:
                                </Label>
                                <Input
                                    onChange={(e) => setAssignToNumber(e.target.value)}
                                    value={assignedToNumber}
                                    invalid={validInput}
                                    id="serialNum"
                                    name="serialNum"
                                    type='text'
                                    list="serialNum"
                                    autoComplete="on"
                                    placeholder='New cutall serial number'
                                />
                                <datalist id="serialNums">
                                    {currentSerialNums.map((serialNum) => (
                                        <option value={serialNum} key={serialNum} />
                                    ))}
                                </datalist>
                            </Form>
                        </ModalBody>

                        <ModalFooter>
                            <Button onClick={handleAssign} type='submit' color='primary' disabled={validInput || submitted}>
                                Submit
                            </Button>
                        </ModalFooter>
                    </Modal>
                </section>
            </div>

            <section className='splitNumConatiner'>
                <section className='nums'>
                    <h2>Wall Saw Serials</h2>
                    {wallNums.length !== 0 ? mappedSerialNums(wallNums) : 'No current data stored'}
                </section>
                <section className='nums'>
                    <h2>Hand Saw Serials</h2>
                    {handNums.length != 0 ? mappedSerialNums(handNums) : 'No current data stored'}
                </section>
                <section className='nums'>
                    <h2>Asphalt Saw Serials</h2>
                    {asphltNums.length !== 0 ? mappedSerialNums(asphltNums) : 'No current data stored'}
                </section>
                <section className='nums'>
                    <h2>Concrete Saw Serials</h2>
                    {concreteNums.length !== 0 ? mappedSerialNums(concreteNums) : 'No current data stored'}
                </section>
                <section className='nums'>
                    <h2>Core Drill Serials</h2>
                    {coreNums.length !== 0 ? mappedSerialNums(coreNums) : 'No current data stored'}
                </section>
                <section className='nums'>
                    <h2>Other Serials</h2>
                    {otherNums.length !== 0 ? mappedSerialNums(otherNums) : 'No current data stored'}
                </section>
            </section>
        </div >
    );
}

export default SerialNums;