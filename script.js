"use strict";

/* =========================================================
   RONALDVOTOS
   JAVASCRIPT
   ========================================================= */


/* =========================================================
   CANDIDATOS
   ========================================================= */

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


/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const STORAGE_KEY = "ronaldVotos";

/*
   Guarda se este navegador já votou.
*/
const VOTED_KEY = "ronaldVotos_ja_votou";


const votosPadrao = {
    LULA: 0,
    DILMA: 0,
    SERRA: 0,
    MARINA: 0,
    BOLSONARO: 0
};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const input = document.getElementById(
    "candidateInput"
);

const voteForm = document.getElementById(
    "voteForm"
);

const voteMessage = document.getElementById(
    "voteMessage"
);

const modal = document.getElementById(
    "modal"
);

const modalCandidate = document.getElementById(
    "modalCandidate"
);

const modalClose = document.getElementById(
    "modalClose"
);

const modalOk = document.getElementById(
    "modalOk"
);

const resetButton = document.getElementById(
    "resetButton"
);

const search = document.getElementById(
    "search"
);

const candidateGrid = document.getElementById(
    "candidateGrid"
);

const noResults = document.getElementById(
    "noResults"
);

const results = document.getElementById(
    "results"
);

const totalVotes = document.getElementById(
    "totalVotes"
);

const heroVotes = document.getElementById(
    "heroVotes"
);

const menuBtn = document.getElementById(
    "menuBtn"
);

const mainNav = document.getElementById(
    "mainNav"
);


/* =========================================================
   VOTOS
   ========================================================= */

let votos = carregarVotos();


function carregarVotos() {

    try {

        const dados =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!dados) {

            return {
                ...votosPadrao
            };

        }


        const armazenados =
            JSON.parse(dados);


        const resultado = {
            ...votosPadrao
        };


        candidatos.forEach(
            candidato => {

                const valor =
                    Number(
                        armazenados[
                            candidato.id
                        ]
                    );


                if (
                    Number.isFinite(valor) &&
                    valor >= 0
                ) {

                    resultado[
                        candidato.id
                    ] =
                        Math.floor(valor);

                }

            }
        );


        return resultado;

    } catch (erro) {

        console.error(
            "Erro ao carregar votos:",
            erro
        );


        return {
            ...votosPadrao
        };

    }

}


function salvarVotos() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(votos)
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar votos:",
            erro
        );

    }

}


/* =========================================================
   CONTROLE DE VOTO
   ========================================================= */

function jaVotou() {

    try {

        return (
            localStorage.getItem(
                VOTED_KEY
            ) === "true"
        );

    } catch (erro) {

        console.error(
            "Erro ao verificar voto:",
            erro
        );

        return false;

    }

}


function marcarComoVotou() {

    try {

        localStorage.setItem(
            VOTED_KEY,
            "true"
        );

    } catch (erro) {

        console.error(
            "Erro ao registrar bloqueio:",
            erro
        );

    }

}


function liberarVoto() {

    try {

        localStorage.removeItem(
            VOTED_KEY
        );

    } catch (erro) {

        console.error(
            "Erro ao liberar voto:",
            erro
        );

    }

}


/* =========================================================
   ATUALIZAR ESTADO DA VOTAÇÃO
   ========================================================= */

function atualizarEstadoVotacao() {

    const votado =
        jaVotou();


    const botoesCandidatos =
        document.querySelectorAll(
            ".select-candidate, .quick-btn"
        );


    if (votado) {

        input.disabled =
            true;


        input.placeholder =
            "Você já registrou seu voto";


        input.value =
            "";


        botoesCandidatos.forEach(
            botao => {

                botao.disabled =
                    true;

            }
        );


        mostrarMensagem(
            "Você já votou. Este navegador não pode registrar outro voto.",
            "success"
        );


    } else {

        input.disabled =
            false;


        input.placeholder =
            "Digite o nome do candidato";


        botoesCandidatos.forEach(
            botao => {

                botao.disabled =
                    false;

            }
        );

    }

}


/* =========================================================
   FUNÇÕES AUXILIARES
   ========================================================= */

