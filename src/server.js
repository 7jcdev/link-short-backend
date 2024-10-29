import express from "express";
import dotenv from "dotenv";
import connectDB from "./data/db.js";
import userRoutes from "./routes/userRoutes.js";
import shorterRoutes from "./routes/shorterRoutes.js";
import cors from "cors";

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

const corsUrl = [process.env.FRONTEND_URI];

const corsOptions = {
    origin: function (origin, callback) {
        if (corsUrl.indexOf(origin) !== -1)
            callback(null, true)
        else {
            callback(new Error("No permitido por Cors"));
        }
    }
}

app.use(cors(corsOptions));
app.use("/api/users", userRoutes);
app.use("/api/short", shorterRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Corri4endo desde el puerto ${PORT}`);
});
