import express from "express";

const router = express.Router();

router.post("/",(req,res) => {
    console.log(req.path);
    console.log(req.body);
    res.send();
});

export default router;