import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
    createShort, createPrivateShort, deletePrivateShort, editPrivateShort
} from "../controllers/ShortController.js";

const router = express.Router();

// Usuario publico.
router.post("/createShort", createShort);

// Usuario registrado.
router.post("/create-private-short", checkAuth, createPrivateShort);
router.delete("/delete-private-short/:id", checkAuth, deletePrivateShort);
router.put("/edit-private-short/:id", checkAuth, editPrivateShort);

export default router;
