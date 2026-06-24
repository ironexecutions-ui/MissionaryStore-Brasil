import React from "react";

import "./sucesso.css";

export default function Sucesso() {

    return (

        <div
            className="sucessoContainer"
        >

            <div
                className="sucessoCard"
            >

                <div
                    className="sucessoIcone"
                >
                    ✓
                </div>

                <h1
                    className="sucessoTitulo"
                >
                    Compra Realizada
                </h1>

                <p
                    className="sucessoTexto"
                >
                    Sua compra foi aprovada
                    com sucesso e os créditos
                    foram processados.
                </p>

            </div>

        </div>

    );

}