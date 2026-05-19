import React, {
    useEffect,
    useState
} from "react";

import "./ganhos.css";

import { API_URL } from "../../../config";

export default function Ganhos() {

    const [dados, setDados] = useState(null);

    const [valorRetorno, setValorRetorno] = useState("");

    const [loading, setLoading] = useState(false);

    const [dataSelecionada, setDataSelecionada] = useState(() => {

        const hoje = new Date();

        const ano = hoje.getFullYear();

        const mes = String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

        const dia = String(
            hoje.getDate()
        ).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    });

    async function buscarGanhos(
        data = dataSelecionada
    ) {

        try {

            const token =
                localStorage.getItem("token");

            const resp = await fetch(
                `${API_URL}/ganhos?data=${data}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const json = await resp.json();

            setDados(json);

        } catch (err) {
            console.log(err);
        }
    }

    async function adicionarRetorno() {

        if (!valorRetorno) return;

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            await fetch(
                `${API_URL}/retornos`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        valor: valorRetorno
                    })
                }
            );

            setValorRetorno("");

            buscarGanhos();

        } catch (err) {
            console.log(err);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        buscarGanhos();

    }, [dataSelecionada]);

    function formatar(valor) {

        return Number(valor || 0)
            .toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );
    }

    function formatarPeriodo(periodo) {

        if (periodo === "dia") {
            return "Dia";
        }

        if (periodo === "semana") {
            return "Semana";
        }

        if (periodo === "mes") {
            return "Mês";
        }

        return periodo;
    }

    if (!dados) {
        return (
            <div className="ganhosLoadingContainer">
                Carregando...
            </div>
        );
    }

    return (

        <div className="ganhosPaginaContainer">

            <div className="ganhosTopoContainer">

                <div className="ganhosAdicionarRetornoBox">

                    <h2 className="ganhosTituloRetorno">
                        Adicionar retorno
                    </h2>

                    <div className="ganhosLinhaRetorno">

                        <input
                            type="number"
                            placeholder="Valor do retorno"
                            value={valorRetorno}
                            onChange={(e) =>
                                setValorRetorno(
                                    e.target.value
                                )
                            }
                            className="ganhosInputRetorno"
                        />

                        <button
                            onClick={adicionarRetorno}
                            className="ganhosBotaoRetorno"
                        >
                            {
                                loading
                                    ? "Enviando..."
                                    : "Adicionar"
                            }
                        </button>

                    </div>

                </div>

                <div className="ganhosFiltroDataContainer">

                    <label className="ganhosLabelData">
                        Selecionar data
                    </label>

                    <input
                        type="date"
                        value={dataSelecionada}
                        onChange={(e) =>
                            setDataSelecionada(
                                e.target.value
                            )
                        }
                        className="ganhosInputData"
                    />

                </div>

            </div>

            <div className="ganhosGridCards">

                {
                    Object.entries(dados)
                        .filter(
                            ([periodo]) =>
                                periodo !== "dia"
                        )
                        .map(
                            ([periodo, valores]) => (

                                <div
                                    key={periodo}
                                    className="ganhosCardResumo"
                                >

                                    <h2 className="ganhosTituloPeriodo">
                                        {
                                            formatarPeriodo(
                                                periodo
                                            )
                                        }
                                    </h2>

                                    <div className="ganhosItemValor">
                                        <span>
                                            Créditos
                                        </span>

                                        <strong className="ganhosCreditoValor">
                                            {
                                                formatar(
                                                    valores.creditos
                                                )
                                            }
                                        </strong>
                                    </div>

                                    <div className="ganhosItemValor">
                                        <span>
                                            Compras
                                        </span>

                                        <strong className="ganhosCompraValor">
                                            {
                                                formatar(
                                                    valores.compras
                                                )
                                            }
                                        </strong>
                                    </div>

                                    <div className="ganhosItemValor">
                                        <span>
                                            Retorno
                                        </span>

                                        <strong className="ganhosRetornoValor">
                                            {
                                                formatar(
                                                    valores.retorno
                                                )
                                            }
                                        </strong>
                                    </div>

                                    <div className="ganhosItemValor ganhosLucroFinal">
                                        <span>
                                            Lucro
                                        </span>

                                        <strong>
                                            {
                                                formatar(
                                                    valores.lucro
                                                )
                                            }
                                        </strong>
                                    </div>

                                </div>
                            )
                        )
                }

            </div>

        </div>
    );
}