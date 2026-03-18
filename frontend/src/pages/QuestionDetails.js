import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Form, Alert, Spinner, InputGroup, Modal } from 'react-bootstrap';

const ThumbsUpOutline = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>;
const ThumbsUpFilled = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>;
const ArrowLeftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const CommentIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const EmptyInboxIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>;
const LockSmallIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'text-bottom' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700&display=swap');

  body { font-family: 'Plus Jakarta Sans', sans-serif !important; background: #f8f9fa !important; overflow-x: hidden; }

  .dc-layout-container { max-width: 1250px; margin: 0 auto; padding: 2rem 1.5rem; display: grid; grid-template-columns: 220px 1fr 280px; gap: 2rem; align-items: start; }
  .dc-layout-container > * { min-width: 0; }

  .dc-sidebar-left, .dc-sidebar-right { position: sticky; top: 88px; height: calc(100vh - 100px); overflow-y: auto; padding-bottom: 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
  .dc-sidebar-left::-webkit-scrollbar, .dc-sidebar-right::-webkit-scrollbar { display: none; }
  .dc-sidebar-left, .dc-sidebar-right { -ms-overflow-style: none; scrollbar-width: none; }

  .dc-sidebar-label { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.6px; padding: 10px 10px 4px; }
  .dc-sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #555; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; transition: all 0.15s; margin-bottom: 4px; text-decoration: none;}
  .dc-sidebar-item:hover { background: #eef2f5; color: #111; }
  
  .dc-card { background: #fff !important; border: 1px solid rgba(0,0,0,0.08) !important; border-radius: 12px !important; transition: all 0.2s ease; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .dc-widget { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .dc-widget-title { font-size: 13px; font-weight: 700; color: #111; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;}

  .dc-card-inner { display: flex; gap: 1.25rem; }
  .dc-stats-col { display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 60px; padding-right: 16px; border-right: 1px solid rgba(0,0,0,0.04); }
  .dc-vote-stack { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .dc-vote-arrow { background: transparent; border: none; font-size: 24px; color: #cbd5e1; cursor: pointer; padding: 0; line-height: 1; transition: color 0.2s;}
  .dc-vote-arrow:hover { color: #94a3b8; }
  .dc-vote-arrow.upvoted { color: #f97316; }
  .dc-vote-arrow.downvoted { color: #3b82f6; }
  .dc-vote-score { font-size: 18px; font-weight: 700; color: #64748b; line-height: 1; }

  .dc-content-col { flex: 1; display: flex; flex-direction: column; }
  .dc-q-title { font-size: 20px; font-weight: 700; color: #111; text-decoration: none; line-height: 1.3; }
  .dc-q-desc { font-size: 14px; color: #444; line-height: 1.6; white-space: pre-wrap; margin: 8px 0 16px; }

  .dc-tag { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; background: #eef2f5; color: #444; border: 1px solid transparent; display: inline-block;}
  .dc-status-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;}
  .status-open { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .status-resolved { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; }
  .status-pending { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

  .dc-action-btn { color: #666; border-color: rgba(0,0,0,0.1) !important; background: transparent !important; transition: all 0.2s; }
  .dc-action-btn:hover { background: #f8f9fa !important; color: #111; border-color: rgba(0,0,0,0.2) !important; }
  .dc-action-btn.active-like { background: #e8f5e9 !important; color: #1D9E75 !important; border-color: #c8e6c9 !important; }
  .dc-action-btn.active-comment { background: #E6F1FB !important; color: #185FA5 !important; border-color: #B5D4F4 !important; }

  .dc-comments-wrapper { max-height: 250px; overflow-y: auto; padding-right: 8px; }
  .dc-comments-wrapper::-webkit-scrollbar { width: 6px; }
  .dc-comments-wrapper::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
  .dc-comments-wrapper::-webkit-scrollbar-track { background: transparent; }

  .dc-textarea { font-size: 14px; background: #f8f9fa; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; padding: 12px; transition: all 0.2s; }
  .dc-textarea:focus { background: #fff; box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.1); border-color: #185FA5; outline: none; }

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
    .dc-card-inner { flex-direction: column; gap: 0.5rem; } 
    .dc-content-col { order: 1; } 
    .dc-stats-col { order: 2; flex-direction: row; align-items: center; justify-content: flex-start; border-right: none; border-top: 1px solid rgba(0,0,0,0.06); padding-right: 0; padding-top: 12px; margin-top: 8px; gap: 16px; }
    .dc-vote-stack { flex-direction: row; gap: 12px; align-items: center; }
    .dc-vote-score { margin: 0; }
    .dc-q-title { font-size: 18px;}
  }
`;

// Helper Component for truncating long text
const TruncatedText = ({ text, maxLength = 300, className, style }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    if (text.length <= maxLength) {
        return <div className={className} style={style}>{text}</div>;
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

const QuestionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);

    const [newAnswer, setNewAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [answerError, setAnswerError] = useState('');

    const [expandedComments, setExpandedComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [modalConfig, setModalConfig] = useState({
        show: false,
        title: '',
        body: '',
        actionText: '',
        actionVariant: 'danger',
        onConfirm: null
    });

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchDiscussion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchDiscussion = async () => {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(`http://localhost:5000/api/questions/${id}`, { headers });
            setQuestion(response.data.question);
            setAnswers(response.data.answers);
        } catch (err) {
            setError('Could not load the discussion. It may be pending approval or deleted.');
        }
    };

    const closeConfirmModal = () => setModalConfig({ ...modalConfig, show: false });

    const openConfirmModal = (title, body, actionText, actionVariant, onConfirmAction) => {
        setModalConfig({ show: true, title, body, actionText, actionVariant, onConfirm: onConfirmAction });
    };

    const handleQuestionVote = async (type) => {
        if (!token || !user._id) return navigate('/login');

        let updatedUpvotes = question.upvotes || [];
        let updatedDownvotes = question.downvotes || [];

        updatedUpvotes = updatedUpvotes.filter(uid => uid !== user._id);
        updatedDownvotes = updatedDownvotes.filter(uid => uid !== user._id);

        if (type === 'upvote') updatedUpvotes.push(user._id);
        if (type === 'downvote') updatedDownvotes.push(user._id);

        setQuestion({ ...question, upvotes: updatedUpvotes, downvotes: updatedDownvotes });

        try {
            await axios.post(`http://localhost:5000/api/questions/${question._id}/vote`,
                { voteType: type === 'upvote' || type === 'downvote' ? type : null },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("Failed to cast vote", err);
        }
    };

    const validateAnswer = () => {
        if (!newAnswer.trim()) {
            setAnswerError('Answer cannot be empty.');
            return false;
        }
        if (newAnswer.trim().length < 15) {
            setAnswerError('Please provide a more detailed answer (at least 15 characters).');
            return false;
        }
        setAnswerError('');
        return true;
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!validateAnswer()) return;

        setIsSubmitting(true);
        try {
            await axios.post(`http://localhost:5000/api/questions/${id}/answers`, { body: newAnswer }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Your answer has been submitted and is waiting for Admin approval.');
            setNewAnswer('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit answer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikeToggle = async (answerId) => {
        if (!token) return navigate('/login');

        try {
            setAnswers(prevAnswers => prevAnswers.map(ans => {
                if (ans._id === answerId) {
                    const wasLiked = ans.userHasLiked;
                    return {
                        ...ans,
                        userHasLiked: !wasLiked,
                        likesCount: wasLiked ? (ans.likesCount || 1) - 1 : (ans.likesCount || 0) + 1
                    };
                }
                return ans;
            }));

            await axios.post(`http://localhost:5000/api/questions/answers/${answerId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            alert('Failed to process like.');
            fetchDiscussion();
        }
    };

    const toggleComments = (answerId) => {
        setExpandedComments(prev => ({ ...prev, [answerId]: !prev[answerId] }));
    };

    const handleCommentSubmit = async (e, answerId) => {
        e.preventDefault();
        if (!token) return navigate('/login');

        const commentBody = commentInputs[answerId];
        if (!commentBody || commentBody.trim() === '') return;

        try {
            await axios.post(`http://localhost:5000/api/questions/answers/${answerId}/comments`, { body: commentBody }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCommentInputs({ ...commentInputs, [answerId]: '' });
            fetchDiscussion();
        } catch (err) {
            alert('Failed to post comment.');
        }
    };

    const handleCommentChange = (answerId, text) => {
        setCommentInputs({ ...commentInputs, [answerId]: text });
    };

    const handleDeleteComment = (commentId) => {
        openConfirmModal(
            "Delete Comment",
            "Are you sure you want to delete your comment? This action cannot be undone.",
            "Delete",
            "danger",
            async () => {
                try {
                    await axios.delete(`http://localhost:5000/api/questions/answers/comments/${commentId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchDiscussion();
                } catch (err) {
                    alert('Failed to delete comment.');
                }
                closeConfirmModal();
            }
        );
    };

    const handleCloseThread = () => {
        openConfirmModal(
            "Close Thread",
            "Are you sure you want to close this discussion? No new answers will be accepted.",
            "Close Thread",
            "warning",
            async () => {
                try {
                    await axios.put(`http://localhost:5000/api/admin/questions/${id}/resolve`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchDiscussion();
                } catch (err) {
                    alert('Failed to close the thread.');
                }
                closeConfirmModal();
            }
        );
    };

    const handleDeleteThread = () => {
        openConfirmModal(
            "Delete Thread",
            "Are you sure you want to delete this entire discussion? This removes all answers and comments and cannot be undone.",
            "Delete Everything",
            "danger",
            async () => {
                try {
                    await axios.delete(`http://localhost:5000/api/admin/questions/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    navigate('/');
                } catch (err) {
                    alert('Failed to delete the thread.');
                }
                closeConfirmModal();
            }
        );
    };

    const timeAgo = (date) => {
        if (!date) return '';
        const diff = Math.floor((Date.now() - new Date(date)) / 1000);
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const scrollToAnswerForm = () => {
        const formElement = document.getElementById('write-answer-section');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    if (error && !question) return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '4rem', textAlign: 'center' }}>
            <Alert variant="danger" className="d-inline-block shadow-sm">{error}</Alert>
            <div><Button as={Link} to="/" variant="primary">Return Home</Button></div>
        </div>
    );
    
    if (!question) return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '4rem', textAlign: 'center' }}>
            <Spinner animation="border" style={{ color: '#185FA5' }} className="mb-3" />
            <h5 className="text-muted">Loading discussion...</h5>
        </div>
    );

    const score = (question.upvotes?.length || 0) - (question.downvotes?.length || 0);
    const hasUpvoted = question.upvotes?.includes(user?._id);
    const hasDownvoted = question.downvotes?.includes(user?._id);

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <style>{styles}</style>

            <Modal show={modalConfig.show} onHide={closeConfirmModal} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold fs-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{modalConfig.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2 text-muted" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {modalConfig.body}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="fw-bold" onClick={closeConfirmModal}>
                        Cancel
                    </Button>
                    <Button variant={modalConfig.actionVariant} className="fw-bold px-4" onClick={modalConfig.onConfirm}>
                        {modalConfig.actionText}
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="dc-layout-container">

                <aside className="dc-sidebar-left">
                    <div>
                        <div className="dc-sidebar-label">Navigation</div>
                        <Link to="/" className="dc-sidebar-item">
                            <ArrowLeftIcon /> Back to Home
                        </Link>
                        <Link to="/ask-question" className="dc-sidebar-item">
                            <PlusIcon /> Ask Question
                        </Link>
                    </div>
                </aside>

                <main>
                    <div className="dc-card mb-4">
                        <div className="dc-card-inner">
                            <div className="dc-stats-col">
                                <div className="dc-vote-stack">
                                    <button className={`dc-vote-arrow ${hasUpvoted ? 'upvoted' : ''}`} title="Upvote" onClick={() => handleQuestionVote('upvote')}>▲</button>
                                    <div className="dc-vote-score">{score}</div>
                                    <button className={`dc-vote-arrow ${hasDownvoted ? 'downvoted' : ''}`} title="Downvote" onClick={() => handleQuestionVote('downvote')}>▼</button>
                                </div>
                            </div>

                            <div className="dc-content-col">
                                <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                                    <h2 className="dc-q-title mb-0">{question.title}</h2>
                                    <span className={`dc-status-badge ${question.status === 'resolved' ? 'status-resolved' : question.isApproved === false ? 'status-pending' : 'status-open'}`}>
                                        {question.status === 'resolved' ? <><LockSmallIcon /> Resolved</> : question.isApproved === false ? 'Pending' : 'Open'}
                                    </span>
                                </div>

                                <div className="d-flex flex-wrap gap-2 mb-2 align-items-center">
                                    <span className="text-muted fw-semibold" style={{ fontSize: '12px' }}>Asked {timeAgo(question.createdAt)}</span>
                                </div>

                                {/* Truncated Question Description */}
                                <TruncatedText 
                                    text={question.description} 
                                    maxLength={500} 
                                    className="dc-q-desc" 
                                />

                                {question.tags && question.tags.length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 mb-4">
                                        {question.tags.map((tag, idx) => <span key={idx} className="dc-tag">{tag}</span>)}
                                    </div>
                                )}

                                {question.imageUrl && (
                                    <div className="mb-4 p-2 bg-light rounded border text-center">
                                        <img src={`http://localhost:5000/${question.imageUrl.replace(/\\/g, '/').replace(/^\//, '')}`} alt="Attachment" className="img-fluid rounded" style={{ maxHeight: '400px', objectFit: 'contain' }} />
                                    </div>
                                )}

                                {user?.role === 'admin' && (
                                    <div className="d-flex gap-2 mt-4 pt-3 border-top">
                                        {question.status !== 'resolved' && (
                                            <Button variant="outline-warning" size="sm" className="fw-bold" onClick={handleCloseThread}>Close Thread</Button>
                                        )}
                                        <Button variant="outline-danger" size="sm" className="fw-bold" onClick={handleDeleteThread}>Delete Thread</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 d-flex justify-content-between align-items-center border-bottom pb-3">
                        <h3 className="fw-bold mb-0" style={{ color: '#111', fontSize: '18px' }}>Answers ({answers.length})</h3>                        
                        {question.status !== 'resolved' && (
                            <Button variant="outline-primary" size="sm" className="fw-bold rounded-pill px-3 shadow-sm d-flex align-items-center gap-2" onClick={scrollToAnswerForm}>
                                <EditIcon /> Write Answer
                            </Button>
                        )}
                    </div>

                    {answers.length === 0 ? (
                        <div className="dc-card text-center py-5 mb-4 shadow-sm d-flex flex-column align-items-center">
                            <EmptyInboxIcon />
                            <div className="fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>No answers yet</div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>Be the first to help out with a solution.</div>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3 mb-5">
                            {answers.map(ans => (
                                <div key={ans._id} className="dc-card">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <small className="text-muted fw-semibold" style={{ fontSize: '13px' }}>
                                            Answered by: <strong style={{ color: '#185FA5' }}>{ans.userId?.name || 'Anonymous'}</strong>
                                        </small>
                                    </div>

                                    {/* Truncated Answer Body */}
                                    <TruncatedText 
                                        text={ans.body} 
                                        maxLength={300} 
                                        className="dc-q-desc mb-4" 
                                        style={{ fontSize: '14px', color: '#222' }} 
                                    />

                                    <div className="d-flex align-items-center gap-2 mt-4 pt-3 border-top">
                                        <Button
                                            variant="light" size="sm"
                                            className={`fw-bold d-flex align-items-center gap-2 rounded-pill px-3 dc-action-btn ${ans.userHasLiked ? 'active-like' : ''}`}
                                            onClick={() => handleLikeToggle(ans._id)}
                                        >
                                            {ans.userHasLiked ? <ThumbsUpFilled /> : <ThumbsUpOutline />}
                                            <span>{ans.likesCount || 0}</span>
                                        </Button>
                                        <Button
                                            variant="light"
                                            size="sm"
                                            className={`fw-bold d-flex align-items-center gap-2 rounded-pill px-3 dc-action-btn ${expandedComments[ans._id] ? 'active-comment' : ''}`}
                                            onClick={() => toggleComments(ans._id)}
                                        >
                                            <CommentIcon /> <span>{ans.comments?.length || 0} Comments</span>
                                        </Button>
                                    </div>

                                    {expandedComments[ans._id] && (
                                        <div className="mt-3 bg-light rounded p-3 border">
                                            {ans.comments && ans.comments.length > 0 ? (
                                                <div className="dc-comments-wrapper mb-3 d-flex flex-column gap-2">
                                                    {ans.comments.map(comment => {
                                                        const isCommentOwner = user._id === (comment.userId?._id || comment.userId);

                                                        return (
                                                            <div key={comment._id} className="bg-white p-2 rounded shadow-sm text-muted d-flex justify-content-between align-items-start" style={{ fontSize: '13px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                                <div>
                                                                    <strong className="text-dark">{comment.userId?.name || 'Anonymous'}:</strong> <span className="ms-1">{comment.body}</span>
                                                                </div>

                                                                {isCommentOwner && (
                                                                    <button onClick={() => handleDeleteComment(comment._id)} className="btn btn-link text-danger p-0 ms-2 text-decoration-none fw-bold" style={{ fontSize: '11px', outline: 'none', boxShadow: 'none' }}>
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-muted small mb-3 fst-italic">No comments yet.</div>
                                            )}

                                            <Form onSubmit={(e) => handleCommentSubmit(e, ans._id)}>
                                                <InputGroup size="sm">
                                                    <Form.Control type="text" placeholder="Add a comment..." value={commentInputs[ans._id] || ''} onChange={(e) => handleCommentChange(ans._id, e.target.value)} className="dc-textarea py-1 px-3" style={{ borderRadius: '6px 0 0 6px', fontSize: '13px', border: '1px solid rgba(0,0,0,0.15)' }} />
                                                    <Button type="submit" variant="primary" className="fw-bold px-3" style={{ borderRadius: '0 6px 6px 0' }}>Post</Button>
                                                </InputGroup>
                                            </Form>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div id="write-answer-section">
                        {question.status === 'resolved' ? (
                            <Alert variant="secondary" className="text-center fw-bold shadow-sm border-0 py-3" style={{ fontSize: '14px', borderRadius: '8px' }}>
                                <LockSmallIcon /> This discussion has been closed. No further answers can be added.
                            </Alert>
                        ) : !token ? (
                            <div className="dc-card mb-5 text-center py-5 shadow-sm border-0 bg-white">
                                <h4 className="fw-bold text-dark mb-2">Join the Discussion</h4>
                                <p className="text-muted mb-4">Please log in or sign up to post an answer.</p>
                                <div className="d-flex justify-content-center gap-3">
                                    <Link to="/login" className="btn btn-outline-primary fw-bold px-4 rounded-pill">Log In</Link>
                                    <Link to="/register" className="btn btn-primary fw-bold px-4 rounded-pill">Sign Up</Link>
                                </div>
                            </div>
                        ) : (
                            <div className="dc-card mb-5">
                                <h5 className="fw-bold mb-3" style={{ color: '#111', fontSize: '16px' }}>Your Answer</h5>

                                {error && <Alert variant="danger" style={{ fontSize: '13px' }}>{error}</Alert>}
                                {message && <Alert variant="success" style={{ fontSize: '13px' }}>{message}</Alert>}

                                <Form noValidate onSubmit={handleAnswerSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Control as="textarea" rows={5} placeholder="Write your detailed solution here..." value={newAnswer} onChange={(e) => { setNewAnswer(e.target.value); if (answerError) setAnswerError(''); }} isInvalid={!!answerError} className="dc-textarea w-100" />
                                        <Form.Control.Feedback type="invalid" className="ps-1 pt-1" style={{ fontSize: '12px' }}>{answerError}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Button type="submit" variant="primary" className="fw-bold px-4 py-2 w-100" disabled={isSubmitting} style={{ borderRadius: '8px', fontSize: '14px' }}>
                                        {isSubmitting ? <><Spinner animation="border" size="sm" className="me-2" />Submitting...</> : 'Post Your Answer'}
                                    </Button>
                                </Form>
                            </div>
                        )}
                    </div>
                </main>

                <aside className="dc-sidebar-right">
                    <div className="dc-widget">
                        <h4 className="dc-widget-title">Thread Info</h4>
                        <div className="d-flex flex-column gap-3 mt-3">
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                <span className="text-muted small fw-bold text-uppercase">Posted</span>
                                <span className="fw-bold text-dark text-end" style={{ fontSize: '12px' }}>{formatDate(question.createdAt)}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                <span className="text-muted small fw-bold text-uppercase">Asked By</span>
                                <span className="fw-bold text-primary" style={{ fontSize: '13px' }}>{question.userId?.name || 'Anonymous'}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                <span className="text-muted small fw-bold text-uppercase">Topic</span>
                                <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{question.topic}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted small fw-bold text-uppercase">Answers</span>
                                <span className="fw-bold" style={{ color: '#1D9E75', fontSize: '13px' }}>{answers.length}</span>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default QuestionDetails;