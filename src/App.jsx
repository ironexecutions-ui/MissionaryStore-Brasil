import React from "react";
import "./app.css"
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Lojascadastradas from "./compenentes/lojas/lojas";
import Cupons from "./compenentes/cupons/cupons";
import Pagamentos from "./compenentes/pagamento/pagamento";
import Painel from "./compenentes/painel/painel";
import Link from "./compenentes/link/link";
import Tudo from "./compenentes/painel/componentes/tudo";
import Recargas from "./compenentes/pagamento/recargas/recargas";
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
        <Route
          path="/painel/lojas"
          element={<Tudo />}
        />  <Route
          path="/painel/fechados"
          element={<Tudo />}
        />
        <Route
          path="/parceria"
          element={<Lojascadastradas />}
        />
        <Route
          path="/path"
          element={<Link />}
        />
        <Route
          path="/creditos-missionary-store"
          element={<Pagamentos />}
        />
        <Route
          path="/creditos-missionary-store/recarga"
          element={<Recargas />}
        />
      </Routes>

    </BrowserRouter>
  );
}