import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Badge, InputGroup } from 'react-bootstrap';

// SVG Icons
const ArrowLeftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const SettingsIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', marginTop: '-2px' }}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const EyeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  body { font-family: 'Plus Jakarta Sans', sans-serif !important; background: #f8f9fa !important; overflow-x: hidden; }

  .dc-layout-container { max-width: 1250px; margin: 0 auto; padding: 2rem 1.5rem; display: grid; grid-template-columns: 220px 1fr 280px; gap: 2rem; align-items: start; }
  .dc-sidebar-left, .dc-sidebar-right { position: sticky; top: 24px; height: calc(100vh - 48px); overflow-y: auto; padding-bottom: 1rem; display: flex; flex-direction: column; gap: 1.5rem; -ms-overflow-style: none; scrollbar-width: none; }
  .dc-sidebar-left::-webkit-scrollbar, .dc-sidebar-right::-webkit-scrollbar { display: none; }
  
  .dc-sidebar-label { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.6px; padding: 10px 10px 4px; }
  .dc-sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #555; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; transition: all 0.15s; margin-bottom: 4px; text-decoration: none;}
  .dc-sidebar-item:hover { background: #eef2f5; color: #111; }
  .dc-sidebar-item.active { background: #E6F1FB; color: #185FA5; }

  .dc-card { background: #fff !important; border: 1px solid rgba(0,0,0,0.08) !important; border-radius: 12px !important; transition: all 0.2s ease; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .dc-widget { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .dc-widget-title { font-size: 13px; font-weight: 700; color: #111; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;}

  .dc-form-label { font-size: 13px; font-weight: 700; color: #444; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;}
  .dc-input { font-size: 15px !important; background: #f8f9fa !important; border: 1px solid rgba(0,0,0,0.1) !important; border-radius: 8px !important; padding: 12px 16px !important; transition: all 0.2s !important; color: #333 !important;}
  .dc-input:focus { background: #fff !important; box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.1) !important; border-color: #185FA5 !important; outline: none !important; }

  /* Red border class for real-time validation errors */
  .dc-input-error { border-color: #dc3545 !important; }

  input[type="password"]::-ms-reveal,
  input[type="password"]::-ms-clear { display: none; }

  .dc-password-toggle {
    background: #f8f9fa !important;
    border: 1px solid rgba(0,0,0,0.1) !important;
    border-left: none !important;
    color: #888 !important;
    border-radius: 0 8px 8px 0 !important;
    transition: all 0.2s;
  }
  .dc-password-toggle:hover { color: #185FA5 !important; }
  .dc-password-toggle.error-border { border-color: #dc3545 !important; }

  @media (max-width: 992px) {
    .dc-layout-container { grid-template-columns: 1fr; padding: 1rem; gap: 1rem; }
    .dc-sidebar-right { display: none; } 
    .dc-sidebar-left { position: static; height: auto; flex-direction: row; overflow-x: auto; gap: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
    .dc-sidebar-left > div { display: flex; gap: 0.5rem; align-items: center; }
    .dc-sidebar-label { display: none; } 
    .dc-sidebar-item { width: auto; white-space: nowrap; padding: 6px 16px; }
  }
`;

const Profile = () => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem('token');

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    
    // Password States
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Eye Icon Toggles
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Submission States
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // --- REAL-TIME VALIDATION LOGIC ---
    // These evaluate to true/false automatically as the user types
    const isPasswordTooShort = password.length > 0 && password.length < 6;
    const doPasswordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
    const isFormDisabled = loading || isPasswordTooShort || doPasswordsMismatch;

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // The only validation left for the submit button is checking if they authorized it
        if (!currentPassword) {
            return setError('Please enter your Current Password to authorize these changes.');
        }

        setLoading(true);

        try {
            const response = await axios.put('http://localhost:5000/api/auth/profile',
                { name, email, currentPassword, password: password || undefined },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedUser = { ...user, name: response.data.name, email: response.data.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage('Profile updated successfully!');
            setCurrentPassword('');
            setPassword('');
            setConfirmPassword('');
            setShowCurrentPassword(false);
            setShowPassword(false);
            setShowConfirmPassword(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <style>{styles}</style>

            <div className="dc-layout-container">
                <aside className="dc-sidebar-left">
                    <div>
                        <div className="dc-sidebar-label">Navigation</div>
                        <Link to="/" className="dc-sidebar-item"><ArrowLeftIcon /> Back to Feed</Link>
                        <Link to={user.role === 'admin' ? "/admin" : "/user-dashboard"} className="dc-sidebar-item">
                            {user.role === 'admin' ? 'Admin Dashboard' : 'My Activity'}
                        </Link>
                        <div className="dc-sidebar-item active"><SettingsIcon /> Account Settings</div>
                    </div>
                </aside>

                <main>
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <h2 className="fw-bold m-0 text-dark" style={{ fontSize: '28px' }}>Account Settings</h2>
                    </div>

                    {message && <Alert variant="success" className="rounded-3">{message}</Alert>}
                    {/* Top alert is now strictly reserved for backend/authorization errors */}
                    {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

                    <div className="dc-card mb-4">
                        <h4 className="fw-bold mb-4 d-flex align-items-center text-dark" style={{ fontSize: '18px' }}>
                            <UserIcon /> Personal Information
                        </h4>
                        <Form onSubmit={handleUpdateProfile}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label className="dc-form-label">Full Name</Form.Label>
                                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} className="dc-input" />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label className="dc-form-label">Email Address</Form.Label>
                                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="dc-input" />
                                    </Form.Group>
                                </div>
                            </div>

                            <hr className="my-4 border-secondary border-opacity-10" />

                            <h4 className="fw-bold mb-4 d-flex align-items-center text-dark" style={{ fontSize: '18px' }}>
                                <LockIcon /> Security
                            </h4>
                            
                            <Form.Group className="mb-4">
                                <Form.Label className="dc-form-label text-primary">Current Password (Required)</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="Enter current password to authorize changes"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="dc-input border-primary"
                                        style={{ borderRadius: '8px 0 0 8px !important' }}
                                    />
                                    <Button
                                        className="dc-password-toggle border-primary"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <Form.Group>
                                        <Form.Label className="dc-form-label">New Password (Optional)</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Leave blank to keep current"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={`dc-input ${isPasswordTooShort ? 'dc-input-error' : ''}`}
                                                style={{ borderRadius: '8px 0 0 8px !important' }}
                                            />
                                            <Button
                                                className={`dc-password-toggle ${isPasswordTooShort ? 'error-border' : ''}`}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                            </Button>
                                        </InputGroup>
                                        {/* Real-time Inline Error */}
                                        {isPasswordTooShort && (
                                            <div className="text-danger mt-2" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                                New password must be at least 6 characters.
                                            </div>
                                        )}
                                    </Form.Group>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <Form.Group>
                                        <Form.Label className="dc-form-label">Confirm New Password</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm your new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`dc-input ${doPasswordsMismatch ? 'dc-input-error' : ''}`}
                                                disabled={!password}
                                                style={{ borderRadius: '8px 0 0 8px !important', backgroundColor: !password ? '#e9ecef' : '#f8f9fa' }}
                                            />
                                            <Button
                                                className={`dc-password-toggle ${doPasswordsMismatch ? 'error-border' : ''}`}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                disabled={!password}
                                            >
                                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                            </Button>
                                        </InputGroup>
                                        {/* Real-time Inline Error */}
                                        {doPasswordsMismatch && (
                                            <div className="text-danger mt-2" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                                Passwords do not match.
                                            </div>
                                        )}
                                    </Form.Group>
                                </div>
                            </div>

                            {/* Smart Submit Button */}
                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="fw-bold px-5 py-2 rounded-3" 
                                disabled={isFormDisabled}
                            >
                                {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                                Save Changes
                            </Button>
                        </Form>
                    </div>
                </main>

                <aside className="dc-sidebar-right">
                    <div className="dc-widget shadow-sm border-0">
                        <h4 className="dc-widget-title">Account Status</h4>
                        <div className="d-flex flex-column gap-3 mt-3">
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                <span className="text-muted small fw-bold text-uppercase">Status</span>
                                <Badge bg="success" className="px-2 py-1">ACTIVE</Badge>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                <span className="text-muted small fw-bold text-uppercase">Email</span>
                                <Badge bg="info" text="dark" className="px-2 py-1">VERIFIED</Badge>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted small fw-bold text-uppercase">Visibility</span>
                                <span className="fw-bold text-dark" style={{ fontSize: '12px' }}>Public</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Profile;