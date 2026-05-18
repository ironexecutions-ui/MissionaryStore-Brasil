import React, { useState } from "react";

import Login from "./fases/login";
import Info from "./fases/infos";
import Compra from "./fases/compra";

export default function Cupons() {

    const [tela, setTela] = useState("login");

    return (
        <>
            {
                tela === "login" && (
                    <Login
                        irParaInfo={() => setTela("info")}
                    />
                )
            }

            {
                tela === "info" && (
                    <Info
                        irParaCompra={() => setTela("compra")}
                    />
                )
            }

            {
                tela === "compra" && (
                    <Compra />
                )
            }
        </>
    );
}