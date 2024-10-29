import generateId from "../util/generateId.js";
import PublicShortModel from "../data/models/PublicShortModel.js";
import ShortModel from "../data/models/ShortModel.js";

// Publico.
const createPublicShort = async (req, res) => {
    try {
        const { url, shortUrl } = short(req);
        const model = new PublicShortModel({ url, shortUrl });
        const modelSaved = await model.save();

        // Borramos la URL de la base de datos luego de un tiempo, ya que este proyecto es solo una demo.
        autoDeleteShort(modelSaved, res);

        console.log(modelSaved);
        return res.status(200).json(modelSaved);
    } catch (error) {
        res.json(error.message);
    }
};

const autoDeleteShort = async (model, res) => {
    setTimeout(async () => {
        const url = await PublicShortModel.findById(model._id);
        try {
            console.log(`Borrando Url: ${url}`)
            await url.deleteOne();
            console.log("Url publica borrada correctamente")

        } catch (error) {
            console.log(error.message);
        }
    }, "60000"); // 1 minute.
}

const getPublicShort = async (req, res) => {
    try {
        const short = await PublicShortModel.findOne({ shortUrl: req.params.url });
        if(!short){
            return res.status(403).json({ msg: "Url no encontrada" });
        }
        console.log(short);
        return res.status(200).json({url: short.url, shortUrl: short.shortUrl, msg: "Url obtenida con exito"});
    }
    catch (error) {
        res.json(error.message);
    }
}

// Usuario registrado.
// TODO: Añadir limite de links por usuario.
const createShort = async (req, res) => {
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

const deleteShort = async (req, res) => {
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

const editShort = async (req, res) => {
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
    createPublicShort, createShort, deleteShort, editShort, getPublicShort
}