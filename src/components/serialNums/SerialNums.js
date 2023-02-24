import { Card, CardBody, Collapse, Form, Row, Col, FormGroup, Label, Input, Alert, Button, ModalBody, Modal, ModalFooter, ModalHeader, ListGroup, ListGroupItem } from 'reactstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PartInfo from './PartInfo';

const SerialNums = (props) => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [toolName, setToolName] = useState([])
    const [serialNumbers, setSerialNumbers] = useState([])
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const [status, setStatus] = useState(null)
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal((prevState) => !prevState);
    const [coreNums, setCoreNums] = useState([])
    const [handNums, setHandNums] = useState([])
    const [wallNums, setWallNums] = useState([])
    const [asphltNums, setAsphltNums] = useState([])
    const [concreteNums, setConcreteNums] = useState([])
    const [otherNums, setOtherNums] = useState([])
    const [validInput, setValidInput] = useState(false)
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

    const getData = (url, where) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => where(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getData(`${props.API_URL}parts/?format=json`, setToolName)
        getData(`${props.API_URL}serialNum`, setSerialNumbers)
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
                getData(`${props.API_URL}serialNum`, setSerialNumbers)
            }, 5000);
        }
        else if (status === 'Error') {
            setTimeout(() => {
                setStatus('');
                setFail(false)
                toggleModal()
                getData(`${props.API_URL}serialNum`, setSerialNumbers)
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
            case num.name.toLocaleLowerCase().includes('core'):
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
        axios.post(`${props.API_URL}serialNum`, newSerialNumberData)
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

    return (
        <div>

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
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handlePost} type='submit' color='primary' disabled={validInput}>
                            Submit
                        </Button>
                    </ModalFooter>
                </Modal>
            </section>

            <section className='splitNumConatiner'>
                <section className='nums'>
                    <h2>Wall Saw Serials</h2>
                    {wallNums.length !== 0 ? mappedSerialNums(wallNums): 'No current data stored'}
                </section>
                <section className='nums'>
                    <h2>Hand Saw Serials</h2>
                    {handNums.length != 0 ? mappedSerialNums(handNums): 'No current data stored'}
                </section>
                <section className='nums'>
                    <h2>Asphalt Saw Serials</h2>
                    {asphltNums.length !== 0 ? mappedSerialNums(asphltNums): 'No current data stored'}
                </section>
                <section className='nums'>
                    <h2>Concrete Saw Serials</h2>
                    {concreteNums.length !== 0 ? mappedSerialNums(concreteNums): 'No current data stored'}
                </section>
                <section className='nums'>
                    <h2>Core Drill Serials</h2>
                    {coreNums.length !== 0 ? mappedSerialNums(coreNums) : 'No current data stored'}
                </section>
                <section className='nums'>
                    <h2>Other Serials</h2>
                    {otherNums.length !== 0 ? mappedSerialNums(otherNums): 'No current data stored'}
                </section>
            </section>
        </div>
    );
}

export default SerialNums;