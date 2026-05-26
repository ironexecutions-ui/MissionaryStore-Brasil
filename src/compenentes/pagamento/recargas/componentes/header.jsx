// header.jsx

import React from "react";
import logo from "/m.png"
import {
    Mail,
    CalendarDays,
    UserRound
} from "lucide-react";

import "./header.css";

export default function Header({
    dadosMissionario
}) {

    return (

        <header className="voucherHeaderContainer">

            <div className="voucherHeaderGlow"></div>

            <div className="voucherHeaderCard">

                <div className="voucherHeaderTop">

                    <div className="voucherHeaderAvatar">

                        <img src={logo} alt="" />

                    </div>

                    <div className="voucherHeaderTituloArea">

                        <h1 className="voucherHeaderTitulo">
                            Missionary Profile
                        </h1>

                        <p className="voucherHeaderSubtitulo">
                            Información del misionero
                        </p>

                    </div>

                </div>

                <div className="voucherHeaderInfoGrid">

                    <div className="voucherHeaderInfoCard">

                        <div className="voucherHeaderIconeArea">

                            <UserRound
                                size={18}
                            />

                        </div>

                        <div className="voucherHeaderTextoArea">

                            <span className="voucherHeaderLabel">
                                Nombre
                            </span>

                            <span className="voucherHeaderValor">
                                {
                                    dadosMissionario?.nome ||
                                    "No informado"
                                }
                            </span>

                        </div>

                    </div>

                    <div className="voucherHeaderInfoCard">

                        <div className="voucherHeaderIconeArea">

                            <Mail
                                size={18}
                            />

                        </div>

                        <div className="voucherHeaderTextoArea">

                            <span className="voucherHeaderLabel">
                                Email
                            </span>

                            <span className="voucherHeaderValor">
                                {
                                    dadosMissionario?.email ||
                                    "No informado"
                                }
                            </span>

                        </div>

                    </div>

                    <div className="voucherHeaderInfoCard">

                        <div className="voucherHeaderIconeArea">

                            <CalendarDays
                                size={18}
                            />

                        </div>

                        <div className="voucherHeaderTextoArea">

                            <span className="voucherHeaderLabel">
                                Fecha final CTM
                            </span>

                            <span className="voucherHeaderValor">
                                {
                                    dadosMissionario?.data_fim ||
                                    "No informado"
                                }
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}