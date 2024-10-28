require ('dotenv').config();
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';  // Import sequelize instance
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import loginRoutes from './routes/loginRoutes';
import qualityRoutes from './routes/qualityRoutes';
import interestRoutes from './routes/interestRoutes';
import uploadRoute from './routes/uploadRoute';
import { MongoClient } from 'mongodb';

dotenv.config();
const app: Application = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize.authenticate()
  .then(() => console.log('MySQL connected successfully'))
  .catch(err => console.error('MySQL connection error:', err));

const mongoDB = process.env.MONGO_DB as string;
const client = new MongoClient(process.env.MONGO_DB as string);
mongoose.connect(mongoDB, {
  
}).then(
  () => { console.log('Connected to mongo DB')}
).catch(
  err => console.error("Error", err)
);

app.use('/user', userRoutes);
app.use('/admin/', adminRoutes);
app.use('/login/', loginRoutes);
app.use('/quality/', qualityRoutes);
app.use('/interest/', interestRoutes);
app.use('/upload/', uploadRoute);

 app.use('/', (req: Request, res: Response) => {
   return res.status(200).json({ message: 'Service running well.'})
 })
const PORT = process.env.LOCAL_PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
