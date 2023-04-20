import axios from 'axios';
import { useEffect, useState } from 'react';
import { Input, Label, Button, Alert } from 'reactstrap';
import { useAuthContext } from '../hooks/useAuthContext';

const UserProfile = (props) => {
    const { user } = useAuthContext()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [title, setTitle] = useState('')
    const [employeeNumber, setEmployeeNumber] = useState('')
    const [status, setStatus] = useState('')
    const [email, setEmail] = useState('No email Stored')
    const [truckNumber, setTruckNumber] = useState('')
    const [alert, setAlert] = useState({ type: 'primary', mssg: 'nothing' })

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
        await axios.put(`${props.API_URL}user/edit/${user.email}`, {
            firstName: firstName,
            lastName: lastName,
            title: title,
            employeeNumber: employeeNumber,
            status: status,
            truckNumber: truckNumber,
        }).then(response => {
            setAlert({ mssg: response.data.mssg, type: 'success' })

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
            // setAlert({ mssg: error.data.mssg, type: 'danger' })
        });
    }
    console.log(user)

    return (
        <div>
            <h1>User Profile</h1>
            <div className='userProfile'>
                {/* <Alert color={alert.type} isOpen={alert}>{alert.mssg}</Alert> */}
                <section className='userInfoSection'>
                    <Label size='lg' for='firstName'>First Name</Label>
                    <Input
                        size='lg'
                        value={firstName}
                        placeholder='please enter a value'
                        name='firstName'
                        type='text'
                        onChange={e => setFirstName(e.target.value)}
                    />
                </section>

                <section className='userInfoSection'>
                    <Label size='lg' for='lastName'>Last Name</Label>
                    <Input
                        size='lg'
                        value={lastName}
                        placeholder='please enter a value'
                        name='lastName'
                        type='text'
                        onChange={e => setLastName(e.target.value)}
                    />
                </section>

                <section className='userInfoSection'>
                    <Label size='lg' for='title'>Title</Label>
                    <Input
                        size='lg'
                        value={title}
                        placeholder='please enter a value'
                        name='title'
                        type='text'
                        onChange={e => setTitle(e.target.value)}
                    />
                </section>

                <section className='userInfoSection'>
                    <Label size='lg' for='employeeNumber'>Employee Number</Label>
                    <Input
                        size='lg'
                        value={employeeNumber}
                        placeholder='please enter a value'
                        name='employeeNumber'
                        type='text'
                        onChange={e => setEmployeeNumber(e.target.value)}
                    />
                </section>

                <section className='userInfoSection'>
                    <Label size='lg' for='status'>Status</Label>
                    <Input
                        size='lg'
                        value={status}
                        placeholder='please enter a value'
                        name='status'
                        type='text'
                        onChange={e => setStatus(e.target.value)}
                    />
                </section>

                <section className='userInfoSection'>
                    <Label size='lg' for='truckNumber'>Truck Number</Label>
                    <Input
                        size='lg'
                        value={truckNumber}
                        placeholder='please enter a value'
                        name='truckNumber'
                        type='text'
                        onChange={e => setTruckNumber(e.target.value)}
                    />
                </section>

                <section className='userInfoSection'>
                    <h2>Email: {email}</h2>
                </section>

                <Button onClick={handleUserUpdate}>Update user</Button>
            </div>

        </div>
    );
}

export default UserProfile;