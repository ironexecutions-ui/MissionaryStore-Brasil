import React, {
    useEffect,
    useState
} from "react";

import QRCode
    from "react-qr-code";

import {
    API_URL
} from "../../../src/config";

import "./pagamento.css";

export default function Pagamento() {

    const [
        usuario,
        setUsuario
    ] = useState(null);

    const [
        valor,
        setValor
    ] = useState("");
    const [
        historico,
        setHistorico
    ] = useState([]);
    const [
        carregando,
        setCarregando
    ] = useState(true);

    const [
        qrLink,
        setQrLink
    ] = useState("");

    useEffect(() => {

        carregarUsuario();

    }, []);
    useEffect(() => {

        carregarUsuario();

        carregarHistorico();

    }, []);
    async function carregarHistorico() {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const resposta =
                await fetch(
                    `${API_URL}/ctm/historico`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const dados =
                await resposta.json();

            setHistorico(
                dados
            );

        } catch {

            console.log(
                "Erro ao carregar histórico"
            );

        }

    }
    async function carregarUsuario() {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const resposta =
                await fetch(
                    `${API_URL}/ctm/me`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const dados =
                await resposta.json();

            setUsuario(
                dados
            );

        } catch {

            alert(
                "Erro ao carregar dados"
            );

        } finally {

            setCarregando(
                false
            );

        }

    }

    async function gerarSolicitacao() {

        const valorNumerico =
            parseFloat(
                valor
            );

        if (
            !valorNumerico
        ) {

            alert(
                "Informe um valor"
            );

            return;

        }

        if (
            valorNumerico >
            usuario.creditos
        ) {

            alert(
                "Você não possui créditos suficientes"
            );

            return;

        }

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const resposta =
                await fetch(
                    `${API_URL}/ctm/pagamento`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify(
                            {
                                valor:
                                    valorNumerico
                            }
                        )
                    }
                );

            const dados =
                await resposta.json();

            if (
                !dados.sucesso
            ) {

                alert(
                    dados.mensagem
                );

                return;

            }

            setQrLink(
                `https://missionarystorebrasil.com.br/compra/${usuario.id_criptografado}`
            );
            carregarHistorico();
        } catch {

            alert(
                "Erro ao gerar solicitação"
            );

        }

    }

    if (carregando) {

        return (
            <h1>
                Carregando...
            </h1>
        );

    }

    return (

        <div
            className="pagamentoContainer"
        >

            <div
                className="pagamentoCard"
            >

                <h1
                    className="pagamentoTitulo"
                >
                    Solicitar Compra
                </h1>

                <p
                    className="pagamentoSaldo"
                >
                    Créditos disponíveis:
                    {" "}
                    R$
                    {" "}
                    {
                        usuario.creditos
                    }
                </p>

                <input
                    type="number"
                    value={
                        valor
                    }
                    onChange={
                        e =>
                            setValor(
                                e.target.value
                            )
                    }
                    placeholder="Valor utilizado"
                    className="pagamentoInputValor"
                />

                <button
                    onClick={
                        gerarSolicitacao
                    }
                    className="pagamentoBotaoGerar"
                >
                    Gerar Solicitação
                </button>

                {
                    qrLink && (

                        <div
                            className="pagamentoQrArea"
                        >

                            <h2>
                                Apresente este QR Code ao administrador
                            </h2>

                            <QRCode
                                value={
                                    qrLink
                                }
                                size={
                                    250
                                }
                            />

                            <p>
                                A compra ficará pendente
                                até aprovação da
                                Missionary Store Brasil.
                            </p>

                        </div>

                    )
                }

            </div>
            <div
                className="pagamentoHistoricoArea"
            >

                <h2>
                    Histórico
                </h2>

                {
                    historico.length === 0
                        ? (
                            <p>
                                Nenhuma compra encontrada.
                            </p>
                        )
                        : (
                            historico.map(
                                item => (

                                    <div
                                        key={item.id}
                                        className="pagamentoHistoricoCard"
                                    >

                                        <div
                                            className="pagamentoHistoricoLinha"
                                        >

                                            <span
                                                className="pagamentoHistoricoValor"
                                            >
                                                R$ {
                                                    Math.abs(
                                                        item.creditos
                                                    ).toFixed(2)
                                                }
                                            </span>

                                            <span
                                                className="pagamentoHistoricoTipo"
                                            >
                                                {
                                                    item.tipo
                                                }
                                            </span>

                                        </div>

                                        <div
                                            className="pagamentoHistoricoData"
                                        >
                                            {
                                                item.criado_em
                                            }
                                        </div>

                                    </div>

                                )
                            )
                        )
                }

            </div>
        </div>

    );

}