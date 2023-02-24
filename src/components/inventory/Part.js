import { Button, Collapse, Card, CardTitle, CardText, CardBody, Alert, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ModalFooter, } from "reactstrap";
import { useState } from "react";
import axios from "axios";
import logo from "../../Assets/cut-all-logo.png";

const Part = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen);
    const [modalOpen, setModalOpen] = useState(false)
    const toggleEdit = () => setModalOpen(!modalOpen);
    const [putName, setPutName] = useState(props.part.name)
    const [putOnHand, setPutOnHand] = useState(props.part.onHand)
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)

    const handleEdit = async () => {
        const getID = await axios.put(`${props.API_URL}parts/${props.part._id}`, {
            name: putName,
            onHand: putOnHand
        })
            .then(res => { if (res.status == 201) setSuccess(true) })
            .catch(err => { if (err.status == 201) setFail(true) })
        setTimeout(() => {
            setFail(false)
            setSuccess(false)
            toggleEdit()
            props.getData(`${props.API_URL}parts/?format=json`)
        }, 5000)
    }

    const handleDelete = async () => {
        const getID = await axios.delete(`${props.API_URL}parts/${props.part._id}`)
        toggleEdit()
    }

    const handleFullHistory = () => {
        let info = axios.get(`${props.API_URL}parts/${props.id}`)
        .then(res => console.log(res.data.data.drawList))
    }

    const mappedLastDrawNames = props.part.drawList.map((info) => {
        return (
            <li key={info.id} style={{ fontSize: 20 }}>{info.name} took <span style={{ color: 'red' }}>{info.amountTaken}</span> on <span style={{ color: 'blue' }}>{info.dateTaken}</span>.</li>
        )
    })
    
    return (
        <div className="part">
            <Card
                color={props.part.onHand <= 0 ? "danger" : props.part.onHand > 5 ? "light" : "warning"}
                className="inventory"
            >
                <img
                    alt="Sample"
                    src={logo}
                    className="inventory"
                    id="partPicture"
                />
                <CardTitle tag="h5">
                    Part Name: {props.part.name}
                </CardTitle>
                <CardBody>
                    <CardText>
                        <section id="partsOnHand" className="item">
                            On hand count: {props.part.onHand}
                        </section>
                        <section id="partLastPerson" className="item">
                            {props.part.drawList.length !== 0 ? <p>Last person to draw: {props.part.drawList.at(-1).name}</p> : <p>Last person to draw: No Data</p>}
                        </section>
                    </CardText>
                    <Button color="primary" onClick={toggleEdit}>
                        Edit
                    </Button>
                    <Button color="primary" onClick={toggle}>
                        History
                    </Button>
                </CardBody>
            </Card>

            <Collapse className="part-collapse" isOpen={isOpen}>
                <Card>
                    <CardBody className="detail-cards">
                        <ul className="lastdrawednames">
                            {/* {props.part.drawList.length !== 0 ? <>{mappedLastDrawNames} <Button onClick={(e) => handleFullHistory()}>Full history</Button></> : <li>No Current data</li>} */}
                            {props.part.drawList.length !== 0 ? mappedLastDrawNames : <li>No Current data</li>}
                        </ul>
                    </CardBody>
                </Card>
            </Collapse>

            <Modal isOpen={modalOpen}>
                <ModalHeader toggle={toggleEdit}>Edit part info</ModalHeader>
                <ModalBody>
                    <Alert color='success' isOpen={success}>You have edited this parts info!</Alert>
                    <Alert color='danger' isOpen={fail}>There was a problem with the submission!</Alert>
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

        </div>
    );
}

export default Part;