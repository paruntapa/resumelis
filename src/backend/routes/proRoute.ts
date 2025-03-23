import express from "express";
import  ensureAuthenticated  from "../Middleware/Auth";

const router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
    res.send("Hello World");
});

export default router;