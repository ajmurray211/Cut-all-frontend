import './drawPart.css'
import { Form, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';

const DrawPart = () => {
    return (
        <>
            <Form>
                
                <Row>
                <Col md={2}/>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="exampleEmail">
                                Employee drawing part:
                            </Label>
                            <Input
                                id="employeeName"
                                name="select"
                                placeholder="who are you"
                                type="select"
                            >
                                <option>Rilyn</option>
                                <option>Kyle</option>
                                <option>Pat</option>
                                <option>Gordon</option>
                                <option>Kim</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={5}>
                        <FormGroup>
                            <Label for="partName">
                                Part Name:
                            </Label>
                            <Input
                                id="exampleAddress"
                                name="text"
                                placeholder="What part are you taking out? "
                            />
                        </FormGroup>
                    </Col>
                <Col md={2}/>
                </Row>

                <Row>
                <Col md={4}/>
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