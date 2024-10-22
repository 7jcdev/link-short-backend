import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const database = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Base de datos conectada correctamente a ${getUrl(database)}`);
    } catch (error) {
        console.log(error);
    }
}

function getUrl(database) {
    return `${database.connection.host}:${database.connection.port}`;
}

export default connectDB;