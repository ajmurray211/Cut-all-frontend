import './jobTicket.css'
import SignatureCanvas from 'react-signature-canvas'
import { Form, Row, Col, Label, FormGroup, Input, Button, Table } from 'reactstrap';

const JobTIcket = () => {
    return (
        <div id='job-ticket'>
            <Form onSubmit={console.log('submit')}>
                <Row>
                    <Col md={4} />
                    <Col md={3}>
                        <FormGroup>
                            <Label for="employeeList">
                                Employee Name:
                            </Label>
                            <Input
                                id="employeeName"
                                name="select"
                                placeholder="Who are you?"
                                type="select"
                                onChange={(event) => console.log(event.target.value)}
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
                    <Col md={2}>
                        <Label>Truck Number:</Label>
                        <Input type='number' onChange={(event) => console.log(event.target.value)}></Input>
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
                                name="select"
                                placeholder="Billing name"
                                type="text"
                                onChange={(event) => console.log(event.target.value)}
                            ></Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="employeeList">
                                Other CA men on the job :
                            </Label>
                            <Input
                                id="billingName"
                                name="select"
                                placeholder="Billing name"
                                type="checkbox"
                                onChange={(event) => console.log(event.target.value)}
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="employeeList">
                                Date:
                            </Label>
                            <Input
                                id="billingName"
                                name="select"
                                placeholder="Billing name"
                                type="date"
                                onChange={(event) => console.log(event.target.value)}
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={2} />
                </Row>

                <Row>
                    <Col md={4} />
                    <Col md={2}>
                        <FormGroup>
                            <Label for="employeeList">
                                Address:
                            </Label>
                            <Input
                                id="billingName"
                                name="select"
                                placeholder="Billing name"
                                type="text"
                                onChange={(event) => console.log(event.target.value)}
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={2}>
                        <FormGroup>
                            <Label for="employeeList">
                                Master Ticket:
                            </Label>
                            <Input
                                id="billingName"
                                name="select"
                                placeholder="Billing name"
                                type="checkbox"
                                onChange={(event) => console.log(event.target.value)}
                            >
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Table bordered striped responsive>
                    <thead>
                        <tr>
                            <th>Quote #</th>
                            <th>QTY</th>
                            <th>Length or DIA</th>
                            <th>Depth</th>
                            <th>Work code</th>
                            <th>Discription / equipment used</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td><Input type='number'></Input></td>
                            <td><Input type='number'></Input></td>
                            <td><Input type='number'></Input></td>
                            <td><Input type='text'></Input></td>
                            <td><Input type='text'></Input></td>
                            <td><Input type='number'></Input></td>
                        </tr>
                    </tbody>
                </Table>
                <Button onClick={(event) => event.preventDefault()}> Add row </Button>

            </Form>

            <h1>Sign Here</h1>

            <SignatureCanvas penColor='black' id='sign'
                canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />

            <Button type='submit'>Submit</Button>
        </div>
    );
}

export default JobTIcket;