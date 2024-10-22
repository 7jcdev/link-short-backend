import express from "express";
import dotenv from "dotenv";
import connectDB from "./data/db.js";
import userRoutes from "./routes/userRoutes.js";
import shorterRoutes from "./routes/shorterRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/short", shorterRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Corri4endo desde el puerto ${PORT}`);
});

//console.log(app._router.stack);
