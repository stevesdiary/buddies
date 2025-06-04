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
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const qualityRoutes_1 = __importDefault(require("./routes/qualityRoutes"));
const interestRoutes_1 = __importDefault(require("./routes/interestRoutes"));
const uploadRoute_1 = __importDefault(require("./routes/uploadRoute"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
models_1.sequelize.authenticate()
    .then(() => console.log('MySQL connected successfully'))
    .catch(err => console.error('MySQL connection error:', err));
const mongoDB = process.env.MONGO_DB;
const client = new mongodb_1.MongoClient(process.env.MONGO_DB);
mongoose_1.default.connect(mongoDB, {}).then(() => { console.log('Connected to mongo DB'); }).catch(err => console.error("Error", err));
app.use('/user', userRoutes_1.default);
app.use('/admin/', adminRoutes_1.default);
app.use('/login/', loginRoutes_1.default);
app.use('/quality/', qualityRoutes_1.default);
app.use('/interest/', interestRoutes_1.default);
app.use('/upload/', uploadRoute_1.default);
app.use('/health', (req, res) => {
    return res.status(200).json({ message: 'Service running well.' });
});
const PORT = process.env.LOCAL_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
