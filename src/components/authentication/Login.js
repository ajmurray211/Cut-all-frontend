import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, CardTitle, CardText, Button, Input, Label, FormGroup, Form, FormFeedback, Alert } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { useLogin } from "../../hooks/useLogin";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [validated, setValidated] = useState(false);
    const { login, error, isLoading } = useLogin();
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        e.preventDefault();
        await login(email, password);
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className="login">
            <Card className='auth_form'>
                <CardBody id=''>
                    <CardTitle tag="h3">
                        Log In
                    </CardTitle>
                    {showError && <Alert color='danger'>{error}</Alert>}
                    <CardText className='inputs'>
                        <Form name='login-form' id='login-form' noValidate validated={validated} onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for='email' >Email</Label>
                                <Input
                                    type='text'
                                    name="email"
                                    id="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter your email'
                                    required
                                    value={email}
                                    onBlur={() => setEmailTouched(true)}
                                    invalid={!validateEmail() && emailTouched}
                                />
                                {emailTouched && !validateEmail() && (
                                    <FormFeedback invalid>Please enter a valid email.</FormFeedback>
                                )}
                            </FormGroup>
                            <FormGroup >
                                <Label for='password'>Password</Label>
                                <section className='passwordGroup'>
                                    <div className='inputGroup'>

                                        <Input
                                            name='password'
                                            id='password'
                                            onBlur={() => setPasswordTouched(true)}
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder='Enter your password'
                                            required
                                            value={password}
                                            invalid={password.length === 0 && passwordTouched}
                                        />
                                        <FormFeedback invalid>Oops! You cannot leave password field blank.</FormFeedback>
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
                        </Form>
                        <Link to='/register'>Register Account</Link>
                    </CardText>
                </CardBody>
                <CardFooter>
                    <Button form='login-form' color='primary' type='submit' disabled={!password || !email}>
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Login;

