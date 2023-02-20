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
    const [newSerialNumberData, setNewSerialNumberData] = useState({
        manufacture: null,
        tool: null,
        specNum: null,
        serialNum: null
    })

    const getData = (url, where) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => where(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('hit submit', newSerialNumberData)
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

    const mappedSerialNums = serialNumbers.map((number) => {
        return (
            <PartInfo
                number={number}
            />
        )
    })

    const handleChange = (e) => {
        setNewSerialNumberData(data => ({
            ...data,
            [e.target.name]: e.target.value
        }))
        console.log(newSerialNumberData)
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
                        <Alert color='success' isOpen={success}>You have drawn a part!</Alert>
                        <Alert color='danger' isOpen={fail}>There was a problem with the submission!</Alert>

                        <Form onSubmit={handleSubmit}>
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
                                            name="tool"
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
                                    <FormGroup onChange={handleChange}>
                                        <Label for="serialNum">
                                            Cutall serial #
                                        </Label>
                                        <Input
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
                        <Button onClick={handlePost} type='submit' color='primary'>
                            Submit
                        </Button>
                    </ModalFooter>
                </Modal>
            </section>

            <ListGroup>
                {mappedSerialNums}
            </ListGroup>
        </div>
    );
}

export default SerialNums;