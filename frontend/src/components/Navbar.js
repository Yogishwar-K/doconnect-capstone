import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px', marginTop: '-2px'}}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ShieldIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px', marginTop: '-2px'}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;

const styles = `
  .dc-global-navbar { background: #fff !important; border-bottom: 1px solid rgba(0,0,0,0.08); padding: 0 2rem; height: 64px; display: flex; align-items: center; gap: 2rem; position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .dc-logo { font-family: 'Syne', sans-serif; font-size: 24px; color: #185FA5; letter-spacing: -0.5px; font-weight: 700; text-decoration: none;}
  .dc-logo span { color: #E24B4A; }
  .dc-logo:hover { color: #185FA5; text-decoration: none; }
  
  .dc-nav-links { display: flex; gap: 1.5rem; align-items: center; margin-right: auto; height: 100%; }
  .dc-nav-link { font-size: 14px; font-weight: 600; color: #555; text-decoration: none; transition: color 0.2s; display: flex; align-items: center; height: 100%; border-bottom: 2px solid transparent; }
  .dc-nav-link:hover { color: #185FA5; }
  .dc-nav-link.active { color: #185FA5; border-bottom-color: #185FA5; }
  
  .dc-nav-right { display: flex; align-items: center; gap: 1.25rem; margin-left: auto; }
  
  .dc-nav-cta { font-size: 13px !important; padding: 8px 16px !important; letter-spacing: 0.3px; transition: transform 0.1s; }
  .dc-nav-cta:active { transform: scale(0.96); }

  .dc-avatar { width: 38px; height: 38px; border-radius: 50%; background: #E6F1FB; color: #185FA5; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); transition: transform 0.2s;}
  .dc-avatar:hover { transform: scale(1.05); }

  .dropdown-item { font-size: 14px; padding: 10px 16px; transition: background 0.2s; }
  .dropdown-item:hover { background: #f8f9fa; color: #185FA5; }
  .dropdown-item.text-danger:hover { background: #fee2e2; color: #dc2626 !important; }
  
  .dc-guest-actions { display: flex; gap: 8px; align-items: center; }

  .desktop-cta { display: flex; align-items: center; }
  .mobile-cta { display: none; align-items: center; justify-content: center; white-space: nowrap; }

  @media (max-width: 992px) {
    .dc-nav-links { display: none; }
    .desktop-cta { display: none !important; }
    .mobile-cta { display: flex !important; }
  }
  
  @media (max-width: 576px) {
    .dc-global-navbar { padding: 0 1rem; justify-content: space-between; gap: 0; }
    .dc-logo { font-size: 20px; }
  }
`;

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // hide the navbar entirely on auth pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <>
            <style>{styles}</style>
            <div className="dc-global-navbar">
                <Link to="/" className="dc-logo">Do<span>Connect</span></Link>

                <div className="dc-nav-links">
                    <Link to="/" className={`dc-nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    {token && (
                        <>
                            <Link to="/chat" className={`dc-nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>Live Chat</Link>
                            <Link to="/user-dashboard" className={`dc-nav-link ${location.pathname === '/user-dashboard' ? 'active' : ''}`}>My Activity</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className={`dc-nav-link text-danger ${location.pathname === '/admin' ? 'active' : ''}`}>Admin Panel</Link>
                            )}
                        </>
                    )}
                </div>

                <div className="dc-nav-right">
                    
                    <Link to="/ask-question" className="btn btn-primary fw-bold rounded-pill shadow-sm dc-nav-cta desktop-cta">
                        <PlusIcon /> Ask Question
                    </Link>

                    {token ? (
                        <>
                            {/* swap the mobile CTA based on role */}
                            {user.role === 'admin' ? (
                                <Link to="/admin" className="btn btn-danger fw-bold rounded-pill shadow-sm mobile-cta px-3 me-2" style={{fontSize: '12px', height: '32px'}}>
                                    <ShieldIcon /> Admin
                                </Link>
                            ) : (
                                <Link to="/ask-question" className="btn btn-primary fw-bold rounded-pill shadow-sm mobile-cta px-3 me-2" style={{fontSize: '12px', height: '32px'}}>
                                    <PlusIcon /> Ask
                                </Link>
                            )}

                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" className="p-0 border-0 text-decoration-none shadow-none">
                                    <div className="dc-avatar" title={user.name}>{initials}</div>
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="shadow border-0 mt-3" style={{ borderRadius: '12px', minWidth: '230px' }}>
                                    <div className="px-3 py-2 mb-1" style={{ cursor: 'default' }}>
                                        <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>{user.name}</div>
                                        <div className="text-muted" style={{ fontSize: '13px' }}>{user.email}</div>
                                    </div>
                                    <Dropdown.Divider className="my-1" />

                                    {/* mobile-only nav links inside the dropdown */}
                                    <div className="d-lg-none">
                                        <Dropdown.Item as={Link} to="/" className="fw-semibold">Home</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/chat" className="fw-semibold">Live Chat</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/user-dashboard" className="fw-semibold">My Activity</Dropdown.Item>
                                        <Dropdown.Divider className="my-1" />
                                    </div>

                                    <Dropdown.Item as={Link} to="/profile" className="fw-semibold">Account Settings</Dropdown.Item>
                                    <Dropdown.Divider className="my-1" />
                                    <Dropdown.Item onClick={handleLogout} className="text-danger fw-bold">Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline-primary fw-bold rounded-pill shadow-sm mobile-cta px-3 bg-white" style={{fontSize: '12px', height: '32px'}}>
                                Log In
                            </Link>

                            <div className="dc-guest-actions d-none d-lg-flex ms-2">
                                <Link to="/login" className="btn btn-light fw-bold rounded-pill px-3 shadow-sm dc-nav-cta border">Log In</Link>
                                <Link to="/register" className="btn btn-dark fw-bold rounded-pill px-3 shadow-sm dc-nav-cta">Sign Up</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;