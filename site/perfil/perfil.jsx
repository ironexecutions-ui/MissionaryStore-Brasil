import React, {
    useEffect,
    useState
} from "react";
import {
    useNavigate
} from "react-router-dom";
import {
    API_URL
} from "../../src/config";

import "./perfil.css";

export default function Perfil() {
    const navigate =
        useNavigate();
    const [
        usuario,
        setUsuario
    ] = useState(null);

    const [
        carregando,
        setCarregando
    ] = useState(true);

    useEffect(() => {

        carregarPerfil();

    }, []);

    async function carregarPerfil() {

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

            setUsuario(
                dados
            );

        } catch {

            alert(
                "Erro ao carregar perfil"
            );

        } finally {

            setCarregando(
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

    return (

        <div
            className="perfilAreaContainer"
        >

            <div
                className="perfilAreaCard"
            >

                <img
                    src={usuario.foto}
                    alt=""
                    className="perfilAreaFoto"
                />

                <h1
                    className="perfilAreaNome"
                >
                    {usuario.nome}
                </h1>

                {
                    usuario.status === 1 ? (

                        <div
                            className="perfilAreaCreditosLiberados"
                        >

                            <span
                                className="perfilAreaTituloCredito"
                            >
                                Créditos disponíveis
                            </span>

                            <h2
                                className="perfilAreaValorCredito"
                            >
                                R$ {usuario.creditos}
                            </h2>

                        </div>

                    ) : (

                        <div
                            className="perfilAreaCreditosBloqueados"
                        >

                            <div
                                className="perfilAreaCreditosBloqueados"
                            >

                                <span
                                    className="perfilAreaTituloCredito"
                                >
                                    Créditos disponíveis
                                </span>

                                <h2
                                    className="perfilAreaValorCreditoBloqueado"
                                >
                                    R$ {usuario.creditos}
                                </h2>

                                <p
                                    className="perfilAreaAvisoBloqueio"
                                >
                                    Seus créditos estão aguardando aprovação.
                                </p>

                                <button
                                    className="perfilAreaBotaoAprovacao"
                                    onClick={() =>
                                        navigate(
                                            "/perfil/instrutores/aprovacao"
                                        )
                                    }
                                >
                                    Aprovar Créditos
                                </button>

                            </div>


                        </div>

                    )
                }

            </div>

        </div>

    );

}