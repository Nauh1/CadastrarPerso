const express = require("express");
const router = express.Router();
const { db } = require("../dados/fireStore.js");

// Middleware para validar o formulário
function validaForm(req, res, next) {
    const { nome, nivel, classe, vida, forca } = req.body;
    if (!nome || !nivel || !classe || !vida || !forca) {
        return res.status(400).json({ erro: "Preencha todos os campos!" });
    }
    next();
}

// POST → criar personagem
router.post("/", validaForm, async (req, res) => {
    try {
        const data = req.body;
        const docRef = await db.collection("personagens").add(data);
        res.json({ id: docRef.id, ...data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao criar personagem" });
    }
});

module.exports = router;

// GET → lista todos os personagens
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("personagens").get();
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(lista);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar personagens" });
    }
});

// DELETE → remove personagem pelo ID
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id; // pega o ID do personagem na URL
        await db.collection("personagens").doc(id).delete();
        res.json({ msg: "Personagem removido com sucesso", id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao deletar personagem" });
    }
});

// PUT → editar personagem pelo ID
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id; // pega o ID do personagem na URL
        const data = req.body; 
        await db.collection("personagens").doc(id).update(data); 
        res.json({ id, ...data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao atualizar personagem" });
    }
});

