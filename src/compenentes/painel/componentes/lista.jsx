import React, { useEffect, useState } from "react";

import { API_URL } from "../../../config";

import "./lista.css";

export default function Lista() {

    const [listaMissionarios, setListaMissionarios] = useState([]);

    const [listaCarregando, setListaCarregando] = useState(true);

    useEffect(() => {

        buscarMissionarios();

    }, []);

    async function buscarMissionarios() {

        try {

            const token = localStorage.getItem(
                "token"
            );

            const resposta = await fetch(
                `${API_URL}/cupons/listar`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                return;
            }

            setListaMissionarios(dados);

        } catch {

        } finally {

            setListaCarregando(false);

        }
    }

    if (listaCarregando) {

        return (
            <div className="listaLoadingSistema">
                carregando...
            </div>
        );
    }

    return (

        <div className="listaContainerSistema">

            <div className="listaTopoSistema">

                <h1 className="listaTituloSistema">
                    Missionários
                </h1>

                <p className="listaQuantidadeSistema">
                    {listaMissionarios.length} registrados
                </p>

            </div>

            <div className="listaTabelaWrapperSistema">

                <table className="listaTabelaSistema">

                    <thead>

                        <tr>

                            <th>Nome</th>

                            <th>Email</th>

                            <th>Idioma</th>

                            <th>Senha</th>

                            <th>Saldo</th>

                            <th>Data final CTM</th>

                            <th>Cadastro</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            listaMissionarios.map((item) => (

                                <tr key={item.id}>

                                    <td>
                                        {item.nome}
                                    </td>

                                    <td>
                                        {item.email}
                                    </td>

                                    <td>
                                        {item.idioma}
                                    </td>

                                    <td>

                                        <div className="listaSenhaHoverSistema">

                                            ••••

                                            <span className="listaSenhaRealSistema">
                                                {item.senha}
                                            </span>

                                        </div>

                                    </td>

                                    <td>
                                        R$ {item.saldo.toFixed(2)}
                                    </td>

                                    <td>
                                        {item.data_fim}
                                    </td>

                                    <td>
                                        {
                                            item.data_cadastro
                                                ?.replace("T", " ")
                                                ?.slice(0, 16)
                                        }
                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
}