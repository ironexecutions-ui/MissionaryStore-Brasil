import React, { useState, useMemo } from "react";

import "./valor.css";

export default function Valor() {

    const [dolares, setDolares] = useState("");

    const resultado = useMemo(() => {

        const valorDolar = Number(
            String(dolares).replace(",", ".")
        );

        if (!valorDolar || valorDolar <= 0) {
            return null;
        }

        let cotacao = 3.8;

        if (valorDolar >= 50) {
            cotacao = 4.0;
        }

        else if (valorDolar >= 30) {
            cotacao = 3.9;
        }

        return (valorDolar * cotacao).toFixed(2);

    }, [dolares]);

    return (
        <div className="ganhosPagina">

            <div className="ganhosCardPrincipal">

                <h1 className="ganhosTitulo">
                    Conversor de Voucher
                </h1>

                <input
                    type="number"
                    placeholder="Digite os dólares"
                    value={dolares}
                    onChange={(e) => setDolares(e.target.value)}
                    className="ganhosInput"
                />

                {resultado && (

                    <h2 className="ganhosResultado">
                        Recebe: R$ {resultado}
                    </h2>

                )}

            </div>

        </div>
    );
}