import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { Spinner, Alert, Form, InputGroup, Button, Badge } from 'react-bootstrap';

// SVG Icons
const ArrowLeftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const MessageSquareIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', marginTop: '-2px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const SendIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const ChatEmptyIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" y1="10" x2="15" y2="10"></line></svg>;
const UsersIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700&display=swap');

  body { font-family: 'Plus Jakarta Sans', sans-serif !important; background: #f8f9fa !important; overflow-x: hidden; }

  .dc-layout-container { max-width: 1250px; margin: 0 auto; padding: 2rem 1.5rem; display: grid; grid-template-columns: 220px 1fr; gap: 2rem; align-items: start; }
  .dc-layout-container > * { min-width: 0; }

  .dc-sidebar-left { position: sticky; top: 24px; height: calc(100vh - 48px); overflow-y: auto; padding-bottom: 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
  .dc-sidebar-left::-webkit-scrollbar { display: none; }
  .dc-sidebar-left { -ms-overflow-style: none; scrollbar-width: none; }

  .dc-sidebar-label { font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.6px; padding: 10px 10px 4px; }
  .dc-sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #555; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; transition: all 0.15s; margin-bottom: 4px; text-decoration: none;}
  .dc-sidebar-item:hover { background: #eef2f5; color: #111; }
  .dc-sidebar-item.active { background: #E6F1FB; color: #185FA5; }
  
  .dc-chat-wrapper { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.03); height: calc(100vh - 100px); display: flex; overflow: hidden; }
  
  .dc-contacts-panel { width: 300px; border-right: 1px solid rgba(0,0,0,0.08); display: flex; flex-direction: column; background: #fff; flex-shrink: 0; }
  .dc-contacts-header { padding: 20px; border-bottom: 1px solid rgba(0,0,0,0.05); font-weight: 700; font-size: 16px; color: #111; display: flex; align-items: center; gap: 8px;}
  .dc-contacts-list { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
  .dc-contacts-list::-webkit-scrollbar { width: 6px; }
  .dc-contacts-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
  
  .dc-contact-item { padding: 12px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; border: 1px solid transparent; }
  .dc-contact-item:hover { background: #f8f9fa; }
  .dc-contact-item.active { background: #E6F1FB; border-color: #B5D4F4; }
  .dc-contact-name { font-size: 14px; font-weight: 600; color: #333; }
  .dc-contact-item.active .dc-contact-name { color: #185FA5; }
  
  .dc-chat-panel { flex: 1; display: flex; flex-direction: column; background: #f8f9fa; min-width: 0; }
  .dc-chat-header { padding: 16px 24px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; }
  .dc-chat-name { font-size: 16px; font-weight: 700; color: #111; margin: 0; }
  .dc-chat-typing { font-size: 12px; color: #1D9E75; font-weight: 600; font-style: italic; margin-top: 2px;}
  
  .dc-messages-area { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .dc-messages-area::-webkit-scrollbar { width: 6px; }
  .dc-messages-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
  
  .dc-msg-row { display: flex; flex-direction: column; }
  .dc-msg-row.me { align-items: flex-end; }
  .dc-msg-row.them { align-items: flex-start; }
  
  .dc-msg-bubble { max-width: 75%; padding: 12px 16px; font-size: 14px; line-height: 1.5; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  .dc-msg-bubble.me { background: #185FA5; color: #fff; border-radius: 16px 16px 4px 16px; }
  .dc-msg-bubble.them { background: #fff; color: #333; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px 16px 16px 4px; }
  .dc-msg-time { font-size: 11px; color: #999; margin-top: 6px; font-weight: 500; }
  
  .dc-chat-input-area { padding: 16px 24px; background: #fff; border-top: 1px solid rgba(0,0,0,0.05); }
  .dc-chat-input { background: #f8f9fa !important; border: 1px solid rgba(0,0,0,0.1) !important; font-size: 14px !important; padding: 12px 20px !important; box-shadow: none !important; }
  .dc-chat-input:focus { background: #fff !important; border-color: #185FA5 !important; }
  
  .dc-online-dot { width: 8px; height: 8px; border-radius: 50%; background: #1D9E75; box-shadow: 0 0 0 2px #fff; }
  .dc-offline-dot { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; box-shadow: 0 0 0 2px #fff; }

  @media (max-width: 992px) {
    .dc-layout-container { grid-template-columns: 1fr; padding: 1rem; gap: 1rem; }
    .dc-sidebar-left { position: static; height: auto; flex-direction: row; overflow-x: auto; gap: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
    .dc-sidebar-left > div { display: flex; gap: 0.5rem; align-items: center; }
    .dc-sidebar-label { display: none; } 
    .dc-sidebar-item { width: auto; white-space: nowrap; padding: 6px 16px; }
    .dc-chat-wrapper { height: calc(100vh - 160px); }
  }

  @media (max-width: 768px) {
    .dc-layout-container { padding: 1rem 0.5rem; gap: 1rem; }
    .dc-chat-wrapper { height: calc(100vh - 140px); }
    .dc-contacts-panel { width: 100%; border-right: none; display: var(--show-contacts); }
    .dc-chat-panel { display: var(--show-chat); }
    .dc-chat-header { padding: 12px 16px; }
    .dc-messages-area { padding: 16px; }
    .dc-chat-input-area { padding: 12px 16px; }
  }
`;

const Chat = () => {
    const [socket, setSocket] = useState(null);
    
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    
    const [onlineUsersList, setOnlineUsersList] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    
    const messagesEndRef = useRef(null);

    const loggedInUserString = localStorage.getItem('user');
    const myUser = loggedInUserString ? JSON.parse(loggedInUserString) : null;

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        
        if (myUser) {
            newSocket.emit('setup', myUser);
        }
        
        fetchUsers();
        
        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('online_users', (activeUsers) => setOnlineUsersList(activeUsers));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop_typing', () => setIsTyping(false));

        socket.on('receive_message', (message) => {
            const isCurrentChat = selectedUser && (
                (message.senderId === myUser?._id && message.receiverId === selectedUser._id) ||
                (message.senderId === selectedUser._id && message.receiverId === myUser?._id)
            );

            if (isCurrentChat) {
                setMessages((prev) => [...prev, message]);
            } else if (message.senderId !== myUser?._id) {
                setUnreadCounts((prev) => ({
                    ...prev,
                    [message.senderId]: (prev[message.senderId] || 0) + 1
                }));
            }
        });

        return () => {
            socket.off('online_users');
            socket.off('typing');
            socket.off('stop_typing');
            socket.off('receive_message');
        };
    }, [socket, selectedUser, myUser?._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const otherUsers = response.data.filter(u => u._id !== myUser._id);
            setUsers(otherUsers);
        } catch (err) {
            console.error('Could not fetch users for chat.', err);
        }
    };

    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        setUnreadCounts(prev => ({ ...prev, [user._id]: 0 }));
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/chat/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
        } catch (err) {
            setError('Could not load chat history.');
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (!selectedUser || !socket) return;

        socket.emit('typing', selectedUser._id);
        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(() => {
            socket.emit('stop_typing', selectedUser._id);
        }, 2000);
        
        setTypingTimeout(timeout);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || !socket) return;

        socket.emit('stop_typing', selectedUser._id);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/chat/${selectedUser._id}`, { message: newMessage }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage('');
        } catch (err) {
            setError('Failed to send message.');
        }
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString([], options);
    };

    if (!myUser) return (
        <div className="text-center mt-5 pt-5">
            <Alert variant="warning" className="d-inline-block shadow-sm fw-bold rounded-4">
                Please log in to access the live chat.
            </Alert>
        </div>
    );

    const mobileStyles = {
        '--show-contacts': selectedUser ? 'none' : 'flex',
        '--show-chat': selectedUser ? 'flex' : 'none'
    };

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', ...mobileStyles }}>
            <style>{styles}</style>
            
            <div className="dc-layout-container">
                
                <aside className="dc-sidebar-left">
                    <div>
                        <div className="dc-sidebar-label">Navigation</div>
                        <Link to="/" className="dc-sidebar-item">
                            <ArrowLeftIcon /> Back to Feed
                        </Link>
                        <div className="dc-sidebar-item active">
                            <MessageSquareIcon /> Live Chat
                        </div>
                    </div>
                </aside>

                <main style={{ gridColumn: 'span 1' }}>
                    <div className="dc-chat-wrapper">
                        
                        <div className="dc-contacts-panel">
                            <div className="dc-contacts-header">
                                <UsersIcon /> Contacts
                            </div>
                            <div className="dc-contacts-list">
                                {users.length === 0 ? (
                                    <div className="text-center text-muted small p-4">No contacts found.</div>
                                ) : (
                                    users.map(u => {
                                        const isOnline = onlineUsersList.includes(u._id);
                                        const unread = unreadCounts[u._id] || 0;
                                        const isSelected = selectedUser?._id === u._id;

                                        return (
                                            <div 
                                                key={u._id} 
                                                className={`dc-contact-item ${isSelected ? 'active' : ''}`}
                                                onClick={() => handleSelectUser(u)}
                                            >
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className={isOnline ? 'dc-online-dot' : 'dc-offline-dot'} title={isOnline ? 'Online' : 'Offline'}></div>
                                                    <div className="dc-contact-name">{u.name}</div>
                                                </div>
                                                {unread > 0 && (
                                                    <Badge bg="danger" pill>{unread}</Badge>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="dc-chat-panel">
                            {selectedUser ? (
                                <>
                                    <div className="dc-chat-header">
                                        <div className="d-flex align-items-center gap-3">
                                            <button 
                                                className="btn btn-link text-muted p-0 d-md-none" 
                                                onClick={() => setSelectedUser(null)}
                                            >
                                                <ArrowLeftIcon />
                                            </button>
                                            <div>
                                                <h3 className="dc-chat-name">{selectedUser.name}</h3>
                                                <div style={{ height: '14px' }}>
                                                    {isTyping && <div className="dc-chat-typing">typing...</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dc-messages-area">
                                        {error && <Alert variant="danger" className="py-2 text-center" style={{fontSize: '13px'}}>{error}</Alert>}
                                        
                                        {messages.length === 0 ? (
                                            <div className="text-center my-auto text-muted" style={{fontSize: '13px'}}>
                                                This is the beginning of your direct message history with <strong>{selectedUser.name.split(' ')[0]}</strong>.
                                            </div>
                                        ) : (
                                            messages.map((msg, index) => {
                                                const isMe = msg.senderId === myUser._id;
                                                return (
                                                    <div key={index} className={`dc-msg-row ${isMe ? 'me' : 'them'}`}>
                                                        <div className={`dc-msg-bubble ${isMe ? 'me' : 'them'}`}>
                                                            {msg.message}
                                                        </div>
                                                        <div className="dc-msg-time">{formatTime(msg.createdAt)}</div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    <div className="dc-chat-input-area">
                                        <Form onSubmit={handleSendMessage}>
                                            <InputGroup>
                                                <Form.Control 
                                                    type="text" 
                                                    value={newMessage} 
                                                    onChange={handleTyping} 
                                                    placeholder="Type a message..." 
                                                    className="dc-chat-input rounded-start-pill border-end-0"
                                                    autoComplete="off"
                                                />
                                                <Button type="submit" variant="primary" className="rounded-end-pill px-4" disabled={!newMessage.trim()}>
                                                    <SendIcon />
                                                </Button>
                                            </InputGroup>
                                        </Form>
                                    </div>
                                </>
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-white">
                                    <ChatEmptyIcon />
                                    <h4 className="fw-bold text-dark" style={{fontSize: '18px'}}>Your Messages</h4>
                                    <p className="text-muted" style={{fontSize: '14px'}}>Select a contact from the sidebar to start chatting.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </main>

            </div>
        </div>
    );
};

export default Chat;