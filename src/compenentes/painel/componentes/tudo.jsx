import React, { useEffect, useState } from "react";

import {
    useNavigate,
    useLocation
} from "react-router-dom";

import Cadastro from "./cadastro";

import Lista from "./lista";

import Piloto from "./piloto";

import Historico from "./historico";

import Ganhos from "./ganhos";

import Valor from "./valor";

import { API_URL } from "../../../config";

import "./tudo.css";

export default function Tudo() {

    const navigate = useNavigate();

    const location = useLocation();

    const [abaAtiva, setAbaAtiva] = useState("cadastro");

    const [carregandoTudoSistema, setCarregandoTudoSistema] = useState(true);

    useEffect(() => {

        verificarLoginSistema();

    }, []);

    useEffect(() => {

        if (
            location.pathname.includes("/painel/cadastro")
        ) {

            setAbaAtiva("cadastro");

        }

        else if (
            location.pathname.includes("/painel/lista")
        ) {

            setAbaAtiva("lista");

        }

        else if (
            location.pathname.includes("/painel/piloto")
        ) {

            setAbaAtiva("piloto");

        }

        else if (
            location.pathname.includes("/painel/historico")
        ) {

            setAbaAtiva("historico");

        }

        else if (
            location.pathname.includes("/painel/ganhos")
        ) {

            setAbaAtiva("ganhos");

        }

        else if (
            location.pathname.includes("/painel/valor")
        ) {

            setAbaAtiva("valor");

        }

    }, [location.pathname]);

    async function verificarLoginSistema() {

        try {

            const token = localStorage.getItem("token");

            if (!token) {

                navigate("/");

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

                navigate("/");

                return;
            }

        } catch {

            localStorage.removeItem("token");

            navigate("/");

        } finally {

            setCarregandoTudoSistema(false);

        }
    }

    if (carregandoTudoSistema) {

        return (
            <div>
                carregando...
            </div>
        );
    }

    return (

        <div className="tudoContainerSistema">

            <div className="tudoMenuSistema">

                <button
                    className={
                        abaAtiva === "cadastro"
                            ? "tudoBotaoSistema tudoBotaoAtivoSistema"
                            : "tudoBotaoSistema"
                    }
                    onClick={() => {

                        setAbaAtiva("cadastro");

                        navigate("/painel/cadastro");

                    }}
                >
                    Cadastro
                </button>

                <button
                    className={
                        abaAtiva === "lista"
                            ? "tudoBotaoSistema tudoBotaoAtivoSistema"
                            : "tudoBotaoSistema"
                    }
                    onClick={() => {

                        setAbaAtiva("lista");

                        navigate("/painel/lista");

                    }}
                >
                    Lista
                </button>

                <button
                    className={
                        abaAtiva === "piloto"
                            ? "tudoBotaoSistema tudoBotaoAtivoSistema"
                            : "tudoBotaoSistema"
                    }
                    onClick={() => {

                        setAbaAtiva("piloto");

                        navigate("/painel/piloto");

                    }}
                >
                    Piloto
                </button>

                <button
                    className={
                        abaAtiva === "historico"
                            ? "tudoBotaoSistema tudoBotaoAtivoSistema"
                            : "tudoBotaoSistema"
                    }
                    onClick={() => {

                        setAbaAtiva("historico");

                        navigate("/painel/historico");

                    }}
                >
                    Histórico
                </button>

                <button
                    className={
                        abaAtiva === "ganhos"
                            ? "tudoBotaoSistema tudoBotaoAtivoSistema"
                            : "tudoBotaoSistema"
                    }
                    onClick={() => {

                        setAbaAtiva("ganhos");

                        navigate("/painel/ganhos");

                    }}
                >
                    Ganhos
                </button>

                <button
                    className={
                        abaAtiva === "valor"
                            ? "tudoBotaoSistema tudoBotaoAtivoSistema"
                            : "tudoBotaoSistema"
                    }
                    onClick={() => {

                        setAbaAtiva("valor");

                        navigate("/painel/valor");

                    }}
                >
                    Valor
                </button>

            </div>

            <div className="tudoConteudoSistema">

                {
                    abaAtiva === "cadastro"
                    &&
                    <Cadastro />
                }

                {
                    abaAtiva === "lista"
                    &&
                    <Lista />
                }

                {
                    abaAtiva === "piloto"
                    &&
                    <Piloto />
                }

                {
                    abaAtiva === "historico"
                    &&
                    <Historico />
                }

                {
                    abaAtiva === "ganhos"
                    &&
                    <Ganhos />
                }

                {
                    abaAtiva === "valor"
                    &&
                    <Valor />
                }

            </div>

        </div>
    );
}