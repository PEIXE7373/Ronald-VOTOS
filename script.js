```javascript
"use strict";

/* ==================================================
   CONFIGURAÇÕES
================================================== */

const STORAGE_KEY = "ronaldVotos_v2";

const candidatos = [
    {
        id: "LULA",
        nome: "Lula",
        partido: "PT"
    },
    {
        id: "DILMA",
        nome: "Dilma",
        partido: "PT"
    },
    {
        id: "SERRA",
        nome: "Serra",
        partido: "PSDB"
    },
    {
        id: "MARINA",
        nome: "Marina",
        partido: "REDE"
    },
    {
        id: "BOLSONARO",
        nome: "Bolsonaro",
        partido: "PL"
    }
];


/* ==================================================
   VOTOS PADRÃO
================================================== */

const votosPadrao = {
    LULA: 0,
    DILMA: 0,
    SERRA: 0,
    MARINA: 0,
    BOLSONARO: 0
};


/* ==================================================
   FUNÇÃO PARA NORMALIZAR TEXTO
================================================== */

function normalizarTexto(texto) {

    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase();

}


/* ==================================================
   CARREGAR VOTOS DO NAVEGADOR
================================================== */

function carregarVotos() {

    try {

        const dadosSalvos =
            localStorage.getItem(STORAGE_KEY);

        if (!dadosSalvos) {

            return {
                ...votosPadrao
            };

        }

        const dados =
            JSON.parse(dadosSalvos);

        const votosCarregados = {
            ...votosPadrao
        };


        candidatos.forEach(function(candidato) {

            const valor =
                Number(dados[candidato.id]);


            if (
                Number.isFinite(valor) &&
                valor >= 0
            ) {

                votosCarregados[candidato.id] =
                    Math.floor(valor);

            }

        });


        return votosCarregados;

    } catch (erro) {

        console.warn(
            "Não foi possível carregar os votos:",
            erro
        );

        return {
            ...votosPadrao
        };

    }

}


/* ==================================================
   VOTOS ATUAIS
================================================== */

let votos = carregarVotos();


/* ==================================================
   SALVAR VOTOS
================================================== */

function salvarVotos() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(votos)
        );

    } catch (erro) {

        console.warn(
            "Não foi possível salvar os votos:",
            erro
        );

    }

}


/* ==================================================
   ELEMENTOS DO HTML
================================================== */

const input =
    document.getElementById("candidateInput");

const voteButton =
    document.getElementById("voteButton");

const voteForm =
    document.getElementById("voteForm");

const message =
    document.getElementById("message") ||
    document.getElementById("voteMessage");

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
    document.querySelector(".menu") ||
    document.getElementById("mainNav");

const resetButton =
    document.getElementById("resetButton");

const heroVotes =
    document.getElementById("heroVotes");


/* ==================================================
   VERIFICAR ELEMENTOS IMPORTANTES
================================================== */

if (!input) {
    console.warn(
        'Elemento "#candidateInput" não encontrado.'
    );
}

if (!results) {
    console.warn(
        'Elemento "#results" não encontrado.'
    );
}


/* ==================================================
   ENCONTRAR CANDIDATO
================================================== */

function encontrarCandidato(valor) {

    const termo =
        normalizarTexto(valor);


    return candidatos.find(function(candidato) {

        return (
            candidato.id === termo ||
            normalizarTexto(candidato.nome) === termo ||
            normalizarTexto(candidato.partido) === termo
        );

    });

}


/* ==================================================
   MOSTRAR MENSAGEM
================================================== */

let timerMensagem = null;

function mostrarMensagem(texto, tipo = "") {

    if (!message) {
        return;
    }


    clearTimeout(timerMensagem);


    message.textContent =
        texto;


    message.classList.remove(
        "erro",
        "sucesso"
    );


    if (tipo) {

        message.classList.add(
            tipo
        );

    }


    timerMensagem =
        setTimeout(function() {

            message.textContent = "";

            message.classList.remove(
                "erro",
                "sucesso"
            );

        }, 4000);

}


/* ==================================================
   SELECIONAR CANDIDATO
================================================== */

function selecionarCandidato(id) {

    const candidato =
        candidatos.find(function(item) {

            return item.id === id;

        });


    if (!candidato || !input) {
        return;
    }


    input.value =
        candidato.nome;


    mostrarMensagem(
        `${candidato.nome} selecionado. Clique em "Votar".`,
        "sucesso"
    );


    input.focus();


    const voteSection =
        document.querySelector(
            "#votacao, .vote-section"
        );


    if (voteSection) {

        voteSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* ==================================================
   BOTÕES DOS CANDIDATOS
================================================== */

const buttons =
    document.querySelectorAll(
        ".select-btn, .select-candidate"
    );


buttons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            selecionarCandidato(
                normalizarTexto(
                    button.dataset.candidate
                )
            );

        }
    );

});


/* ==================================================
   CALCULAR TOTAL
================================================== */

function calcularTotal() {

    return candidatos.reduce(
        function(total, candidato) {

            return total +
                Number(votos[candidato.id] || 0);

        },
        0
    );

}


/* ==================================================
   FORMATAR NÚMEROS
================================================== */

function formatarNumero(numero) {

    return Number(numero).toLocaleString(
        "pt-BR"
    );

}


/* ==================================================
   ATUALIZAR RESULTADOS
================================================== */

function atualizarResultados() {

    if (!results) {
        return;
    }


    const total =
        calcularTotal();


    if (totalVotes) {

        totalVotes.textContent =
            formatarNumero(total);

    }


    if (heroVotes) {

        heroVotes.textContent =
            formatarNumero(total);

    }


    results.innerHTML = "";


    candidatos.forEach(
        function(candidato) {

            const quantidade =
                Number(
                    votos[candidato.id] || 0
                );


            const porcentagem =
                total > 0
                    ? (quantidade / total) * 100
                    : 0;


            /* RESULTADO */

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "result-row";


            /* TOPO */

            const top =
                document.createElement(
                    "div"
                );


            top.className =
                "result-top";


            /* NOME */

            const nome =
                document.createElement(
                    "strong"
                );


            nome.textContent =
                candidato.nome;


            /* INFORMAÇÕES */

            const info =
                document.createElement(
                    "span"
                );


            info.textContent =
                `${formatarNumero(quantidade)} voto(s) • ${porcentagem.toFixed(1).replace(".", ",")}%`;


            top.appendChild(nome);

            top.appendChild(info);


            /* BARRA */

            const progress =
                document.createElement(
                    "div"
                );


            progress.className =
                "progress";


            const progressBar =
                document.createElement(
                    "div"
                );


            progressBar.className =
                "progress-bar";


            progressBar.style.width =
                `${porcentagem}%`;


            progress.appendChild(
                progressBar
            );


            /* MONTAR */

            row.appendChild(top);

            row.appendChild(progress);

            results.appendChild(row);

        }
    );

}


/* ==================================================
   VOTAR
================================================== */

function votar() {

    if (!input) {
        return;
    }


    const valor =
        input.value.trim();


    if (valor === "") {

        mostrarMensagem(
            "Digite ou selecione um candidato.",
            "erro"
        );

        input.focus();

        return;

    }


    const candidato =
        encontrarCandidato(valor);


    if (!candidato) {

        mostrarMensagem(
            "Candidato não encontrado. Escolha uma opção válida.",
            "erro"
        );

        input.focus();

        return;

    }


    /* ADICIONAR VOTO */

    votos[candidato.id] =
        Number(votos[candidato.id] || 0) + 1;


    /* SALVAR */

    salvarVotos();


    /* ATUALIZAR */

    atualizarResultados();


    /* LIMPAR */

    input.value = "";


    /* MENSAGEM */

    mostrarMensagem(
        "Voto registrado com sucesso!",
        "sucesso"
    );


    /* MODAL */

    abrirModal(
        candidato.nome
    );

}


/* ==================================================
   BOTÃO VOTAR
================================================== */

if (voteButton) {

    voteButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            votar();

        }
    );

}


/* ==================================================
   FORMULÁRIO
================================================== */

if (voteForm) {

    voteForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            votar();

        }
    );

}


/* ==================================================
   ENTER NO INPUT
================================================== */

if (input) {

    input.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                votar();

            }

        }
    );

}


/* ==================================================
   MODAL
================================================== */

function abrirModal(nome) {

    if (!modal) {
        return;
    }


    if (modalCandidate) {

        modalCandidate.textContent =
            nome;

    }


    modal.classList.add(
        "active"
    );


    modal.removeAttribute(
        "hidden"
    );


    document.body.classList.add(
        "modal-open"
    );


    if (modalOk) {

        setTimeout(
            function() {

                modalOk.focus();

            },
            50
        );

    }

}


function fecharModal() {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "hidden",
        ""
    );


    document.body.classList.remove(
        "modal-open"
    );


    if (input) {

        setTimeout(
            function() {

                input.focus();

            },
            50
        );

    }

}


/* FECHAR X */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        fecharModal
    );

}


/* BOTÃO OK */

if (modalOk) {

    modalOk.addEventListener(
        "click",
        fecharModal
    );

}


/* CLICAR FORA */

if (modal) {

    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal ||
                event.target.hasAttribute(
                    "data-close-modal"
                ) ||
                event.target.classList.contains(
                    "modal-backdrop"
                )
            ) {

                fecharModal();

            }

        }
    );

}


/* ESC */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modal &&
            modal.classList.contains("active")
        ) {

            fecharModal();

        }

    }
);


/* ==================================================
   PESQUISA
================================================== */

if (search) {

    search.addEventListener(
        "input",
        function() {

            const termo =
                normalizarTexto(
                    search.value
                );


            const cards =
                document.querySelectorAll(
                    ".candidate-card"
                );


            let encontrados = 0;


            cards.forEach(
                function(card) {

                    const nome =
                        normalizarTexto(
                            card.dataset.name ||
                            card.textContent
                        );


                    const partido =
                        normalizarTexto(
                            card.dataset.party || ""
                        );


                    const corresponde =
                        termo === "" ||
                        nome.includes(termo) ||
                        partido.includes(termo);


                    card.hidden =
                        !corresponde;


                    if (corresponde) {

                        encontrados++;

                    }

                }
            );


            if (noResults) {

                noResults.hidden =
                    encontrados !== 0;

            }

        }
    );

}


/* ==================================================
   ZERAR VOTOS
================================================== */

function zerarVotos() {

    const confirmar =
        window.confirm(
            "Tem certeza que deseja zerar todos os votos?"
        );


    if (!confirmar) {
        return;
    }


    candidatos.forEach(
        function(candidato) {

            votos[candidato.id] = 0;

        }
    );


    salvarVotos();

    atualizarResultados();


    mostrarMensagem(
        "Todos os votos foram zerados.",
        "sucesso"
    );

}


/* BOTÃO ZERAR */

if (resetButton) {

    resetButton.addEventListener(
        "click",
        zerarVotos
    );

}


/* ==================================================
   MENU MOBILE
================================================== */

if (menuBtn && menu) {

    menuBtn.addEventListener(
        "click",
        function() {

            const aberto =
                menu.classList.toggle(
                    "open"
                );


            menuBtn.setAttribute(
                "aria-expanded",
                String(aberto)
            );


            menuBtn.setAttribute(
                "aria-label",
                aberto
                    ? "Fechar menu"
                    : "Abrir menu"
            );

        }
    );

}


/* ==================================================
   FECHAR MENU AO CLICAR
================================================== */

if (menu) {

    const links =
        menu.querySelectorAll(
            "a"
        );


    links.forEach(
        function(link) {

            link.addEventListener(
                "click",
                function() {

                    menu.classList.remove(
                        "open"
                    );


                    if (menuBtn) {

                        menuBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

        }
    );

}


/* ==================================================
   MENU ATIVO
================================================== */

const linksMenu =
    document.querySelectorAll(
        ".menu a, .main-nav a, .nav-link"
    );


window.addEventListener(
    "scroll",
    function() {

        const sections =
            document.querySelectorAll(
                "section[id]"
            );


        const posicao =
            window.scrollY + 180;


        sections.forEach(
            function(section) {

                const topo =
                    section.offsetTop;


                const altura =
                    section.offsetHeight;


                const id =
                    section.getAttribute(
                        "id"
                    );


                if (
                    posicao >= topo &&
                    posicao < topo + altura
                ) {

                    linksMenu.forEach(
                        function(link) {

                            link.classList.remove(
                                "active"
                            );


                            if (
                                link.getAttribute(
                                    "href"
                                ) === `#${id}`
                            ) {

                                link.classList.add(
                                    "active"
                                );

                            }

                        }
                    );

                }

            }
        );

    },
    {
        passive: true
    }
);


/* ==================================================
   FECHAR MENU AO REDIMENSIONAR
================================================== */

window.addEventListener(
    "resize",
    function() {

        if (
            window.innerWidth > 750 &&
            menu
        ) {

            menu.classList.remove(
                "open"
            );


            if (menuBtn) {

                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    }
);


/* ==================================================
   INICIALIZAÇÃO
================================================== */

atualizarResultados();


/* ==================================================
   DISPONIBILIZA FUNÇÕES
   PARA DEBUG NO CONSOLE
================================================== */

window.RonaldVotos = {

    votar,
    zerarVotos,
    atualizarResultados,
    selecionarCandidato,
    abrirModal,
    fecharModal

};
```
