const nome = document.getElementById("nome")
const nivel = document.getElementById("nivel")
const classe = document.getElementById("classe")
const vida = document.getElementById("vida")
const forca = document.getElementById("forca")

const submit = document.getElementById("submit")

let perso = {};


function cadastrar() {
    if (
        nome.value.trim() !== "" &&
        nivel.value.trim() !== "" &&
        classe.value !== "" &&
        vida.value.trim() !== "" &&
        forca.value.trim() !== ""
    ) {
        perso = {
            nome: nome.value.trim(),
            nivel: nivel.value.trim(),
            classe: classe.value,
            vida: vida.value.trim(),
            forca: forca.value.trim()
        };
        console.log(perso);
        alert("Personagem cadastrado com sucesso!");
    } else {
        alert("Por favor, preencha todos os campos antes de cadastrar.");
    }
}

submit.addEventListener('click',cadastrar)

