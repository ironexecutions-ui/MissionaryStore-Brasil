import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Cadastro from "./cadastro";

import Lista from "./lista";

import Piloto from "./piloto";

import { API_URL } from "../../../config";

import "./tudo.css";

export default function Tudo() {

    const navigate = useNavigate();

    const [abaAtiva, setAbaAtiva] = useState("cadastro");

    const [carregandoTudoSistema, setCarregandoTudoSistema] = useState(true);

    useEffect(() => {

        verificarLoginSistema();

    }, []);

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
                    onClick={() =>
                        setAbaAtiva("cadastro")
                    }
                >
                    Cadastro
                </button>

                <button
                    className={
                        abaAtiva === "lista"
                            ? "tudoBotaoSistema tudoBotaoAtivoSistema"
                            : "tudoBotaoSistema"
                    }
                    onClick={() =>
                        setAbaAtiva("lista")
                    }
                >
                    Lista
                </button>

                <button
                    className={
                        abaAtiva === "piloto"
                            ? "tudoBotaoSistema tudoBotaoAtivoSistema"
                            : "tudoBotaoSistema"
                    }
                    onClick={() =>
                        setAbaAtiva("piloto")
                    }
                >
                    Piloto
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

            </div>

        </div>
    );
}