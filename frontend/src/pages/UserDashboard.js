import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner, Alert, Badge } from 'react-bootstrap';

const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const FileTextIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const MessageSquareIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const ArrowLeftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ActivityIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const CheckCircleIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px', marginTop:'-2px'}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

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
  .dc-sidebar-item.active { background: #E6F1FB; color: #185FA5; }
  
  .dc-card { background: #fff !important; border: 1px solid rgba(0,0,0,0.08) !important; border-radius: 12px !important; transition: all 0.2s ease; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .dc-card:hover { border-color: rgba(0,0,0,0.15) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important; }
  .dc-card-inner { display: flex; gap: 1.25rem; }
  
  .dc-widget { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .dc-widget-title { font-size: 13px; font-weight: 700; color: #111; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;}

  .dc-profile-header { background: linear-gradient(135deg, #185FA5 0%, #0C447C 100%); color: #fff; border-radius: 12px; padding: 2.5rem 2rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1.5rem;}
  .dc-profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: #fff; color: #185FA5; font-size: 28px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 4px solid rgba(255,255,255,0.2); flex-shrink: 0;}
  .dc-profile-name { font-size: 24px; font-weight: 700; margin: 0 0 4px 0; }
  .dc-profile-email { font-size: 14px; color: rgba(255,255,255,0.8); margin: 0; }

  .dc-stats-col { display: flex; flex-direction: column; align-items: center; gap: 12px; min-width: 60px; padding-right: 16px; border-right: 1px solid rgba(0,0,0,0.04); }
  .dc-vote-stack { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .dc-vote-arrow { background: transparent; border: none; font-size: 20px; color: #cbd5e1; cursor: pointer; padding: 0; line-height: 1; transition: color 0.2s;}
  .dc-vote-arrow:hover { color: #f97316; }
  .dc-vote-arrow.upvoted { color: #f97316; }
  .dc-vote-arrow.downvoted { color: #3b82f6; }
  .dc-vote-score { font-size: 18px; font-weight: 700; color: #64748b; line-height: 1; }

  .dc-stat-box { display: flex; flex-direction: column; align-items: center; line-height: 1.1; padding: 6px 8px; border-radius: 6px; border: 1px solid transparent; width: 100%;}
  .dc-stat-box.has-answers { border: 1px solid #1D9E75; background: #f0fdf4; }
  .dc-stat-count { font-size: 14px; font-weight: 700; color: #888; }
  .dc-stat-count.has-answers { color: #1D9E75; }
  .dc-stat-label { font-size: 11px; color: #888; font-weight: 500; margin-top: 4px; text-transform: lowercase; }
  .dc-stat-label.has-answers { color: #1D9E75; }

  .dc-content-col { flex: 1; display: flex; flex-direction: column; }
  .dc-q-title { font-size: 17px; font-weight: 600; color: #185FA5; text-decoration: none; line-height: 1.4; }
  .dc-q-title:hover { color: #0C447C; text-decoration: underline; }
  .dc-q-desc { font-size: 14px; color: #555; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 8px 0 12px; }

  .dc-tag { font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 100px; background: #eef2f5; color: #444; border: 1px solid transparent; transition: all 0.2s; display: inline-block; white-space: nowrap;}
  .dc-tag:hover { background: #E6F1FB; color: #185FA5; border-color: #B5D4F4; }

  .dc-status-badge { font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;}
  .status-open { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .status-resolved { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; }
  .status-pending { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

  .dc-meta { font-size: 13px; color: #888; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: auto;}

  .dc-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .dc-stat-widget { background: #f8f9fa; border-radius: 8px; padding: 16px 12px; text-align: center; border: 1px solid #eee; }
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
    .dc-profile-header { flex-direction: column; text-align: center; padding: 2rem 1rem; }
    .dc-card-inner { flex-direction: column; gap: 0.5rem; } 
    .dc-content-col { order: 1; } 
    .dc-stats-col { order: 2; flex-direction: row; align-items: center; justify-content: flex-start; border-right: none; border-top: 1px solid rgba(0,0,0,0.06); padding-right: 0; padding-top: 12px; margin-top: 8px; gap: 16px; }
    .dc-vote-stack { flex-direction: row; gap: 12px; }
    .dc-vote-arrow { font-size: 24px; }
    .dc-vote-score { font-size: 16px; margin: 0; }
    .dc-stat-box { flex-direction: row; gap: 6px; align-items: baseline; padding: 4px 10px; width: auto;}
  }
`;

const UserDashboard = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('questions');

    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchAllData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/questions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuestions(response.data);
            } catch (err) {
                setError('Failed to load your activity.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [token, navigate]);

    const handleVote = async (questionId, type) => {
        try {
            setQuestions(questions.map(q => {
                if (q._id === questionId) {
                    let updatedUpvotes = q.upvotes || [];
                    let updatedDownvotes = q.downvotes || [];

                    updatedUpvotes = updatedUpvotes.filter(id => id !== user._id);
                    updatedDownvotes = updatedDownvotes.filter(id => id !== user._id);

                    if (type === 'upvote') updatedUpvotes.push(user._id);
                    if (type === 'downvote') updatedDownvotes.push(user._id);

                    return { ...q, upvotes: updatedUpvotes, downvotes: updatedDownvotes };
                }
                return q;
            }));

            await axios.post(`http://localhost:5000/api/questions/${questionId}/vote`,
                { voteType: type === 'upvote' || type === 'downvote' ? type : null },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("Failed to cast vote", err);
        }
    };

    const myQuestions = questions.filter(q => {
        const askerId = typeof q.userId === 'object' ? q.userId?._id : q.userId;
        return askerId === user?._id;
    });
    
    const myAnsweredQuestions = questions.filter(q => q.answers?.some(ans => {
        const ansUserId = typeof ans.userId === 'object' ? ans.userId._id : ans.userId;
        return ansUserId === user?._id;
    }));

    const displayData = activeTab === 'questions' ? myQuestions : myAnsweredQuestions;
    displayData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const timeAgo = (date) => {
        if (!date) return '';
        const diff = Math.floor((Date.now() - new Date(date)) / 1000);
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    if (!user) return null;

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <style>{styles}</style>
            
            <div className="dc-layout-container">
                
                <aside className="dc-sidebar-left">
                    <div>
                        <div className="dc-sidebar-label">Navigation</div>
                        <Link to="/" className="dc-sidebar-item">
                            <ArrowLeftIcon /> Back to Feed
                        </Link>
                        <Link to="/ask-question" className="dc-sidebar-item">
                            <PlusIcon /> Ask Question
                        </Link>
                    </div>
                </aside>

                <main>
                    <div className="dc-profile-header shadow-sm">
                        <div className="dc-profile-avatar">{initials}</div>
                        <div>
                            <h1 className="dc-profile-name">{user.name}</h1>
                            <p className="dc-profile-email">{user.email}</p>
                            <Badge bg={user.role === 'admin' ? 'warning' : 'light'} text={user.role === 'admin' ? 'dark' : 'dark'} className="mt-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                                <UserIcon /> {user.role === 'admin' ? 'Administrator' : 'Member'}
                            </Badge>
                        </div>
                    </div>

                    <div className="d-flex gap-2 mb-4 border-bottom pb-3 overflow-auto">
                        <button 
                            className={`btn fw-bold px-4 rounded-pill ${activeTab === 'questions' ? 'btn-primary shadow-sm' : 'btn-light text-muted border'}`}
                            onClick={() => setActiveTab('questions')}
                            style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
                        >
                            <FileTextIcon /> Questions Asked ({myQuestions.length})
                        </button>
                        <button 
                            className={`btn fw-bold px-4 rounded-pill ${activeTab === 'answers' ? 'btn-primary shadow-sm' : 'btn-light text-muted border'}`}
                            onClick={() => setActiveTab('answers')}
                            style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
                        >
                            <MessageSquareIcon /> Answers Provided ({myAnsweredQuestions.length})
                        </button>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: '#185FA5' }} />
                        </div>
                    ) : displayData.length === 0 ? (
                        <div className="dc-card text-center py-5 mb-4 shadow-sm d-flex flex-column align-items-center">
                            <ActivityIcon />
                            <div className="fw-bold text-dark mb-1" style={{fontSize: '18px'}}>No activity found</div>
                            <div className="text-muted" style={{fontSize: '14px'}}>
                                {activeTab === 'questions' 
                                    ? "You haven't asked any questions yet." 
                                    : "You haven't answered any questions yet."}
                            </div>
                            {activeTab === 'questions' && (
                                <Link to="/ask-question" className="btn btn-outline-primary fw-bold mt-3 px-4 rounded-pill">
                                    Start a Discussion
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {displayData.map(q => {
                                const answerCount = q.answers?.length || 0;
                                const hasAnswers = answerCount > 0;
                                const isResolved = q.status === 'resolved';

                                const score = (q.upvotes?.length || 0) - (q.downvotes?.length || 0);
                                const hasUpvoted = q.upvotes?.includes(user._id);
                                const hasDownvoted = q.downvotes?.includes(user._id);

                                // only used when on the answers tab
                                const userAnswers = q.answers?.filter(ans => {
                                    const ansUserId = typeof ans.userId === 'object' ? ans.userId?._id : ans.userId;
                                    return ansUserId === user?._id;
                                });

                                return (
                                    <div key={q._id} className="dc-card">
                                        <div className="dc-card-inner">
                                            
                                            <div className="dc-stats-col">
                                                <div className="dc-vote-stack">
                                                    <button className={`dc-vote-arrow ${hasUpvoted ? 'upvoted' : ''}`} title="Upvote" onClick={(e) => { e.preventDefault(); handleVote(q._id, hasUpvoted ? 'neutral' : 'upvote'); }}>▲</button>
                                                    <div className="dc-vote-score">{score}</div>
                                                    <button className={`dc-vote-arrow ${hasDownvoted ? 'downvoted' : ''}`} title="Downvote" onClick={(e) => { e.preventDefault(); handleVote(q._id, hasDownvoted ? 'neutral' : 'downvote'); }}>▼</button>
                                                </div>
                                                <div className={`dc-stat-box ${hasAnswers ? 'has-answers' : ''} mt-2`}>
                                                    <div className={`dc-stat-count ${hasAnswers ? 'has-answers' : ''}`}>{answerCount}</div>
                                                    <div className={`dc-stat-label ${hasAnswers ? 'has-answers' : ''}`}>answers</div>
                                                </div>
                                            </div>

                                            <div className="dc-content-col">
                                                <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                                                    <Link to={`/questions/${q._id}`} className="dc-q-title">
                                                        {q.title}
                                                    </Link>
                                                    <span className={`dc-status-badge ${isResolved ? 'status-resolved' : q.isApproved === false ? 'status-pending' : 'status-open'}`}>
                                                        {isResolved ? 'Resolved' : q.isApproved === false ? 'Pending Approval' : 'Open'}
                                                    </span>
                                                </div>

                                                <p className="dc-q-desc">{q.description}</p>

                                                {q.tags && q.tags.length > 0 && (
                                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                                        {q.tags.map(tag => (
                                                            <span key={tag} className="dc-tag">{tag}</span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="dc-meta">
                                                    {isResolved ? <span className="text-success fw-bold d-flex align-items-center"><CheckCircleIcon /> Answered</span> : ''}
                                                    {isResolved ? <span className="d-none d-sm-inline">•</span> : ''}
                                                    <span>Topic: <strong className="text-dark">{q.topic}</strong></span>
                                                    <span className="d-none d-sm-inline">•</span>
                                                    <span>{timeAgo(q.createdAt)}</span>
                                                </div>

                                                {activeTab === 'answers' && userAnswers?.length > 0 && (
                                                    <div className="mt-3 pt-3 border-top">
                                                        <div className="text-muted small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>Your Answer</div>
                                                        {userAnswers.map(ans => (
                                                            <div key={ans._id} className="p-3 rounded mb-2" style={{ background: '#f8f9fa', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                                    <span className={`dc-status-badge ${ans.isApproved === false ? 'status-pending' : 'status-open'}`}>
                                                                        {ans.isApproved === false ? 'Pending Approval' : 'Approved & Public'}
                                                                    </span>
                                                                    <span className="text-muted" style={{fontSize: '11px'}}>{timeAgo(ans.createdAt)}</span>
                                                                </div>
                                                                <div style={{fontSize: '14px', color: '#444', whiteSpace: 'pre-wrap'}}>{ans.body}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>

                <aside className="dc-sidebar-right">
                    <div className="dc-widget shadow-sm border-0">
                        <h4 className="dc-widget-title">My Impact</h4>
                        <div className="dc-stat-grid">
                            <div className="dc-stat-widget bg-white shadow-sm border">
                                <div className="dc-stat-num">{myQuestions.length}</div>
                                <div className="dc-stat-lbl">Questions</div>
                            </div>
                            <div className="dc-stat-widget bg-white shadow-sm border">
                                <div className="dc-stat-num text-success">{myAnsweredQuestions.length}</div>
                                <div className="dc-stat-lbl">Answers</div>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default UserDashboard;