const express = require("express");
const app = express();
const PORT = 8000;

app.use(express.json());

app.use(express.static("public"));

const personagensRouter = require("./rotas/Rotas.js");
app.use("/api/personagens", personagensRouter);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`), console.log(`http://localhost:${PORT}`)
);
