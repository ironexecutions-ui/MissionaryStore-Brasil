// fase5.jsx

import React, {
    useEffect,
    useState
} from "react";

import Header from "./header";

import "./fase5.css";

export default function Fase5({
    dadosMissionario
}) {

    const [dadosVoucher, setDadosVoucher] =
        useState(null);

    const [carregando, setCarregando] =
        useState(true);

    // =====================================
    // BUSCAR DADOS VOUCHER
    // =====================================

    useEffect(() => {

        async function buscarVoucher() {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const resposta =
                    await fetch(

                        `http://localhost:8888/cupons/dados-voucher?id_cupom=${dadosMissionario.id}`,

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

                    alert(
                        dados.detail
                    );

                    return;
                }

                setDadosVoucher(
                    dados
                );

            } catch (erro) {

                console.log(
                    erro
                );

            } finally {

                setCarregando(false);
            }
        }

        buscarVoucher();

    }, []);

    // =====================================
    // BAIXAR VOUCHER
    // =====================================

    function baixarVoucher() {

        if (!dadosVoucher) {

            return;
        }

        const url =

            `http://localhost:8888/pdf/voucher?` +

            `idioma=espanhol` +

            `&nome=${encodeURIComponent(
                dadosVoucher.nome
            )}` +

            `&email=${encodeURIComponent(
                dadosVoucher.email
            )}` +

            `&codigo=${encodeURIComponent(
                dadosVoucher.codigo
            )}` +

            `&pin=${encodeURIComponent(
                dadosVoucher.senha
            )}` +

            `&saldo=${encodeURIComponent(
                dadosVoucher.saldo
            )}`;

        window.open(
            url,
            "_blank"
        );
    }

    return (

        <div className="fase5Container">



            <div className="fase5Conteudo">

                <div className="fase5Card">

                    <div className="fase5Glow"></div>

                    <div className="fase5CheckArea">

                        <div className="fase5Check">

                            ✓

                        </div>

                    </div>

                    <span className="fase5Status">

                        PAYMENT SUCCESSFUL

                    </span>

                    <h1 className="fase5Titulo">

                        ¡Gracias por su compra!

                    </h1>

                    <p className="fase5Descricao">

                        El pago fue aprobado
                        correctamente y el saldo
                        ya fue agregado al voucher
                        del misionero.

                    </p>

                    <div className="fase5MensagemBox">

                        <div className="fase5MensagemIcone">

                            ✦

                        </div>

                        <div className="fase5MensagemConteudo">

                            <h3>

                                Información importante

                            </h3>

                            <p>

                                El misionero recibirá
                                automáticamente un mensaje
                                con el voucher actualizado
                                y las instrucciones para
                                utilizar el saldo.

                            </p>

                        </div>

                    </div>

                    <div className="fase5InfoGrid">

                        <div className="fase5InfoCard">

                            <span className="fase5InfoLabel">

                                Voucher

                            </span>

                            <strong className="fase5InfoValor">

                                {
                                    dadosVoucher?.codigo ||
                                    "------"
                                }

                            </strong>

                        </div>

                        <div className="fase5InfoCard">

                            <span className="fase5InfoLabel">

                                Saldo actual

                            </span>

                            <strong className="fase5InfoValor">

                                R$ {
                                    Number(
                                        dadosVoucher?.saldo || 0
                                    ).toFixed(2)
                                }

                            </strong>

                        </div>

                    </div>

                    <button
                        className="fase5BotaoVoucher"
                        disabled={
                            carregando
                        }
                        onClick={baixarVoucher}
                    >

                        {
                            carregando
                                ? "Cargando voucher..."
                                : "Descargar Voucher PDF"
                        }

                    </button>

                </div>

            </div>

        </div>
    );
}