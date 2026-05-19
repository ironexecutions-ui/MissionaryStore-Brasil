import React, { useEffect, useMemo, useState } from "react";

import "./historico.css";

import { API_URL } from "../../../config";

export default function Historico() {

    const [historico, setHistorico] = useState([]);

    const [loading, setLoading] = useState(true);
    const [filtroPagamento, setFiltroPagamento] = useState("");
    const [filtroNome, setFiltroNome] = useState("");

    const [filtroData, setFiltroData] = useState("");

    const [filtroApartirData, setFiltroApartirData] = useState("");

    const [filtroVendedor, setFiltroVendedor] = useState("");

    const [filtroTipo, setFiltroTipo] = useState("");

    const [filtroLocal, setFiltroLocal] = useState("");

    async function carregarHistorico() {

        try {

            const token = localStorage.getItem("token");

            const resp = await fetch(
                `${API_URL}/historico`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const dados = await resp.json();

            setHistorico(dados);

        } catch (erro) {

            console.log(erro);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {
        carregarHistorico();
    }, []);
    const nomesUnicos = [
        ...new Set(
            historico.map(item => item.nome)
        )
    ];

    const vendedoresUnicos = [
        ...new Set(
            historico.map(item => item.vendedor)
        )
    ];

    const locaisUnicos = [
        ...new Set(
            historico.map(item => item.local)
        )
    ];

    const datasUnicas = [
        ...new Set(
            historico.map(item => {

                if (!item.data_hora) {
                    return "";
                }

                return new Date(
                    item.data_hora
                ).toLocaleDateString(
                    "pt-BR",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    }
                );
            })
        )
    ];

    const tiposPagamentoUnicos = [
        ...new Set(
            historico.map(item => item.tipo_pagamento)
        )
    ];
    const historicoFiltrado = useMemo(() => {

        return historico.filter((item) => {

            const nome = (
                item.nome || ""
            ).toLowerCase();

            const vendedor = (
                item.vendedor || ""
            ).toLowerCase();

            const local = (
                item.local || ""
            ).toLowerCase();

            const pagamento = (
                item.tipo_pagamento || ""
            ).toLowerCase();

            const dataTexto = item.data_hora
                ? new Date(item.data_hora)
                    .toLocaleDateString(
                        "pt-BR",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }
                    )
                    .toLowerCase()
                : "";

            if (
                filtroNome &&
                !nome.includes(
                    filtroNome.toLowerCase()
                )
            ) {
                return false;
            }

            if (
                filtroVendedor &&
                !vendedor.includes(
                    filtroVendedor.toLowerCase()
                )
            ) {
                return false;
            }

            if (
                filtroLocal &&
                !local.includes(
                    filtroLocal.toLowerCase()
                )
            ) {
                return false;
            }

            if (
                filtroPagamento &&
                !pagamento.includes(
                    filtroPagamento.toLowerCase()
                )
            ) {
                return false;
            }

            if (
                filtroTipo &&
                item.tipo_transacao !== filtroTipo
            ) {
                return false;
            }

            if (
                filtroData &&
                !dataTexto.includes(
                    filtroData.toLowerCase()
                )
            ) {
                return false;
            }

            if (filtroApartirData) {

                const dataItem = new Date(
                    item.data_hora
                );

                const dataFiltro = new Date(
                    filtroApartirData
                );

                if (dataItem < dataFiltro) {
                    return false;
                }
            }

            return true;

        });

    }, [
        historico,
        filtroNome,
        filtroData,
        filtroApartirData,
        filtroVendedor,
        filtroTipo,
        filtroLocal,
        filtroPagamento
    ]);

    if (loading) {
        return (
            <div className="historicoLoadingContainer">
                <h2 className="historicoLoadingTexto">
                    Carregando histórico...
                </h2>
            </div>
        );
    }

    return (
        <div className="historicoPaginaContainer">

            <div className="historicoTopoArea">

                <h1 className="historicoTituloPrincipal">
                    Histórico de Transações
                </h1>

                <p className="historicoSubtituloPrincipal">
                    Recargas e gastos dos missionários
                </p>

            </div>

            <div className="historicoFiltrosContainer">

                <input
                    type="text"
                    placeholder="Buscar por nome"
                    value={filtroNome}
                    list="historicoListaNomes"
                    onChange={(e) =>
                        setFiltroNome(e.target.value)
                    }
                    className="historicoInputFiltro"
                />

                <datalist id="historicoListaNomes">

                    {
                        nomesUnicos.map((nome, index) => (
                            <option
                                key={index}
                                value={nome}
                            />
                        ))
                    }

                </datalist>

                <input
                    type="text"
                    placeholder="Buscar data exata"
                    value={filtroData}
                    list="historicoListaDatas"
                    onChange={(e) =>
                        setFiltroData(e.target.value)
                    }
                    className="historicoInputFiltro"
                />

                <datalist id="historicoListaDatas">

                    {
                        datasUnicas.map((data, index) => (
                            <option
                                key={index}
                                value={data}
                            />
                        ))
                    }

                </datalist>

                <input
                    type="date"
                    value={filtroApartirData}
                    onChange={(e) =>
                        setFiltroApartirData(e.target.value)
                    }
                    className="historicoInputFiltro"
                />

                <input
                    type="text"
                    placeholder="Buscar vendedor"
                    value={filtroVendedor}
                    list="historicoListaVendedores"
                    onChange={(e) =>
                        setFiltroVendedor(e.target.value)
                    }
                    className="historicoInputFiltro"
                />

                <datalist id="historicoListaVendedores">

                    {
                        vendedoresUnicos.map((vendedor, index) => (
                            <option
                                key={index}
                                value={vendedor}
                            />
                        ))
                    }

                </datalist>

                <input
                    type="text"
                    placeholder="Buscar local"
                    value={filtroLocal}
                    list="historicoListaLocais"
                    onChange={(e) =>
                        setFiltroLocal(e.target.value)
                    }
                    className="historicoInputFiltro"
                />

                <datalist id="historicoListaLocais">

                    {
                        locaisUnicos.map((local, index) => (
                            <option
                                key={index}
                                value={local}
                            />
                        ))
                    }

                </datalist>


                <input
                    type="text"
                    placeholder="Tipo de pagamento"
                    value={filtroPagamento}
                    list="historicoListaPagamentos"
                    onChange={(e) =>
                        setFiltroPagamento(e.target.value)
                    }
                    className="historicoInputFiltro"
                />

                <datalist id="historicoListaPagamentos">

                    {
                        tiposPagamentoUnicos.map((tipo, index) => (
                            <option
                                key={index}
                                value={tipo}
                            />
                        ))
                    }

                </datalist>
            </div>

            <div className="historicoListaContainer">

                {
                    historicoFiltrado.map((item) => (

                        <div
                            key={item.id}
                            className="historicoCardItem"
                        >

                            <div className="historicoLinhaSuperior">

                                <div className="historicoInfosPessoa">

                                    <h2 className="historicoNomeMissionario">
                                        {item.nome}
                                    </h2>

                                    <p className="historicoEmailMissionario">
                                        {item.email}
                                    </p>

                                </div>

                                <div
                                    className={
                                        item.tipo_transacao === "gasto"
                                            ? "historicoValorNegativo"
                                            : "historicoValorPositivo"
                                    }
                                >
                                    {item.valor}
                                </div>

                            </div>

                            <div className="historicoDetalhesArea">

                                <div className="historicoDetalheBloco">

                                    <span className="historicoLabel">
                                        Tipo
                                    </span>

                                    <span className="historicoTexto">
                                        {item.tipo_transacao}
                                    </span>

                                </div>

                                <div className="historicoDetalheBloco">

                                    <span className="historicoLabel">
                                        Local
                                    </span>

                                    <span className="historicoTexto">
                                        {item.local}
                                    </span>

                                </div>

                                <div className="historicoDetalheBloco">

                                    <span className="historicoLabel">
                                        Pagamento
                                    </span>

                                    <span className="historicoTexto">
                                        {item.tipo_pagamento}
                                    </span>

                                </div>

                                <div className="historicoDetalheBloco">

                                    <span className="historicoLabel">
                                        Vendedor
                                    </span>

                                    <span className="historicoTexto">
                                        {item.vendedor}
                                    </span>

                                </div>

                                <div className="historicoDetalheBloco">

                                    <span className="historicoLabel">
                                        Data
                                    </span>

                                    <span className="historicoTexto">
                                        {
                                            new Date(item.data_hora)
                                                .toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )
                                        }
                                    </span>

                                </div>

                            </div>

                        </div>
                    ))
                }

            </div>

        </div>
    );
}