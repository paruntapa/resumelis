import express from "express";
import {login, signup} from "../controllers/AuthController";
import { loginValidation, signupValidation } from "../middleware";
import  ensureAuthenticated from "../Middleware/Auth";

const router = express.Router();

router.post("/login", loginValidation, login);

router.post("/signup", signupValidation, signup);


export default router;