"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models"); // Import sequelize instance
// import userRoutes from './routes/userRoutes';
// import chatRoutes from './routes/chatRoutes';
// import aiChatRoutes from './routes/aiChatRoutes';
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Test MySQL Connection
models_1.sequelize.authenticate()
    .then(() => console.log('MySQL connected successfully'))
    .catch(err => console.error('MySQL connection error:', err));
// Sync models with the database
models_1.sequelize.sync({ alter: true }).then(() => {
    console.log('Database synchronized');
});
// Routes
// app.use('/api/users', userRoutes);
// app.use('/api/chats', chatRoutes);
// app.use('/api/ai', aiChatRoutes);
const PORT = process.env.LOCAL_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
