import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
    createPublicShort, createShort, deleteShort, editShort, getPublicShort
} from "../controllers/ShortController.js";

const router = express.Router();

// Usuario publico.
router.post("/create-public-short", createPublicShort);
router.get("/get-public-short/:url", getPublicShort);

// Usuario registrado.
router.post("/create-short", checkAuth, createShort);
router.delete("/delete-short/:id", checkAuth, deleteShort);
router.put("/edit-short/:id", checkAuth, editShort);

export default router;
