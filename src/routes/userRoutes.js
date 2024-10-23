import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
    registerUser, login, 
    profile, editProfile,
    deleteProfile
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", login);

router.get("/profile", checkAuth, profile);

router.put("/edit-profile/:id", checkAuth, editProfile);

router.delete("/delete/:id", checkAuth, deleteProfile);

export default router;