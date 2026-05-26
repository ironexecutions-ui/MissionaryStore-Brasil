import React, {
    useMemo,
    useState
} from "react";

import {
    CardElement,
    Elements,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";

import {
    loadStripe
} from "@stripe/stripe-js";

import Header from "./header";

import "./fase3.css";

const stripePromise =
    loadStripe(
        "SUA_CHAVE_PUBLICAVEL"
    );

function CheckoutForm({
    valorReais,
    saldoRecebido,
    dadosMissionario,
    setFaseAtual
}) {

    const stripe =
        useStripe();

    const elements =
        useElements();

    const [carregando, setCarregando] =
        useState(false);

    const [mostrarModal, setMostrarModal] =
        useState(false);

    // =========================================
    // MODAL SUCESSO
    // =========================================

    async function sucessoPagamento() {

        setMostrarModal(true);

        setTimeout(() => {

            setFaseAtual(4);

        }, 3000);
    }

    // =========================================
    // PAGAMENTO NORMAL
    // =========================================

    async function pagar() {

        try {

            if (!stripe || !elements) {

                return;
            }

            setCarregando(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            // ===================================
            // PAYMENT INTENT
            // ===================================

            const resposta =
                await fetch(

                    "http://localhost:8888/stripe/criar-payment-intent",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            valor:
                                Number(
                                    valorReais
                                ),

                            id_missionario:
                                dadosMissionario.id
                        })
                    }
                );

            const dados =
                await resposta.json();

            if (!resposta.ok) {

                alert(
                    dados.detail ||
                    "Erro pagamento"
                );

                return;
            }

            // ===================================
            // STRIPE
            // ===================================

            const resultado =
                await stripe.confirmCardPayment(

                    dados.client_secret,

                    {

                        payment_method: {

                            card:
                                elements.getElement(
                                    CardElement
                                )
                        }
                    }
                );

            if (resultado.error) {

                alert(
                    resultado.error.message
                );

                return;
            }

            // ===================================
            // APROVADO
            // ===================================

            if (

                resultado.paymentIntent
                    .status === "succeeded"

            ) {

                // ===============================
                // CONFIRMAR BACKEND
                // ===============================

                const confirmar =
                    await fetch(

                        "http://localhost:8888/stripe/confirmar-pagamento",

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                payment_intent_id:
                                    resultado
                                        .paymentIntent
                                        .id
                            })
                        }
                    );

                const dadosConfirmacao =
                    await confirmar.json();

                if (!confirmar.ok) {

                    alert(
                        dadosConfirmacao.detail
                    );

                    return;
                }

                await sucessoPagamento();
            }

        } catch (erro) {

            console.log(erro);

            alert(
                "Erro ao processar"
            );

        } finally {

            setCarregando(false);
        }
    }

    // =========================================
    // BOTÃO TESTE
    // =========================================

    async function pagamentoTeste() {

        try {

            setCarregando(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            // ===================================
            // CHAMA BACKEND
            // ===================================

            const resposta =
                await fetch(

                    "http://localhost:8888/stripe/confirmar-pagamento-teste",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            valor:
                                Number(
                                    valorReais
                                ),

                            id_missionario:
                                dadosMissionario.id
                        })
                    }
                );

            const dados =
                await resposta.json();

            if (!resposta.ok) {

                alert(
                    dados.detail ||
                    "Erro teste"
                );

                return;
            }

            await sucessoPagamento();

        } catch (erro) {

            console.log(erro);

            alert(
                "Erro teste"
            );

        } finally {

            setCarregando(false);
        }
    }

    return (

        <>

            <div className="fase3StripeArea">

                <div className="fase3StripeBox">

                    <CardElement
                        options={{
                            style: {

                                base: {

                                    color:
                                        "#ffffff",

                                    fontSize:
                                        "16px"
                                }
                            }
                        }}
                    />

                </div>

                <button
                    className="fase3PagarBotao"
                    disabled={carregando}
                    onClick={pagar}
                >

                    {
                        carregando
                            ? "Processando..."
                            : `Pagar R$ ${Number(
                                valorReais
                            ).toFixed(2)}`
                    }

                </button>

                {/* ================================= */}
                {/* BOTÃO TESTE */}
                {/* ================================= */}

                <button
                    className="fase3BotaoTeste"
                    onClick={pagamentoTeste}
                >

                    Simular Pagamento

                </button>

            </div>

            {/* ===================================== */}
            {/* MODAL */}
            {/* ===================================== */}

            {
                mostrarModal && (

                    <div className="fase3ModalOverlay">

                        <div className="fase3ModalSucesso">

                            <div className="fase3ModalCheck">

                                ✓

                            </div>

                            <h2>

                                aprovado

                            </h2>

                            <p>

                                El saldo se añadió correctamente al comprobante del misionero.

                            </p>

                            <div className="fase3ModalLoading">

                                Redirigiendo...

                            </div>

                        </div>

                    </div>
                )
            }

        </>
    );
}

export default function Fase3({
    dadosMissionario,
    setFaseAtual
}) {

    const [valorReais, setValorReais] =
        useState("");

    const {
        taxa,
        saldoRecebido
    } = useMemo(() => {

        const valor =
            parseFloat(valorReais) || 0;

        const valorTaxa =
            valor * 0.15;

        const valorFinal =
            valor - valorTaxa;

        return {

            taxa:
                valorTaxa,

            saldoRecebido:
                valorFinal
        };

    }, [valorReais]);

    return (

        <div className="fase3RecargaContainer">

            <Header
                dadosMissionario={
                    dadosMissionario
                }
            />

            <div className="fase3RecargaCard">

                <h1 className="fase3RecargaTitulo">

                    Recargar Voucher

                </h1>

                <input
                    type="number"
                    placeholder="100"
                    value={valorReais}
                    onChange={(e) =>
                        setValorReais(
                            e.target.value
                        )
                    }
                    className="fase3RecargaInput"
                />

                {
                    Number(valorReais) > 0 && (

                        <div className="fase3ResumoContainer">

                            <div className="fase3ResumoLinha">

                                <span>
                                    Valor enviado
                                </span>

                                <strong>

                                    R$ {
                                        Number(
                                            valorReais
                                        ).toFixed(2)
                                    }

                                </strong>

                            </div>

                            <div className="fase3ResumoLinha">

                                <span>
                                    Tarifa por servicio 15%
                                </span>

                                <strong>

                                    R$ {
                                        taxa.toFixed(2)
                                    }

                                </strong>

                            </div>

                            <div className="fase3ResumoLinha">

                                <span>
                                    Saldo del misionero
                                </span>

                                <strong>

                                    R$ {
                                        saldoRecebido.toFixed(2)
                                    }

                                </strong>

                            </div>

                        </div>
                    )
                }

                {
                    Number(valorReais) > 0 && (

                        <Elements stripe={stripePromise}>

                            <CheckoutForm

                                valorReais={
                                    valorReais
                                }

                                saldoRecebido={
                                    saldoRecebido
                                }

                                dadosMissionario={
                                    dadosMissionario
                                }

                                setFaseAtual={
                                    setFaseAtual
                                }
                            />

                        </Elements>
                    )
                }

            </div>

        </div>
    );
}