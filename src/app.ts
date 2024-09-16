require ('dotenv').config();
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';  // Import sequelize instance

import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import loginRoutes from './routes/loginRoutes';
// import aiChatRoutes from './routes/aiChatRoutes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize.authenticate()
  .then(() => console.log('MySQL connected successfully'))
  .catch(err => console.error('MySQL connection error:', err));

// Sync models with the database
// await sequelize.sync({ force: true }).then(() => {
  // console.log('Database synchronized');
// });

// app.use('/', (req: Request, res: Response) => {
//   return res.status(200).json({ message: 'Service running well.'})
// })
app.use('/user', userRoutes);
app.use('/admin/', adminRoutes);
app.use('/login/', loginRoutes);
// app.use('/api/ai', aiChatRoutes);


const PORT = process.env.LOCAL_PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