function normalizar(texto) {

    return String(texto || "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim()
        .toUpperCase();

}


function encontrarCandidato(valor) {

    const busca =
        normalizar(valor);


    return candidatos.find(
        candidato =>

            normalizar(
                candidato.id
            ) === busca ||

            normalizar(
                candidato.nome
            ) === busca ||

            normalizar(
                candidato.partido
            ) === busca
    );

}


function calcularTotal() {

    return Object.values(votos)
        .reduce(
            (
                total,
                quantidade
            ) =>
                total + quantidade,
            0
        );

}


/* =========================================================
   MENSAGEM
   ========================================================= */

function mostrarMensagem(
    texto,
    tipo = ""
) {

    voteMessage.textContent =
        texto;


    voteMessage.className =
        "vote-message";


    if (tipo === "success") {

        voteMessage.classList.add(
            "success"
        );

    }


    if (tipo === "error") {

        voteMessage.classList.add(
            "error"
        );

    }

}


/* =========================================================
   SELECIONAR CANDIDATO
   ========================================================= */

function selecionarCandidato(id) {

    /*
       Segurança adicional:
       mesmo que alguém tente chamar
       a função manualmente, o voto continua bloqueado.
    */

    if (jaVotou()) {

        mostrarMensagem(
            "Você já votou. Não é possível registrar outro voto.",
            "error"
        );

        return;

    }


    const candidato =
        candidatos.find(
            item =>
                item.id === id
        );


    if (!candidato) {
        return;
    }


    input.value =
        candidato.nome;


    mostrarMensagem(
        `${candidato.nome} selecionado. Clique em "Votar".`,
        "success"
    );


    document
        .getElementById("votacao")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


    setTimeout(
        () => {

            if (!input.disabled) {

                input.focus();

            }

        },
        300
    );

}


/* =========================================================
   VOTAR
   ========================================================= */

function votar() {

    /*
       PRIMEIRO BLOQUEIO

       Verifica se o navegador já votou.
    */

    if (jaVotou()) {

        mostrarMensagem(
            "Você já votou. Este navegador já registrou um voto.",
            "error"
        );

        return;

    }


    const candidato =
        encontrarCandidato(
            input.value
        );


    if (!candidato) {

        mostrarMensagem(
            "Digite ou selecione um candidato válido.",
            "error"
        );


        input.focus();

        return;

    }


    /*
       REGISTRA O VOTO
    */

    votos[
        candidato.id
    ]++;


    /*
       SALVA OS VOTOS
    */

    salvarVotos();


    /*
       MARCA O NAVEGADOR COMO JÁ VOTADO
    */

    marcarComoVotou();


    /*
       ATUALIZA OS RESULTADOS
    */

    atualizarResultados();


    /*
       LIMPA O CAMPO
    */

    input.value = "";


    /*
       MOSTRA MENSAGEM
    */

    mostrarMensagem(
        "Voto registrado com sucesso! Você já votou.",
        "success"
    );


    /*
       ABRE MODAL
    */

    abrirModal(
        candidato
    );


    /*
       BLOQUEIA A VOTAÇÃO
    */

    atualizarEstadoVotacao();

}


/* =========================================================
   RESULTADOS
   ========================================================= */

function atualizarResultados() {

    const total =
        calcularTotal();


    totalVotes.textContent =
        total.toLocaleString(
            "pt-BR"
        );


    heroVotes.textContent =
        total.toLocaleString(
            "pt-BR"
        );


    results.innerHTML =
        "";


    candidatos.forEach(
        candidato => {

            const quantidade =
                votos[
                    candidato.id
                ];


            const porcentagem =
                total > 0
                    ? (
                        quantidade /
                        total
                    ) * 100
                    : 0;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "result-item";


            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "result-header";


            const nome =
                document.createElement(
                    "span"
                );


            nome.className =
                "result-name";


            nome.textContent =
                `${candidato.nome} — ${candidato.partido}`;


            const quantidadeTexto =
                document.createElement(
                    "span"
                );


            quantidadeTexto.className =
                "result-votes";


            quantidadeTexto.textContent =
                `${quantidade} ${
                    quantidade === 1
                        ? "voto"
                        : "votos"
                }`;


            header.appendChild(
                nome
            );


            header.appendChild(
                quantidadeTexto
            );


            const barra =
                document.createElement(
                    "div"
                );


            barra.className =
                "result-bar";


            const progresso =
                document.createElement(
                    "div"
                );


            progresso.className =
                "result-progress";


            progresso.style.width =
                `${porcentagem}%`;


            barra.appendChild(
                progresso
            );


            const percentual =
                document.createElement(
                    "small"
                );


            percentual.className =
                "result-percent";


            percentual.textContent =
                `${porcentagem.toFixed(1)}%`;


            item.appendChild(
                header
            );


            item.appendChild(
                barra
            );


            item.appendChild(
                percentual
            );


            results.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   MODAL
   ========================================================= */

function abrirModal(
    candidato
) {

    modalCandidate.textContent =
        candidato.nome;


    modal.hidden =
        false;


    document.body.classList.add(
        "modal-open"
    );

}


function fecharModal() {

    modal.hidden =
        true;


    document.body.classList.remove(
        "modal-open"
    );

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
    evento => {

        if (
            evento.target === modal ||
            evento.target.classList.contains(
                "modal-background"
            )
        ) {

            fecharModal();

        }

    }
);


document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key === "Escape" &&
            !modal.hidden
        ) {

            fecharModal();

        }

    }
);


/* =========================================================
   FORMULÁRIO
   ========================================================= */

voteForm.addEventListener(
    "submit",
    evento => {

        evento.preventDefault();

        votar();

    }
);


/* =========================================================
   BOTÕES DOS CANDIDATOS
   ========================================================= */

document
    .querySelectorAll(
        ".select-candidate"
    )
    .forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    selecionarCandidato(
                        botao.dataset.candidate
                    );

                }
            );

        }
    );


