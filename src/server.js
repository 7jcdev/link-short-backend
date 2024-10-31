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

// TODO: Arreglar cors.
/*const corsOptions = {
    origin: function (origin, callback) {
        if (corsUrl.indexOf(origin) !== -1){

            const options = { "origin": "true", "methods": "GET,HEAD,PUT,PATCH,POST,DELETE" }
            callback(null, options)
        }
        else {
            callback(new Error("No permitido por Cors"));
        }
    }
}
app.use(cors(corsOptions));    
*/
// [`${corsUrl}`]
app.use((req, res, next)=>{
    res.append("Access-Control-Allow-Origin", ["*"])
    res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Access-Control-Allow-Credentials', true)
    next()
})
app.use("/api/users", userRoutes);
app.use("/api/short", shorterRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Corri4endo desde el puerto ${PORT}`);
});
