import React, {
    useEffect,
    useState
} from "react";
import "./lojas.css"
import { API_URL } from "../../../config";

export default function Lojas() {

    const [email, setEmail] = useState("");

    const [loja, setLoja] = useState("");

    const [senha, setSenha] = useState("");

    const [lista, setLista] = useState([]);

    const [editando, setEditando] = useState(null);

    useEffect(() => {

        buscarLojas();

    }, []);

    async function buscarLojas() {

        const token = localStorage.getItem("token");

        const resposta = await fetch(
            `${API_URL}/lojas`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const dados = await resposta.json();

        setLista(dados);
    }

    async function salvarLoja() {

        const token = localStorage.getItem("token");

        const body = {
            email,
            loja,
            senha
        };

        const url = editando
            ? `${API_URL}/lojas/${editando}`
            : `${API_URL}/lojas`;

        const metodo = editando
            ? "PUT"
            : "POST";

        const resposta = await fetch(
            url,
            {
                method: metodo,

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(body)
            }
        );

        const dados = await resposta.json();

        alert(
            dados.detail || dados.mensagem
        );

        setEmail("");
        setLoja("");
        setSenha("");

        setEditando(null);

        buscarLojas();
    }

    async function apagarLoja(id) {

        const token = localStorage.getItem("token");

        await fetch(
            `${API_URL}/lojas/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        buscarLojas();
    }

    function editarLoja(item) {

        setEditando(item.id);

        setEmail(item.email);

        setLoja(item.loja);

        setSenha("");
    }

    return (

        <div className="lojasPaginaContainer">

            <div className="lojasTopoArea">

                <h1 className="lojasTituloPrincipal">
                    Lojas
                </h1>

                <p className="lojasSubtituloPrincipal">
                    Gerencie as lojas cadastradas no sistema.
                </p>

            </div>

            <form
                className="lojasFormularioContainer"
                autoComplete="off"
                onSubmit={(e) => {
                    e.preventDefault();

                    salvarLoja();
                }}
            >

                <input
                    className="lojasInputSistema"
                    type="text"
                    name="email_fake_loja"
                    placeholder="Email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />

                <input
                    className="lojasInputSistema"
                    type="text"
                    name="nome_fake_loja"
                    placeholder="Nome da loja"
                    autoComplete="off"
                    value={loja}
                    onChange={(e) => {
                        setLoja(e.target.value);
                    }}
                />

                <input
                    className="lojasInputSistema"
                    type="text"
                    name="senha_fake_loja"
                    placeholder="Senha"
                    autoComplete="new-password"
                    value={senha}
                    onChange={(e) => {
                        setSenha(e.target.value);
                    }}
                />

                <button
                    type="submit"
                    className="lojasBotaoSalvar"
                >
                    {
                        editando
                            ? "Salvar alterações"
                            : "Cadastrar loja"
                    }
                </button>

            </form>

            <div className="lojasListaContainer">

                {
                    lista.map((item) => (

                        <div
                            className="lojasCardItem"
                            key={item.id}
                        >

                            <div className="lojasInfosArea">

                                <h3 className="lojasNome">
                                    {item.loja}
                                </h3>

                                <p className="lojasEmail">
                                    {item.email}
                                </p>

                                <div className="lojasSenhaContainer">

                                    <span className="lojasSenhaLabel">
                                        Senha:
                                    </span>

                                    <span className="lojasSenhaHover">
                                        Passe o mouse
                                    </span>

                                    <span className="lojasSenhaReal">
                                        {item.senha}
                                    </span>

                                </div>

                            </div>

                            <div className="lojasBotoesArea">

                                <button
                                    type="button"
                                    className="lojasBotaoEditar"
                                    onClick={() => {
                                        editarLoja(item);
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    className="lojasBotaoApagar"
                                    onClick={() => {
                                        apagarLoja(item.id);
                                    }}
                                >
                                    Apagar
                                </button>

                            </div>

                        </div>

                    ))
                }

            </div>

        </div>
    );
}