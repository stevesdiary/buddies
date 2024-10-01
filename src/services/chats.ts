import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import User from '../models/User';
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const ChatModel = mongoose.model('Chat', ChatSchema);

// 4. Set up Express server


const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// 5. Set up Socket.IO for real-time communication
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', async (msg) => {
    try {

			// const sender = await User.findByPk(user_id)
			// senderUsername = sender?.username
      const chat = new ChatModel(msg);
      await chat.save();
      io.emit('chat message', msg);
    } catch (error) {
      console.error('Error saving chat:', error);
			// await channel.close()
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});