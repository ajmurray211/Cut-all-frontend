// import './drawPart.css'
import { Form, Row, Col, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDataFetcher } from '../../hooks/useDataFetcher';

const DrawPart = (props) => {
    const { getData, data, error, loading } = useDataFetcher();

    useEffect(() => {
        getData(`${props.API_URL}parts/?format=json`)
    }, [])

    const mapParts = data.map((part) => {
        return (
            <option key={part.id}>{part.name}</option>
        )
    })

    const handleChange = (e) => {
        if (e.target.name == 'dateTaken') {
            let splitDate = e.target.value.split('-')
            let year = splitDate.shift()
            splitDate.push(year)
            let reFormatedDate = splitDate.join('/')
            props.setDrawData(val => ({
                ...val,
                dateTaken: reFormatedDate
            }))
        } else {
            props.setDrawData(val => ({
                ...val,
                [e.target.name]: e.target.value
            }))
        }
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
                                name="dateTaken"
                                type='date'
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </section>
    );
}

export default DrawPart;