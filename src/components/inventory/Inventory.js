import { useState, useEffect } from "react";
import Part from "./Part";
import {
    DropdownToggle, DropdownMenu, DropdownItem, Button,
    UncontrolledDropdown, Modal, ModalBody, ModalFooter, ModalHeader,
    Form, FormGroup, Label, Input, Spinner, Alert
} from 'reactstrap';
import axios from "axios";
import searchicon from "../../Assets/searchicon.png";
import DrawPart from "./DrawPart";

const Main = (props) => {
    const [searchVal, setSearchVal] = useState('')
    const [activeSearchVal, setActiveSearchVal] = useState('')
    const [searchBy, setSearchBy] = useState('')
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    const [drawModal, setDrawModal] = useState(false);
    const toggleDrawModal = () => setDrawModal(!drawModal);
    const [parts, setParts] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [partName, setPartName] = useState('')
    const [postOnHand, setPostOnHand] = useState(null)
    const [postTool, setPostTool] = useState(null)
    const [drawAlert, setDrawAlert] = useState(false)
    const [addAlert, setAddAlert] = useState(false)
    const [drawData, setDrawData] = useState({
        partName: null,
        name: null,
        amountTaken: 1,
        serialNumber: null,
        dateTaken: null
    })

    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setParts(response.data.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (activeSearchVal === '') {
            getData(`${props.API_URL}parts/?format=json`)
        } else {
            getData(`${props.API_URL}parts/search/?${searchBy}=${activeSearchVal}`)
        }
    }, [activeSearchVal])

    const handleChange = (event) => {
        event.preventDefault()
        setSearchVal(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        getData(`${props.API_URL}parts/search/?name=${searchVal}`)
        setSearchVal('')
    }

    const filterOnHand = (event) => {
        setSearchBy(event.target.name)
        setActiveSearchVal(event.target.value)
    }

    const handlePost = () => {
        axios.post(`${props.API_URL}parts/`, {
            name: partName,
            onHand: postOnHand,
            tool: postTool
        })
            .then(res => res.status == 201 ? setAddAlert(true) : null)
            .catch(err => console.log('error', err))
        const timer = setTimeout(() => {
            setPartName('')
            setPostOnHand(null)
            setActiveSearchVal('')
            setAddAlert(false)
            toggleModal()
            getData(`${props.API_URL}parts/?format=json`)
        }, 5000);
    }

    // draws parts from stock and appends a worker to the draw list while updating the amount on hand
    const drawPart = async () => {
        console.log(drawData)
        const getPartNumber = await axios.get(`${props.API_URL}parts/search/?name=${drawData.partName}`)
        const partNumber = getPartNumber.data.data[0]._id
        const onHand = getPartNumber.data.data[0].onHand

        const postWorker = await axios.post(`${props.API_URL}workers`, {
            ...drawData,
            partID: partNumber
        })
            .then(res => console.log(res))
            .catch(err => console.log('error', err))

        const newOnHandCount = onHand - drawData.amountTaken

        const drawListAddition = await axios.put(`${props.API_URL}parts/${partNumber}`, {
            name: drawData.partName,
            onHand: newOnHandCount
        })

        if (drawListAddition.status == 201) {
            setDrawAlert(true)
        }
        const timer = setTimeout(() => {
            setDrawAlert(false)
            toggleDrawModal()
            getData(`${props.API_URL}parts/?format=json`)
        }, 5000);
    }

    const mappedParts = parts.map((part) => {
        return (
            <Part
                key={part.id}
                part={part}
                API_URL={props.API_URL}
            />
        )
    })

    return (
        <div className="partDisplay">
            <section className="d-flex p-5 justify-content-center" id="filter-bar">
                <form className="me-2" id="filter-item" onSubmit={handleSubmit} >
                    <input className="searchbar" type='text' placeholder="Search by name" onChange={handleChange} value={searchVal} />
                    <button className="search-submit" type="submit">
                        <img src={searchicon} alt="Search Icon" />
                    </button>
                </form>

                <UncontrolledDropdown className="me-2" id="filter-item">
                    <DropdownToggle caret> Tools </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem name='tool' value='Concrete saw' onClick={filterOnHand}>Concrete saw</DropdownItem>
                        <DropdownItem name='tool' value='Asphalt saw' onClick={filterOnHand}>Asphalt saw</DropdownItem>
                        <DropdownItem name='tool' value='Wall saw' onClick={filterOnHand}>Wall saw</DropdownItem>
                        <DropdownItem name='tool' value='Hand saw' onClick={filterOnHand}>Hand saw</DropdownItem>
                        <DropdownItem name='tool' value='Core drill' onClick={filterOnHand} >Core drill</DropdownItem>
                        <DropdownItem name='tool' value='Consumable' onClick={filterOnHand} >Consumables</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown className="me-2" id="filter-item">
                    <DropdownToggle caret > Count </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem name='sort' value='dec' onClick={filterOnHand}>High</DropdownItem>
                        <DropdownItem name='sort' value='acd' onClick={filterOnHand}>Low</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                <Button className="me-2" id="filter-item" color="dark" onClick={() => getData(`${props.API_URL}parts/?format=json`)}>
                    Refresh
                </Button>

                <Button className="me-2" id="filter-item" color="danger" onClick={toggleDrawModal}>
                    Draw Part
                </Button>

                <Button className="me-2" id="filter-item" color="danger" onClick={toggleModal}>
                    Add Item
                </Button>

            </section>

            <Modal isOpen={modal} toggle={toggleModal} centered >
                <ModalHeader toggle={toggleModal} >Part input</ModalHeader>
                <ModalBody>
                    <Alert color='success' isOpen={addAlert}>You Added an item!</Alert>

                    <Form>
                        <FormGroup>
                            <Label for="partName"> Part Name </Label>
                            <Input id="partName" placeholder="Enter the parts name" type="text" onChange={(event) => setPartName(event.target.value)} value={partName} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="partCount"> Amount on hand </Label>
                            <Input id="partCount" placeholder="On hand count" type="number" onChange={(event) => setPostOnHand(event.target.value)} value={postOnHand} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="toolInput">Tool </Label>
                            <Input id="toolInput" placeholder="What tool does this part belong to?" type="select" onChange={(event) => setPostTool(event.target.value)} value={postTool}>
                                <option>Concrete saw</option>
                                <option>Asphalt saw</option>
                                <option>Hand saw</option>
                                <option>Core drill</option>
                                <option>Consumables</option>
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handlePost}> Submit </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={drawModal} size='lg' centered >
                <ModalHeader toggle={toggleDrawModal}>Draw Part</ModalHeader>
                <ModalBody>
                    <DrawPart
                        drawData={drawData}
                        setDrawData={setDrawData}
                        drawAlert={drawAlert}
                        API_URL={props.API_URL}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={drawPart}> Submit </Button>
                </ModalFooter>
            </Modal>

            <ul>
                {loading ? <Spinner animation="border" /> : mappedParts}
            </ul>
        </div>
    );
}

export default Main;