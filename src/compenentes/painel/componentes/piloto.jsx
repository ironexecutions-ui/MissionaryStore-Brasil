import React, { useState } from "react";
import "./piloto.css"
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function Piloto() {

    const [codigo, setCodigo] = useState("");

    const [dados, setDados] = useState(null);

    const [valor, setValor] = useState("");

    const [local, setLocal] = useState("");

    const [senha, setSenha] = useState("");
    const [tipoLeitor, setTipoLeitor] = useState("");

    const [abrirCamera, setAbrirCamera] = useState(false);
    const [erro, setErro] = useState("");

    const [mensagem, setMensagem] = useState("");

    const [loading, setLoading] = useState(false);

    const [abrirModalSenha, setAbrirModalSenha] = useState(false);
    const [erroSenha, setErroSenha] = useState("");
    async function buscarCupom(codigoDigitado) {

        setCodigo(codigoDigitado);

        setErro("");

        setMensagem("");

        if (!codigoDigitado) {

            setDados(null);

            return;
        }

        try {

            const resp = await fetch(
                `http://localhost:8888/piloto/buscar/${codigoDigitado}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await resp.json();

            if (!resp.ok) {

                setErro(data.detail || "Erro");

                setDados(null);

                return;
            }

            setDados(data);

        } catch {

            setErro("Erro ao buscar");

            setDados(null);
        }
    }
    useEffect(() => {

        if (!abrirCamera) return;

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: 250,
                aspectRatio: 1
            },
            false
        );

        scanner.render(
            async (decodedText) => {

                try {

                    await buscarCupom(
                        decodedText
                    );

                    setCodigo(
                        decodedText
                    );

                    setAbrirCamera(false);

                    scanner.clear();

                } catch (err) {

                    console.log(err);
                }

            },
            () => { }
        );

        return () => {

            scanner.clear().catch(() => { });

        };

    }, [abrirCamera]);
    function abrirConfirmacao() {

        setMensagem("");

        setErroSenha("");

        if (!valor || !local) {

            setMensagem("Preencha os campos");

            return;
        }

        setAbrirModalSenha(true);
    }

    async function retirarSaldo() {

        if (!senha) {

            setErroSenha(
                "Digite a senha"
            );

            return;
        }

        setLoading(true);

        try {

            const resp = await fetch(
                "http://localhost:8888/piloto/retirar",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },

                    body: JSON.stringify({
                        codigo,
                        valor,
                        local,
                        senha
                    })
                }
            );

            const data = await resp.json();

            if (!resp.ok) {

                setErroSenha(
                    data.detail || "Erro"
                );

                setLoading(false);

                return;
            }

            setDados((prev) => ({
                ...prev,
                saldo: data.saldo
            }));

            setValor("");

            setSenha("");

            setAbrirModalSenha(false);

            setMensagem(
                "Retirada realizada com sucesso"
            );

        } catch {

            setErroSenha(
                "Erro ao retirar saldo"
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="pilotoContainerUnico">
            <div className="pilotoBotoesScannerUnico">

                <button
                    className={
                        `
            pilotoScannerBotaoUnico
            ${tipoLeitor === "qrcode"
                            ? "pilotoScannerAtivoUnico"
                            : ""
                        }
            `
                    }
                    onClick={() => {

                        setTipoLeitor("qrcode");

                        setAbrirCamera(true);
                    }}
                >
                    QR Code
                </button>

                <button
                    className={
                        `
            pilotoScannerBotaoUnico
            ${tipoLeitor === "barcode"
                            ? "pilotoScannerAtivoUnico"
                            : ""
                        }
            `
                    }
                    onClick={() => {

                        setTipoLeitor("barcode");

                        setAbrirCamera(true);
                    }}
                >
                    Código de Barras
                </button>

            </div>
            <h1 className="pilotoTituloUnico">
                Piloto
            </h1>

            <input
                className={
                    `
        pilotoInputCodigoUnico
        pilotoInputCodigoProtegidoUnico
        ${dados
                        ? "pilotoInputCodigoOcultoUnico"
                        : ""
                    }
        `
                }
                placeholder="Código"
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={codigo}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onSelect={(e) => {
                    window.getSelection()?.removeAllRanges();
                }}
                onKeyDown={(e) => {

                    if (
                        (e.ctrlKey && e.key.toLowerCase() === "c") ||
                        (e.ctrlKey && e.key.toLowerCase() === "x") ||
                        (e.ctrlKey && e.key.toLowerCase() === "a")
                    ) {
                        e.preventDefault();
                    }
                }}
                onChange={(e) =>
                    buscarCupom(
                        e.target.value
                    )
                }
            />

            {
                erro && (
                    <div className="pilotoErroUnico">
                        {erro}
                    </div>
                )
            }
            {
                abrirCamera && (
                    <div className="pilotoCameraAreaUnico">

                        <div
                            id="reader"
                            className="pilotoReaderUnico"
                        />

                    </div>
                )
            }
            {
                dados && (
                    <div className="pilotoCardUnico">

                        <h2 className="pilotoNomeUnico">
                            {dados.nome}
                        </h2>

                        <p className="pilotoTextoUnico">
                            Email: {dados.email}
                        </p>

                        <p className="pilotoTextoUnico">
                            Data fim: {dados.data_fim}
                        </p>

                        {
                            dados.expirado && (
                                <p className="pilotoExpiradoUnico">
                                    Voucher expirado
                                </p>
                            )
                        }

                        <p className="pilotoSaldoUnico">
                            Saldo: R$ {
                                Number(
                                    dados.saldo
                                ).toFixed(2)
                            }
                        </p>

                        <div className="pilotoAreaRetiradaUnico">

                            <input
                                className="pilotoInputValorUnico"
                                placeholder="Valor"
                                type="number"
                                value={valor}
                                onChange={(e) =>
                                    setValor(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                className="pilotoInputLocalUnico"
                                placeholder="Local"
                                list="locais"
                                value={local}
                                onChange={(e) =>
                                    setLocal(
                                        e.target.value
                                    )
                                }
                            />

                            <datalist id="locais">
                                {
                                    dados.locais.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <option
                                                key={index}
                                                value={item}
                                            />
                                        )
                                    )
                                }
                            </datalist>

                            <button
                                className="pilotoBotaoUnico"
                                onClick={abrirConfirmacao}
                                disabled={loading}
                            >
                                {
                                    loading
                                        ? "Enviando..."
                                        : "Enviar"
                                }
                            </button>

                            {
                                mensagem && (
                                    <p className="pilotoMensagemUnica">
                                        {mensagem}
                                    </p>
                                )
                            }

                        </div>

                    </div>
                )
            }

            {
                abrirModalSenha && (
                    <div className="pilotoModalOverlayUnico">

                        <div className="pilotoModalUnico">

                            <h2 className="pilotoModalTituloUnico">
                                Senha do Missionário
                            </h2>

                            <div
                                className="pilotoSenhaQuadradosUnico"
                                onClick={() => {
                                    document
                                        .getElementById(
                                            "pilotoSenhaInputReal"
                                        )
                                        ?.focus();
                                }}
                            >

                                {[0, 1, 2, 3].map((index) => (

                                    <div
                                        key={index}
                                        className={
                                            `
                pilotoSenhaQuadradoUnico
                ${senha.length === index
                                                ? "pilotoSenhaQuadradoAtivoUnico"
                                                : ""
                                            }
                `
                                        }
                                    >
                                        {
                                            senha[index]
                                                ? "*"
                                                : ""
                                        }
                                    </div>

                                ))}

                            </div>

                            <input
                                id="pilotoSenhaInputReal"
                                className="pilotoSenhaInputEscondidoUnico"
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                value={senha}
                                onChange={(e) => {

                                    const valor =
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 4);

                                    setSenha(valor);

                                    setErroSenha("");
                                }}
                            />

                            {
                                erroSenha && (
                                    <p className="pilotoErroSenhaModalUnico">
                                        {erroSenha}
                                    </p>
                                )
                            }
                            <div className="pilotoModalBotoesUnico">

                                <button
                                    className="pilotoCancelarUnico"
                                    onClick={() => {
                                        setAbrirModalSenha(false);
                                        setSenha("");
                                    }}
                                >
                                    Cancelar
                                </button>

                                <button
                                    className="pilotoConfirmarUnico"
                                    onClick={retirarSaldo}
                                >
                                    Confirmar
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }

        </div>
    );
}