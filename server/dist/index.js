"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const postsRoute_1 = __importDefault(require("./routes/postsRoute"));
const app = (0, express_1.default)();
dotenv_1.default.config();
//middleware
app.use(body_parser_1.default.json({ limit: "30mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "30mb", extended: true }));
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use("/auth", authRoute_1.default);
app.use("/users", usersRoute_1.default);
app.use("/posts", postsRoute_1.default);
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT;
if (!CONNECTION_URL) {
    throw new Error('CONNECTION_URL is not defined');
}
if (!PORT) {
    throw new Error('PORT is not defined');
}
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));
