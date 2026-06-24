import React from "react";

import {
    GoogleLogin
} from "@react-oauth/google";

import "./inicio.css";
import logo from "../m.png";
import {
    API_URL
} from "../src/config";

export default function Inicio() {

    async function fazerLoginGoogle(
        credentialResponse
    ) {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/auth/google`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            credential:
                                credentialResponse.credential
                        })
                    }
                );

            const dados =
                await resposta.json();

            if (dados.erro) {

                alert(
                    dados.erro
                );

                return;

            }

            localStorage.setItem(
                "token",
                dados.token
            );

            window.location.href =
                "/perfil/instrutores";

        } catch {

            alert(
                "Erro ao fazer login"
            );

        }

    }

    return (

        <div
            className="inicioContainer"
        >

            <div
                className="inicioCardLogin"
            >

                <div
                    className="inicioCabecalhoSistema"
                >

                    <div
                        className="inicioLogoCirculo"
                    >

                        <img
                            src={logo}
                            alt="Logo CTM"
                            className="inicioLogoImagem"
                        />

                    </div>
                    <h1
                        className="inicioTituloPrincipal"
                    >
                        Missionary Store Brasil
                    </h1>

                    <p
                        className="inicioDescricaoLogin"
                    >
                        Plataforma oficial para consulta,
                        gerenciamento e aprovação de créditos para funcionarios do CTM.
                    </p>

                </div>

                <div
                    className="inicioInformacaoBox"
                >

                    <h3>
                        Acesso Seguro
                    </h3>

                    <p>
                        Utilize sua conta Google autorizada
                        para acessar o sistema.
                    </p>

                </div>

                <div
                    className="inicioLoginArea"
                >

                    <GoogleLogin
                        onSuccess={
                            fazerLoginGoogle
                        }
                        onError={() =>
                            alert(
                                "Erro ao autenticar"
                            )
                        }
                    />

                </div>

                <div
                    className="inicioRodape"
                >

                    <p>
                        Missionary store Brasil Creditos
                    </p>

                    <span>
                        Sistema Oficial de Controle de Créditos
                    </span>

                </div>

            </div>

        </div>

    );

}