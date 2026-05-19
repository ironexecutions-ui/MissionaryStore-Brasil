import React, {
    useState,
    useEffect
} from "react";
import "./lojas.css"
import Piloto from "../painel/componentes/piloto";
import logoMissionary from "../../../m.png";
import { API_URL } from "../../config";

export default function Lojascadastradas() {

    const [email, setEmail] = useState("");
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [senha, setSenha] = useState("");

    const [loja, setLoja] = useState(null);

    useEffect(() => {

        const dados = localStorage.getItem(
            "dados_loja"
        );

        if (dados) {

            setLoja(
                JSON.parse(dados)
            );
        }

    }, []);

    async function fazerLogin(e) {

        e.preventDefault();

        if (loadingLogin) return;

        setLoadingLogin(true);

        try {

            const resposta = await fetch(
                `${API_URL}/lojas/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                alert(
                    dados.detail || "Erro"
                );

                return;
            }

            localStorage.setItem(
                "token_loja",
                dados.token
            );

            localStorage.setItem(
                "dados_loja",
                JSON.stringify(dados.loja)
            );

            setLoja(dados.loja);

        } catch {

            alert(
                "Erro ao entrar"
            );

        } finally {

            setLoadingLogin(false);
        }
    }

    function sair() {

        localStorage.removeItem(
            "token_loja"
        );

        localStorage.removeItem(
            "dados_loja"
        );

        setLoja(null);
    }

    if (!loja) {

        return (
            <form
                className="parceriaLoginFormulario"
                onSubmit={fazerLogin}
            >
                <div>
                    <img
                        className="parceriaLoginLogo"
                        src={logoMissionary}
                        alt="Missionary Store Brasil"
                    />
                    <h1 className="parceriaLoginTitulo">
                        Login Loja parceira com Missionary Store Brasil
                    </h1>
                </div>


                <p className="parceriaLoginSubtitulo">
                    Entre com o email da loja parceira
                </p>

                <input
                    className="parceriaLoginInput"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />

                <input
                    className="parceriaLoginInput"
                    type="text"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => {
                        setSenha(e.target.value);
                    }}
                />

                <button
                    className="parceriaLoginBotao"
                    type="submit"
                    disabled={loadingLogin}
                >
                    {
                        loadingLogin
                            ? "Entrando..."
                            : "Entrar"
                    }
                </button>

            </form>
        );
    }

    return (

        <div className="parceriaPainelContainer">

            <div className="parceriaTopoPainel">

                <div className="parceriaInfosLoja">



                    <h2 className="parceriaNomeLoja">
                        {loja.nome}
                    </h2>

                    <p className="parceriaEmailLoja">
                        {loja.email}
                    </p>

                </div>

                <button
                    className="parceriaBotaoSair"
                    onClick={sair}
                >
                    Sair
                </button>

            </div>

            <div className="parceriaPilotoWrapper">

                <Piloto />

            </div>

        </div>
    );
}