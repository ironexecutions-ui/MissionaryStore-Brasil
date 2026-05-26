// fase2.jsx

import React, {
    useState
} from "react";

import Header from "./header";

import "./fase2.css";

export default function Fase2({
    dadosMissionario,
    setFaseAtual
}) {

    const [aceitou, setAceitou] =
        useState(false);

    const [carregando, setCarregando] =
        useState(false);

    async function aceitarTermos() {

        try {

            setCarregando(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            const resposta =
                await fetch(
                    "http://localhost:8888/cupons/aceitar-termos",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            id_cupons:
                                dadosMissionario.id,

                            termos: 1
                        })
                    }
                );

            const dados =
                await resposta.json();

            if (!resposta.ok) {

                alert(
                    dados.detail ||
                    "Error al aceptar términos"
                );

                return;
            }
            dadosMissionario.aceitou_termos = true;
            setFaseAtual(3);

        } catch (erro) {

            console.log(erro);

            alert(
                "Error al aceptar términos"
            );

        } finally {

            setCarregando(false);
        }
    }

    return (

        <div className="fase2Container">

            <Header
                dadosMissionario={
                    dadosMissionario
                }
            />

            <div className="fase2Card">

                <h1 className="fase2Titulo">
                    Términos y Condiciones
                </h1>

                <p className="fase2Descricao">
                    Antes de continuar, es necesario
                    aceptar los términos y condiciones
                    del Missionary Voucher.
                </p>

                <div className="fase2TermosBox">

                    <p className="fase2TermoItem">
                        • El crédito misionero es
                        exclusivamente para consumo
                        en establecimientos asociados
                        al Missionary Voucher.
                    </p>

                    <p className="fase2TermoItem">
                        • El voucher es personal e
                        intransferible, y solamente el
                        misionero registrado puede
                        utilizarlo.
                    </p>

                    <p className="fase2TermoItem">
                        • El saldo disponible no puede
                        ser retirado en efectivo ni
                        transferido a otras personas.
                    </p>

                    <p className="fase2TermoItem">
                        • El PIN de acceso debe
                        mantenerse seguro y no debe
                        compartirse con terceros.
                    </p>

                    <p className="fase2TermoItem">
                        • Todas las transacciones,
                        accesos y movimientos pueden
                        ser registrados y auditados
                        por motivos de seguridad.
                    </p>

                    <p className="fase2TermoItem">
                        • El uso indebido del voucher
                        puede ocasionar bloqueo
                        temporal o permanente del
                        acceso.
                    </p>

                    <p className="fase2TermoItem">
                        • El Missionary Voucher fue
                        desarrollado para facilitar las
                        compras y mejorar la seguridad
                        de los misioneros durante su
                        permanencia en el CTM Brasil.
                    </p>

                </div>

                <label className="fase2CheckboxArea">

                    <input
                        type="checkbox"
                        checked={aceitou}
                        onChange={(e) =>
                            setAceitou(
                                e.target.checked
                            )
                        }
                    />

                    <span>
                        Acepto los términos y
                        condiciones
                    </span>

                </label>

                <button
                    className="fase2BotaoAceitar"
                    disabled={
                        !aceitou ||
                        carregando
                    }
                    onClick={aceitarTermos}
                >

                    {
                        carregando
                            ? "Procesando..."
                            : "Aceptar Términos"
                    }

                </button>

            </div>

        </div>
    );
}