document
    .querySelectorAll(
        ".quick-btn"
    )
    .forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    selecionarCandidato(
                        botao.dataset.candidate
                    );

                }
            );

        }
    );


/* =========================================================
   PESQUISA
   ========================================================= */

search.addEventListener(
    "input",
    () => {

        const termo =
            normalizar(
                search.value
            );


        let encontrados =
            0;


        document
            .querySelectorAll(
                ".candidate-card"
            )
            .forEach(
                card => {

                    const id =
                        card.dataset
                            .candidate;


                    const candidato =
                        candidatos.find(
                            item =>
                                item.id === id
                        );


                    if (!candidato) {
                        return;
                    }


                    const nome =
                        normalizar(
                            candidato.nome
                        );


                    const partido =
                        normalizar(
                            candidato.partido
                        );


                    const corresponde =
                        nome.includes(
                            termo
                        ) ||
                        partido.includes(
                            termo
                        );


                    card.style.display =
                        corresponde
                            ? ""
                            : "none";


                    if (corresponde) {

                        encontrados++;

                    }

                }
            );


        noResults.hidden =
            encontrados !== 0;

    }
);


/* =========================================================
   ZERAR VOTOS
   ========================================================= */

resetButton.addEventListener(
    "click",
    () => {

        const confirmar =
            confirm(
                "Tem certeza que deseja zerar todos os votos?"
            );


        if (!confirmar) {
            return;
        }


        /*
           ZERA TODOS OS VOTOS
        */

        votos = {
            ...votosPadrao
        };


        salvarVotos();


        /*
           LIBERA NOVAMENTE O NAVEGADOR
        */

        liberarVoto();


        /*
           ATUALIZA RESULTADOS
        */

        atualizarResultados();


        /*
           ATUALIZA BOTÕES
        */

        atualizarEstadoVotacao();


        mostrarMensagem(
            "Todos os votos foram zerados. O voto foi liberado novamente.",
            "success"
        );

    }
);


/* =========================================================
   MENU MOBILE
   ========================================================= */

menuBtn.addEventListener(
    "click",
    () => {

        const aberto =
            mainNav.classList.toggle(
                "open"
            );


        menuBtn.setAttribute(
            "aria-expanded",
            aberto
        );

    }
);


document
    .querySelectorAll(
        ".nav-link"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    mainNav.classList.remove(
                        "open"
                    );


                    menuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
);


/* =========================================================
   FECHAR MENU AO AUMENTAR A TELA
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 800
        ) {

            mainNav.classList.remove(
                "open"
            );


            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);


/* =========================================================
   IMAGENS
   ========================================================= */

document
    .querySelectorAll(
        ".candidate-image img"
    )
    .forEach(
        imagem => {

            imagem.addEventListener(
                "error",
                () => {

                    imagem.style.display =
                        "none";


                    imagem.parentElement
                        .style.display =
                        "grid";


                    imagem.parentElement
                        .style.placeItems =
                        "center";


                    imagem.parentElement
                        .style.color =
                        "#a6b0c0";


                    imagem.parentElement
                        .textContent =
                        imagem.alt;

                },
                {
                    once: true
                }
            );

        }
);


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

atualizarResultados();

atualizarEstadoVotacao();