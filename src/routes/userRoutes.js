import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
    registerUser, login, profile,
    updateProfile,
    deleteProfile
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", login);

router.get("/profile", checkAuth, profile);

router.put("/update-profile/:id", checkAuth, updateProfile);

router.delete("/delete/:id", checkAuth, deleteProfile);

export default router;