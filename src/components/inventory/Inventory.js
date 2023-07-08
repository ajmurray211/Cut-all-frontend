import { useState, useEffect } from "react";
import Part from "./Part";
import {
    DropdownToggle, DropdownMenu, DropdownItem, Button,
    UncontrolledDropdown, Modal, ModalBody, ModalFooter, ModalHeader,
    Form, FormGroup, Label, Input, Spinner, Alert, FormFeedback
} from 'reactstrap';
import axios from "axios";
import searchicon from "../../Assets/searchicon.png";
import DrawPart from "./DrawPart";
import { useDataFetcher } from "../../hooks/useDataFetcher";
import { useModal } from "../../hooks/useModal";
import { useWorkerContext } from "../../hooks/useWorkerContext";

const Main = (props) => {
    const { API_URL, workerlist } = useWorkerContext()
    const { isOpen: addPartModal, toggleModal: toggleAddPartModal } = useModal();
    const { isOpen: drawModal, toggleModal: toggleDrawModal } = useModal();
    const { getData, data: parts, error, loading } = useDataFetcher();
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)
    const [searchVal, setSearchVal] = useState('')
    const [activeSearchVal, setActiveSearchVal] = useState('')
    const [searchBy, setSearchBy] = useState('')
    const [partName, setPartName] = useState(null)
    const [postOnHand, setPostOnHand] = useState(null)
    const [postTool, setPostTool] = useState(null)
    const [drawAlert, setDrawAlert] = useState(false)
    const [addAlert, setAddAlert] = useState(false)
    const [nameTouched, setNameTouched] = useState(false)
    const [toolTouched, setToolTouched] = useState(false)
    const [bladeNamesList, setBladeNamesList] = useState([])
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [drawData, setDrawData] = useState({
        partName: null,
        name: null,
        amountTaken: 1,
        serialNumber: null,
        dateTaken: null
    })

    useEffect(() => {
        if (activeSearchVal === '') {
            getData(`${API_URL}parts/?format=json`)
        } else {
            getData(`${API_URL}parts/search/?${searchBy}=${activeSearchVal}`)
        }
    }, [activeSearchVal])

    const handleChange = (event) => {
        console.log(event.target.value)
        event.preventDefault()
        setSearchVal(event.target.value)
    }

    const splitBladeNames = () => {
        parts.map((part) => {
            if (!bladeNamesList.includes(part.name)) {
                let copy = [...bladeNamesList]
                copy.push(part.name)
                setBladeNamesList(copy)
            }
        })
    }
    splitBladeNames()

    const handleSubmit = (event) => {
        event.preventDefault()
        getData(`${API_URL}parts/search/?name=${searchVal}`)
        setSearchVal('')
    }

    const filterOnHand = (event) => {
        setSearchBy(event.target.name)
        setActiveSearchVal(event.target.value)
    }

    const handlePost = async () => {
        const formData = new FormData();
        formData.append("name", partName);
        formData.append("onHand", postOnHand);
        formData.append("tool", postTool);
        formData.append("image", selectedFile);

        try {
            const response = axios.post(`${API_URL}parts/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                setSuccess(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setFail(true);
            }
        }
        console.log(postTool, partName)

        const timer = setTimeout(() => {
            setPartName('')
            setPostOnHand(null)
            setActiveSearchVal('')
            setAddAlert(false)
            toggleAddPartModal()
            getData(`${API_URL}parts/?format=json`)
        }, 5000);
    }

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
    };

    // draws parts from stock and appends a worker to the draw list while updating the amount on hand
    const drawPart = async () => {
        const getPartNumber = await axios.get(`${API_URL}parts/search/?name=${drawData.partName}`)
        const partNumber = getPartNumber.data.data[0]._id
        const onHand = getPartNumber.data.data[0].onHand

        const postWorker = await axios.post(`${API_URL}workers`, {
            ...drawData,
            partID: partNumber
        })
            .then(res => console.log(res))
            .catch(err => console.log('error', err))

        const newOnHandCount = onHand - drawData.amountTaken

        const drawListAddition = await axios.put(`${API_URL}parts/${partNumber}`, {
            name: drawData.partName,
            onHand: newOnHandCount,
            dateTaken: drawData.dateTaken
        })

        if (drawListAddition.status == 201) {
            setDrawAlert(true)
        }
        const timer = setTimeout(() => {
            setDrawAlert(false)
            toggleDrawModal()
            getData(`${API_URL}parts/?format=json`)
        }, 5000);
    }

    const mappedParts = parts.map((part, key) => {
        if (part.emailed == false && part.onHand <= 5) {
            axios.put(`${API_URL}parts/${part._id}`, { emailed: true })
        }
        return (
            <Part
                key={part.id}
                part={part}
                getData={getData}
                id={part._id}
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

                <Button className="me-2" id="filter-item" color="dark" onClick={() => getData(`${API_URL}parts/?format=json`)}>
                    Refresh
                </Button>

                <Button className="me-2" id="filter-item" color="danger" onClick={toggleDrawModal}>
                    Draw Part
                </Button>

                <Button className="me-2" id="filter-item" color="danger" onClick={() => {
                    toggleAddPartModal()
                }}>
                    Add Item
                </Button>

            </section>

            <Modal isOpen={addPartModal} toggle={toggleAddPartModal} centered >
                <ModalHeader toggle={toggleAddPartModal} >Part input</ModalHeader>
                <ModalBody>
                    <Alert color='success' isOpen={addAlert}>You Added an item!</Alert>
                    <Form noValidate >
                        <FormGroup >
                            <Label for="partName"> Part Name </Label>
                            <Input
                                id="partName"
                                placeholder="Enter the parts name"
                                type="text"
                                onChange={(event) => setPartName(event.target.value)}
                                value={partName}
                                valid={partName && nameTouched && !bladeNamesList.includes(partName)}
                                invalid={bladeNamesList.includes(partName)}
                                onBlur={() => setNameTouched(true)}
                            />
                            <FormFeedback valid>Name is valid</FormFeedback>
                            <FormFeedback invalid>Oops! You need to enter a unique name.</FormFeedback>
                        </FormGroup>
                        <FormGroup >
                            <Label for="partCount"> Amount on hand </Label>
                            <Input id="partCount" placeholder="On hand count" type="number" onChange={(event) => setPostOnHand(event.target.value)} value={postOnHand} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="toolInput">Tool </Label>
                            <Input
                                id="toolInput"
                                type="select"
                                onChange={(event) => setPostTool(event.target.value)}
                                value={postTool}
                                valid={postTool && toolTouched}
                                invalid={postTool == null && toolTouched}
                                onBlur={() => setToolTouched(true)}
                            >
                                <option></option>
                                <option>Concrete saw</option>
                                <option>Hand saw</option>
                                <option>Wall saw</option>
                                <option>Asphalt saw</option>
                                <option>Core drill</option>
                                <option>Consumables</option>
                            </Input>
                            <FormFeedback valid>Tool is valid</FormFeedback>
                            <FormFeedback invalid>Oops! There is a problem.</FormFeedback>

                        </FormGroup>
                        <FormGroup>
                            <Label for="partImage" > Upload an image </Label>
                            <Input id="partImage" type="file" onChange={handleFileInputChange} />
                            {previewUrl && <img id="partPicture" src={previewUrl} alt="Preview" />}
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button disabled={bladeNamesList.includes(partName) || postTool === null || partName === null ||partName === ''} color="primary" onClick={handlePost}> Submit </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={drawModal} size='lg' centered >
                <ModalHeader toggle={toggleDrawModal}>Draw Part</ModalHeader>
                <ModalBody>
                    <DrawPart
                        drawData={drawData}
                        setDrawData={setDrawData}
                        drawAlert={drawAlert}
                        API_URL={API_URL}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={drawPart}> Submit </Button>
                </ModalFooter>
            </Modal>

            <ul id="partsContainer" className="inventory">
                {loading ? <Spinner animation="border" /> : mappedParts}
            </ul>
        </div>
    );
}

export default Main;