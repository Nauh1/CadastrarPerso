// ----------------- CADASTRO -----------------
const nome = document.getElementById("nomeCadastro");
const nivel = document.getElementById("nivelCadastro");
const classe = document.getElementById("classeCadastro");
const vida = document.getElementById("vidaCadastro");
const forca = document.getElementById("forcaCadastro");
const submit = document.getElementById("submitCadastro");

const divListaPerso = document.getElementById("listaPerso");


function exibiuPopup(pop) {
    let botao = pop.querySelector("button");
    pop.style.display = "block";

    const timeout = setTimeout(() => {
        pop.style.display = "none";
    }, 1500);

    const fechar = () => {
        pop.style.display = "none";
        clearTimeout(timeout);
        botao.removeEventListener("click", fechar);
    }

    botao.addEventListener("click", fechar);
}

// ----------------- FUNÇÃO PARA PEGAR VALORES DO POPUP DE EDIÇÃO -----------------
function pegarValoresNovos() {
    const nomeEditar = document.getElementById("nomeEditar");
    const nivelEditar = document.getElementById("nivelEditar");
    const classeEditar = document.getElementById("classeEditar");
    const vidaEditar = document.getElementById("vidaEditar");
    const forcaEditar = document.getElementById("forcaEditar");

    if (
        nomeEditar.value.trim() !== "" &&
        nivelEditar.value.trim() !== "" &&
        classeEditar.value !== "" &&
        vidaEditar.value.trim() !== "" &&
        forcaEditar.value.trim() !== ""
    ) {
        return {
            nome: nomeEditar.value.trim(),
            nivel: nivelEditar.value.trim(),
            classe: classeEditar.value,
            vida: vidaEditar.value.trim(),
            forca: forcaEditar.value.trim()
        };
    } else {
        return null;
    }
}

// ----------------- FUNÇÃO PARA CRIAR CARDS -----------------
function exibir(p) {
    const card = document.createElement("div");
    card.classList.add("card");

    function atualizarCard(data) {
        card.querySelector("h2").textContent = data.nome;
        card.querySelector("p:nth-of-type(1)").innerHTML = `<strong>Nível:</strong> ${data.nivel}`;
        card.querySelector("p:nth-of-type(2)").innerHTML = `<strong>Classe:</strong> ${data.classe}`;
        card.querySelector("p:nth-of-type(3)").innerHTML = `<strong>Vida:</strong> ${data.vida}`;
        card.querySelector("p:nth-of-type(4)").innerHTML = `<strong>Força:</strong> ${data.forca}`;
    }

    card.innerHTML = `
        <h2>${p.nome}</h2>
        <p><strong>Nível:</strong> ${p.nivel}</p>
        <p><strong>Classe:</strong> ${p.classe}</p>
        <p><strong>Vida:</strong> ${p.vida}</p>
        <p><strong>Força:</strong> ${p.forca}</p>
        <button class="buttonEditar">Editar</button>
        <button class="buttonRemover">Remover</button>
    `;

    divListaPerso.appendChild(card);

    // DELETE
    card.querySelector(".buttonRemover").addEventListener("click", async () => {
        try {
            await fetch(`http://localhost:8000/api/personagens/${p.id}`, { method: "DELETE" });
            card.remove();
            const popup = document.getElementById("popupDeletar");
            exibiuPopup(popup);
        } catch (err) {
            console.error(err);
            alert("Erro ao remover personagem");
        }
    });

    // EDITAR
    card.querySelector(".buttonEditar").addEventListener("click", () => {
        const popupEditar = document.getElementById("popupEditar");
        popupEditar.style.display = "block";

        document.getElementById("nomeEditar").value = p.nome;
        document.getElementById("nivelEditar").value = p.nivel;
        document.getElementById("classeEditar").value = p.classe;
        document.getElementById("vidaEditar").value = p.vida;
        document.getElementById("forcaEditar").value = p.forca;

        const btnSalvar = document.getElementById("salvarEdicao");
        const btnSair = document.getElementById("xButtonEditar");
        
        // Remove listener antigo
        const novoBtn = btnSalvar.cloneNode(true);
        btnSalvar.replaceWith(novoBtn);

        novoBtn.addEventListener("click", async () => {
            const dadosAtualizados = pegarValoresNovos();
            if (!dadosAtualizados) return alert("Preencha todos os campos!");

            try {
                const response = await fetch(`http://localhost:3000/api/personagens/${p.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dadosAtualizados)
                });
                const data = await response.json();

                atualizarCard(data);
                p = data;

                popupEditar.style.display = "none";
                alert("Personagem atualizado!");
            } catch (err) {
                console.error(err);
                alert("Erro ao atualizar personagem");
            }
        });

        btnSair.addEventListener('click', () => {
            popupEditar.style.display = "none";
        })
    });
}

// ----------------- CADASTRO -----------------
submit.addEventListener("click", async () => {
    if (
        nome.value.trim() !== "" &&
        nivel.value.trim() !== "" &&
        classe.value !== "" &&
        vida.value.trim() !== "" &&
        forca.value.trim() !== ""
    ) {
        const perso = {
            nome: nome.value.trim(),
            nivel: nivel.value.trim(),
            classe: classe.value,
            vida: vida.value.trim(),
            forca: forca.value.trim()
        };

        try {
            const response = await fetch("http://localhost:3000/api/personagens", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(perso)
            });
            const data = await response.json();

            const popup = document.getElementById("popupSalvar");
            exibiuPopup(popup);

            exibir(data);
        } catch (err) {
            console.error(err);
            alert("Erro ao cadastrar personagem");
        }
    } else {
        alert("Preencha todos os campos!");
    }
});

// ----------------- CARREGAR PERSONAGENS EXISTENTES -----------------
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:3000/api/personagens");
        const lista = await response.json();
        lista.forEach(p => exibir(p));
    } catch (err) {
        console.error("Erro ao buscar personagens:", err);
    }
});
