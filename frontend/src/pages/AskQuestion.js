import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const ArrowLeftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const CheckCircleIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ImageIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'text-bottom' }}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

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
  
  .dc-card { background: #fff !important; border: 1px solid rgba(0,0,0,0.08) !important; border-radius: 12px !important; transition: all 0.2s ease; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .dc-widget { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .dc-widget-title { font-size: 13px; font-weight: 700; color: #111; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;}

  .dc-form-label { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 8px; }
  .dc-input, .dc-textarea { font-size: 14px !important; background: #f8f9fa !important; border: 1px solid rgba(0,0,0,0.1) !important; border-radius: 8px !important; padding: 12px 16px !important; transition: all 0.2s !important; color: #333 !important;}
  .dc-input:focus, .dc-textarea:focus { background: #fff !important; box-shadow: 0 0 0 3px rgba(24, 95, 165, 0.1) !important; border-color: #185FA5 !important; outline: none !important; }
  .dc-form-text { font-size: 12px; color: #777; margin-top: 6px; display: block;}
  
  .dc-file-upload { background: #f8f9fa; border: 1px dashed rgba(0,0,0,0.15); border-radius: 8px; padding: 20px; transition: all 0.2s; }
  .dc-file-upload:hover { border-color: #185FA5; background: #f0f7ff; }

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
    .dc-card { padding: 1.5rem 1rem !important; }
  }
`;

const AskQuestion = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [topic, setTopic] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    
    const [image, setImage] = useState('');
    const [fileName, setFileName] = useState('');
    const [uploading, setUploading] = useState(false);
    
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // show a login prompt instead of the form for guests
    if (!token) {
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
                            <div className="dc-sidebar-item active">
                                <PlusIcon /> Ask Question
                            </div>
                        </div>
                    </aside>
                    <main>
                        <div className="dc-card text-center py-5 shadow-sm border-0 d-flex flex-column align-items-center">
                            <div className="display-1 text-primary opacity-50 mb-3" style={{ fontSize: '4rem' }}>💬</div>
                            <h3 className="fw-bold text-dark mb-2">Join the Community</h3>
                            <p className="text-muted mb-4" style={{ fontSize: '15px', maxWidth: '400px' }}>
                                You must be logged in to ask a question. Join DoConnect to share knowledge, ask questions, and collaborate with other developers.
                            </p>
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <Link to="/login" className="btn btn-outline-primary fw-bold px-4 py-2 rounded-pill">Log In</Link>
                                <Link to="/register" className="btn btn-primary fw-bold px-4 py-2 rounded-pill">Sign Up</Link>
                            </div>
                        </div>
                    </main>
                    <aside className="dc-sidebar-right"></aside>
                </div>
            </div>
        );
    }

    const validateForm = () => {
        const errors = {};
        
        if (!title.trim()) {
            errors.title = 'A title is required.';
        } else if (title.trim().length < 10) {
            errors.title = 'Title must be at least 10 characters long to be descriptive.';
        }

        if (!topic) {
            errors.topic = 'Please select a topic category.';
        }

        if (!description.trim()) {
            errors.description = 'A detailed description is required.';
        } else if (description.trim().length < 20) {
            errors.description = 'Please provide more details (at least 20 characters).';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return; 

        setFileName(file.name); 
        const formData = new FormData();
        formData.append('image', file); 
        setUploading(true);
        setError(''); 

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
            
            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error('Upload Error:', error);
            setError('Image upload failed. Ensure it is a JPG or PNG under 5MB.');
            setUploading(false);
            setFileName(''); 
        }
    };

    const handleRemoveImage = () => {
        setImage('');
        setFileName(''); 
        if (error.includes('upload')) setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

            const newQuestion = {
                title,
                description,
                topic,
                tags: tagsArray,
                imageUrl: image 
            };

            await axios.post('http://localhost:5000/api/questions', newQuestion, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Your question has been submitted successfully and is waiting for Admin approval!');
            
            setTitle('');
            setDescription('');
            setTopic('');
            setTagsInput('');
            setImage('');
            setFileName(''); 
            setValidationErrors({});

            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit question. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <Link to="/ask-question" className="dc-sidebar-item active">
                            <PlusIcon /> Ask Question
                        </Link>
                    </div>
                </aside>

                <main>
                    <div className="dc-card">
                        <h2 className="mb-4 fw-bold text-dark border-bottom pb-3" style={{ fontSize: '24px' }}>Ask a New Question</h2>
                        
                        {error && <Alert variant="danger" className="rounded-3" style={{ fontSize: '14px' }}>{error}</Alert>}
                        {message && <Alert variant="success" className="rounded-3" style={{ fontSize: '14px' }}>{message}</Alert>}

                        <Form noValidate onSubmit={handleSubmit}>
                            
                            <Form.Group className="mb-4">
                                <Form.Label className="dc-form-label">Title</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="e.g., How do I pass props in React?" 
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (validationErrors.title) setValidationErrors({...validationErrors, title: null});
                                    }}
                                    isInvalid={!!validationErrors.title}
                                    className="dc-input"
                                />
                                <Form.Text className="dc-form-text">
                                    Be specific and imagine you're asking a question to another person.
                                </Form.Text>
                                <Form.Control.Feedback type="invalid" style={{ fontSize: '12px' }}>
                                    {validationErrors.title}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <Form.Group>
                                        <Form.Label className="dc-form-label">Topic</Form.Label>
                                        <Form.Select 
                                            value={topic}
                                            onChange={(e) => {
                                                setTopic(e.target.value);
                                                if (validationErrors.topic) setValidationErrors({...validationErrors, topic: null});
                                            }}
                                            isInvalid={!!validationErrors.topic}
                                            className="dc-input"
                                        >
                                            <option value="" disabled>Select a topic...</option>
                                            <option value="JavaScript">JavaScript</option>
                                            <option value="Java">Java</option>
                                            <option value="Python">Python</option>
                                            <option value="React">React</option>
                                            <option value="Spring Boot">Spring Boot</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid" style={{ fontSize: '12px' }}>
                                            {validationErrors.topic}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className="col-md-6 mb-4">
                                    <Form.Group>
                                        <Form.Label className="dc-form-label">Tags (Optional)</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="e.g., javascript, frontend, hooks" 
                                            value={tagsInput}
                                            onChange={(e) => setTagsInput(e.target.value)}
                                            className="dc-input"
                                        />
                                        <Form.Text className="dc-form-text">
                                            Separate multiple tags with commas.
                                        </Form.Text>
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group className="mb-4">
                                <Form.Label className="dc-form-label">Description</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={8}
                                    placeholder="Provide details, share your code, and explain what you've tried so far..." 
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        if (validationErrors.description) setValidationErrors({...validationErrors, description: null});
                                    }}
                                    isInvalid={!!validationErrors.description}
                                    className="dc-textarea"
                                />
                                <Form.Control.Feedback type="invalid" style={{ fontSize: '12px' }}>
                                    {validationErrors.description}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-5">
                                <Form.Label className="dc-form-label"><ImageIcon /> Attach an Image (Optional)</Form.Label>
                                
                                {image && !uploading ? (
                                    <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                        <div className="text-success fw-bold d-flex align-items-center flex-grow-1 overflow-hidden me-3" style={{ fontSize: '13px' }}>
                                            <CheckCircleIcon /> 
                                            <span className="text-truncate d-inline-block" style={{ maxWidth: '100%' }}>
                                                {fileName || 'Image attached successfully'}
                                            </span>
                                        </div>
                                        <Button 
                                            variant="link" 
                                            className="text-danger p-0 fw-bold text-decoration-none d-flex align-items-center flex-shrink-0" 
                                            onClick={handleRemoveImage} 
                                            style={{ fontSize: '13px' }}
                                        >
                                            <TrashIcon /> Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="p-3 rounded" style={{ background: '#f8f9fa', border: '1px dashed rgba(0,0,0,0.15)' }}>
                                        <Form.Control 
                                            type="file" 
                                            onChange={uploadFileHandler}
                                            disabled={uploading}
                                            className="dc-input border-0 shadow-none w-auto"
                                            style={{ fontSize: '13px', background: 'transparent', padding: '0' }}
                                        />
                                        {uploading && (
                                            <div className="text-primary mt-2 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                                                <Spinner animation="border" size="sm" /> Uploading image...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="fw-bold py-3 px-5 w-100"
                                disabled={isSubmitting || uploading}
                                style={{ borderRadius: '8px', fontSize: '15px' }}
                            >
                                {isSubmitting ? (
                                    <><Spinner animation="border" size="sm" className="me-2" /> Submitting...</>
                                ) : (
                                    'Post Question'
                                )}
                            </Button>
                        </Form>
                    </div>
                </main>

                <aside className="dc-sidebar-right">
                    <div className="dc-widget shadow-sm border-0">
                        <h4 className="dc-widget-title">Writing a Good Question</h4>
                        <div className="d-flex flex-column gap-3 mt-3 text-muted" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                            <div>
                                <strong>Summarize the problem</strong><br/>Include details about your goal and the expected vs. actual results.
                            </div>
                            <div>
                                <strong>Describe what you've tried</strong><br/>Show what you've already attempted so others know where to start.
                            </div>
                            <div>
                                <strong>Add tags</strong><br/>Tags help route your question to the right experts quickly.
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default AskQuestion;