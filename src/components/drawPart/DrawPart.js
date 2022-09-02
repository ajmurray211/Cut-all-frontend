import './drawPart.css'
import { Form, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';

const DrawPart = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [postName, setPostName] = useState('')
    const [amountTaken, setAmountTaken] = useState(null)
    const [dateTaken, setDateTaken] = useState(null)
    const [partName, setpartName] = useState(null)
    const [idNumber, setIdNumber] = useState(null)
    const [partNumber, setpartNumber] = useState(null)

    const API_URL = 'https://fast-meadow-65226.herokuapp.com/'

    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setData(response.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    const postData = () => {
        fetch(`${API_URL}workers/?name=${partName}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: postName,
                amountTaken: amountTaken,
                dateTaken: dateTaken
            })
        })
            .then(req => fetch(`${API_URL}workers/?name=${postName}`))
            .then(res => res.json())
            .then(data => setIdNumber(data.at(-1).id))
            .then(i => {
                fetch(`${API_URL}workers/`, {
                    method: 'Put',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: postName,
                        drawList: [{
                            idNumber: idNumber
                        }]
                    })
                })
            })
    }

    const getId = () => {
        axios
            .get(`${API_URL}workers`)
            .then((response) => console.log(response.data))
            .catch((err) => setError(err))
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
            <option>{part.name}</option>
        )
    })

    return (
        <section>
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
                <Button type='submit'>
                    Submit
                </Button>
            </Form>
        </section>
    );
}

export default DrawPart;