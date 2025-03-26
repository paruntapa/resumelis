import express from "express";
import  ensureAuthenticated  from "../middleware/Auth";

const router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
    res.send("Hello World");
});

export default router;