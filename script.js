/* ==================================================
   DADOS
================================================== */

const candidatos = [
    "LULA",
    "DILMA",
    "SERRA",
    "MARINA",
    "BOLSONARO"
];


/* ==================================================
   VOTOS
================================================== */

let votos = {

    LULA: 0,
    DILMA: 0,
    SERRA: 0,
    MARINA: 0,
    BOLSONARO: 0

};


/* ==================================================
   ELEMENTOS
================================================== */

const input =
    document.getElementById("candidateInput");

const voteButton =
    document.getElementById("voteButton");

const message =
    document.getElementById("message");

const modal =
    document.getElementById("modal");

const modalCandidate =
    document.getElementById("modalCandidate");

const modalClose =
    document.getElementById("modalClose");

const modalOk =
    document.getElementById("modalOk");

const totalVotes =
    document.getElementById("totalVotes");

const results =
    document.getElementById("results");

const search =
    document.getElementById("search");

const candidateGrid =
    document.getElementById("candidateGrid");

const noResults =
    document.getElementById("noResults");

const menuBtn =
    document.getElementById("menuBtn");

const menu =
    document.querySelector(".menu");


/* ==================================================
   SELECIONAR CANDIDATO
================================================== */

const buttons =
    document.querySelectorAll(".select-btn");


buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        const nome =
            button.dataset.candidate;

        input.value = nome;

        input.focus();

        document
            .querySelector(".vote-section")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


/* ==================================================
   VOTAR
================================================== */

function votar() {

    const nome =
        input.value.trim().toUpperCase();


    /* Campo vazio */

    if (nome === "") {

        mostrarMensagem(
            "Digite o nome de um candidato.",
            "erro"
        );

        return;

    }


    /* Candidato inexistente */

    if (!candidatos.includes(nome)) {

        mostrarMensagem(
            "Candidato não encontrado.",
            "erro"
        );

        return;

    }


    /* Adiciona voto */

    votos[nome]++;

    
    /* Atualiza interface */

    atualizarResultados();


    /* Limpa input */

    input.value = "";


    /* Mostra modal */

    abrirModal(nome);

}


/* ==================================================
   MENSAGEM
================================================== */

function mostrarMensagem(texto, tipo) {

    message.textContent = texto;


    if (tipo === "erro") {

        message.style.color =
            "#ff5c5c";

    } else {

        message.style.color =
            "#00d084";

    }


    setTimeout(function() {

        message.textContent = "";

    }, 4000);

}


/* ==================================================
   MODAL
================================================== */

function abrirModal(nome) {

    modalCandidate.textContent =
        nome;

    modal.classList.add("active");

}


function fecharModal() {

    modal.classList.remove("active");

}


modalClose.addEventListener(
    "click",
    fecharModal
);


modalOk.addEventListener(
    "click",
    fecharModal
);


modal.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {

            fecharModal();

        }

    }
);


/* ==================================================
   RESULTADOS
================================================== */

function atualizarResultados() {

    let total = 0;


    candidatos.forEach(function(nome) {

        total += votos[nome];

    });


    totalVotes.textContent =
        total;


    results.innerHTML = "";


    candidatos.forEach(function(nome) {

        const quantidade =
            votos[nome];


        let porcentagem = 0;


        if (total > 0) {

            porcentagem =
                (quantidade / total) * 100;

        }


        const row =
            document.createElement("div");

        row.classList.add(
            "result-row"
        );


        row.innerHTML = `

            <div class="result-top">

                <strong>
                    ${nome}
                </strong>

                <span>
                    ${quantidade}
                    voto(s)
                    •
                    ${porcentagem.toFixed(1)}%
                </span>

            </div>

            <div class="progress">

                <div
                    class="progress-bar"
                    style="width: ${porcentagem}%"
                ></div>

            </div>

        `;


        results.appendChild(row);

    });

}


/* ==================================================
   PESQUISA
================================================== */

search.addEventListener(
    "input",
    function() {

        const termo =
            search.value
                .toLowerCase()
                .trim();


        const cards =
            document.querySelectorAll(
                ".candidate-card"
            );


        let encontrados = 0;


        cards.forEach(function(card) {

            const nome =
                card.dataset.name;


            if (
                nome.includes(termo)
            ) {

                card.style.display =
                    "";

                encontrados++;

            } else {

                card.style.display =
                    "none";

            }

        });


        if (encontrados === 0) {

            noResults.style.display =
                "block";

        } else {

            noResults.style.display =
                "none";

        }

    }
);


/* ==================================================
   ENTER NO INPUT
================================================== */

input.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            votar();

        }

    }
);


/* ==================================================
   MENU MOBILE
================================================== */

menuBtn.addEventListener(
    "click",
    function() {

        menu.classList.toggle(
            "open"
        );

    }
);


/* ==================================================
   FECHAR MENU AO CLICAR
================================================== */

const links =
    document.querySelectorAll(
        ".menu a"
    );


links.forEach(function(link) {

    link.addEventListener(
        "click",
        function() {

            menu.classList.remove(
                "open"
            );

        }
    );

});


/* ==================================================
   MENU ATIVO
================================================== */

window.addEventListener(
    "scroll",
    function() {

        const sections =
            document.querySelectorAll(
                "section[id]"
            );

        const scroll =
            window.scrollY + 150;


        sections.forEach(function(section) {

            const top =
                section.offsetTop;

            const height =
                section.offsetHeight;

            const id =
                section.getAttribute("id");


            if (
                scroll >= top &&
                scroll < top + height
            ) {

                links.forEach(function(link) {

                    link.classList.remove(
                        "active"
                    );

                    if (
                        link.getAttribute("href")
                        === "#" + id
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                });

            }

        });

    }
);


/* ==================================================
   INICIALIZA
================================================== */

atualizarResultados();