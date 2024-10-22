import UserModel from "../data/models/UserModel.js";
import generateJWT from "../util/generateJWT.js";
import ShortModel from "../data/models/ShortModel.js";

// TODO: Se puede poner un limite de usuarios por IP.

const registerUser = async (req, res) => {
    const { email, name } = req.body;
    const checkUser = await UserModel.findOne({ email });

    if (checkUser) {
        const error = new Error("El usuario ya esta registrado");
        return res.status(400).json({ msg: error.message })
    }

    try {
        const model = new UserModel(req.body);
        const savedModel = await model.save();

        // Excluimos la contraseña por seguridad.
        const { _id, name, email } = savedModel;
        res.status(200).json({
            id: _id,
            name,
            email
        });
    } catch (error) {
        return res.json({ msg: error.message })
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
        const error = new Error("Usuaio no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (await user.checkPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user.id)
        });
    } else {
        const error = new Error("Password Incorrecto");
        return res.status(403).json({ msg: error.message });
    }
};

const profile = (req, res) => {
    const { user } = req;
    res.json(user);
};

const updateProfile = async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
        const error = new Error("Id de usuario no encontrado");
        return res.status(404).json({ msg: error.message })
    }

    const { email } = req.body;
    if (user.email !== req.body.email) {
        const checkEmail = await UserModel.findOne({ email });
        if (checkEmail) {
            const error = new Error("Email esta en uso");
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        user.name = req.body.name;
        user.email = req.body.email;
        const userSaved = await user.save();
        res.status(200).json({
            name: userSaved.name,
            email: userSaved.email,
            _id: userSaved._id
        });
    } catch (error) {
        return res.json({ msg: error.message })
    }
};

const deleteProfile = async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    try {
        const urls = await ShortModel.find({ userId: user._id });
        for (let i = 0; i < urls.length; i++) {
            await urls[i].deleteOne();
        }
        await user.deleteOne();
        req.user = null;
        res.status(200).json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        return res.json({ msg: error.message })
    }
};


export { registerUser, login, profile, updateProfile, deleteProfile } 