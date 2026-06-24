import React, {
    useEffect,
    useState
} from "react";

import QRCode from "react-qr-code";

import {
    API_URL
} from "../../src/config";

import "./aprovacao.css";

export default function Aprovacao() {

    const [
        usuario,
        setUsuario
    ] = useState(null);

    const [
        carregando,
        setCarregando
    ] = useState(true);

    useEffect(() => {

        carregarUsuario();

    }, []);

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

            console.log(
                "DADOS:",
                dados
            );

            setUsuario(
                dados
            );

        } catch (erro) {

            console.error(
                erro
            );

            alert(
                "Erro ao carregar dados"
            );

        } finally {

            setCarregando(
                false
            );

        }

    }

    if (
        carregando
    ) {

        return (
            <h1>
                Carregando...
            </h1>
        );

    }

    if (
        !usuario
    ) {

        return (
            <h1>
                Erro ao carregar usuário
            </h1>
        );

    }

    return (

        <div
            className="aprovacaoInstrutorContainer"
        >

            <div
                className="aprovacaoInstrutorCard"
            >

                <h1
                    className="aprovacaoInstrutorTitulo"
                >
                    Aprovação de Créditos
                </h1>

                <img
                    src={usuario.foto}
                    alt=""
                    className="aprovacaoInstrutorFoto"
                />

                <h2
                    className="aprovacaoInstrutorNome"
                >
                    {usuario.nome}
                </h2>


                <p
                    className="aprovacaoInstrutorTexto"
                >
                    Dirija-se até a
                    Missionary Store Brasil
                    para validar sua identidade
                    e liberar seus créditos.
                </p>

                <div
                    className="aprovacaoInstrutorQrArea"
                >

                    <QRCode
                        value={
                            usuario.id_criptografado
                                ? `https://www.missionarystorebrasil.com.br/aprovacao/${usuario.id_criptografado}`
                                : "erro"
                        }
                        size={250}
                    />

                </div>

                <p
                    className="aprovacaoInstrutorRodape"
                >
                    Apresente este QR Code
                    para aprovação.
                </p>

            </div>

        </div>

    );

}