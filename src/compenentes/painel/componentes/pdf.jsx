import React from "react";

import { API_URL } from "../../../config";

export default function Pdf({

    nome,

    email,

    codigo,

    senha,

    idioma,

    saldo

}) {

    const idiomaFinal =
        idioma || "espanhol";

    // =====================================
    // BAIXAR TERMOS + VOUCHER
    // =====================================

    async function baixarDocumentos() {

        try {

            const urlTermos =
                `${API_URL}/pdf/termos`
                + `?idioma=${encodeURIComponent(idiomaFinal)}`
                + `&nome=${encodeURIComponent(nome)}`
                + `&codigo=${encodeURIComponent(codigo)}`
                + `&pin=${encodeURIComponent(senha)}`
                + `&saldo=${encodeURIComponent(saldo)}`;

            window.open(
                urlTermos,
                "_blank"
            );

            setTimeout(() => {

                baixarVoucher();

            }, 1000);

        } catch (erro) {

            console.log(
                "Erro PDFs:",
                erro
            );

        }
    }

    // =====================================
    // BAIXAR SOMENTE VOUCHER
    // =====================================

    async function baixarVoucher() {

        try {

            const urlVoucher =
                `${API_URL}/pdf/voucher`
                + `?idioma=${encodeURIComponent(idiomaFinal)}`
                + `&nome=${encodeURIComponent(nome)}`
                + `&email=${encodeURIComponent(email)}`
                + `&codigo=${encodeURIComponent(codigo)}`
                + `&pin=${encodeURIComponent(senha)}`
                + `&saldo=${encodeURIComponent(saldo)}`;

            window.open(
                urlVoucher,
                "_blank"
            );

        } catch (erro) {

            console.log(
                "Erro Voucher:",
                erro
            );

        }
    }

    return {

        baixarDocumentos,

        baixarVoucher
    };
}