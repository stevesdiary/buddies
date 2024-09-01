require ('dotenv').config();
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';  // Import sequelize instance

import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import aiChatRoutes from './routes/aiChatRoutes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test MySQL Connection
sequelize.authenticate()
  .then(() => console.log('MySQL connected successfully'))
  .catch(err => console.error('MySQL connection error:', err));

// Sync models with the database
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/ai', aiChatRoutes);


const PORT = process.env.LOCAL_PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
