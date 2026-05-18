import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

import "./login.css";
import Termos from "./termos";

import { API_URL } from "../../../config";

export default function Login({ irParaInfo }) {

    const [mostrarTermos, setMostrarTermos] = useState(false);
    const [googleResponse, setGoogleResponse] = useState(null);
    const [aceitou, setAceitou] = useState(false);
    const [loading, setLoading] = useState(false);

    async function enviarCadastroGoogle() {

        if (!googleResponse?.credential) {
            alert("Credencial do Google não encontrada");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${API_URL}/missionarios/google/login`,
                {
                    credential: googleResponse.credential
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "usuario",
                JSON.stringify(response.data.usuario)
            );

            irParaInfo();

        } catch (err) {

            console.log(err);

            alert(
                err?.response?.data?.detail ||
                "Erro ao realizar login"
            );

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        if (
            aceitou &&
            googleResponse
        ) {
            enviarCadastroGoogle();
        }

    }, [aceitou]);

    return (

        <div className="login_google_container_x91">

            <div className="login_google_box_x91">

                <div className="login_google_topo_x91">

                    <h1 className="login_google_title_x91">
                        Missionários
                    </h1>

                    <p className="login_google_subtitle_x91">
                        Entre utilizando sua conta Google
                    </p>

                </div>

                {
                    !mostrarTermos && (
                        <div className="login_google_btn_area_x91">

                            <GoogleLogin
                                onSuccess={(credentialResponse) => {

                                    setGoogleResponse(
                                        credentialResponse
                                    );

                                    setMostrarTermos(true);

                                }}
                                onError={() => {

                                    alert(
                                        "Erro ao autenticar com Google"
                                    );

                                }}
                            />

                        </div>
                    )
                }

                {
                    mostrarTermos && (
                        <div className="login_google_termos_area_x91">

                            <div className="login_google_termos_scroll_x91">
                                <Termos />
                            </div>

                            <button
                                className="login_google_btn_aceitar_x91"
                                disabled={loading}
                                onClick={() => setAceitou(true)}
                            >
                                {
                                    loading
                                        ? "Carregando..."
                                        : "Aceitar termos"
                                }
                            </button>

                        </div>
                    )
                }

            </div>

        </div>

    );

}