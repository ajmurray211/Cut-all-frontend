// import './drawPart.css'
import { Form, Row, Col, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';

const DrawPart = (props) => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setData(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getData(`${props.API_URL}parts/?format=json`)
    }, [])

    const mapParts = data.map((part) => {
        return (
            <option key={part.id}>{part.name}</option>
        )
    })

    const handleChange = (e) => {
        console.log(e.target.value)
        props.setDrawData(val => ({
            ...val, 
            [e.target.name]: e.target.value
        }))
    }

    return (
        <section className='drawPart'>
            <Alert color='success' isOpen={props.drawAlert}>You have drawn a part!</Alert>

            <Form className='drawPart' id='drawForm'>
                <Row>
                    <Col md={1} />
                    <Col md={5}>
                        <FormGroup>
                            <Label for="name">
                                Employee drawing part:
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Who are you?"
                                type="select"
                                onChange={handleChange}
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
                    <Col md={5}>
                        <FormGroup>
                            <Label for="partName"> Part: </Label>
                            <Input
                                id="partName"
                                name="partName"
                                placeholder="What part are you taking?"
                                type="select"
                                onChange={handleChange}
                            >
                                <option></option>
                                {mapParts}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md={1} />
                    <Col md={5}>
                        <FormGroup onChange={handleChange}>
                            <Label for="amounTaken">
                                Amount
                            </Label>
                            <Input
                                id="amountTaken"
                                name="amountTaken"
                                type='number'
                                placeholder='0'
                                min={0}
                                max={3}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={5}>
                        <FormGroup onChange={handleChange}>
                            <Label for="date">
                                Date
                            </Label>
                            <Input
                                id="date"
                                name="date"
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
            </Form>
        </section>
    );
}

export default DrawPart;