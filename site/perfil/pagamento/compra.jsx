import React, {
    useEffect,
    useState,
    useRef
} from "react";

import {
    useParams
} from "react-router-dom";

import {
    Html5QrcodeScanner
} from "html5-qrcode";

import {
    API_URL
} from "../../../src/config";

import "./compra.css";

export default function Compra() {

    const {
        id
    } = useParams();

    const [
        compra,
        setCompra
    ] = useState(null);
    const [
        qrLido,
        setQrLido
    ] = useState(false);
    const [
        carregando,
        setCarregando
    ] = useState(true);

    const [
        abrirCamera,
        setAbrirCamera
    ] = useState(false);

    const [
        processando,
        setProcessando
    ] = useState(false);

    const scannerRef =
        useRef(null);

    useEffect(() => {

        carregarCompra();

    }, []);

    useEffect(() => {

        if (
            !abrirCamera
        ) {

            return;

        }

        if (
            scannerRef.current
        ) {

            return;

        }

        scannerRef.current =
            new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: 250
                },
                false
            );

        scannerRef.current.render(

            async (
                textoLido
            ) => {

                if (
                    qrLido ||
                    processando
                ) {

                    return;

                }

                setQrLido(
                    true
                );
                setAbrirCamera(
                    false
                );

                if (
                    scannerRef.current
                ) {

                    await scannerRef.current
                        .clear()
                        .catch(
                            () => { }
                        );

                    scannerRef.current =
                        null;

                }
                await aprovarCompra(
                    textoLido
                );

            },

            () => { }
        );

        return () => {

            if (
                scannerRef.current
            ) {

                scannerRef.current
                    .clear()
                    .catch(
                        () => { }
                    );

                scannerRef.current =
                    null;

            }

        };

    }, [abrirCamera]);

    async function carregarCompra() {

        try {

            console.log(
                "URL CHAMADA:",
                `${API_URL}/ctm/compra/${id}`
            );

            const resposta =
                await fetch(
                    `${API_URL}/ctm/compra/${id}`
                );

            const dados =
                await resposta.json();

            console.log(
                "COMPRA RECEBIDA:",
                dados
            );

            setCompra(
                dados
            );

        } catch (erro) {

            console.log(
                "ERRO:",
                erro
            );

            alert(
                "Erro ao carregar compra"
            );

        } finally {

            setCarregando(
                false
            );

        }

    }

    async function aprovarCompra(
        chave
    ) {

        if (
            processando
        ) {

            return;

        }

        try {

            setProcessando(
                true
            );
            console.log(
                "URL CHAMADA:",
                `${API_URL}/ctm/compra/${id}`
            );
            const resposta =
                await fetch(
                    `${API_URL}/ctm/compra/aprovar/${compra.compra_id}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            {
                                chave
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

                setQrLido(
                    false
                );

                setAbrirCamera(
                    false
                );

                return;

            }

            alert(
                "Compra aprovada com sucesso"
            );

            setTimeout(
                () => {

                    window.location.href =
                        "/";

                },
                2000
            );

            return;

        } catch {

            alert(
                "Erro ao aprovar compra"
            );

            setQrLido(
                false
            );

        } finally {

            setProcessando(
                false
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

    if (
        compra?.erro
    ) {

        return (
            <h1>
                {
                    compra.erro
                }
            </h1>
        );

    }

    return (

        <div
            className="compraContainer"
        >

            <div
                className="compraCard"
            >

                <h1
                    className="compraTitulo"
                >
                    Aprovação de Compra
                </h1>

                <img
                    src={
                        compra.foto
                    }
                    alt=""
                    className="compraFoto"
                />

                <h2
                    className="compraNome"
                >
                    {
                        compra.nome
                    }
                </h2>

                <p
                    className="compraValor"
                >
                    Valor solicitado:
                    {" "}
                    R$
                    {" "}
                    {
                        compra.valor
                    }
                </p>

                <button
                    className="compraBotao"
                    disabled={
                        processando
                    }
                    onClick={() => {

                        const confirmar =
                            window.confirm(
                                "Você é administrador da Missionary Store?"
                            );

                        if (
                            confirmar
                        ) {

                            setAbrirCamera(
                                true
                            );

                        }

                    }}
                >

                    Aprovar Compra

                </button>

                {
                    abrirCamera && (

                        <div
                            className="compraCamera"
                        >

                            <h3>
                                Escaneie o QR Code da chave MSB
                            </h3>

                            <div
                                id="reader"
                            ></div>

                        </div>

                    )
                }

            </div>
            {
                !abrirCamera && (

                    <button
                        className="compraBotao"
                        onClick={() => {

                            setQrLido(
                                false
                            );

                            setAbrirCamera(
                                true
                            );

                        }}
                    >
                        Abrir Scanner
                    </button>

                )
            }
        </div>

    );

}