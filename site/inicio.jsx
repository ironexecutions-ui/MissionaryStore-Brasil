import React from "react";

import {
    GoogleLogin
} from "@react-oauth/google";

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

                <h1
                    className="inicioTituloPrincipal"
                >
                    Créditos CTM
                </h1>

                <p
                    className="inicioDescricaoLogin"
                >
                    Entre utilizando sua conta Google
                </p>

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

        </div>

    );

}