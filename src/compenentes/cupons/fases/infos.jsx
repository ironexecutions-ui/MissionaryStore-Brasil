import React, { useEffect, useState } from "react";
import axios from "axios";

import { API_URL } from "../../../config";
import "./info.css";

export default function Info({ irParaCompra }) {

    const [nome, setNome] = useState("");
    const [inicioMissao, setInicioMissao] = useState("");
    const [fotoAtual, setFotoAtual] = useState("");
    const [novaFoto, setNovaFoto] = useState(null);
    const [previewFoto, setPreviewFoto] = useState("");
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    function pegarToken() {
        return localStorage.getItem("token");
    }

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {

        try {

            const token = pegarToken();

            if (!token) {
                localStorage.removeItem("token");
                return;
            }

            const response = await axios.get(
                `${API_URL}/missionarios/google/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNome(response.data.nome || "");
            setInicioMissao(response.data.inicio_missao || "");

            // CORREÇÃO DA FOTO
            if (response.data.foto_url) {
                setFotoAtual(response.data.foto_url);
            }

        } catch (err) {

            console.log(err);

            alert(
                err?.response?.data?.detail ||
                "Erro ao carregar informações"
            );

            localStorage.removeItem("token");
            localStorage.removeItem("usuario");

        } finally {

            setLoading(false);

        }

    }

    function escolherFoto(e) {

        const arquivo = e.target.files[0];

        if (!arquivo) return;

        setNovaFoto(arquivo);
        setPreviewFoto(URL.createObjectURL(arquivo));

    }

    async function salvarInfo(e) {

        e.preventDefault();

        try {

            setSalvando(true);

            const token = pegarToken();

            if (!token) {
                alert("Token não encontrado");
                return;
            }

            const formData = new FormData();

            formData.append("nome", nome);
            formData.append("inicio_missao", inicioMissao);

            if (novaFoto) {
                formData.append("foto", novaFoto);
            }

            await axios.put(
                `${API_URL}/missionarios/google/info`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            irParaCompra();

        } catch (err) {

            console.log(err);

            alert(
                err?.response?.data?.detail ||
                "Erro ao salvar informações"
            );

        } finally {

            setSalvando(false);

        }

    }

    if (loading) {
        return (
            <div className="info_missionario_loading_z44">
                Carregando informações...
            </div>
        );
    }

    return (

        <div className="info_missionario_container_z44">

            <form
                className="info_missionario_card_z44"
                onSubmit={salvarInfo}
            >

                <h1 className="info_missionario_title_z44">
                    Complete suas informações
                </h1>

                <label className="info_missionario_foto_box_z44">

                    <img
                        className="info_missionario_foto_z44"
                        src={
                            previewFoto ||
                            fotoAtual ||
                            "/sem-foto.png"
                        }
                        alt="Foto de perfil"
                    />

                    <span className="info_missionario_foto_text_z44">
                        Clique para trocar a foto
                    </span>

                    <input
                        className="info_missionario_foto_input_z44"
                        type="file"
                        accept="image/*"
                        onChange={escolherFoto}
                    />

                </label>

                <div className="info_missionario_group_z44">

                    <label className="info_missionario_label_z44">
                        Nome
                    </label>

                    <input
                        className="info_missionario_input_z44"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />

                </div>

                <div className="info_missionario_group_z44">

                    <label className="info_missionario_label_z44">
                        Início da missão
                    </label>

                    <input
                        className="info_missionario_input_z44"
                        type="date"
                        value={inicioMissao}
                        onChange={(e) => setInicioMissao(e.target.value)}
                        required
                    />

                </div>

                <button
                    className="info_missionario_btn_z44"
                    type="submit"
                    disabled={salvando}
                >
                    {
                        salvando
                            ? "Salvando..."
                            : "Salvar e continuar"
                    }
                </button>

            </form>

        </div>

    );

}