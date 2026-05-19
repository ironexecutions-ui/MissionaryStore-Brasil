import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import Pdf from "./pdf";
import { API_URL } from "../../../config";

import "./cadastro.css";

export default function Cadastro() {

    const navigate = useNavigate();

    const [cadastroNomeMissionario, setCadastroNomeMissionario] = useState("");

    const [cadastroEmailMissionario, setCadastroEmailMissionario] = useState("");
    const [cadastroTituloMissionario, setCadastroTituloMissionario] = useState("Elder");
    const [cadastroIdiomaMissionario, setCadastroIdiomaMissionario] = useState("espanhol");

    const [cadastroSaldoMissionario, setCadastroSaldoMissionario] = useState("");

    const [cadastroDataFimMissionario, setCadastroDataFimMissionario] = useState("");

    const [cadastroPagamentoMissionario, setCadastroPagamentoMissionario] = useState("dinheiro");

    const [cadastroMensagemMissionario, setCadastroMensagemMissionario] = useState("");

    const [cadastroCarregandoMissionario, setCadastroCarregandoMissionario] = useState(true);

    const [vendedorCadastroDados, setVendedorCadastroDados] = useState(null);

    const [missionarioExistente, setMissionarioExistente] = useState(false);
    const pdf = Pdf({});
    useEffect(() => {

        verificarLoginCadastro();

    }, []);

    useEffect(() => {

        const timeout = setTimeout(() => {

            buscarMissionario();

        }, 500);

        return () => clearTimeout(timeout);

    }, [cadastroEmailMissionario]);

    async function verificarLoginCadastro() {

        try {

            const token = localStorage.getItem("token");

            if (!token) {

                navigate("/");

                return;
            }

            const resposta = await fetch(
                `${API_URL}/vendedores/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!resposta.ok) {

                localStorage.removeItem("token");

                navigate("/");

                return;
            }

            const dados = await resposta.json();

            setVendedorCadastroDados(dados);

        } catch {

            localStorage.removeItem("token");

            navigate("/");

        } finally {

            setCadastroCarregandoMissionario(false);

        }
    }

    async function buscarMissionario() {

        try {

            if (!cadastroEmailMissionario) {

                setMissionarioExistente(false);

                return;
            }

            const token = localStorage.getItem("token");

            const resposta = await fetch(
                `${API_URL}/cupons/buscar/${cadastroEmailMissionario}@missionary.org`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!resposta.ok) {

                setMissionarioExistente(false);

                return;
            }

            const dados = await resposta.json();

            setMissionarioExistente(true);

            if (dados.nome?.startsWith("Elder ")) {

                setCadastroTituloMissionario(
                    "Elder"
                );

                setCadastroNomeMissionario(
                    dados.nome.replace("Elder ", "")
                );

            } else if (dados.nome?.startsWith("Sister ")) {

                setCadastroTituloMissionario(
                    "Sister"
                );

                setCadastroNomeMissionario(
                    dados.nome.replace("Sister ", "")
                );

            } else {

                setCadastroNomeMissionario(
                    dados.nome || ""
                );
            }

            setCadastroIdiomaMissionario(
                dados.idioma || "espanhol"
            );

            setCadastroDataFimMissionario(
                dados.data_fim
                    ? dados.data_fim.split("T")[0]
                    : ""
            );

        } catch {

            setMissionarioExistente(false);

        }
    }

    async function cadastrarMissionarioSistema(e) {

        e.preventDefault();

        try {

            setCadastroMensagemMissionario("");

            const token = localStorage.getItem("token");

            const resposta = await fetch(
                `${API_URL}/cupons/cadastrar`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        nome: `${cadastroTituloMissionario} ${cadastroNomeMissionario}`,
                        email: `${cadastroEmailMissionario}@missionary.org`,

                        idioma: cadastroIdiomaMissionario,

                        saldo: parseFloat(
                            cadastroSaldoMissionario
                        ),

                        data_fim: cadastroDataFimMissionario,

                        tipo_pagamento: cadastroPagamentoMissionario

                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                setCadastroMensagemMissionario(
                    dados.detail || "Erro"
                );

                return;
            }

            if (dados.codigo) {

                setCadastroMensagemMissionario(
                    `Missionário cadastrado | Código: ${dados.codigo} | PIN: ${dados.senha}`
                );

                const pdfSistema = Pdf({

                    nome: `${cadastroTituloMissionario} ${cadastroNomeMissionario}`,

                    email: `${cadastroEmailMissionario}@missionary.org`,

                    codigo: dados.codigo,

                    senha: dados.senha,

                    idioma: cadastroIdiomaMissionario,

                    saldo: dados.saldo
                });

                // =====================================
                // NOVO MISSIONÁRIO
                // BAIXA TERMOS + VOUCHER
                // =====================================

                pdfSistema.baixarDocumentos();

            } else {

                setCadastroMensagemMissionario(
                    `Saldo adicionado | Novo saldo: R$ ${dados.saldo_novo
                    }`
                );

                // =====================================
                // MISSIONÁRIO EXISTENTE
                // BAIXA SOMENTE VOUCHER ATUALIZADO
                // =====================================

                const pdfSistema = Pdf({

                    nome: `${cadastroTituloMissionario} ${cadastroNomeMissionario}`,

                    email: `${cadastroEmailMissionario}@missionary.org`,

                    codigo: dados.codigo_existente,

                    senha: dados.senha_existente,

                    idioma: cadastroIdiomaMissionario,

                    saldo: dados.saldo_novo
                });

                pdfSistema.baixarVoucher();
            }

            setCadastroSaldoMissionario("");
            setTimeout(() => {

                window.location.reload();

            }, 8000);
        } catch {

            setCadastroMensagemMissionario(
                "Erro interno"
            );

        }
    }

    if (cadastroCarregandoMissionario) {

        return (
            <div>
                carregando...
            </div>
        );
    }

    return (
        <div className="cadastroContainerSistema">

            <div className="cadastroTopoSistema">

                <div>

                    <h1 className="cadastroTituloSistema">
                        Cadastro Missionário
                    </h1>

                    <p className="cadastroSubtituloSistema">
                        {vendedorCadastroDados?.nome}
                    </p>

                </div>

                <button
                    className="cadastroSairSistema"
                    onClick={() => {

                        localStorage.removeItem("token");

                        navigate("/painel");

                    }}
                >
                    Sair
                </button>

            </div>

            <form
                className="cadastroFormularioSistema"
                onSubmit={cadastrarMissionarioSistema}
            >

                <div className="cadastroNomeWrapperSistema">

                    <select
                        className="cadastroTituloSelectSistema"
                        value={cadastroTituloMissionario}
                        onChange={(e) =>
                            setCadastroTituloMissionario(
                                e.target.value
                            )
                        }
                    >

                        <option value="Elder">
                            Elder
                        </option>

                        <option value="Sister">
                            Sister
                        </option>

                    </select>

                    <input
                        className="cadastroNomeInputSistema"
                        type="text"
                        placeholder="Nome missionário"
                        value={cadastroNomeMissionario}
                        onChange={(e) =>
                            setCadastroNomeMissionario(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>

                <div className="cadastroEmailContainerSistema">

                    <input
                        className="cadastroInputSistema"
                        type="text"
                        placeholder="missionario"
                        value={cadastroEmailMissionario}
                        onChange={(e) =>
                            setCadastroEmailMissionario(
                                e.target.value
                                    .replace("@missionary.org", "")
                                    .trim()
                            )
                        }
                        required
                    />

                    <span className="cadastroDominioSistema">
                        @missionary.org
                    </span>

                </div>

                {
                    missionarioExistente
                    &&
                    (
                        <div className="cadastroExistenteSistema">
                            Missionário encontrado, saldo será adicionado ao cupom existente
                        </div>
                    )
                }

                <select
                    className="cadastroInputSistema"
                    value={cadastroIdiomaMissionario}
                    onChange={(e) =>
                        setCadastroIdiomaMissionario(
                            e.target.value
                        )
                    }
                >

                    <option value="espanhol">
                        Espanhol
                    </option>

                    <option value="ingles">
                        Inglês
                    </option>

                    <option value="portugues">
                        Português
                    </option>

                    <option value="frances">
                        Francês
                    </option>

                </select>

                <input
                    className="cadastroInputSistema"
                    type="number"
                    placeholder="Saldo"
                    value={cadastroSaldoMissionario}
                    onChange={(e) =>
                        setCadastroSaldoMissionario(
                            e.target.value
                        )
                    }
                    required
                />

                <input
                    className="cadastroInputSistema"
                    type="date"
                    value={cadastroDataFimMissionario}
                    onChange={(e) =>
                        setCadastroDataFimMissionario(
                            e.target.value
                        )
                    }
                    required
                />

                <select
                    className="cadastroInputSistema"
                    value={cadastroPagamentoMissionario}
                    onChange={(e) =>
                        setCadastroPagamentoMissionario(
                            e.target.value
                        )
                    }
                >

                    <option value="dinheiro">
                        Dinheiro
                    </option>

                    <option value="maquininha">
                        Maquininha
                    </option>

                    <option value="pix">
                        Pix
                    </option>

                </select>

                <button
                    className="cadastroBotaoSistema"
                >
                    Salvar
                </button>

                {
                    cadastroMensagemMissionario
                    &&
                    (
                        <p className="cadastroMensagemSistema">
                            {cadastroMensagemMissionario}
                        </p>
                    )
                }

            </form>

        </div>
    );
}