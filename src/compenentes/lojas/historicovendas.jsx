import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import "./historicovendas.css";

import { API_URL } from "../../config";

export default function HistoricoVendas() {

    const [historico, setHistorico] = useState([]);

    const [loading, setLoading] = useState(true);

    const [detalhesAberto, setDetalhesAberto] = useState(null);

    const [uploading, setUploading] = useState(null);

    const [modalFecharDia, setModalFecharDia] = useState(null);

    async function carregarHistorico() {

        try {

            setLoading(true);

            const token = localStorage.getItem(
                "token_loja"
            );

            const resposta = await fetch(
                `${API_URL}/lojas/historico`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const dados = await resposta.json();

            if (Array.isArray(dados)) {

                setHistorico(dados);

            } else {

                setHistorico([]);
            }

        } catch {

            setHistorico([]);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {

        carregarHistorico();

    }, []);

    async function fecharDia(
        data
    ) {

        try {

            setUploading(data);

            const token = localStorage.getItem(
                "token_loja"
            );

            const formData = new FormData();

            formData.append(
                "data",
                data
            );

            const resposta = await fetch(
                `${API_URL}/lojas/fechar-dia`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formData
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                alert(
                    dados.detail || "Erro"
                );

                return;
            }

            setModalFecharDia(null);

            carregarHistorico();

        } catch {

            alert(
                "Erro ao gerar relatório"
            );

        } finally {

            setUploading(null);
        }
    }

    const totalGeral = useMemo(() => {

        let total = 0;

        historico.forEach((dia) => {

            total += Number(
                dia.total || 0
            );

        });

        return total.toFixed(2);

    }, [historico]);

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

        <>

            <div className="historicoContainerPrincipal">

                <div className="historicoTopoResumo">

                    <div className="historicoCardResumo">

                        <span className="historicoResumoTitulo">
                            Total geral
                        </span>

                        <strong className="historicoResumoValor">
                            R$ {totalGeral}
                        </strong>

                    </div>

                    <div className="historicoCardResumo">

                        <span className="historicoResumoTitulo">
                            Dias registrados
                        </span>

                        <strong className="historicoResumoValor">
                            {historico.length}
                        </strong>

                    </div>

                </div>

                {
                    historico.length === 0 && (

                        <div className="historicoSemResultados">

                            <h2>
                                Nenhuma venda encontrada
                            </h2>

                        </div>
                    )
                }

                {
                    historico.map((dia) => (

                        <div
                            key={dia.data}
                            className="historicoDiaCard"
                        >

                            <div className="historicoDiaTopo">

                                <div>

                                    <h2 className="historicoDiaTitulo">
                                        {dia.data}
                                    </h2>

                                    <p className="historicoDiaQuantidade">
                                        {dia.quantidade}
                                        {" "}
                                        vendas realizadas
                                    </p>

                                </div>

                                <div className="historicoDiaTotal">

                                    R$ {dia.total}

                                </div>

                            </div>

                            <div className="historicoDiaAcoes">

                                {
                                    dia.fechado ? (

                                        <a
                                            className="historicoComprovanteLink"
                                            href={dia.comprovante}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Ver comprovante do dia
                                        </a>

                                    ) : (

                                        <button
                                            className="historicoBotaoFecharVenda"
                                            onClick={() => {

                                                setModalFecharDia(
                                                    dia.data
                                                );

                                            }}
                                        >
                                            {
                                                uploading === dia.data
                                                    ? "Gerando relatório..."
                                                    : "Fechar vendas do dia"
                                            }
                                        </button>

                                    )
                                }

                                <button
                                    className="historicoBotaoDetalhes"
                                    onClick={() => {

                                        setDetalhesAberto(

                                            detalhesAberto === dia.data
                                                ? null
                                                : dia.data
                                        );

                                    }}
                                >
                                    {
                                        detalhesAberto === dia.data
                                            ? "Fechar detalhes"
                                            : "Ver detalhes"
                                    }
                                </button>

                            </div>

                            {
                                detalhesAberto === dia.data && (

                                    <div className="historicoListaVendas">

                                        {
                                            dia.vendas.map((venda) => (

                                                <div
                                                    key={venda.id}
                                                    className="historicoVendaItem"
                                                >

                                                    <div className="historicoVendaInfos">

                                                        <div>

                                                            <h3 className="historicoVendaNome">

                                                                {venda.nome}

                                                            </h3>

                                                            <p className="historicoVendaEmail">

                                                                {venda.email}

                                                            </p>

                                                        </div>

                                                        <div className="historicoVendaValor">

                                                            R$ {venda.valor}

                                                        </div>

                                                    </div>

                                                    <div className="historicoVendaLinhaDetalhes">

                                                        <span>
                                                            {venda.tipo_pagamento}
                                                        </span>

                                                        <span>
                                                            {venda.data_hora}
                                                        </span>

                                                        <span>
                                                            ID:
                                                            {" "}
                                                            {venda.id_missionario}
                                                        </span>

                                                    </div>

                                                </div>

                                            ))
                                        }

                                    </div>

                                )
                            }

                        </div>

                    ))
                }

            </div>

            {
                modalFecharDia && (

                    <div className="historicoModalOverlay">

                        <div className="historicoModalConfirmacao">

                            <h2 className="historicoModalTitulo">
                                Fechar vendas do dia?
                            </h2>

                            <p className="historicoModalTexto">
                                Assim que o dia for fechado, não será possível
                                realizar novas vendas nesta data.
                            </p>

                            <p className="historicoModalTextoSecundario">
                                Tem certeza que deseja continuar?
                            </p>

                            <div className="historicoModalBotoes">

                                <button
                                    className="historicoModalCancelar"
                                    onClick={() => {

                                        setModalFecharDia(null);

                                    }}
                                >
                                    Cancelar
                                </button>

                                <button
                                    className="historicoModalConfirmar"
                                    onClick={() => {

                                        fecharDia(
                                            modalFecharDia
                                        );

                                    }}
                                >
                                    {
                                        uploading === modalFecharDia
                                            ? "Fechando..."
                                            : "Confirmar fechamento"
                                    }
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </>
    );
}