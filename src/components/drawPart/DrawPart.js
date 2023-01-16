import './drawPart.css'
import { Form, Row, Col, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';

const DrawPart = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [postName, setPostName] = useState('')
    const [amountTaken, setAmountTaken] = useState(null)
    const [serialNumber, setSerialNumber] = useState(null)
    const [dateTaken, setDateTaken] = useState(null)
    const [partName, setpartName] = useState(null)
    const [data, setData] = useState([])
    const [show, setShow] = useState(false)

    // const API_URL = 'https://fast-meadow-65226.herokuapp.com/'
    const API_URL = 'http://localhost:8080/'
    // const API_URL = 'http://127.0.0.1:8000/'

    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setData(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    // draws parts from stock and appends a worker to the draw list while updating the amount on hand
    const postData = async () => {
        const getPartNumber = await axios.get(`${API_URL}parts/search/?name=${partName}`)
        const partNumber = getPartNumber.data.data[0]._id
        const onHand = getPartNumber.data.data[0].onHand

        const postWorker = await axios.post(`${API_URL}workers`, {
            name: postName,
            amountTaken: amountTaken,
            dateTaken: dateTaken,
            partID: partNumber
        })

        const newOnHandCount = onHand - amountTaken

        const drawListAddition = await axios.put(`${API_URL}parts/${partNumber}`, {
            name: partName,
            onHand: newOnHandCount
        })

        if (drawListAddition.status == 201) {
            setShow(true)
        }

        const timer = setTimeout(() => setShow(false), 5000);
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        postData()
    }

    useEffect(() => {
        getData(`${API_URL}parts/?format=json`)
    }, [])

    const mapParts = data.map((part) => {
        return (
            <option key={part.id}>{part.name}</option>
        )
    })

    return (
        <section>
            <Alert color='success' isOpen={show}>You have drawn a part!</Alert>

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={3} />
                    <Col md={3}>
                        <FormGroup>
                            <Label for="employeeList">
                                Employee drawing part:
                            </Label>
                            <Input
                                id="employeeName"
                                name="select"
                                placeholder="Who are you?"
                                type="select"
                                onChange={(event) => setPostName(event.target.value)}
                            >
                                <option></option>
                                <option >Rilyn</option>
                                <option>Kyle</option>
                                <option>Pat</option>
                                <option>Gordon</option>
                                <option>Kim</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="partLabel"> Part: </Label>
                            <Input
                                id="partList"
                                name="select"
                                placeholder="What part are you taking?"
                                type="select"
                                onChange={(event) => setpartName(event.target.value)}
                            >
                                <option></option>
                                {mapParts}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={2} />
                </Row>

                <Row>
                    <Col md={4} />
                    <Col md={2}>
                        <FormGroup onChange={(event) => setAmountTaken(event.target.value)}>
                            <Label for="amount">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                name="amount"
                                type='number'
                                placeholder='0'
                                min={0}
                                max={3}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup onChange={(event) => setDateTaken(event.target.value)}>
                            <Label for="dateGroup">
                                Date
                            </Label>
                            <Input
                                id="dateGroup"
                                name="dateGroup"
                                type='date'
                            />
                        </FormGroup>
                    </Col>
                </Row>
                {/* <Row>
                    <Col md={4} />
                    <Col md={4}>
                        <FormGroup onChange={(event) => setSerialNumber(event.target.value)}>
                            <Label for="serialNum">
                                Serial number for blade/bit
                            </Label>
                            <Input
                                id="serialNum"
                                name="serialNum"
                                type='number'
                            />
                        </FormGroup>
                    </Col>
                </Row> */}
                <Button type='submit'>
                    Submit
                </Button>
            </Form>

        </section>
    );
}

export default DrawPart;