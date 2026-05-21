import React, { useState } from "react";
import "./piloto.css"
import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";
import { API_URL } from "../../../config";
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
    const [processandoLeitura, setProcessandoLeitura] = useState(false);
    const [pagamentoAprovado, setPagamentoAprovado] = useState(false);
    const [valorPagamento, setValorPagamento] = useState("");
    const [novoSaldo, setNovoSaldo] = useState(null);
    const tokenSistema =
        localStorage.getItem("token")
        ||
        localStorage.getItem("token_loja");
    const dadosLoja = JSON.parse(
        localStorage.getItem(
            "dados_loja"
        ) || "{}"
    );
    useEffect(() => {

        const estaEmParceria =
            window.location.pathname.includes(
                "/parceria"
            );

        if (
            estaEmParceria
            &&
            dadosLoja?.nome
        ) {

            setLocal(
                dadosLoja.nome
            );
        }

    }, []);
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
                `${API_URL}/piloto/buscar/${codigoDigitado}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenSistema}`
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

        let html5QrCode;

        let cameraAtiva = false;

        async function iniciarCamera() {

            try {

                html5QrCode = new Html5Qrcode(
                    "reader"
                );

                const cameras =
                    await Html5Qrcode.getCameras();

                if (!cameras.length) {

                    setErro(
                        "Nenhuma câmera encontrada"
                    );

                    return;
                }

                let cameraTraseira =
                    cameras.find((camera) =>
                        camera.label
                            .toLowerCase()
                            .includes("back")
                    );

                if (!cameraTraseira) {

                    cameraTraseira =
                        cameras[cameras.length - 1];
                }

                await html5QrCode.start(
                    {
                        facingMode: "environment"
                    },
                    {
                        fps: 10,

                        qrbox: {
                            width: 280,
                            height: 280
                        },

                        aspectRatio: 1,

                        disableFlip: false
                    },

                    async (decodedText) => {

                        if (
                            !cameraAtiva ||
                            processandoLeitura
                        ) return;

                        setProcessandoLeitura(true);

                        cameraAtiva = false;

                        try {

                            if (
                                html5QrCode &&
                                html5QrCode.isScanning
                            ) {

                                await html5QrCode.stop();
                            }

                            setAbrirCamera(false);

                            setCodigo(decodedText);

                            await buscarCupom(
                                decodedText
                            );

                        } catch (err) {

                            console.log(err);

                            setErro(
                                "Erro ao buscar código"
                            );

                        } finally {

                            setTimeout(() => {

                                setProcessandoLeitura(false);

                            }, 1500);
                        }
                    },

                    () => { }
                );

                cameraAtiva = true;

            } catch (err) {

                console.log(err);

                setErro(
                    "Erro ao abrir câmera"
                );
            }
        }

        iniciarCamera();

        return () => {

            async function limpar() {

                try {

                    if (
                        html5QrCode &&
                        html5QrCode.isScanning
                    ) {

                        await html5QrCode.stop();
                    }

                } catch {

                }
            }

            limpar();
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
    useEffect(() => {

        if (abrirModalSenha) {

            setTimeout(() => {

                document
                    .getElementById(
                        "pilotoSenhaInputReal"
                    )
                    ?.focus();

            }, 100);
        }

    }, [abrirModalSenha]);
    async function retirarSaldo(
        senhaManual = senha
    ) {
        if (loading) return;

        if (!senha) {

            setErroSenha(
                "Digite a senha"
            );

            return;
        }

        setLoading(true);

        try {

            const resp = await fetch(
                `${API_URL}/piloto/retirar`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenSistema}`
                    },

                    body: JSON.stringify({
                        codigo,
                        valor,
                        local,
                        senha: senhaManual
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

            setNovoSaldo(data.saldo);

            setValorPagamento(valor);

            setPagamentoAprovado(true);

            setSenha("");

            setValor("");

        } catch {

            setErroSenha(
                "Erro ao retirar saldo"
            );

        } finally {

            setLoading(false);
        }
    }
    const saldoAtual = Number(
        dados?.saldo || 0
    );

    const valorNumerico = Number(
        valor || 0
    );

    const valorMaiorQueSaldo =
        valorNumerico > saldoAtual;

    const textoBotaoRetirada =
        valorMaiorQueSaldo
            ? "Saldo insuficiente"
            : loading
                ? "Processando..."
                : "Confirmar retirada";
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

                        setErro("");

                        setDados(null);

                        setCodigo("");

                        setProcessandoLeitura(false);

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

                        setErro("");

                        setDados(null);

                        setCodigo("");

                        setProcessandoLeitura(false);

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
                                className={
                                    `
        pilotoInputValorUnico
        ${valorMaiorQueSaldo
                                        ? "pilotoInputValorErroUnico"
                                        : ""
                                    }
        `
                                }
                                placeholder="0.00"
                                inputMode="numeric"
                                value={valor}
                                onChange={(e) => {

                                    const apenasNumeros =
                                        e.target.value.replace(/\D/g, "");

                                    const valorFormatado = (
                                        Number(apenasNumeros || 0) / 100
                                    ).toFixed(2);

                                    setValor(valorFormatado);
                                }}
                            />

                            {
                                valorMaiorQueSaldo && (
                                    <p className="pilotoAvisoSaldoUnico">
                                        O valor informado excede o saldo disponível
                                    </p>
                                )
                            }

                            {
                                localStorage.getItem("token")
                                    ? (
                                        <>
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
                                        </>
                                    )
                                    : (
                                        <input
                                            className="pilotoInputLocalUnico"
                                            value={local}
                                            readOnly
                                        />
                                    )
                            }

                            <button
                                className={
                                    `
            pilotoBotaoUnico
            ${valorMaiorQueSaldo
                                        ? "pilotoBotaoDesabilitadoUnico"
                                        : ""
                                    }
            `
                                }
                                onClick={abrirConfirmacao}
                                disabled={
                                    loading ||
                                    valorMaiorQueSaldo
                                }
                            >
                                {textoBotaoRetirada}
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
                            <p className="pilotoValorPagamentoUnico">
                                Valor da retirada
                            </p>

                            <h3 className="pilotoValorDestaqueUnico">
                                R$ {
                                    Number(
                                        pagamentoAprovado
                                            ? valorPagamento
                                            : valor
                                    ).toFixed(2)
                                }                            </h3>
                            {
                                pagamentoAprovado ? (
                                    <div className="pilotoPagamentoAprovadoAreaUnico">

                                        <div className="pilotoPagamentoCheckUnico">
                                            ✓
                                        </div>

                                        <h3 className="pilotoPagamentoTituloUnico">
                                            Pagamento aprovado
                                        </h3>


                                        <div className="pilotoNovoSaldoBoxUnico">

                                            <span className="pilotoNovoSaldoLabelUnico">
                                                Novo saldo
                                            </span>

                                            <strong className="pilotoNovoSaldoValorUnico">
                                                R$ {Number(novoSaldo || 0).toFixed(2)}
                                            </strong>

                                        </div>

                                        <button
                                            className="pilotoConfirmarUnico"
                                            onClick={() => {

                                                setAbrirModalSenha(false);

                                                setPagamentoAprovado(false);

                                                setNovoSaldo(null);

                                                setCodigo("");

                                                setDados(null);

                                                setValor("");

                                                setValorPagamento("");

                                                setErro("");

                                                setMensagem("");
                                            }}
                                        >
                                            Finalizar
                                        </button>

                                    </div>
                                ) : (
                                    <>
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

                                                const valorDigitado =
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 4);

                                                setSenha(valorDigitado);

                                                setErroSenha("");

                                                if (valorDigitado.length === 4) {

                                                    setTimeout(() => {

                                                        retirarSaldo(valorDigitado);
                                                    }, 150);
                                                }
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



                                        </div>
                                    </>
                                )
                            }



                        </div>

                    </div>
                )
            }

        </div>
    );
}