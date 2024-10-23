import jwt from "jsonwebtoken";
import UserModel from "../data/models/UserModel.js";

const checkAuth = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await UserModel.findById(decoded.id)
                .select("-password");
            
            return next();
        }
        catch(error){
            const err = new Error("Token Invalido");
            return res.status(403).json({msg: err.message});
        }
    }

    if(!token){
        const err = new Error("Token invalido o inexistente");
        res.status(403).json({msg: err.message});
    }
    next();
}

export default checkAuth;