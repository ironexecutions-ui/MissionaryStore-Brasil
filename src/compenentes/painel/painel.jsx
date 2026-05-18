// src/components/painel/Painel.jsx

import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

import "./painel.css";

import { API_URL } from "../../config";

export default function Painel() {

    const navigate = useNavigate();

    const [carregandoPainelVendedor, setCarregandoPainelVendedor] = useState(true);

    const [vendedorPainelDados, setVendedorPainelDados] = useState(null);

    useEffect(() => {

        verificarLoginPainel();

    }, []);

    async function verificarLoginPainel() {

        try {

            const token = localStorage.getItem("token");

            if (!token) {

                setCarregandoPainelVendedor(false);

                return;
            }

            const resposta = await fetch(
                `${API_URL}/vendedores/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!resposta.ok) {

                localStorage.removeItem("token");

                setCarregandoPainelVendedor(false);

                return;
            }

            const dados = await resposta.json();

            setVendedorPainelDados(dados);

        } catch {

            localStorage.removeItem("token");

        } finally {

            setCarregandoPainelVendedor(false);

        }
    }

    async function loginGooglePainelSistema(response) {

        try {

            const resposta = await fetch(
                `${API_URL}/vendedores/google`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        credential: response.credential
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                alert(
                    dados.detail || "Erro no login"
                );

                return;
            }

            localStorage.setItem(
                "token",
                dados.token
            );

            setVendedorPainelDados(
                dados.vendedor
            );

            navigate("/painel/cadastro");

        } catch {

            alert("Erro interno");

        }
    }

    function sairPainelSistema() {

        localStorage.removeItem("token");

        setVendedorPainelDados(null);

    }

    if (carregandoPainelVendedor) {

        return (
            <div className="painelCarregandoAreaSistema">
                <h1 className="painelCarregandoTextoSistema">
                    carregando...
                </h1>
            </div>
        );
    }

    // =====================================
    // NÃO LOGADO
    // =====================================

    if (!vendedorPainelDados) {

        return (
            <div className="painelAuthContainerSistema">

                <div className="painelGoogleAreaSistema">

                    <h1 className="painelTituloSistema">
                        Painel Vendedores
                    </h1>

                    <p className="painelSubtituloSistema">
                        Entrar com Google
                    </p>

                    <div className="painelGoogleBotaoSistema">

                        <GoogleLogin
                            onSuccess={loginGooglePainelSistema}
                            onError={() => {
                                alert("Erro no Google");
                            }}
                        />

                    </div>

                </div>

            </div>
        );
    }

    // =====================================
    // LOGADO
    // =====================================

    return (
        <div className="painelContainerSistema">

            <div className="painelTopoSistema">

                <div>

                    <h1 className="painelTituloSistema">
                        Painel
                    </h1>

                    <p className="painelSubtituloSistema">
                        Bem-vindo {vendedorPainelDados?.nome}
                    </p>

                </div>

                <button
                    className="painelBotaoSairSistema"
                    onClick={sairPainelSistema}
                >
                    Sair
                </button>

            </div>

            <div className="painelCardsSistema">

                <button
                    className="painelCardSistema"
                    onClick={() => navigate("/painel/cadastro")}
                >
                    Cadastro de Missionários
                </button>

            </div>

        </div>
    );
}