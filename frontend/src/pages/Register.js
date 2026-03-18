import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';

const EyeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700&display=swap');

  .dc-auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 20px;
  }

  .dc-auth-card {
    width: 100%;
    max-width: 480px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.05);
    padding: 40px;
  }

  .dc-logo-brand {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    color: #185FA5;
    letter-spacing: -0.5px;
    font-weight: 700;
    text-decoration: none;
    display: block;
    text-align: center;
    margin-bottom: 8px;
  }
  .dc-logo-brand span { color: #E24B4A; }

  .dc-auth-title {
    font-size: 20px;
    font-weight: 700;
    color: #111;
    text-align: center;
    margin-bottom: 32px;
  }

  .dc-label { font-size: 13px; font-weight: 700; color: #444; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  
  .dc-input { 
    font-size: 15px !important; 
    background: #f8f9fa !important; 
    border: 1px solid rgba(0,0,0,0.1) !important; 
    border-radius: 10px !important; 
    padding: 12px 16px !important; 
    transition: all 0.2s !important;
  }
  .dc-input:focus { background: #fff !important; border-color: #185FA5 !important; box-shadow: 0 0 0 4px rgba(24, 95, 165, 0.08) !important; }

  .dc-password-toggle {
    background: #f8f9fa !important;
    border: 1px solid rgba(0,0,0,0.1) !important;
    border-left: none !important;
    color: #888 !important;
    border-radius: 0 10px 10px 0 !important;
    transition: all 0.2s;
  }
  .dc-password-toggle:hover { color: #185FA5 !important; }

  .dc-btn-primary {
    background: #185FA5 !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 14px !important;
    font-weight: 700 !important;
    font-size: 16px !important;
    margin-top: 10px;
    transition: transform 0.1s;
  }
  .dc-btn-primary:active { transform: scale(0.98); }

  .dc-auth-footer {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: #666;
  }

  input[type="password"]::-ms-reveal,
  input[type="password"]::-ms-clear { display: none; }
`;

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    
    const [emailTakenError, setEmailTakenError] = useState('');

    const handleEmailBlur = async () => {
        const cleanEmail = email.trim();
        
        if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) return;

        try {
            const response = await axios.post('http://localhost:5000/api/auth/check-email', { email: cleanEmail });
            if (response.data.exists) {
                setEmailTakenError('This email is already registered. Please login instead.');
            } else {
                setEmailTakenError('');
            }
        } catch (err) {
            console.error('Email check failed', err);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!name.trim()) errors.name = 'Name is required.';
        
        if (emailTakenError) {
            errors.email = emailTakenError;
        } else if (!email.trim()) {
            errors.email = 'Email address is required.';
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            errors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            errors.password = 'Password is required.';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password
            });
            
            window.location.href = '/login';
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="dc-auth-page">
            <style>{styles}</style>

            <div className="dc-auth-card">
                <div className="dc-logo-brand">Do<span>Connect</span></div>
                <h2 className="dc-auth-title">Create Account</h2>
                
                {error && <Alert variant="danger" className="py-2 small border-0 text-center" style={{borderRadius: '8px'}}>{error}</Alert>}

                <Form noValidate onSubmit={handleRegister}>
                    <Form.Group className="mb-4">
                        <Form.Label className="dc-label">Full Name</Form.Label>
                        <Form.Control 
                            className="dc-input"
                            type="text" 
                            placeholder="John Doe" 
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (validationErrors.name) setValidationErrors({...validationErrors, name: null});
                            }}
                            isInvalid={!!validationErrors.name}
                        />
                        <Form.Control.Feedback type="invalid" className="small">{validationErrors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="dc-label">Email Address</Form.Label>
                        <Form.Control 
                            className="dc-input"
                            type="email" 
                            placeholder="name@company.com" 
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailTakenError) setEmailTakenError('');
                                if (validationErrors.email) setValidationErrors({...validationErrors, email: null});
                            }}
                            onBlur={handleEmailBlur}
                            isInvalid={!!validationErrors.email || !!emailTakenError}
                        />
                        <Form.Control.Feedback type="invalid" className="small">
                            {emailTakenError || validationErrors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="dc-label">Password</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control 
                                className="dc-input"
                                type={showPassword ? "text" : "password"} 
                                placeholder="Create a password" 
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (validationErrors.password) setValidationErrors({...validationErrors, password: null});
                                }}
                                isInvalid={!!validationErrors.password}
                                style={{ borderRadius: '10px 0 0 10px !important' }}
                            />
                            <Button 
                                className="dc-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </Button>
                            <Form.Control.Feedback type="invalid" className="small">{validationErrors.password}</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="dc-label">Confirm Password</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control 
                                className="dc-input"
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Re-enter password" 
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (validationErrors.confirmPassword) setValidationErrors({...validationErrors, confirmPassword: null});
                                }}
                                isInvalid={!!validationErrors.confirmPassword}
                                style={{ borderRadius: '10px 0 0 10px !important' }}
                            />
                            <Button 
                                className="dc-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </Button>
                            <Form.Control.Feedback type="invalid" className="small">{validationErrors.confirmPassword}</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="dc-btn-primary w-100">
                        Create Account
                    </Button>
                </Form>

                <div className="dc-auth-footer">
                    Already have an account? <Link to="/login" className="text-decoration-none fw-bold text-primary">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;