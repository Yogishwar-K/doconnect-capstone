const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const http = require('http'); 
const { Server } = require('socket.io');

dotenv.config();
connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// attach io to the app so controllers can emit events
app.set('io', io);

// tracks which socket belongs to which user
const onlineUsers = new Map(); 

io.on('connection', (socket) => {
    console.log(`[SOCKET] User connected: ${socket.id}`);

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        onlineUsers.set(socket.id, userData._id);
        io.emit('online_users', Array.from(new Set(onlineUsers.values())));
        console.log(`[SOCKET] ${userData.name} joined room: ${userData._id}`);
    });

    // forward typing events only to the person being typed to
    socket.on('typing', (receiverId) => socket.to(receiverId).emit('typing'));
    socket.on('stop_typing', (receiverId) => socket.to(receiverId).emit('stop_typing'));

    socket.on('disconnect', () => {
        console.log(`[SOCKET] User disconnected: ${socket.id}`);
        onlineUsers.delete(socket.id);
        io.emit('online_users', Array.from(new Set(onlineUsers.values())));
    });
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

// server.listen instead of app.listen so socket.io and express share the same port
server.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT}`);
});