"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
// Création du routeur
const router = express_1.default.Router();
// Définition des routes
router.get("/", usersController_1.getUsers);
router.get("/:id", usersController_1.getUser);
router.put("/", authMiddleware_1.default, usersController_1.updateUser);
router.delete("/:id", authMiddleware_1.default, usersController_1.deleteUser);
router.put("/follow/:id", authMiddleware_1.default, usersController_1.followUser);
router.put("/unfollow/:id", authMiddleware_1.default, usersController_1.unfollowUser);
exports.default = router;
