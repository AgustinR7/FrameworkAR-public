const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const User = require('./models/User');
const Profile = require('./models/Profile');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:5173',
	credentials: true
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_URL || 'http://localhost:5173',
		methods: ['GET', 'POST'],
		credentials: true
	}
});

// Socket.io logic
const connectedUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
	console.log('Un usuario se ha conectado:', socket.id);

	socket.on('register', (userId) => {
		connectedUsers.set(userId, socket.id);
		// Send existing online users to the newly connected socket
		socket.emit('onlineUsers', Array.from(connectedUsers.keys()));
		// Notify everyone else this user just came online
		socket.broadcast.emit('userOnline', userId);
	});

	socket.on('sendMessage', async (data) => {
		try {
			const { conversationId, senderId, receiverId, content } = data;
			
			// Save message to DB
			const message = await Message.create({
				conversationId,
				senderId,
				content
			});

			// If receiver is connected, emit to them
			const receiverSocketId = connectedUsers.get(receiverId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit('receiveMessage', message);
			}
			
			// Also emit back to sender to confirm (optional, could just rely on REST or optimism)
			const senderSocketId = connectedUsers.get(senderId);
			if (senderSocketId) {
				io.to(senderSocketId).emit('receiveMessage', message);
			}
		} catch (error) {
			console.error('Error enviando mensaje por socket:', error);
		}
	});

	socket.on('disconnect', () => {
		for (const [userId, socketId] of connectedUsers.entries()) {
			if (socketId === socket.id) {
				connectedUsers.delete(userId);
				io.emit('userOffline', userId);
				break;
			}
		}
	});
});

const PORT = process.env.PORT || 4000;

const startServer = async () => {
	try {
		await sequelize.authenticate();
		console.log('Conexión a DB establecida.');

		User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
    Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

		// Chat relations
		User.hasMany(Conversation, { foreignKey: 'user1Id', as: 'conversationsAsUser1' });
		User.hasMany(Conversation, { foreignKey: 'user2Id', as: 'conversationsAsUser2' });
		Conversation.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
		Conversation.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });

		Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
		Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });
		
		User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
		Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

		await sequelize.sync();
		console.log('Base de datos sincronizada y relaciones creadas');

		server.listen(PORT, () => {
			console.log(`Servidor (con WebSockets) corriendo en puerto ${PORT}`);
		});

	} catch (error) {
		console.error('No se pudo conectar a la DB:', error.message);
		console.log('Reintentando en 5 segundos...');
		setTimeout(startServer, 5000);
	}
};

startServer();