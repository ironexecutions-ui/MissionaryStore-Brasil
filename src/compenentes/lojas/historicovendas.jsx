import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import "./historicoVendas.css";

import { API_URL } from "../../config";

export default function HistoricoVendas() {

    const [historico, setHistorico] = useState([]);

    const [loading, setLoading] = useState(true);

    const [detalhesAberto, setDetalhesAberto] = useState(null);

    const [uploading, setUploading] = useState(null);

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

    async function fecharVenda(
        transacaoId,
        arquivo
    ) {

        try {

            setUploading(transacaoId);

            const token = localStorage.getItem(
                "token_loja"
            );

            const formData = new FormData();

            formData.append(
                "transacao_id",
                transacaoId
            );

            formData.append(
                "file",
                arquivo
            );

            const resposta = await fetch(
                `${API_URL}/lojas/fechar-venda`,
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
                    dados.detail || "Erro ao fechar venda"
                );

                return;
            }

            await carregarHistorico();

        } catch {

            alert(
                "Erro ao enviar comprovante"
            );

        } finally {

            setUploading(null);
        }
    }

    const totalGeral = useMemo(() => {

        let total = 0;

        historico.forEach((dia) => {

            total += Number(dia.total || 0);

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

                                        </div>

                                        <button
                                            className="historicoBotaoDetalhes"
                                            onClick={() => {

                                                setDetalhesAberto(

                                                    detalhesAberto === venda.id
                                                        ? null
                                                        : venda.id
                                                );

                                            }}
                                        >
                                            {
                                                detalhesAberto === venda.id
                                                    ? "Fechar detalhes"
                                                    : "Ver detalhes"
                                            }
                                        </button>

                                        {
                                            detalhesAberto === venda.id && (

                                                <div className="historicoPainelDetalhes">

                                                    <div className="historicoDetalhesGrid">

                                                        <div className="historicoDetalhesBloco">

                                                            <span className="historicoDetalhesLabel">
                                                                ID missionário
                                                            </span>

                                                            <strong>
                                                                {venda.id_missionario}
                                                            </strong>

                                                        </div>

                                                        <div className="historicoDetalhesBloco">

                                                            <span className="historicoDetalhesLabel">
                                                                Forma de pagamento
                                                            </span>

                                                            <strong>
                                                                {venda.tipo_pagamento}
                                                            </strong>

                                                        </div>

                                                    </div>

                                                    {
                                                        venda.fechado ? (

                                                            <div className="historicoVendaFechada">

                                                                <span className="historicoVendaFechadaTexto">
                                                                    Venda fechada
                                                                </span>

                                                                <a
                                                                    className="historicoComprovanteLink"
                                                                    href={venda.comprovante}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    Ver comprovante
                                                                </a>

                                                            </div>

                                                        ) : (

                                                            <div className="historicoAreaUpload">

                                                                <label className="historicoBotaoFecharVenda">

                                                                    {
                                                                        uploading === venda.id
                                                                            ? "Enviando..."
                                                                            : "Fechar venda"
                                                                    }

                                                                    <input
                                                                        type="file"
                                                                        hidden
                                                                        accept="image/*,.pdf"
                                                                        disabled={
                                                                            uploading === venda.id
                                                                        }
                                                                        onChange={(e) => {

                                                                            const arquivo =
                                                                                e.target.files[0];

                                                                            if (!arquivo) return;

                                                                            fecharVenda(
                                                                                venda.id,
                                                                                arquivo
                                                                            );

                                                                        }}
                                                                    />

                                                                </label>

                                                            </div>

                                                        )
                                                    }

                                                </div>

                                            )
                                        }

                                    </div>

                                ))
                            }

                        </div>

                    </div>

                ))
            }

        </div>
    );
}