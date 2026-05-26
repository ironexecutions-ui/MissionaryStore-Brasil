import React from "react";

import Mensagem from "./componentes/mensagem";
import Rodape from "./componentes/rodape";

import "./pagamentos.css";

export default function Pagamentos() {

    const irParaRecarga = () => {

        window.location.href =
            "/creditos-missionary-store/recarga";
    };

    return (

        <div className="pagamentosPaginaContainer">

            <div className="pagamentosConteudoWrapper">

                <Mensagem />
                <br /><br />
                <div className="pagamentosBotaoArea">

                    <button
                        className="pagamentosBotaoRecarga"
                        onClick={irParaRecarga}
                    >

                        <span className="pagamentosBotaoMiniTexto">
                            Missionary Voucher
                        </span>

                        <span className="pagamentosBotaoTexto">

                            Recargar

                        </span>

                        <span className="pagamentosBotaoSubTexto">

                            Rápido, seguro y práctico

                        </span>

                        {/* MOBILE */}


                    </button>

                </div>
            </div>
            <br /><br />
            <Rodape />

        </div>
    );
}