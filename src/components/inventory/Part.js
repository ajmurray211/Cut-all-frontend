import { Button, Collapse, Card, CardTitle, CardText, CardBody, Alert, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, ModalFooter, } from "reactstrap";
import { useState } from "react";
import axios from "axios";
import logo from "../../Assets/cut-all-logo.png";
import { useModal } from "../../hooks/useModal";
import { useWorkerContext } from "../../hooks/useWorkerContext";

const Part = (props) => {
    const { API_URL, workerlist } = useWorkerContext()
    const { isOpen: pullhistoryOpen, toggleModal: togglePullHistory } = useModal();
    const { isOpen: editOpen, toggleModal: toggleEdit } = useModal();
    const [putName, setPutName] = useState(props.part.name)
    const [putOnHand, setPutOnHand] = useState(props.part.onHand)
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleEdit = async (event) => {
        // const formData = new FormData();
        // formData.append("image", selectedFile);
        
        const getID = await axios.put(`${API_URL}parts/${props.part._id}`, {
            name: putName,
            onHand: putOnHand,
        })
            .then(res => { if (res.status == 201) setSuccess(true) })
            .catch(err => { if (err.status == 201) setFail(true) })
        setTimeout(() => {
            setFail(false)
            setSuccess(false)
            toggleEdit()
            props.getData(`${API_URL}parts/?format=json`)
        }, 5000)
    }

    // const handleFileInputChange = (event) => {
    //     const file = event.target.files[0];
    //     setSelectedFile(file);

    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onloadend = () => {
    //         setPreviewUrl(reader.result);
    //     };
    // };

    const handleDelete = async () => {
        const getID = await axios.delete(`${API_URL}parts/${props.part._id}`)
        toggleEdit()
    }

    const handleFullHistory = () => {
        let info = axios.get(`${API_URL}parts/${props.id}`)
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
                    <Button color="primary" onClick={togglePullHistory}>
                        History
                    </Button>
                </CardBody>
            </Card>

            <Collapse className="part-collapse" isOpen={pullhistoryOpen}>
                <Card>
                    <CardBody className="detail-cards">
                        <ul className="lastdrawednames">
                            {/* {props.part.drawList.length !== 0 ? <>{mappedLastDrawNames} <Button onClick={(e) => handleFullHistory()}>Full history</Button></> : <li>No Current data</li>} */}
                            {props.part.drawList.length !== 0 ? mappedLastDrawNames : <li>No Current data</li>}
                        </ul>
                    </CardBody>
                </Card>
            </Collapse>

            <Modal isOpen={editOpen}>
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
                        {/* <FormGroup>
                            <Label for="partImage" > Upload an image </Label>
                            <Input id="partImage" type="file" onChange={handleFileInputChange} />
                            {previewUrl && <img id="partPicture" src={previewUrl} alt="Preview" />}
                        </FormGroup> */}
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