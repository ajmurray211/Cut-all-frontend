import { Link } from 'react-router-dom';
import { Card, CardBody, CardFooter, CardTitle, CardText, Button, Input, Label, FormFeedback, FormGroup, Form, Alert, Row, Col } from 'reactstrap'
import { useEffect, useState } from 'react';
import { useSignup } from '../../hooks/useSignup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
    const [newUserData, setNewUserData] = useState({
        firstName: null,
        lastName: null,
        email: null,
        title: null,
        status: null,
        employeeNumber: null,
        truckNumber: null,
        password: '',
        confirmPassword: '',
        isAdmin: false
    })
    const [blurrred, setBlurrred] = useState({
        firstName: false,
        lastName: false,
        email: false,
        title: false,
        status: false,
        employeeNumber: false,
        truckNumber: false,
        password: false,
        confirmPassword: false
    })
    const [confirmationPassword, setConfirmationPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showError, setShowError] = useState(false);
    const { signup, isLoading, error } = useSignup()

    useEffect(() => {
        if (error) {
            setShowError(true);

            const timeout = setTimeout(() => {
                setShowError(false);
            }, 8000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signup(newUserData)
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target

        if (name === 'isAdmin') {
            setNewUserData((data) => ({
                ...data,
                [name]: checked
            }))
        } else {
            setNewUserData((data) => ({
                ...data,
                [name]: value
            }))
        }
    }

    const handleBlur = (e) => {
        const { name } = e.target

        setBlurrred((data) => ({
            ...data,
            [name]: true
        }))
    }

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(newUserData.email);
    };

    const validatePassword = () => {
        const lowercaseRegex = /^(?=.*[a-z])/;
        const uppercaseRegex = /^(?=.*[A-Z])/;
        const digitRegex = /^(?=.*\d)/;
        const specialCharRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])/;
        const lengthRegex = /^.{8,}$/;

        const isLowercaseValid = lowercaseRegex.test(newUserData.password);
        const isUppercaseValid = uppercaseRegex.test(newUserData.password);
        const isDigitValid = digitRegex.test(newUserData.password);
        const isSpecialCharValid = specialCharRegex.test(newUserData.password);
        const isLengthValid = lengthRegex.test(newUserData.password);

        return (
            isLowercaseValid &&
            isUppercaseValid &&
            isDigitValid &&
            isSpecialCharValid &&
            isLengthValid
        );
    };

    const validateConfirmPassword = () =>
        newUserData.password !== null && newUserData.password === confirmationPassword;

    return (
        <div>
            <Card
                className='auth_form'
            >
                {showError && <Alert color='danger'>{error}</Alert>}
                <CardBody id=''>
                    <CardTitle tag="h3">
                        Register
                    </CardTitle>
                    <Form name='register-form' id='register-form' noValidate onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='firstName' >First Name</Label>
                                    <Input
                                        name='firstName'
                                        id='firstName'
                                        type='text'
                                        placeholder='Enter your first name'
                                        onChange={handleChange}
                                        value={newUserData.firstName}
                                        onBlur={handleBlur}
                                        valid={newUserData.firstName && blurrred.firstName}
                                        invalid={blurrred.firstName && !newUserData.firstName}
                                    />
                                    <FormFeedback invalid>Oops! You need to enter your first name.</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='lastName' >Last Name</Label>
                                    <Input
                                        name='lastName'
                                        id='lastName'
                                        type='text'
                                        placeholder='Enter your last name'
                                        onChange={handleChange}
                                        value={newUserData.lastName}
                                        onBlur={handleBlur}
                                        valid={newUserData.lastName && blurrred.lastName}
                                        invalid={blurrred.lastName && !newUserData.lastName}
                                    />
                                    <FormFeedback invalid>Oops! You need to enter your last name.</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='email' >Email</Label>
                                    <Input
                                        name='email'
                                        id='email'
                                        type='text'
                                        placeholder='Enter a email'
                                        onChange={handleChange}
                                        value={newUserData.email}
                                        onBlur={handleBlur}
                                        valid={validateEmail() && blurrred.email}
                                        invalid={blurrred.email && !validateEmail()}
                                    />
                                    {/* <FormFeedback valid>email is valid</FormFeedback> */}
                                    {blurrred.email && !validateEmail() && (
                                    <FormFeedback invalid>Please enter a valid email.</FormFeedback>
                                )}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='title' >Title</Label>
                                    <Input
                                        name='title'
                                        id='title'
                                        type='text'
                                        placeholder='Enter your title'
                                        onChange={handleChange}
                                        value={newUserData.title}
                                        onBlur={handleBlur}
                                        valid={newUserData.title && blurrred.title}
                                        invalid={blurrred.title && !newUserData.title}
                                    />
                                    <FormFeedback invalid>Oops! You need to enter a title.</FormFeedback>
                                </FormGroup>
                            </Col>

                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='employeeNumber' >Employee number</Label>
                                    <Input
                                        name='employeeNumber'
                                        id='employeeNumber'
                                        type='text'
                                        placeholder='Enter your employee #'
                                        onChange={handleChange}
                                        value={newUserData.employeeNumber}
                                        onBlur={handleBlur}
                                        valid={newUserData.employeeNumber && blurrred.employeeNumber}
                                        invalid={blurrred.employeeNumber && !newUserData.employeeNumber}
                                    />
                                    {/* <FormFeedback valid>Employee number is valid</FormFeedback> */}
                                    <FormFeedback invalid>Oops! You need to enter your employee number.</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='truckNumber'>Truck #</Label>
                                    <Input
                                        name='truckNumber'
                                        id='truckNumber'
                                        type='text'
                                        placeholder='Enter your truck #'
                                        onChange={handleChange}
                                        value={newUserData.truckNumber}
                                        onBlur={handleBlur}
                                        valid={newUserData.truckNumber && blurrred.truckNumber}
                                        invalid={blurrred.truckNumber && !newUserData.truckNumber}
                                    />
                                    {/* <FormFeedback valid>Truck number is valid</FormFeedback> */}
                                    <FormFeedback invalid>Oops! You need to enter a Truck number.</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='status' >Status</Label>
                                    <Input
                                        name='status'
                                        id='status'
                                        type='text'
                                        placeholder='Enter your status'
                                        onChange={handleChange}
                                        value={newUserData.status}
                                        onBlur={handleBlur}
                                        valid={newUserData.status && blurrred.status}
                                        invalid={blurrred.status && !newUserData.status}
                                    />
                                    {/* <FormFeedback valid>Status is valid</FormFeedback> */}
                                    <FormFeedback invalid>Oops! You need to enter a status.</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='isAdmin'>Admin</Label>
                                    <Input
                                        name='isAdmin'
                                        id='isAdmin'
                                        type='switch'
                                        onChange={handleChange}
                                        value={newUserData.isAdmin}
                                    />
                                    <Input
                                        name='adminPassword'
                                        id='adminPassword'
                                        type='password'
                                        placeholder='Enter the admin password'
                                        onChange={handleChange}
                                        // value={newUserData.isAdmin}
                                        disabled={newUserData.isAdmin === false}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='password'>Password</Label>
                                    <section className='passwordGroup'>
                                        <div className='inputGroup'>
                                            <Input
                                                name='password'
                                                id='password'
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder='Enter your password'
                                                onChange={handleChange}
                                                value={newUserData.password}
                                                onBlur={handleBlur}
                                                minLength={8}
                                                valid={validatePassword() && blurrred.password}
                                                invalid={!validatePassword() && blurrred.password}
                                            />
                                            {blurrred.password && !validatePassword() && (
                                                <>
                                                    {!newUserData.password.match(/^(?=.*[a-z])/) && (
                                                        <FormFeedback invalid>One lowercase letter required.</FormFeedback>
                                                    )}
                                                    {!newUserData.password.match(/^(?=.*[A-Z])/) && (
                                                        <FormFeedback invalid>One capital letter required.</FormFeedback>
                                                    )}
                                                    {!newUserData.password.match(/^(?=.*\d)/) && (
                                                        <FormFeedback invalid>One digit required.</FormFeedback>
                                                    )}
                                                    {!newUserData.password.match(/^(?=.*[!@#$%^&*(),.?":{}|<>])/) && (
                                                        <FormFeedback invalid>
                                                            One special character (!@#$%^&*(),.?":{ }|) required.
                                                        </FormFeedback>
                                                    )}
                                                    {!newUserData.password.match(/^.{8,}$/) && (
                                                        <FormFeedback invalid>Password length of 8 required.</FormFeedback>
                                                    )}
                                                </>
                                            )}
                                            {blurrred.password && validatePassword() && (
                                                <FormFeedback valid>Password meets all requirements.</FormFeedback>
                                            )}
                                        </div>
                                        <div className="visibility-icons">
                                            {showPassword ? (
                                                <VisibilityOffIcon onClick={() => setShowPassword(!showPassword)} />
                                            ) : (
                                                <VisibilityIcon onClick={() => setShowPassword(!showPassword)} />
                                            )}
                                        </div>
                                    </section>


                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for='confirmPassword'>Confirm Password</Label>
                                    <section className='passwordGroup'>
                                        <div className='inputGroup'>
                                            <Input
                                                name='confirmPassword'
                                                id='confirmPassword'
                                                type={showConfirm ? 'text' : 'password'}
                                                value={confirmationPassword}
                                                onChange={(e) => setConfirmationPassword(e.target.value)}
                                                placeholder='Re-enter your password'
                                                required
                                                onBlur={handleBlur}
                                                valid={validateConfirmPassword() && blurrred.confirmPassword}
                                                invalid={!validateConfirmPassword() && blurrred.confirmPassword}
                                            />
                                            <FormFeedback valid>Passwords match. You are all good.</FormFeedback>
                                            <FormFeedback invalid>Oops! You need to fix the passwords to match.</FormFeedback>
                                        </div>
                                        <div className="visibility-icons">
                                            {showConfirm ? (
                                                <VisibilityOffIcon onClick={() => setShowConfirm(!showConfirm)} />
                                            ) : (
                                                <VisibilityIcon onClick={() => setShowConfirm(!showConfirm)} />
                                            )}
                                        </div>
                                    </section>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                    <Link to='/login'>Login</Link>
                </CardBody>
                <CardFooter>
                    <Button disabled={isLoading || Object.values(newUserData).some(value => value == null)} form='register-form' color='primary'>
                        Submit
                    </Button>

                </CardFooter>
            </Card>
        </div >
    );
}

export default Register;