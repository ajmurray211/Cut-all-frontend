import { Button, Collapse, Card, CardBody, ButtonGroup, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ModalFooter, } from "reactstrap";
import { useState } from "react";
import axios from "axios";
import arrow from '../Assets/arrow.png'

const Part = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen);
    const [modalOpen, setModalOpen] = useState(false)
    const toggleEdit = () => setModalOpen(!modalOpen);
    const [putName, setPutName] = useState(props.part.name)
    const [putOnHand, setPutOnHand] = useState(props.part.onHand)

    const handleEdit = async () => {
        const getID = await axios.put(`https://fast-meadow-65226.herokuapp.com/parts/${props.part.id}`, {
            name: putName,
            onHand: putOnHand
        })
        toggleEdit()
    }
    const handleDelete = async () => {
        const getID = await axios.delete(`https://fast-meadow-65226.herokuapp.com/parts/${props.part.id}`)
        toggleEdit()
    }

    const mappedLastDrawNames = props.part.drawList.map((info) => {
        return (
            <li style={{ fontSize: 20 }}>{info.name} took <span style={{ color: 'red' }}>{info.amountTaken}</span> on <span style={{ color: 'blue' }}>{info.dateTaken}</span>.</li>
        )
    })

    return (
        <>
            <li className="part">
                <section id="partName" className="item" >
                    Part Name: {props.part.name}
                </section>
                <section id="partsOnHand" className="item">
                    On hand count: {props.part.onHand}
                </section>
                <section id="partLastPerson" className="item">
                    {props.part.drawList.length !== 0 ? <p>Last person to draw: {props.part.drawList.at(-1).name}</p> : <p>Last person to draw: No Data</p>}
                </section>
                <ButtonGroup>
                    <Button color="primary" onClick={toggleEdit}>
                        Edit
                    </Button>
                    <Button color="primary" onClick={toggle}>
                        <img src={arrow} className={isOpen ? "down" : "left"} />
                    </Button>
                </ButtonGroup>
            </li>
            <Collapse className="part-collapse" isOpen={isOpen}>
                <Card>
                    <h4 style={{ fontSize: 27, marginTop: 10 }}>History of who has pulled {props.part.name}:</h4>
                    <CardBody className="detail-cards">
                        <ul className="lastdrawednames">
                            {props.part.drawList.length !== 0 ? mappedLastDrawNames : <li>No Current data</li>}
                        </ul>
                    </CardBody>
                </Card>
            </Collapse>

            <Modal isOpen={modalOpen}>
                <ModalHeader toggle={toggleEdit}>Edit part info</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="partName"> Part Name </Label>
                            <Input id="partName" placeholder={props.part.name} type="text" onChange={(event) => setPutName(event.target.value)} value={putName} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="partCount"> Amount on hand </Label>
                            <Input id="partCount" placeholder={props.part.onHand} type="number" onChange={(event) => setPutOnHand(event.target.value)} value={putOnHand} />
                        </FormGroup>
                    </Form>
                    <ModalFooter>
                        <Button color="danger" onClick={handleDelete}> Delete </Button>
                        <Button onClick={handleEdit}>Submit</Button>
                    </ModalFooter>
                </ModalBody>
            </Modal>
        </>
    );
}

export default Part;