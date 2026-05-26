import React from "react";

import "./mensagem.css";
import logo from "/m.png"
export default function Mensagem() {

    return (

        <div className="missionaryMensajeContainer">

            <div className="missionaryMensajeGlow"></div>
            <img src={logo} alt="" />
            <h1 className="missionaryMensajeTitulo">
                Missionary Voucher
            </h1>

            <p className="missionaryMensajeTexto">

                Al ser llamados como Representantes de Jesucristo,
                los misioneros que llegan al CTM Brasil tienen un día
                a la semana para realizar compras y actividades
                necesarias fuera del CTM. Sin embargo, muchos
                terminan perdiendo parte del dinero enviado por sus
                familias incluso antes de utilizarlo, debido a los
                cambios de moneda, comisiones internacionales y
                tarifas bancarias.

                En muchos casos, el dinero necesita ser convertido
                de la moneda local a dólares  y después nuevamente a
                reales brasileños, generando pérdidas importantes
                durante el proceso.

            </p>

            <p className="missionaryMensajeTexto">

                Con el sistema de créditos de
                <span className="missionaryMensajeDestaque">
                    {" "}Missionary Store Brasil
                </span>
                , los misioneros pueden recibir créditos digitales de
                una manera más práctica, rápida y económica.

            </p>

            <p className="missionaryMensajeTexto">

                Pagando solamente una tarifa aproximada del 15%,
                el valor es convertido en créditos de
                <span className="missionaryMensajeDestaque">
                    {" "}Missionary Voucher
                </span>
                , permitiendo utilizar esos créditos en tiendas
                asociadas cercanas al CTM, como
                <span className="missionaryMensajeDestaque">
                    {" "}Missionary Store Brasil
                </span>
                {" "}y
                <span className="missionaryMensajeDestaque">
                    {" "}Milk Shake Up
                </span>
                .

            </p>

            <p className="missionaryMensajeTexto">

                Además de ayudar económicamente, el sistema también
                mejora la seguridad de los misioneros durante las
                salidas, ya que evita que necesiten llevar dinero en
                efectivo mientras visitan tiendas y restaurantes.

            </p>

            <p className="missionaryMensajeTexto">

                Cada semana, el misionero recibe correos electrónicos
                completos con el historial actualizado de movimientos,
                saldo disponible y toda la información de su
                Missionary Voucher, ofreciendo más control,
                transparencia y tranquilidad para las familias.

            </p>

            <p className="missionaryMensajeTexto">

                De esta manera, los misioneros pueden aprovechar
                mejor el dinero enviado por sus familias, reduciendo
                pérdidas por conversiones y facilitando compras
                durante su tiempo en el CTM.

            </p>

            <div className="missionaryMensajeInformacionExtra">

                <h2 className="missionaryMensajeSubTitulo">

                    ¿Quién puede realizar la recarga?

                </h2>

                <p className="missionaryMensajeTexto">

                    Las recargas pueden ser realizadas tanto por
                    familiares y amigos del misionero como también
                    por el propio misionero antes de llegar al CTM
                    Brasil.

                </p>

                <p className="missionaryMensajeTexto">

                    Esto permite que el misionero llegue al CTM
                    ya con créditos disponibles en su
                    <span className="missionaryMensajeDestaque">
                        {" "}Missionary Voucher
                    </span>
                    , facilitando compras en su maravillosa salida de Pday.

                </p>

                <div className="missionaryMensajeVantagens">

                    <div className="missionaryMensajeVantagemItem">
                        ✅ Recargas internacionales
                    </div>

                    <div className="missionaryMensajeVantagemItem">
                        ✅ Créditos disponibles rápidamente
                    </div>

                    <div className="missionaryMensajeVantagemItem">
                        ✅ Más seguridad para el misionero
                    </div>

                    <div className="missionaryMensajeVantagemItem">
                        ✅ Menos pérdidas por conversión
                    </div>

                </div>

            </div>

        </div>
    );
}