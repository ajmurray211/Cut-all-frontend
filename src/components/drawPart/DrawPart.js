import './drawPart.css'
import { Form, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';

const DrawPart = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const API_URL = 'https://fast-meadow-65226.herokuapp.com/'

    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setData(response.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getData(`${API_URL}parts/?format=json`)
    }, [])

    const mapParts = data.map((part) => {
        return (
            <option>{part.name}" {part.tool}</option>
        )
    })

    return (
        <>
            <Form>

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
                    <Col md={3}>
                        <FormGroup>
                            <Label for="partLabel"> Part: </Label>
                            <Input
                                id="partList"
                                name="select"
                                placeholder="What part are you taking?"
                                type="select"
                            >
                                {mapParts}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={2} />
                </Row>

                <Row>
                    <Col md={4} />
                    <Col md={2}>
                        <FormGroup>
                            <Label for="amount">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                name="amount"
                                type='number'
                                placeholder='0'
                                min={0}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
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
                <Button>
                    Submit
                </Button>
            </Form>
        </>
    );
}

export default DrawPart;