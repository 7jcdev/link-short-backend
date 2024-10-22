import mongoose from "mongoose";

const publicShortSchema = new mongoose.Schema({
    url: {
        type: String,
        trim: true
    },
    shortUrl: {
        type: String,
        trim: true
    }
});

const PublicShortModel = mongoose.model("PublicShortModel", publicShortSchema);
export default PublicShortModel;