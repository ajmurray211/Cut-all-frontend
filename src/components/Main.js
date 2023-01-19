import { useState, useEffect } from "react";
import Part from "./Part";
import {
    DropdownToggle, DropdownMenu, DropdownItem, Button,
    UncontrolledDropdown, Modal, ModalBody, ModalFooter, ModalHeader,
    Form, FormGroup, Label, Input, Spinner
} from 'reactstrap';
import axios from "axios";
import searchicon from "../Assets/searchicon.png";

const Main = () => {
    const [searchVal, setSearchVal] = useState('')
    const [activeSearchVal, setActiveSearchVal] = useState('')
    const [searchBy, setSearchBy] = useState('')
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    const [parts, setParts] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [postName, setPostName] = useState('')
    const [postOnHand, setPostOnHand] = useState(null)
    const [postTool, setPostTool] = useState(null)

    const API_URL = 'https://shielded-cove-45306.herokuapp.com/'
    // const API_URL = 'http://localhost:8080/'

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
            getData(`${API_URL}parts/?format=json`)
        } else {
            getData(`${API_URL}parts/search/?${searchBy}=${activeSearchVal}`)
        }
    }, [activeSearchVal])

    const handleChange = (event) => {
        event.preventDefault()
        setSearchVal(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        getData(`${API_URL}parts/search/?name=${searchVal}`)
        setSearchVal('')
    }

    const filterOnHand = (event) => {
        setSearchBy(event.target.name)
        setActiveSearchVal(event.target.value)
    }

    const handlePost = () => {
        fetch(`${API_URL}parts/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: postName,
                onHand: postOnHand,
                tool: postTool
            })
        });
        getData(`${API_URL}parts/?format=json`)
        setPostName('')
        setPostOnHand(null)
        toggleModal()
    }

    const mappedParts = parts.map((part) => {
        return (
            <Part
                key={part.id}
                part={part}
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
                        <DropdownItem name='tool' value='Core saw' onClick={filterOnHand} >Core drill</DropdownItem>
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

                <Button className="me-2" id="filter-item" color="danger" onClick={toggleModal}>
                    Add Item
                </Button>

                <Button className="me-2" id="filter-item" color="dark" onClick={() => getData(`${API_URL}parts/?format=json`)}>
                    Refresh
                </Button>
            </section>

            <Modal isOpen={modal} toggle={toggleModal} >
                <ModalHeader toggle={toggleModal}>Part input</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="partName"> Part Name </Label>
                            <Input id="partName" placeholder="Enter the parts name" type="text" onChange={(event) => setPostName(event.target.value)} value={postName} />
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
                        <FormGroup>
                            <Label for="partLastPerson"> Last person to draw </Label>
                            <Input id="partLastPerson" placeholder="Last person to draw" type="select">
                                <option>Gordon</option>
                                <option>Pat</option>
                                <option>Rilyn</option>
                                <option>Kyle</option>
                                <option>Kim</option>
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handlePost}> Submit </Button>
                </ModalFooter>
            </Modal>

            <ul>
                {loading ? <Spinner animation="border" /> : mappedParts}
            </ul>
        </div>
    );
}

export default Main;