import '../../App.css';
import { Card, CardBody, CardFooter, CardTitle, CardText, Button, Input, Label, FormGroup, Form, FormFeedback } from 'reactstrap'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [validated, setValidated] = useState(false);
    const { login, error, isLoading } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(email, password)
        await login(email, password)
    };

    return (
        <div className="login">
            <Card
                className='auth_form'
            >
                <CardBody id=''>
                    <CardTitle tag="h3">
                        Log In
                    </CardTitle>
                    <CardText className='inputs'>
                        <Form name='login-form' id='login-form' noValidate validated={validated} onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for='email' >email</Label>
                                <Input
                                    type='text'
                                    name="email"
                                    id="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter a email'
                                    required
                                    value={email}
                                    onBlur={() => setEmailTouched(true)}
                                    invalid={email.length === 0 && emailTouched}
                                />
                                <FormFeedback invalid>Oops! You cannot leve username blank.</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for='password'>Password</Label>
                                <Input
                                    name='password'
                                    id='password'
                                    onBlur={() => setPasswordTouched(true)}
                                    type='password'
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Enter your password'
                                    required
                                    value={password}
                                    invalid={password.length === 0 && passwordTouched}
                                />
                                <FormFeedback invalid>Oops! You cannot leve password blank.</FormFeedback>
                            </FormGroup>
                        </Form>
                        <Link to='/register'>Register Account</Link>
                    </CardText>
                </CardBody>
                <CardFooter>
                    <Button form='login-form' color='primary' type='submit'>
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Login;