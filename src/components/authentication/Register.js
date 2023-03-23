import { Link } from 'react-router-dom';
import { Card, CardBody, CardFooter, CardTitle, CardText, Button, Input, Label, FormFeedback, FormGroup, Form, Alert } from 'reactstrap'
import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmationPassword, setConfirmationPassword] = useState(null)
    const [validated, setValidated] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
    const { signup, isLoading, error } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(email, password)
        await signup(email, password)
    };

    return (
        <div>
            <Card
                className='auth_form'
            >
                {error && <Alert color='danger' classname="error">{error}</Alert>}
                <CardBody id=''>
                    <CardTitle tag="h3">
                        Register
                    </CardTitle>
                    <CardText className='inputs'>
                        <Form name='register-form' id='register-form' noValidate onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for='email' >email</Label>
                                <Input
                                    name='email'
                                    id='email'
                                    type='text'
                                    placeholder='Enter a email'
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    onBlur={() => setEmailTouched(true)}
                                    valid={email.length > 0 && emailTouched}
                                    invalid={email.length === 0 && emailTouched}
                                />
                                <FormFeedback valid>email is valid</FormFeedback>
                                <FormFeedback invalid>Oops! You need to enter a email.</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for='password'>Password</Label>
                                <Input
                                    name='password'
                                    id='password'
                                    type='password'
                                    placeholder='Enter your password'
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    onBlur={() => setPasswordTouched(true)}
                                    minLength={8}
                                    valid={password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/) && passwordTouched}
                                    invalid={!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/) && passwordTouched}
                                />
                                <FormFeedback valid>Password meets all requirements.</FormFeedback>
                                <FormFeedback invalid>Oops! You need to meet all password requirements.</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for='confirmpassword'>Confirm Password</Label>
                                <Input
                                    name='confirmPassword'
                                    id='confirmPassword'
                                    type='password'
                                    value={confirmationPassword}
                                    onChange={(e) => setConfirmationPassword(e.target.value)}
                                    placeholder='Renter your password'
                                    required
                                    onBlur={() => setConfirmPasswordTouched(true)}
                                    minLength={8}
                                    valid={password.match(confirmationPassword) && confirmPasswordTouched}
                                    invalid={!password.match(confirmationPassword) && confirmPasswordTouched}
                                />
                                <FormFeedback valid>Passwords match you are all good</FormFeedback>
                                <FormFeedback invalid>Oops! You need to fix the passwords to match.</FormFeedback>
                            </FormGroup>
                        </Form>
                        <Link to='/login'>Login</Link>
                    </CardText>
                </CardBody>
                <CardFooter>
                    <Button disabled={isLoading} form='register-form' color='primary'>
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Register;