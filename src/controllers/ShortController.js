import generateId from "../util/generateId.js";
import PublicShortModel from "../data/models/PublicShortModel.js";
import ShortModel from "../data/models/ShortModel.js";

// Publico.
// Este se guarda sin el id del usuario.
const createShort = async (req, res) => {
    try {
        const { url, shortUrl } = short(req);
        const model = new PublicShortModel({ url, shortUrl });
        const modelSaved = await model.save();

        // Borramos la URL de la base de datos luego de un tiempo, ya que este proyecto es solo una demo.
        autoDeleteUrl(modelSaved, res);
        return res.status(200).json(modelSaved);
    } catch (error) {
        res.json(error.message);
    }
};

const autoDeleteUrl = async (model, res) => {
    setTimeout(async () => {
        const url = await PublicShortModel.findById(model._id);
        try {
            console.log(`Borrando Url: ${url}`)
            await url.deleteOne();
            console.log("Url publica borrada correctamente")

        } catch (error) {
            console.log(error.message);
        }
    }, "60000"); // Esto se borra en un minuto.
}


// Se requiere estar logeado.
// Este se guarda con el id del usuario.

// TODO: Se puede poner un limite de urls guardadas por cada usuario y un limite de usuarios por IP.
const createPrivateShort = async (req, res) => {
    if (!req.user) {
        return res.status(404).json({ msg: "Usuario logeado no encontrado" });
    }
    try {
        const { url, shortUrl } = short(req);
        const { id } = req.user;
        const model = new ShortModel({ url, shortUrl, userId: id })
        const modelSaved = await model.save();
        return res.status(200).json(modelSaved);
    }
    catch (error) {
        res.json(error.message);
    }
};

const deletePrivateShort = async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(404).json({ msg: "Usuario logeado no encontrado" });
    }

    const url = await ShortModel.findById(req.params.id);
    if (!url) {
        return res.status(404).json({ msg: "URL NO ENCONTRAO" });
    }

    if (url.userId != userId) {
        return res.status(401).json({ msg: "Permiso para borrar url denegado" });
    }

    try {
        await url.deleteOne();
        res.status(200).json({ msg: "Url borrada correctamente" });
    } catch (error) {
        return res.json({ msg: error.message });
    }
};

const editPrivateShort = async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        return res.status(404).json({ msg: "Usuario logeado no encontrado" });
    }

    const url = await ShortModel.findById(req.params.id);
    if (!url) {
        return res.status(404).json({ msg: "URL NO ENCONTRAO" });
    }

    if (url.userId != userId) {
        return res.status(401).json({ msg: "Permiso para modificar url denegado" });
    }

    try {
        url.url = req.body.url;
        const urlSaved = await url.save()
        res.status(200).json(urlSaved);
    } catch (error) {
        return res.json({ msg: error.message });
    }
};

const short = (req) => {
    const { url } = req.body;
    const shortUrl = generateId();
    return { url, shortUrl };
};

export {
    createShort, createPrivateShort, deletePrivateShort, editPrivateShort
}