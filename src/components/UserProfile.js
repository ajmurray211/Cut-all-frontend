import axios from 'axios';
import { useEffect, useState } from 'react';
import { Input, Label, Button, Alert, FormGroup, Form, Row, Col, Table } from 'reactstrap';
import { useAuthContext } from '../hooks/useAuthContext';
import { useWorkerContext } from '../hooks/useWorkerContext';
import userIcon from '../Assets/userIcon.png'

const UserProfile = (props) => {
    const { user } = useAuthContext()
    const { API_URL, workerlist } = useWorkerContext()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [title, setTitle] = useState('')
    const [employeeNumber, setEmployeeNumber] = useState('')
    const [status, setStatus] = useState('')
    const [email, setEmail] = useState('No email Stored')
    const [truckNumber, setTruckNumber] = useState('')
    const [alert, setAlert] = useState({ type: null, mssg: null })
    const [show, setShow] = useState(false)
    const toggle = () => setShow(!show)
    const [showInfo, setShowInfo] = useState(true) // Track the active section (Info or Time cards)

    const toggleInfo = () => {
        setShowInfo(true)
    }

    const toggleTimeCards = () => {
        setShowInfo(false)
    }

    // assign defaults from local storage 
    const assignValues = () => {
        if (user) {
            if (user.firstName) setFirstName(user.firstName)
            if (user.lastName) setLastName(user.lastName)
            if (user.title) setTitle(user.title)
            if (user.employeeNumber) setEmployeeNumber(user.employeeNumber)
            if (user.status) setStatus(user.status)
            if (user.truckNumber) setTruckNumber(user.truckNumber)
            if (user.email) setEmail(user.email)
        }
    }

    useEffect(() => {
        assignValues()
    }, [user])

    const handleUserUpdate = async () => {
        await axios.put(`${API_URL}user/edit/${user.email}`, {
            firstName: firstName,
            lastName: lastName,
            title: title,
            employeeNumber: employeeNumber,
            status: status,
            truckNumber: truckNumber,
        }).then(response => {
            setAlert({ mssg: response.data.mssg, type: 'success' })

            setTimeout(() => {
                setAlert({ mssg: null, type: null })
                // assignValues()
            }, 8000);

            // shorten data location
            const res = response.data.updatedUser

            // Retrieve the user object from the local storage.
            const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));

            // Update the user object with the new values.
            const updatedUser = {
                ...userFromLocalStorage,
                firstName: res.firstName,
                lastName: res.lastName,
                title: res.title,
                employeeNumber: res.employeeNumber,
                status: res.status,
                truckNumber: res.truckNumber
            };

            // Save the updated user object back to the local storage.
            localStorage.setItem('user', JSON.stringify(updatedUser));

        }).catch(error => {
            console.log(error);
            setAlert({ mssg: error.data.mssg, type: 'danger' })
            setTimeout(() => {
                setAlert({ mssg: null, type: null })
            }, 8000);
        });
    }


    const mappedTimecards = user.timeCards.map((card) => {
        console.log(card)
        return (
            <tr>
                <td>
                    {card.date ? card.date : ''}
                </td>
                <td>
                    {card.startTime ? card.startTime : ''}
                </td>
                <td>
                    {card.endTime ? card.endTime : ''}
                </td>
                <td>
                    {card.workCode ? card.workCode : ''}
                </td>
                <td>
                    {card.jobName ? card.jobName : ''}
                </td>
                <td>
                    {card.hours ? card.hours : ''}
                </td>
                <td>
                    {card.notes ? card.notes : ''}
                </td>
            </tr>
        )
    })

    return (
        <div>
            <div class="profile-header">
                <div class="profile-img">

                    <img src={userIcon} width="200" alt="Profile Image" />
                </div>
                <div class="profile-nav-info">
                    <h3 class="user-name">{user.firstName} {user.lastName}</h3>
                    <p class="user-mail">{user.email}</p>
                </div>
            </div>

            <div class="main-bd">
                <div class="left-side">
                    <div class="profile-side">
                        <div>
                            <h3>Instructions</h3>
                            <p>
                                Edit your information or view all of your time cards on this user page. You may uplaod an image for your profile.
                                You may not currently edit your email features like that may be an optionin the future.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="right-side">
                    <div class="nav">
                        <Button
                            color={!showInfo ? 'light' : 'primary'}
                            onClick={toggleInfo}
                        >
                            Info
                        </Button>
                        <Button
                            color={showInfo ? 'light' : 'primary'}
                            onClick={toggleTimeCards}
                        >
                            Time cards
                        </Button>
                    </div>

                    <div className='userProfile' style={{ display: showInfo ? '' : 'none' }}>
                        <Alert color={alert.type} isOpen={alert.type}>{alert.mssg}</Alert>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <FormGroup >
                                        <Label size='lg' for='firstName'>First Name</Label>
                                        <Input
                                            size='lg'
                                            value={firstName}
                                            placeholder='please enter a value'
                                            name='firstName'
                                            type='text'
                                            onChange={e => setFirstName(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup >
                                        <Label size='lg' for='lastName'>Last Name</Label>
                                        <Input
                                            size='lg'
                                            value={lastName}
                                            placeholder='please enter a value'
                                            name='lastName'
                                            type='text'
                                            onChange={e => setLastName(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup >
                                        <Label size='lg' for='title'>Title</Label>
                                        <Input
                                            size='lg'
                                            value={title}
                                            placeholder='please enter a value'
                                            name='title'
                                            type='text'
                                            onChange={e => setTitle(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup >
                                        <Label size='lg' for='employeeNumber'>Employee Number</Label>
                                        <Input
                                            size='lg'
                                            value={employeeNumber}
                                            placeholder='please enter a value'
                                            name='employeeNumber'
                                            type='text'
                                            onChange={e => setEmployeeNumber(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <FormGroup >
                                        <Label size='lg' for='status'>Status</Label>
                                        <Input
                                            size='lg'
                                            value={status}
                                            placeholder='please enter a value'
                                            name='status'
                                            type='text'
                                            onChange={e => setStatus(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup >
                                        <Label size='lg' for='truckNumber'>Truck Number</Label>
                                        <Input
                                            size='lg'
                                            value={truckNumber}
                                            placeholder='please enter a value'
                                            name='truckNumber'
                                            type='text'
                                            onChange={e => setTruckNumber(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Button color='primary' onClick={handleUserUpdate}>Update user</Button>
                        </Form>
                    </div>

                    <div className='timeCards' style={{ display: !showInfo ? '' : 'none' }}>
                        <h2>Timecards for this pay period</h2>
                        <Table bordered responsive striped>
                            <thead style={{ display: user.timeCards.length ? '' : 'none' }}>
                                <tr>
                                    <th>Date</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Work Code</th>
                                    <th>Job Name</th>
                                    <th>Hours</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>{user.timeCards.length ? mappedTimecards : 'No timecards stored'}</tbody>
                        </Table>
                    </div>
                </div>
            </div>


        </div >
    );
}

export default UserProfile;