import React from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Cupons from "./compenentes/cupons/cupons";

import Painel from "./compenentes/painel/painel";

import Tudo from "./compenentes/painel/componentes/tudo";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/compra"
          element={<Cupons />}
        />

        <Route
          path="/painel"
          element={<Painel />}
        />

        <Route
          path="/painel/cadastro"
          element={<Tudo />}
        />

        <Route
          path="/painel/lista"
          element={<Tudo />}
        />

        <Route
          path="/painel/piloto"
          element={<Tudo />}
        />

        <Route
          path="/painel/historico"
          element={<Tudo />}
        />

        <Route
          path="/painel/ganhos"
          element={<Tudo />}
        />

        <Route
          path="/painel/valor"
          element={<Tudo />}
        />

      </Routes>

    </BrowserRouter>
  );
}