import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Alert, Spinner, Form } from 'react-bootstrap';

const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const CheckCircleIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px', marginTop:'-2px'}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const TrendingIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const EmptyInboxIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  body { font-family: 'Plus Jakarta Sans', sans-serif !important; background: #f8f9fa !important; overflow-x: hidden; }

  .dc-layout-container { max-width: 1250px; margin: 0 auto; padding: 2rem 1.5rem; display: grid; grid-template-columns: 220px 1fr 280px; gap: 2rem; align-items: start; }
  .dc-layout-container > * { min-width: 0; }

  .dc-sidebar-left, .dc-sidebar-right { position: sticky; top: 88px; height: calc(100vh - 100px); overflow-y: auto; padding-bottom: 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
  .dc-sidebar-left::-webkit-scrollbar, .dc-sidebar-right::-webkit-scrollbar, .dc-mobile-tags::-webkit-scrollbar { display: none; }
  .dc-sidebar-left, .dc-sidebar-right, .dc-mobile-tags { -ms-overflow-style: none; scrollbar-width: none; }

  .dc-sidebar-label { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.6px; padding: 10px 10px 4px; }
  .dc-sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #555; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; transition: all 0.15s; margin-bottom: 4px; text-decoration: none;}
  .dc-sidebar-item:hover { background: #eef2f5; color: #111; }
  .dc-sidebar-item.active { background: #E6F1FB; color: #185FA5; }
  .dc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .dc-search-wrap { position: relative; width: 100%; margin-bottom: 1.5rem; }
  .dc-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #888; pointer-events: none; }
  .dc-search-input { width: 100%; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 14px 16px 14px 44px; font-size: 15px; font-family: inherit; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.02); color: #333;}
  .dc-search-input:focus { outline: none; border-color: #185FA5; box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.1); }

  .dc-card { background: #fff !important; border: 1px solid rgba(0,0,0,0.08) !important; border-radius: 12px !important; transition: all 0.2s ease; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); margin-bottom: 1rem;}
  .dc-card:hover { border-color: rgba(0,0,0,0.15) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important; }
  .dc-card-inner { display: flex; gap: 1.25rem; }

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
  .dc-stat-label { font-size: 11px; color: #888; font-weight: 500; margin-top: 4px; }
  .dc-stat-label.has-answers { color: #1D9E75; }

  .dc-content-col { flex: 1; display: flex; flex-direction: column; }
  .dc-q-title { font-size: 17px; font-weight: 600; color: #185FA5; text-decoration: none; line-height: 1.4; }
  .dc-q-title:hover { color: #0C447C; text-decoration: underline; }
  .dc-q-desc { font-size: 14px; color: #555; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 8px 0 12px; }

  .dc-tag { font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 100px; background: #eef2f5; color: #444; border: 1px solid transparent; transition: all 0.2s; display: inline-block; cursor: pointer; white-space: nowrap;}
  .dc-tag:hover { background: #E6F1FB; color: #185FA5; border-color: #B5D4F4; }

  .dc-status-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;}
  .status-open { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .status-resolved { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; }
  .status-pending { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

  .dc-meta { font-size: 13px; color: #888; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: auto;}
  .dc-meta strong { color: #333; }

  .dc-control-select { font-size: 13px; font-weight: 600; color: #111; border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; padding: 6px 32px 6px 12px; background-color: #fff; cursor: pointer; outline: none; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
  .dc-control-select:focus { border-color: #185FA5; box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.1); }

  .dc-widget { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); margin-bottom: 1.5rem;}
  .dc-widget-title { font-size: 13px; font-weight: 700; color: #111; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;}
  .dc-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .dc-stat { background: #f8f9fa; border-radius: 8px; padding: 16px 12px; text-align: center; border: 1px solid #eee; }
  .dc-stat-num { font-size: 24px; font-weight: 700; color: #185FA5; line-height: 1; margin-bottom: 6px;}
  .dc-stat-lbl { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; }
  
  .dc-hot-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; text-decoration: none; transition: background 0.2s; }
  .dc-hot-item:last-child { border-bottom: none; padding-bottom: 0; }
  .dc-hot-item:hover .dc-hot-q { color: #185FA5; }
  .dc-hot-num { font-size: 16px; font-weight: 800; color: #cbd5e1; min-width: 16px; }
  .dc-hot-q { font-size: 13px; color: #444; line-height: 1.4; font-weight: 600; transition: color 0.2s;}

  @media (max-width: 992px) {
    .dc-layout-container { grid-template-columns: 1fr; padding: 1rem; gap: 1rem; }
    .dc-sidebar-right { display: none; } 
    .dc-sidebar-left { position: static; height: auto; flex-direction: row; overflow-x: auto; gap: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
    .dc-sidebar-left > div { display: flex; gap: 0.5rem; align-items: center; }
    .dc-sidebar-label { display: none; } 
    .dc-sidebar-left > div:nth-child(2) { display: none; } 
    .dc-sidebar-item { width: auto; white-space: nowrap; padding: 6px 16px; }
  }

  @media (max-width: 576px) {
    .dc-layout-container { padding: 1rem 0.5rem; gap: 1rem; }
    .dc-card { padding: 1rem !important; }
    .dc-card-inner { flex-direction: column; gap: 0.5rem; } 
    .dc-content-col { order: 1; } 
    .dc-stats-col { order: 2; flex-direction: row; align-items: center; justify-content: flex-start; border-right: none; border-top: 1px solid rgba(0,0,0,0.06); padding-right: 0; padding-top: 12px; margin-top: 8px; gap: 16px; }
    .dc-vote-stack { flex-direction: row; gap: 12px; }
    .dc-vote-arrow { font-size: 24px; }
    .dc-vote-score { font-size: 16px; margin: 0; }
    .dc-stat-box { flex-direction: row; gap: 6px; align-items: baseline; padding: 4px 10px; width: auto;}
    .dc-q-title { font-size: 16px; line-height: 1.3;}
    .dc-mobile-tags { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 12px; }
  }
`;

const Home = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeSort, setActiveSort] = useState('newest');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                // guests can browse without a token
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.get('http://localhost:5000/api/questions', { headers });
                setQuestions(response.data);
            } catch (err) {
                setError('Failed to fetch questions. Ensure your backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [token]);

    const handleVote = async (questionId, type) => {
        // redirect guests to login rather than letting the request fail
        if (!token || !user._id) {
            return navigate('/login');
        }

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

    let displayQuestions = questions.filter(q => {
        if (searchTerm) {
            const s = searchTerm.toLowerCase();
            const matchesSearch = q.title?.toLowerCase().includes(s) ||
                q.topic?.toLowerCase().includes(s) ||
                q.tags?.some(tag => tag.toLowerCase().includes(s));
            if (!matchesSearch) return false;
        }

        if (activeFilter === 'unanswered') {
            return !q.answers || q.answers.length === 0;
        }

        return true;
    });

    displayQuestions.sort((a, b) => {
        const scoreA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
        const scoreB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);

        if (activeSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (activeSort === 'liked') return scoreB - scoreA;
        return 0;
    });

    const highlightMatch = (text, highlight) => {
        if (!highlight.trim() || !text) return text;
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.toString().split(regex);
        return parts.map((part, i) => regex.test(part) ? <mark key={i} style={{ background: '#fef08a', padding: '0 2px', borderRadius: '3px' }}>{part}</mark> : part);
    };

    const timeAgo = (date) => {
        if (!date) return '';
        const diff = Math.floor((Date.now() - new Date(date)) / 1000);
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const allTopics = [...new Set(questions.map(q => q.topic).filter(Boolean))].slice(0, 5);
    const allTags = [...new Set(questions.flatMap(q => q.tags || []))].slice(0, 10);
    const trendingQuestions = [...questions].sort((a, b) => (b.answers?.length || 0) - (a.answers?.length || 0)).slice(0, 4);
    const totalAnswers = questions.reduce((a, q) => a + (q.answers?.length || 0), 0);

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <style>{styles}</style>           

            <div className="dc-layout-container">

                <aside className="dc-sidebar-left">
                    <div>
                        <div className="dc-sidebar-label">Quick Links</div>
                        <button className={`dc-sidebar-item ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
                            All Questions
                        </button>
                        <button className={`dc-sidebar-item ${activeFilter === 'unanswered' ? 'active' : ''}`} onClick={() => setActiveFilter('unanswered')}>
                            Unanswered
                        </button>
                    </div>

                    {allTopics.length > 0 && (
                        <div>
                            <div className="dc-sidebar-label">Top Topics</div>
                            {allTopics.map(topic => (
                                <button key={topic} className="dc-sidebar-item" onClick={() => setSearchTerm(topic)}>
                                    <div className="dc-dot" style={{ background: '#185FA5' }}></div>
                                    {topic}
                                </button>
                            ))}
                        </div>
                    )}
                </aside>

                <main>
                    <div className="dc-search-wrap">
                        <div className="dc-search-icon"><SearchIcon /></div>
                        <input 
                            type="text" 
                            className="dc-search-input" 
                            placeholder="Search by title, topic, or tag..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>

                    {allTags.length > 0 && (
                        <div className="dc-mobile-tags d-lg-none">
                            <Button
                                variant="light" size="sm" className="rounded-pill fw-bold"
                                style={{ fontSize: '12px', border: '1px solid #ccc', backgroundColor: searchTerm === '' ? '#111' : '#fff', color: searchTerm === '' ? '#fff' : '#111' }}
                                onClick={() => setSearchTerm('')}
                            >
                                All
                            </Button>
                            {allTags.map(tag => (
                                <Button
                                    key={tag} variant="light" size="sm" className="rounded-pill fw-bold"
                                    style={{ fontSize: '12px', border: '1px solid #ccc', backgroundColor: searchTerm === tag ? '#185FA5' : '#fff', color: searchTerm === tag ? '#fff' : '#555' }}
                                    onClick={() => setSearchTerm(tag)}
                                >
                                    {tag}
                                </Button>
                            ))}
                        </div>
                    )}

                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111', margin: 0 }}>
                            {activeFilter === 'unanswered' ? 'Unanswered Questions' : 'Top Questions'}
                        </h2>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom flex-wrap gap-3">
                        <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                            {displayQuestions.length} {displayQuestions.length === 1 ? 'question' : 'questions'}
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' }}>Sort:</span>
                            <Form.Select
                                className="dc-control-select"
                                value={activeSort}
                                onChange={(e) => setActiveSort(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="liked">Highest Score</option>
                            </Form.Select>
                        </div>
                    </div>

                    {error && <Alert variant="danger" style={{ borderRadius: '8px' }}>{error}</Alert>}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: '#185FA5' }} />
                            <p className="mt-3 text-muted">Loading discussions...</p>
                        </div>
                    ) : displayQuestions.length === 0 ? (
                        <div className="dc-card d-flex flex-column align-items-center justify-content-center py-5">
                            <EmptyInboxIcon />
                            <h4 className="fw-bold text-dark mt-2 mb-1" style={{ fontSize: '18px' }}>No questions found</h4>
                            <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                                {searchTerm ? `We couldn't find anything matching "${searchTerm}".` : 'There are no questions in this view yet.'}
                            </p>
                            <Button onClick={() => { setSearchTerm(''); setActiveFilter('all'); }} variant="outline-primary" className="fw-bold px-4 rounded-pill">
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {displayQuestions.map((q) => {
                                const answerCount = q.answers?.length || 0;
                                const hasAnswers = answerCount > 0;
                                const isResolved = q.status === 'resolved';

                                const score = (q.upvotes?.length || 0) - (q.downvotes?.length || 0);
                                const hasUpvoted = q.upvotes?.includes(user?._id);
                                const hasDownvoted = q.downvotes?.includes(user?._id);

                                return (
                                    <div key={q._id} className="dc-card">
                                        <div className="dc-card-inner">

                                            <div className="dc-stats-col">
                                                <div className="dc-vote-stack">
                                                    <button
                                                        className={`dc-vote-arrow ${hasUpvoted ? 'upvoted' : ''}`}
                                                        title="Upvote"
                                                        onClick={(e) => { e.preventDefault(); handleVote(q._id, hasUpvoted ? 'neutral' : 'upvote'); }}
                                                    >
                                                        ▲
                                                    </button>
                                                    <div className="dc-vote-score">{score}</div>
                                                    <button
                                                        className={`dc-vote-arrow ${hasDownvoted ? 'downvoted' : ''}`}
                                                        title="Downvote"
                                                        onClick={(e) => { e.preventDefault(); handleVote(q._id, hasDownvoted ? 'neutral' : 'downvote'); }}
                                                    >
                                                        ▼
                                                    </button>
                                                </div>

                                                <div className={`dc-stat-box ${hasAnswers ? 'has-answers' : ''} mt-2`}>
                                                    <div className={`dc-stat-count ${hasAnswers ? 'has-answers' : ''}`}>{answerCount}</div>
                                                    <div className={`dc-stat-label ${hasAnswers ? 'has-answers' : ''}`}>answers</div>
                                                </div>
                                            </div>

                                            <div className="dc-content-col">
                                                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                                                    <Link to={`/questions/${q._id}`} className="dc-q-title">
                                                        {highlightMatch(q.title || 'Untitled Discussion', searchTerm)}
                                                    </Link>
                                                    <span className={`dc-status-badge ${isResolved ? 'status-resolved' : q.isApproved === false ? 'status-pending' : 'status-open'}`}>
                                                        {isResolved ? 'Resolved' : q.isApproved === false ? 'Pending' : 'Open'}
                                                    </span>
                                                </div>

                                                <p className="dc-q-desc">{q.description}</p>

                                                {q.tags?.length > 0 && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                                                        {q.tags.map(tag => (
                                                            <span key={tag} className="dc-tag" onClick={() => setSearchTerm(tag)}>
                                                                {highlightMatch(tag, searchTerm)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="dc-meta">
                                                    {isResolved ? <span className="text-success fw-bold d-flex align-items-center"><CheckCircleIcon /> Answered</span> : ''}
                                                    {isResolved ? <span className="d-none d-sm-inline">•</span> : ''}
                                                    <span>Topic: <strong>{highlightMatch(q.topic, searchTerm)}</strong></span>
                                                    <span className="d-none d-sm-inline">•</span>
                                                    <span>{timeAgo(q.createdAt)}</span>
                                                    {q.userId?.name && (
                                                        <>
                                                            <span className="d-none d-sm-inline">•</span>
                                                            <span>asked by <strong style={{ color: '#185FA5' }}>{q.userId.name}</strong></span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>

                <aside className="dc-sidebar-right">
                    <div className="dc-widget">
                        <h4 className="dc-widget-title">DoConnect Stats</h4>
                        <div className="dc-stat-grid">
                            <div className="dc-stat bg-white shadow-sm border">
                                <div className="dc-stat-num">{questions.length}</div>
                                <div className="dc-stat-lbl">Questions</div>
                            </div>
                            <div className="dc-stat bg-white shadow-sm border">
                                <div className="dc-stat-num text-success">{totalAnswers}</div>
                                <div className="dc-stat-lbl">Answers</div>
                            </div>
                        </div>
                    </div>

                    {trendingQuestions.length > 0 && (
                        <div className="dc-widget pb-2">
                            <h4 className="dc-widget-title d-flex align-items-center"><TrendingIcon /> Trending Discussions</h4>
                            {trendingQuestions.map((q, i) => (
                                <Link to={`/questions/${q._id}`} key={q._id} className="dc-hot-item">
                                    <span className="dc-hot-num">{i + 1}</span>
                                    <span className="dc-hot-q">{q.title?.slice(0, 50)}{q.title?.length > 50 ? '...' : ''}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {allTags.length > 0 && (
                        <div className="dc-widget">
                            <h4 className="dc-widget-title">Popular Tags</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {allTags.map(tag => (
                                    <span key={tag} className="dc-tag" onClick={() => setSearchTerm(tag)}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default Home;