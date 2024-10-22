import mongoose from "mongoose";

const ShortSchema = new mongoose.Schema({
    url: {
        type: String,
        trim: true
    },
    shortUrl: {
        type: String,
        trim: true
    },
    userId: {
        type: String,
        required: true
    }
});

const ShortModel = mongoose.model("ShortModel", ShortSchema);
export default ShortModel;