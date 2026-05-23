import React, {
    useEffect,
    useState
} from "react";
import "./link.css";
import { API_URL } from "../../config";
import instagramLogo from "./logos/ins.svg";
import whatsappLogo from "./logos/wa.png";
import missioneLogo from "./logos/mn.webp";
import networkLogo from "./logos/ns.png";

export default function Link() {
    const mensagens = [

        "✨ Produtos pensados para missionários",

        "🛍️ Loja oficial Missionary Store Brasil",

        "📩 Entre em contato conosco"
    ];

    const [indiceAtual, setIndiceAtual] =
        useState(0);

    const [fotos, setFotos] =
        useState([]);

    useEffect(() => {

        const intervalo = setInterval(() => {

            setIndiceAtual((anterior) => {

                if (
                    anterior === mensagens.length - 1
                ) {

                    return 0;
                }

                return anterior + 1;
            });

        }, 8300);
        return () =>
            clearInterval(intervalo);

    }, []);

    useEffect(() => {

        buscarFotos();

    }, []);

    async function buscarFotos() {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/link/fotos`
                );

            const dados =
                await resposta.json();

            setFotos(dados);

        } catch (erro) {

            console.log(erro);
        }
    }
    return (

        <div className="missionaryLinkPagina">


            <div className="missionaryLinkCard">
                <div className="missionaryLinkCardLinhas">

                    <span></span>

                    <span></span>
                    <span></span>




                </div>
                <div className="missionaryLinkTopo">

                    <div className="missionaryLinkFotoArea">

                        <img
                            src="https://www.missionarystorebrasil.com.br/assets/m-BFCE3fxv.png"
                            alt="Missionary Store Brasil"
                        />

                    </div>

                    <h1 className="missionaryLinkTitulo">
                        Missionary Store Brasil
                    </h1>

                    <div className="missionaryLinkShowcaseArea">

                        <div className="missionaryLinkTextoAnimado">

                            <p className="missionaryLinkTextoAtivo">
                                {mensagens[indiceAtual]}
                            </p>

                        </div>

                        <div className="missionaryLinkFotosArea">

                            {fotos.map((foto, index) => (

                                <div
                                    key={index}
                                    className="missionaryLinkFotoMini"
                                >

                                    <img
                                        src={foto}
                                        alt="Missionário"
                                    />

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

                <div className="missionaryLinkLista">

                    {/* INSTAGRAM */}

                    <a
                        href="https://www.instagram.com/missionarystore.brasil"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="missionaryLinkBotao missionaryLinkInstagram"
                    >

                        <div className="missionaryLinkEsquerda">

                            <div className="missionaryLinkIcone">

                                <img
                                    src={instagramLogo}
                                    alt="Instagram"
                                />

                            </div>

                            <div className="missionaryLinkTextos">

                                <h3>
                                    Instagram
                                </h3>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="missionaryLinkCompartilhar"
                            onClick={(e) => {

                                e.preventDefault();

                                if (navigator.share) {

                                    navigator.share({

                                        title: "Missionary Store Brasil",

                                        text: "Acesse nosso Instagram",

                                        url: "https://www.instagram.com/missionarystore.brasil"
                                    });

                                } else {

                                    navigator.clipboard.writeText(
                                        "https://www.instagram.com/missionarystore.brasil"
                                    );

                                    alert("Link copiado!");
                                }
                            }}
                        >

                            <div className="missionaryLinkCompartilharIcone">

                                <span></span>

                                <span></span>

                                <span></span>

                                <div className="missionaryLinkCompartilharLinha missionaryLinkCompartilharLinhaUm"></div>

                                <div className="missionaryLinkCompartilharLinha missionaryLinkCompartilharLinhaDois"></div>

                            </div>
                        </button>

                    </a>

                    {/* WHATSAPP */}

                    {/* WHATSAPP */}

                    <a
                        href="https://wa.me/5511994381409"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="missionaryLinkBotao missionaryLinkWhatsapp"
                    >

                        <div className="missionaryLinkEsquerda">

                            <div className="missionaryLinkIcone">

                                <img
                                    src={whatsappLogo}
                                    alt="Whatsapp"
                                />

                            </div>

                            <div className="missionaryLinkTextos">

                                <h3>
                                    WhatsApp
                                </h3>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="missionaryLinkCompartilhar"
                            onClick={(e) => {

                                e.preventDefault();

                                if (navigator.share) {

                                    navigator.share({

                                        title: "Missionary Store Brasil",

                                        text: "Entre em contato pelo WhatsApp",

                                        url: "https://wa.me/5511994381409"
                                    });

                                } else {

                                    navigator.clipboard.writeText(
                                        "https://wa.me/5511994381409"
                                    );

                                    alert("Link copiado!");
                                }
                            }}
                        >

                            <div className="missionaryLinkCompartilharIcone">

                                <span></span>

                                <span></span>

                                <span></span>

                                <div className="missionaryLinkCompartilharLinha missionaryLinkCompartilharLinhaUm"></div>

                                <div className="missionaryLinkCompartilharLinha missionaryLinkCompartilharLinhaDois"></div>

                            </div>
                        </button>

                    </a>

                    {/* REDE SOCIAL */}

                    <a
                        href="https://missionetwork.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="missionaryLinkBotao missionaryLinkRede"
                    >

                        <div className="missionaryLinkEsquerda">

                            <div className="missionaryLinkIcone">

                                <img
                                    src={networkLogo}
                                    alt="Missione Network"
                                />

                            </div>

                            <div className="missionaryLinkTextos">

                                <h3>
                                    Compras Online                                </h3>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="missionaryLinkCompartilhar"
                            onClick={(e) => {

                                e.preventDefault();

                                if (navigator.share) {

                                    navigator.share({

                                        title: "Missione Network",

                                        text: "Conheça nossa rede social",

                                        url: "https://missionetwork.com"
                                    });

                                } else {

                                    navigator.clipboard.writeText(
                                        "https://missionetwork.com"
                                    );

                                    alert("Link copiado!");
                                }
                            }}
                        >

                            <div className="missionaryLinkCompartilharIcone">

                                <span></span>

                                <span></span>

                                <span></span>

                                <div className="missionaryLinkCompartilharLinha missionaryLinkCompartilharLinhaUm"></div>

                                <div className="missionaryLinkCompartilharLinha missionaryLinkCompartilharLinhaDois"></div>

                            </div>
                        </button>

                    </a>

                    {/* COMPRAS */}

                    <a
                        href="https://missionarystorebrasil.com/produtos/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="missionaryLinkBotao missionaryLinkCompras"
                    >

                        <div className="missionaryLinkEsquerda">

                            <div className="missionaryLinkIcone">

                                <img
                                    src={missioneLogo}
                                    alt="Loja"
                                />

                            </div>

                            <div className="missionaryLinkTextos">

                                <h3>
                                    Nossa Rede social
                                </h3>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="missionaryLinkCompartilhar"
                            onClick={(e) => {

                                e.preventDefault();

                                if (navigator.share) {

                                    navigator.share({

                                        title: "Missionary Store Brasil",

                                        text: "Acesse nossa loja oficial",

                                        url: "https://missionarystorebrasil.com/produtos/"
                                    });

                                } else {

                                    navigator.clipboard.writeText(
                                        "https://missionarystorebrasil.com/produtos/"
                                    );

                                    alert("Link copiado!");
                                }
                            }}
                        >

                            <div className="missionaryLinkCompartilharIcone">

                                <span></span>

                                <span></span>

                                <span></span>

                                <div className="missionaryLinkCompartilharLinha missionaryLinkCompartilharLinhaUm"></div>

                                <div className="missionaryLinkCompartilharLinha missionaryLinkCompartilharLinhaDois"></div>

                            </div>
                        </button>

                    </a>

                </div>
                <div className="missionaryLinkRodape">

                    <div className="missionaryLinkRodapeLinha"></div>

                    <p>
                        <img
                            src="https://www.missionarystorebrasil.com.br/assets/m-BFCE3fxv.png"
                            alt="Missionary Store Brasil"
                            style={{
                                width: "15px", borderRadius: "50%", marginRight: "5px"
                            }}
                        /> Missionary Store Brasil • Conectando missionários e famílias
                    </p>

                    <span>
                        © 2026 Todos os direitos reservados
                    </span>

                </div>
            </div>

        </div>
    );
}