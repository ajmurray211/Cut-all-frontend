import { Form, Row, Col, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';

const SerialNums = (props) => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [postName, setPostName] = useState('')
    const [amountTaken, setAmountTaken] = useState(null)
    const [serialNumber, setSerialNumber] = useState(null)
    const [dateTaken, setDateTaken] = useState(null)
    const [partName, setpartName] = useState(null)
    const [data, setData] = useState([])
    const [show, setShow] = useState(false)

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
        const getPartNumber = await axios.get(`${props.API_URL}parts/search/?name=${partName}`)
        const partNumber = getPartNumber.data.data[0]._id
        const onHand = getPartNumber.data.data[0].onHand

        const postWorker = await axios.post(`${props.API_URL}workers`, {
            name: postName,
            amountTaken: amountTaken,
            dateTaken: dateTaken,
            partID: partNumber
        })

        const newOnHandCount = onHand - amountTaken

        const drawListAddition = await axios.put(`${props.API_URL}parts/${partNumber}`, {
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
        getData(`${props.API_URL}serialNums/?format=json`)
    }, [])

    const mapParts = data.map((part) => {
        return (
            <option key={part.id}>{part.name}</option>
        )
    })

    const handleChange = (e) => {
        console.log(e)
    }

    return (
        <section>
            <Alert color='success' isOpen={show}>You have drawn a part!</Alert>

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={3} />
                    <Col md={3}>
                        <FormGroup>
                            <Label for="employeeList">
                                Manufactures:
                            </Label>
                            <Input
                                id="employeeName"
                                name="select"
                                placeholder="Who are you?"
                                type="select"
                                onChange={(event) => setPostName(event.target.value)}
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
                    <Col md={3} />
                    <Col md={3}>
                        <FormGroup>
                            <Label for="partLabel"> Spec number or serial: </Label>
                            <Input
                                id="serialOrSpec"
                                name="serialOrSpec"
                                placeholder="What is the serial or spec number?"
                                type="text"
                                onChange={(event) => setpartName(event.target.value)}
                            >
                                <option></option>
                                {mapParts}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup onChange={(event) => setDateTaken(event.target.value)}>
                            <Label for="cutallSerial">
                                Cutall serial #
                            </Label>
                            <Input
                                id="cutallSerial"
                                name="cutallSerial"
                                type='text'
                                placeholder='New cutall serial number'
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Button type='submit' color='primary'>
                    Submit
                </Button>
            </Form>
        </section>
    );
}

export default SerialNums;