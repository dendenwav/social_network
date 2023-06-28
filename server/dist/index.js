"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const usersRoute_1 = __importDefault(require("./presentation/routes/usersRoute"));
const authRoute_1 = __importDefault(require("./presentation/routes/authRoute"));
const postsRoute_1 = __importDefault(require("./presentation/routes/postsRoute"));
const DBConnection_1 = require("./dal/DBConnection");
const app = (0, express_1.default)();
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
(0, DBConnection_1.DBConnection)(app);
