import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

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
    max-width: 440px;
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
`;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgot = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email.trim()) {
            return setError('Email address is required.');
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Error generating link. Please try again.');
        }
    };

    return (
        <div className="dc-auth-page">
            <style>{styles}</style>

            <div className="dc-auth-card">
                <div className="dc-logo-brand">Do<span>Connect</span></div>
                <h2 className="dc-auth-title">Reset Password</h2>

                {error && <Alert variant="danger" className="py-2 small border-0 text-center" style={{ borderRadius: '8px' }}>{error}</Alert>}
                {message && <Alert variant="success" className="py-2 small border-0 text-center" style={{ borderRadius: '8px' }}>{message}</Alert>}

                <Form onSubmit={handleForgot}>
                    <Form.Group className="mb-4">
                        <Form.Label className="dc-label">Email Address</Form.Label>
                        <Form.Control
                            className="dc-input"
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="dc-btn-primary w-100">
                        Generate Reset Link
                    </Button>
                </Form>

                <div className="dc-auth-footer">
                    Remember your password? <Link to="/login" className="text-decoration-none fw-bold text-primary">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;