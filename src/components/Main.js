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
    const [postOnHand, setpostOnHand] = useState(null)

    const API_URL = 'https://fast-meadow-65226.herokuapp.com/'
    // const API_URL = 'http://0.0.0.0:5000/'

    const getData = (url) => {
        setLoading(true)
        axios
            .get(url)
            .then((response) => setParts(response.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        if (activeSearchVal == '') {
            getData(`${API_URL}parts/?format=json`)
        } else {
            getData(`${API_URL}parts/?format=json&${searchBy}=${activeSearchVal}`)
        }
    }, [activeSearchVal])

    const handleChange = (event) => {
        event.preventDefault()
        setSearchVal(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        getData(`${API_URL}parts/?format=json&name=${searchVal}`)
        setSearchVal('')
        console.log('submit hit', searchVal)
    }

    const filterOnHand = (event) => {
        setSearchBy(event.target.name)
        setActiveSearchVal(event.target.value)
        getData(`${API_URL}parts/?format=json&${searchBy}=${activeSearchVal}`)
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
            })
        });
        getData(`${API_URL}parts/?format=json`)
        setPostName('')
        setpostOnHand(null)
        toggleModal()
    }

    const mappedParts = parts.map((part) => {
        return (
            <Part
                part={part}
            />
        )
    })

    return (
        <>
            <section className="d-flex p-5 justify-content-center">
                <form className="me-2" onSubmit={handleSubmit} >
                    <input className="searchbar" type='text' placeholder="Search by name" onChange={handleChange} value={searchVal} />
                    <button className="search-submit" type="submit">
                        <img src={searchicon} alt="Search Icon" />
                    </button>
                </form>

                <UncontrolledDropdown className="me-2">
                    <DropdownToggle caret> Tools </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>Action</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown className="me-2">
                    <DropdownToggle caret> Count </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem name='onHandDec' value='high' onClick={filterOnHand}>High</DropdownItem>
                        <DropdownItem name='onHandAce' value='low' onClick={filterOnHand}>Low</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>

                <Button className="me-2" color="danger" onClick={toggleModal}>
                    Add Item
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
                            <Input id="partCount" placeholder="On hand count" type="number" onChange={(event) => setpostOnHand(event.target.value)} value={postOnHand} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="partLastPerson"> Last person to draw </Label>
                            <Input id="partLastPerson" placeholder="Last person to draw" type="text" onChange={(event) => setpostOnHand(event.target.value)} value={postOnHand} />
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
        </>
    );
}

export default Main;