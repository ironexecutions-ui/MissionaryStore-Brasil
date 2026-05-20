import React, {
    useEffect,
    useState
} from "react";

import "./fechados.css";

import { API_URL } from "../../../config";

export default function Fechados() {

    const [lista, setLista] = useState([]);

    const [loading, setLoading] = useState(true);

    async function buscarFechamentos() {

        try {

            setLoading(true);

            const token = localStorage.getItem(
                "token"
            );

            const resposta = await fetch(
                `${API_URL}/fechamentos`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const dados = await resposta.json();

            setLista(dados);

        } catch (erro) {

            console.log(erro);

        } finally {

            setLoading(false);
        }
    }

    const [loadingPagamento, setLoadingPagamento] = useState(null);

    async function marcarEntregue(id) {

        try {

            setLoadingPagamento(id);

            await new Promise((resolve) => {
                setTimeout(resolve, 2000);
            });

            const token = localStorage.getItem(
                "token"
            );

            const resposta = await fetch(
                `${API_URL}/fechamentos/entregue/${id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await resposta.json();

            buscarFechamentos();

        } catch (erro) {

            console.log(erro);

        } finally {

            setLoadingPagamento(null);

        }
    }

    useEffect(() => {

        buscarFechamentos();

    }, []);

    return (

        <div className="fechadosPagina">

            <div className="fechadosContainer">

                <div className="fechadosTopo">

                    <h1 className="fechadosTitulo">
                        Fechamento de Comercio
                    </h1>

                    <span className="fechadosQuantidade">
                        {lista.length} registros
                    </span>
                    <div className="fechadosResumo">

                        <div className="fechadosResumoCard fechadosResumoPendente">

                            <span className="fechadosResumoLabel">
                                Pendentes
                            </span>

                            <strong className="fechadosResumoValor">
                                {
                                    lista.filter(
                                        (item) => item.entregue === 0
                                    ).length
                                }
                            </strong>

                        </div>

                        <div className="fechadosResumoCard fechadosResumoPago">

                            <span className="fechadosResumoLabel">
                                Pagos
                            </span>

                            <strong className="fechadosResumoValor">
                                {
                                    lista.filter(
                                        (item) => item.entregue === 1
                                    ).length
                                }
                            </strong>

                        </div>

                    </div>
                </div>

                {
                    loading ? (

                        <div className="fechadosLoading">
                            Carregando fechamentos...
                        </div>

                    ) : (

                        <div className="fechadosLista">

                            {
                                lista.map((item) => (

                                    <div
                                        key={item.id}
                                        className={`fechadosCard ${item.entregue === 1
                                            ? "fechadosCardPago"
                                            : ""
                                            }`}
                                    >

                                        <div className="fechadosCardHeader">

                                            <div>

                                                <h2 className="fechadosLoja">
                                                    {item.nome_loja}
                                                </h2>

                                                <span className="fechadosDataHora">
                                                    {item.data_hora}
                                                </span>

                                            </div>

                                            <div
                                                className={`fechadosStatus ${item.entregue === 1
                                                    ? "fechadosStatusPago"
                                                    : "fechadosStatusPendente"
                                                    }`}
                                            >
                                                {
                                                    item.entregue === 1
                                                        ? "Pago ao parceiro"
                                                        : "Pendente"
                                                }
                                            </div>

                                        </div>

                                        <div className="fechadosInfos">

                                            <div className="fechadosInfoBox">

                                                <span className="fechadosInfoLabel">
                                                    Valor total
                                                </span>

                                                <strong className="fechadosInfoValor">
                                                    R$ {item.valor_total}
                                                </strong>

                                            </div>

                                            <div className="fechadosInfoBox">

                                                <span className="fechadosInfoLabel">
                                                    Data
                                                </span>

                                                <strong className="fechadosInfoValor">
                                                    {item.data}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="fechadosAcoes">

                                            <button
                                                className="fechadosBotaoComprovante"
                                                onClick={() => {
                                                    window.open(
                                                        item.comprovante_link,
                                                        "_blank"
                                                    );
                                                }}
                                            >
                                                Abrir comprovante
                                            </button>

                                            {
                                                item.entregue === 0 && (

                                                    <button
                                                        className="fechadosBotaoEntregue"
                                                        disabled={loadingPagamento === item.id}
                                                        onClick={() => {
                                                            marcarEntregue(
                                                                item.id
                                                            );
                                                        }}
                                                    >
                                                        {
                                                            loadingPagamento === item.id
                                                                ? "Confirmando pagamento..."
                                                                : "Marcar como pago"
                                                        }
                                                    </button>

                                                )
                                            }

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

            </div>

        </div>
    );
}