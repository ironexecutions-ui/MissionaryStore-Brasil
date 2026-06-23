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
} from "../../src/config";

import "./aprovacao_admin.css";

export default function AprovacaoAdmin() {

    const {
        id
    } = useParams();

    const [
        instrutor,
        setInstrutor
    ] = useState(null);

    const [
        carregando,
        setCarregando
    ] = useState(true);

    const [
        enviando,
        setEnviando
    ] = useState(false);

    const [
        abrirCamera,
        setAbrirCamera
    ] = useState(false);

    const scannerRef =
        useRef(null);

    useEffect(() => {

        carregarInstrutor();

    }, []);

    useEffect(() => {

        if (!abrirCamera) {

            return;

        }

        if (scannerRef.current) {

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

                await validarQRCode(
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

    async function carregarInstrutor() {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/ctm/aprovacao/${id}`
                );

            const dados =
                await resposta.json();

            setInstrutor(
                dados
            );

        } catch (erro) {

            console.error(
                erro
            );

            alert(
                "Erro ao carregar instrutor"
            );

        } finally {

            setCarregando(
                false
            );

        }

    }

    async function validarQRCode(
        chaveLida
    ) {

        try {

            setEnviando(
                true
            );

            const resposta =
                await fetch(
                    `${API_URL}/ctm/aprovacao/${id}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            {
                                chave:
                                    chaveLida
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

            alert(
                "Créditos aprovados com sucesso"
            );

            setAbrirCamera(
                false
            );

            carregarInstrutor();

        } catch (erro) {

            console.error(
                erro
            );

            alert(
                "Erro ao validar QR Code"
            );

        } finally {

            setEnviando(
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
        !instrutor
    ) {

        return (

            <h1>
                Instrutor não encontrado
            </h1>

        );

    }

    if (
        instrutor.erro
    ) {

        return (

            <h1>
                {
                    instrutor.erro
                }
            </h1>

        );

    }

    return (

        <div
            className="aprovacaoAdminContainer"
        >

            <div
                className="aprovacaoAdminCard"
            >

                <h1
                    className="aprovacaoAdminTitulo"
                >
                    Missionary Store Brasil
                </h1>

                <img
                    src={
                        instrutor.foto
                    }
                    alt=""
                    className="aprovacaoAdminFoto"
                />

                <h2
                    className="aprovacaoAdminNome"
                >
                    {
                        instrutor.nome
                    }
                </h2>

                <p
                    className="aprovacaoAdminStatus"
                >
                    Status:
                    {" "}

                    {
                        instrutor.status === 1
                            ? "Aprovado"
                            : "Pendente"
                    }

                </p>

                <p
                    className="aprovacaoAdminCredito"
                >
                    Créditos:
                    {" "}
                    R$
                    {" "}
                    {
                        instrutor.creditos
                    }
                </p>

                {
                    instrutor.status === 0 && (

                        <>

                            <p
                                className="aprovacaoAdminTexto"
                            >
                                Clique abaixo
                                para escanear
                                o QR Code de
                                autorização da
                                Missionary Store.
                            </p>

                            <button
                                className="aprovacaoAdminBotao"
                                disabled={
                                    enviando
                                }
                                onClick={() => {

                                    const confirmar =
                                        window.confirm(
                                            "Você é administrador da loja?"
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

                                {
                                    enviando
                                        ? "Processando..."
                                        : "Liberar Créditos"
                                }

                            </button>

                            {
                                abrirCamera && (

                                    <div
                                        className="aprovacaoAdminCameraArea"
                                    >

                                        <div
                                            id="reader"
                                        ></div>

                                    </div>

                                )
                            }

                        </>

                    )
                }

                {
                    instrutor.status === 1 && (

                        <div
                            className="aprovacaoAdminSucesso"
                        >

                            Créditos já aprovados.

                        </div>

                    )
                }

            </div>

        </div>

    );

}