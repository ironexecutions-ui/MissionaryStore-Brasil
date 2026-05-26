import React, {
    useState,
    useEffect
} from "react";

import "./fase1.css";

export default function Fase1({
    setFaseAtual,
    setDadosMissionario,
    dadosMissionario
}) {
    const [nomeMissionario, setNomeMissionario] =
        useState("");

    const [emailMissionario, setEmailMissionario] =
        useState("");

    const [dataFim, setDataFim] =
        useState("");

    const [carregando, setCarregando] =
        useState(false);

    const [buscandoEmail, setBuscandoEmail] =
        useState(false);

    const [missionarioExiste, setMissionarioExiste] =
        useState(false);

    const [resultadoCadastro, setResultadoCadastro] =
        useState(null);

    // =====================================
    // BUSCAR EMAIL
    // =====================================

    useEffect(() => {

        if (
            !emailMissionario.trim()
        ) {

            setMissionarioExiste(false);

            return;
        }

        const timeout =
            setTimeout(() => {

                buscarMissionario();

            }, 700);

        return () =>
            clearTimeout(timeout);

    }, [emailMissionario]);

    // =====================================
    // BUSCAR MISSIONARIO
    // =====================================

    async function buscarMissionario() {

        try {

            setBuscandoEmail(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            const resposta =
                await fetch(
                    `http://localhost:8888/cupons/verificar-email?email=${emailMissionario}@missionary.org`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const dados =
                await resposta.json();

            if (!resposta.ok) {

                setMissionarioExiste(false);

                return;
            }

            if (dados.existe) {

                const termosAceitos = (
                    dados.aceitou_termos === true ||
                    dados.aceitou_termos === 1 ||
                    dados.aceitou_termos === "1"
                );

                console.log(
                    "TERMOS:",
                    dados.aceitou_termos
                );

                console.log(
                    "BOOLEAN:",
                    termosAceitos
                );

                setMissionarioExiste(true);



                setDadosMissionario({

                    id:
                        dados.id,

                    nome:
                        dados.nome,

                    email:
                        dados.email,

                    data_fim:
                        dados.data_fim,

                    data_cadastro:
                        dados.data_cadastro,

                    aceitou_termos:
                        termosAceitos
                });

                setNomeMissionario(
                    dados.nome || ""
                );

                setDataFim(
                    dados.data_fim || ""
                );
            } else {

                setMissionarioExiste(false);

                setDadosMissionario(null);

                setNomeMissionario("");

                setDataFim("");
            }

        } catch (erro) {

            console.log(erro);

        } finally {

            setBuscandoEmail(false);
        }
    }

    // =====================================
    // CADASTRAR
    // =====================================

    async function cadastrarMissionario() {

        try {

            // =================================
            // JA EXISTE
            // =================================

            if (missionarioExiste) {

                if (
                    dadosMissionario?.aceitou_termos
                ) {

                    setFaseAtual(3);

                } else {

                    setFaseAtual(2);
                }

                return;
            }

            // =================================
            // VALIDACOES
            // =================================

            if (
                !nomeMissionario.trim()
            ) {

                alert(
                    "Digite o nome do missionário"
                );

                return;
            }

            if (
                !emailMissionario.trim()
            ) {

                alert(
                    "Digite o email do missionário"
                );

                return;
            }

            if (
                !dataFim
            ) {

                alert(
                    "Selecione a data final"
                );

                return;
            }

            setCarregando(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            const resposta =
                await fetch(
                    "http://localhost:8888/cupons/cadastrar-missionario",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            nome:
                                nomeMissionario,

                            email:
                                emailMissionario,

                            data_fim:
                                dataFim
                        })
                    }
                );

            const dados =
                await resposta.json();

            if (!resposta.ok) {

                alert(
                    dados.detail ||
                    "Erro ao cadastrar"
                );

                return;
            }

            setResultadoCadastro(
                dados
            );

            setMissionarioExiste(true);

            setDadosMissionario({

                id:
                    dados.id,

                nome:
                    nomeMissionario,

                email:
                    dados.email,

                data_fim:
                    dataFim,
                aceitou_termos:
                    dados.aceitou_termos
            });

            // =================================
            // IR PARA FASE 2
            // =================================

            setFaseAtual(2);

            // depois:
            // setFaseAtual(2)

        } catch (erro) {

            console.log(erro);

            alert(
                "Erro ao cadastrar"
            );

        } finally {

            setCarregando(false);
        }
    }

    return (

        <div className="fase1Container">

            <div className="fase1Card">

                <h1 className="fase1Titulo">
                    Registro del Misionero
                </h1>

                <div className="fase1CampoGrupo">

                    <label className="fase1Label">
                        Correo del Misionero
                    </label>

                    <div className="fase1InputEmailWrapper">

                        <input
                            type="text"
                            className="fase1InputEmail"
                            placeholder="de.la.cruz.martinez"
                            value={emailMissionario}
                            onChange={(e) =>
                                setEmailMissionario(
                                    e.target.value
                                )
                            }
                        />

                        <span className="fase1DominioFixo">
                            @missionary.org
                        </span>

                    </div>

                    {
                        buscandoEmail && (

                            <p className="fase1StatusBusca">
                                Buscando misionero...
                            </p>
                        )
                    }

                    {
                        missionarioExiste && (

                            <p className="fase1StatusEncontrado">
                                Misionero encontrado
                            </p>
                        )
                    }

                </div>

                <div className="fase1CampoGrupo">

                    <label className="fase1Label">
                        Nombre del Misionero
                    </label>

                    <div className="fase1NomeWrapper">

                        <select
                            disabled={missionarioExiste}
                            className="fase1SelectTitulo"
                            value={
                                nomeMissionario
                                    .toLowerCase()
                                    .startsWith("hermana")
                                    ? "Hermana"
                                    : "Elder"
                            }
                            onChange={(e) => {

                                const titulo =
                                    e.target.value;

                                const nomeSemTitulo =
                                    nomeMissionario
                                        .replace(/^elder\s+/i, "")
                                        .replace(/^hermana\s+/i, "");

                                setNomeMissionario(
                                    `${titulo} ${nomeSemTitulo}`
                                );
                            }}
                        >

                            <option value="Elder">
                                Elder
                            </option>

                            <option value="Hermana">
                                Hermana
                            </option>

                        </select>

                        <input
                            disabled={missionarioExiste}
                            type="text"
                            className="fase1InputNome"
                            placeholder="Nombre"
                            value={
                                nomeMissionario
                                    .replace(/^elder\s+/i, "")
                                    .replace(/^hermana\s+/i, "")
                            }
                            onChange={(e) => {

                                const nomeDigitado =
                                    e.target.value;

                                const tituloAtual =
                                    nomeMissionario
                                        .toLowerCase()
                                        .startsWith("hermana")
                                        ? "Hermana"
                                        : "Elder";

                                setNomeMissionario(
                                    `${tituloAtual} ${nomeDigitado}`
                                );
                            }}
                        />

                    </div>

                </div>

                <div className="fase1CampoGrupo">

                    <label className="fase1Label">
                        Fecha final en el CCM
                    </label>

                    <input
                        disabled={missionarioExiste}
                        type="date"
                        className="fase1InputData"
                        value={dataFim}
                        onChange={(e) =>
                            setDataFim(
                                e.target.value
                            )
                        }
                    />

                </div>

                <button
                    className="fase1BotaoCadastrar"
                    onClick={cadastrarMissionario}
                    disabled={carregando}
                >

                    {
                        carregando
                            ? "Cargando..."
                            : missionarioExiste
                                ? "Continuar"
                                : "Registrar Misionero"
                    }

                </button>

                {
                    resultadoCadastro && (

                        <div className="fase1ResultadoContainer">

                            <h2 className="fase1ResultadoTitulo">
                                Registro realizado
                            </h2>

                            <div className="fase1ResultadoLinha">
                                <strong>ID:</strong>
                                {" "}
                                {resultadoCadastro.id}
                            </div>

                            <div className="fase1ResultadoLinha">
                                <strong>Código:</strong>
                                {" "}
                                {resultadoCadastro.codigo}
                            </div>

                            <div className="fase1ResultadoLinha">
                                <strong>Contraseña:</strong>
                                {" "}
                                {resultadoCadastro.senha}
                            </div>

                            <div className="fase1ResultadoLinha">
                                <strong>Correo:</strong>
                                {" "}
                                {resultadoCadastro.email}
                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );
}