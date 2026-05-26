import React, {
    useState
} from "react";
import "./recargas.css"
import Fase1 from "./componentes/fase1";
import Fase2 from "./componentes/fase2";
import Fase3 from "./componentes/fase3";
import Fase5 from "./componentes/fase5";

export default function Recargas() {

    const [faseAtual, setFaseAtual] =
        useState(1);

    const [dadosMissionario, setDadosMissionario] =
        useState(null);

    return (

        <div className="recargasPaginaContainer">

            {
                faseAtual === 1 && (

                    <Fase1
                        setFaseAtual={
                            setFaseAtual
                        }
                        setDadosMissionario={
                            setDadosMissionario
                        }
                        dadosMissionario={
                            dadosMissionario
                        }
                    />
                )
            }

            {
                faseAtual === 2 && (

                    <Fase2
                        dadosMissionario={
                            dadosMissionario
                        }
                        setFaseAtual={
                            setFaseAtual
                        }
                    />
                )
            }

            {
                faseAtual === 3 && (

                    <Fase3
                        dadosMissionario={
                            dadosMissionario
                        }

                        setFaseAtual={
                            setFaseAtual
                        }
                    />
                )
            }

            {
                faseAtual === 4 && (

                    <Fase5
                        dadosMissionario={
                            dadosMissionario
                        }
                    />
                )
            }

        </div>
    );
}