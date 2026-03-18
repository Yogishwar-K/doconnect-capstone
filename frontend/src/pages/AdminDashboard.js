import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Alert, Spinner, Badge, Table, Modal } from 'react-bootstrap';

// SVG Icons
const ArrowLeftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const ShieldIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const FileTextIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const MessageSquareIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const UsersIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ArchiveIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>;
const RefreshIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const EmptyInboxIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700&display=swap');

  body { font-family: 'Plus Jakarta Sans', sans-serif !important; background: #f8f9fa !important; overflow-x: hidden; }

  .dc-layout-container { max-width: 1250px; margin: 0 auto; padding: 2rem 1.5rem; display: grid; grid-template-columns: 220px 1fr 280px; gap: 2rem; align-items: start; }
  .dc-layout-container > * { min-width: 0; }

  .dc-sidebar-left, .dc-sidebar-right { position: sticky; top: 24px; height: calc(100vh - 48px); overflow-y: auto; padding-bottom: 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
  .dc-sidebar-left::-webkit-scrollbar, .dc-sidebar-right::-webkit-scrollbar { display: none; }
  .dc-sidebar-left, .dc-sidebar-right { -ms-overflow-style: none; scrollbar-width: none; }

  .dc-sidebar-label { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.6px; padding: 10px 10px 4px; }
  .dc-sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #555; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; transition: all 0.15s; margin-bottom: 4px; text-decoration: none;}
  .dc-sidebar-item:hover { background: #eef2f5; color: #111; }
  .dc-sidebar-item.active { background: #fee2e2; color: #e11d48; }
  
  .dc-card { background: #fff !important; border: 1px solid rgba(0,0,0,0.08) !important; border-radius: 12px !important; transition: all 0.2s ease; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .dc-widget { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .dc-widget-title { font-size: 13px; font-weight: 700; color: #111; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;}

  .dc-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .dc-stat { background: #f8f9fa; border-radius: 8px; padding: 16px 12px; text-align: center; border: 1px solid #eee; }
  .dc-stat-num { font-size: 24px; font-weight: 700; color: #185FA5; line-height: 1; margin-bottom: 6px;}
  .dc-stat-lbl { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; }

  @media (max-width: 992px) {
    .dc-layout-container { grid-template-columns: 1fr; padding: 1rem; gap: 1rem; }
    .dc-sidebar-right { display: none; } 
    .dc-sidebar-left { position: static; height: auto; flex-direction: row; overflow-x: auto; gap: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
    .dc-sidebar-left > div { display: flex; gap: 0.5rem; align-items: center; }
    .dc-sidebar-label { display: none; } 
    .dc-sidebar-item { width: auto; white-space: nowrap; padding: 6px 16px; }
  }

  @media (max-width: 576px) {
    .dc-layout-container { padding: 1rem 0.5rem; gap: 1rem; }
    .dc-card { padding: 1rem !important; }
  }
`;

const TruncatedText = ({ text, maxLength = 200, className, style }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    if (text.length <= maxLength) {
        return <p className={className} style={style}>{text}</p>;
    }

    return (
        <div className={className} style={style}>
            {isExpanded ? text : `${text.substring(0, maxLength)}...`}
            <span
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ color: '#185FA5', cursor: 'pointer', fontWeight: '700', marginLeft: '8px', fontSize: '0.9em' }}
            >
                {isExpanded ? 'Show Less' : 'Read More'}
            </span>
        </div>
    );
};

const AdminDashboard = () => {
    // Content States
    const [pendingQuestions, setPendingQuestions] = useState([]);
    const [pendingAnswers, setPendingAnswers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [archivedResolved, setArchivedResolved] = useState([]);
    const [archivedDeleted, setArchivedDeleted] = useState([]);

    // UI States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [activeTab, setActiveTab] = useState('questions');
    const [modalConfig, setModalConfig] = useState({
        show: false, title: '', body: '', actionText: '', actionVariant: 'danger', onConfirm: null
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const qResponse = await axios.get('http://localhost:5000/api/admin/questions/pending', { headers });
            setPendingQuestions(qResponse.data);

            const aResponse = await axios.get('http://localhost:5000/api/admin/answers/pending', { headers });
            setPendingAnswers(aResponse.data);

            const uResponse = await axios.get('http://localhost:5000/api/auth/users', { headers });
            setAllUsers(uResponse.data);

            // Fetching the Archive payload from the Profile Controller
            // Note: Ensure your route for getUserProfileActivity is mapped to /api/auth/profile using GET
            try {
                const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', { headers });
                if (profileResponse.data && profileResponse.data.adminActivity) {
                    setArchivedResolved(profileResponse.data.adminActivity.closedThreads || []);
                    setArchivedDeleted(profileResponse.data.adminActivity.deletedThreads || []);
                }
            } catch (archiveErr) {
                console.warn("Could not fetch archived threads data.");
            }

        } catch (err) {
            setError('Could not load dashboard data. Please ensure you are logged in as an Admin.');
        } finally {
            setLoading(false);
        }
    };

    const closeConfirmModal = () => setModalConfig({ ...modalConfig, show: false });

    const openConfirmModal = (title, body, actionText, actionVariant, onConfirmAction) => {
        setModalConfig({ show: true, title, body, actionText, actionVariant, onConfirm: onConfirmAction });
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const formatImageUrl = (dbPath) => {
        if (!dbPath) return '';
        const cleanPath = dbPath.replace(/\\/g, '/').replace(/^\//, '');
        return `http://localhost:5000/${cleanPath}`;
    };

    // Handlers
    const handleApproveQuestion = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/questions/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
            showSuccess('Question approved successfully.');
            fetchAllData();
        } catch (err) { setError('Question approval failed.'); }
    };

    const handleRejectQuestion = (id) => {
        openConfirmModal(
            "Reject Question",
            "Are you sure you want to reject and permanently delete this question?",
            "Reject & Delete",
            "danger",
            async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:5000/api/admin/questions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    showSuccess('Question rejected and deleted.');
                    fetchAllData();
                } catch (err) { setError('Question rejection failed.'); }
                closeConfirmModal();
            }
        );
    };

    const handleApproveAnswer = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/answers/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
            showSuccess('Answer approved successfully.');
            fetchAllData();
        } catch (err) { setError('Answer approval failed.'); }
    };

    const handleRejectAnswer = (id) => {
        openConfirmModal(
            "Reject Answer",
            "Are you sure you want to reject and permanently delete this answer?",
            "Reject & Delete",
            "danger",
            async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:5000/api/admin/answers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    showSuccess('Answer rejected and deleted.');
                    fetchAllData();
                } catch (err) { setError('Answer rejection failed.'); }
                closeConfirmModal();
            }
        );
    };

    const handleToggleUserStatus = (userId, currentIsActive) => {
        const action = currentIsActive ? 'deactivate' : 'reactivate';
        openConfirmModal(
            `${currentIsActive ? 'Deactivate' : 'Reactivate'} User`,
            `Are you sure you want to ${action} this user? ${currentIsActive ? 'They will not be able to log in.' : 'Their access will be restored.'}`,
            currentIsActive ? 'Deactivate' : 'Reactivate',
            currentIsActive ? 'warning' : 'success',
            async () => {
                try {
                    const token = localStorage.getItem('token');
                    await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`,
                        { isActive: !currentIsActive },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    showSuccess(`User successfully ${action}d.`);
                    fetchAllData();
                } catch (err) { setError(`Failed to ${action} user.`); }
                closeConfirmModal();
            }
        );
    };

    const totalPending = pendingQuestions.length + pendingAnswers.length;
    const activeUsers = allUsers.filter(u => u.isActive !== false).length;
    const totalArchived = archivedResolved.length + archivedDeleted.length;

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <style>{styles}</style>

            {/* The Confirmation Modal */}
            <Modal show={modalConfig.show} onHide={closeConfirmModal} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold fs-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{modalConfig.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2 text-muted" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {modalConfig.body}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="fw-bold" onClick={closeConfirmModal}>Cancel</Button>
                    <Button variant={modalConfig.actionVariant} className="fw-bold px-4" onClick={modalConfig.onConfirm}>{modalConfig.actionText}</Button>
                </Modal.Footer>
            </Modal>

            <div className="dc-layout-container">

                <aside className="dc-sidebar-left">
                    <div>
                        <div className="dc-sidebar-label">Navigation</div>
                        <Link to="/" className="dc-sidebar-item">
                            <ArrowLeftIcon /> Back to Feed
                        </Link>
                        <div className="dc-sidebar-item active mt-2">
                            <ShieldIcon /> Admin Panel
                        </div>
                    </div>
                </aside>

                <main>
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <h2 className="fw-bold text-dark mb-0" style={{ fontSize: '24px' }}>Moderation Dashboard</h2>
                        <Button variant="outline-secondary" size="sm" className="fw-bold rounded-pill px-3 d-flex align-items-center" onClick={fetchAllData} disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : <RefreshIcon />}
                            {loading ? 'Refreshing...' : 'Refresh Data'}
                        </Button>
                    </div>

                    {error && <Alert variant="danger" className="rounded-3" style={{ fontSize: '14px' }}>{error}</Alert>}
                    {successMsg && <Alert variant="success" className="rounded-3" style={{ fontSize: '14px' }}>{successMsg}</Alert>}

                    {/* The TABS Section */}
                    <div className="d-flex gap-2 mb-4 border-bottom pb-3 overflow-auto">
                        <button
                            className={`btn fw-bold px-4 rounded-pill ${activeTab === 'questions' ? 'btn-danger shadow-sm' : 'btn-light text-muted border'}`}
                            onClick={() => setActiveTab('questions')}
                            style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
                        >
                            <FileTextIcon /> Questions
                            <Badge bg={activeTab === 'questions' ? 'light' : 'secondary'} text={activeTab === 'questions' ? 'danger' : 'light'} pill className="ms-2">{pendingQuestions.length}</Badge>
                        </button>
                        <button
                            className={`btn fw-bold px-4 rounded-pill ${activeTab === 'answers' ? 'btn-danger shadow-sm' : 'btn-light text-muted border'}`}
                            onClick={() => setActiveTab('answers')}
                            style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
                        >
                            <MessageSquareIcon /> Answers
                            <Badge bg={activeTab === 'answers' ? 'light' : 'secondary'} text={activeTab === 'answers' ? 'danger' : 'light'} pill className="ms-2">{pendingAnswers.length}</Badge>
                        </button>
                        <button
                            className={`btn fw-bold px-4 rounded-pill ${activeTab === 'users' ? 'btn-dark shadow-sm' : 'btn-light text-muted border'}`}
                            onClick={() => setActiveTab('users')}
                            style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
                        >
                            <UsersIcon /> Users
                            <Badge bg={activeTab === 'users' ? 'light' : 'secondary'} text={activeTab === 'users' ? 'dark' : 'light'} pill className="ms-2">{allUsers.length}</Badge>
                        </button>
                        <button
                            className={`btn fw-bold px-4 rounded-pill ${activeTab === 'archive' ? 'btn-secondary shadow-sm' : 'btn-light text-muted border'}`}
                            onClick={() => setActiveTab('archive')}
                            style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
                        >
                            <ArchiveIcon /> Archive
                            <Badge bg={activeTab === 'archive' ? 'light' : 'secondary'} text={activeTab === 'archive' ? 'dark' : 'light'} pill className="ms-2">{totalArchived}</Badge>
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: '#185FA5' }} />
                        </div>
                    ) : (
                        <>
                            {/* QUESTIONS TAB */}
                            {activeTab === 'questions' && (
                                <>
                                    {pendingQuestions.length === 0 ? (
                                        <div className="dc-card text-center py-5 shadow-sm d-flex flex-column align-items-center">
                                            <EmptyInboxIcon />
                                            <div className="fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>All caught up!</div>
                                            <div className="text-muted" style={{ fontSize: '13px' }}>No questions waiting for approval.</div>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3">
                                            {pendingQuestions.map(q => (
                                                <div key={q._id} className="dc-card">
                                                    <h4 className="fw-bold text-dark mb-3" style={{ fontSize: '18px' }}>{q.title}</h4>
                                                    <TruncatedText
                                                        text={q.description}
                                                        maxLength={250}
                                                        className="text-muted mb-4"
                                                        style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6' }}
                                                    />                                                    {q.imageUrl && (
                                                        <div className="mb-4 p-2 bg-light rounded border text-center">
                                                            <img src={formatImageUrl(q.imageUrl)} alt="Attachment" className="img-fluid rounded" style={{ maxHeight: '250px', objectFit: 'contain' }} />
                                                        </div>
                                                    )}
                                                    <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                                                        <Button variant="light" className="fw-bold text-danger d-flex align-items-center border" onClick={() => handleRejectQuestion(q._id)} style={{ fontSize: '14px' }}>
                                                            <XIcon /> Reject
                                                        </Button>
                                                        <Button variant="success" className="fw-bold px-4 d-flex align-items-center" onClick={() => handleApproveQuestion(q._id)} style={{ fontSize: '14px' }}>
                                                            <CheckIcon /> Approve
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ANSWERS TAB */}
                            {activeTab === 'answers' && (
                                <>
                                    {pendingAnswers.length === 0 ? (
                                        <div className="dc-card text-center py-5 shadow-sm d-flex flex-column align-items-center">
                                            <EmptyInboxIcon />
                                            <div className="fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>All caught up!</div>
                                            <div className="text-muted" style={{ fontSize: '13px' }}>No answers waiting for approval.</div>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3">
                                            {pendingAnswers.map(ans => (
                                                <div key={ans._id} className="dc-card bg-light border-0">
                                                    <TruncatedText
                                                        text={ans.body}
                                                        maxLength={250}
                                                        className="text-dark mb-4"
                                                        style={{ whiteSpace: 'pre-wrap', fontSize: '15px', lineHeight: '1.6' }}
                                                    />                                                    <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-10">
                                                        <Button variant="outline-danger" className="fw-bold d-flex align-items-center bg-white" onClick={() => handleRejectAnswer(ans._id)} style={{ fontSize: '13px' }}>
                                                            <XIcon /> Reject
                                                        </Button>
                                                        <Button variant="success" className="fw-bold px-4 d-flex align-items-center" onClick={() => handleApproveAnswer(ans._id)} style={{ fontSize: '13px' }}>
                                                            <CheckIcon /> Approve
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* USERS TAB */}
                            {activeTab === 'users' && (
                                <div className="dc-card p-0 overflow-hidden shadow-sm">
                                    <Table responsive hover className="mb-0" style={{ fontSize: '14px' }}>
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3 text-uppercase text-muted" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Name</th>
                                                <th className="py-3 text-uppercase text-muted" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Email</th>
                                                <th className="py-3 text-uppercase text-muted" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Role</th>
                                                <th className="py-3 text-uppercase text-muted" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Status</th>
                                                <th className="px-4 py-3 text-end text-uppercase text-muted" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.map(u => (
                                                <tr key={u._id} className="align-middle">
                                                    <td className="px-4 fw-bold text-dark">{u.name}</td>
                                                    <td className="text-muted">{u.email}</td>
                                                    <td>
                                                        <Badge bg={u.role === 'admin' ? 'danger' : 'secondary'} className="fw-bold">
                                                            {u.role.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg={u.isActive === false ? 'warning' : 'success'} text={u.isActive === false ? 'dark' : 'light'} className="fw-bold">
                                                            {u.isActive === false ? 'Deactivated' : 'Active'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 text-end">
                                                        {u.role !== 'admin' && (
                                                            <Button
                                                                variant={u.isActive === false ? 'outline-success' : 'outline-danger'}
                                                                size="sm"
                                                                className="fw-bold"
                                                                onClick={() => handleToggleUserStatus(u._id, u.isActive)}
                                                                style={{ fontSize: '12px' }}
                                                            >
                                                                {u.isActive === false ? 'Reactivate' : 'Deactivate'}
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}

                            {/* NEW: ARCHIVE TAB */}
                            {activeTab === 'archive' && (
                                <div className="d-flex flex-column gap-4">
                                    {/* Resolved Threads */}
                                    <div className="dc-card p-0 overflow-hidden shadow-sm">
                                        <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
                                            <CheckIcon /> <h5 className="fw-bold text-success m-0" style={{ fontSize: '15px' }}>Resolved Threads</h5>
                                        </div>
                                        {archivedResolved.length === 0 ? (
                                            <p className="text-muted p-4 mb-0 text-center" style={{ fontSize: '14px' }}>No resolved threads in the system.</p>
                                        ) : (
                                            <Table responsive hover className="mb-0" style={{ fontSize: '14px' }}>
                                                <tbody>
                                                    {archivedResolved.map(t => (
                                                        <tr key={t._id}>
                                                            <td className="px-4 py-3 fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>
                                                                {t.title}
                                                            </td>                                                            <td className="px-4 py-3 text-end">
                                                                <Badge bg="success" className="px-2 py-1">Resolved</Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>

                                    {/* Deleted Threads */}
                                    <div className="dc-card p-0 overflow-hidden shadow-sm">
                                        <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center gap-2">
                                            <XIcon /> <h5 className="fw-bold text-danger m-0" style={{ fontSize: '15px' }}>Deleted Threads</h5>
                                        </div>
                                        {archivedDeleted.length === 0 ? (
                                            <p className="text-muted p-4 mb-0 text-center" style={{ fontSize: '14px' }}>No deleted threads in the system.</p>
                                        ) : (
                                            <Table responsive hover className="mb-0" style={{ fontSize: '14px' }}>
                                                <tbody>
                                                    {archivedDeleted.map(t => (
                                                        <tr key={t._id}>
                                                            <td className="px-4 py-3 fw-bold text-dark">{t.title}</td>
                                                            <td className="px-4 py-3 text-end">
                                                                <Badge bg="danger" className="px-2 py-1">Deleted</Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>

                <aside className="dc-sidebar-right">
                    <div className="dc-widget shadow-sm border-0">
                        <h4 className="dc-widget-title">System Overview</h4>
                        <div className="dc-stat-grid mb-3">
                            <div className="dc-stat bg-white shadow-sm border" style={{ gridColumn: 'span 2' }}>
                                <div className={`dc-stat-num ${totalPending > 0 ? 'text-danger' : 'text-success'}`}>{totalPending}</div>
                                <div className="dc-stat-lbl">Total Pending Items</div>
                            </div>
                            <div className="dc-stat bg-white shadow-sm border">
                                <div className="dc-stat-num text-dark">{allUsers.length}</div>
                                <div className="dc-stat-lbl">Users</div>
                            </div>
                            <div className="dc-stat bg-white shadow-sm border">
                                <div className="dc-stat-num text-success">{activeUsers}</div>
                                <div className="dc-stat-lbl">Active</div>
                            </div>
                            <div className="dc-stat bg-white shadow-sm border" style={{ gridColumn: 'span 2' }}>
                                <div className="dc-stat-num text-secondary">{totalArchived}</div>
                                <div className="dc-stat-lbl">Total Archived Threads</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AdminDashboard;