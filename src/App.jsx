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
import Inicio from "../site/inicio";
import Perfil from "../site/perfil/perfil";
import Aprovacao from "../site/perfil/aprovacao";
import AprovacaoAdmin from "../site/perfil/aprovacao_admin";
import Compra from "../site/perfil/pagamento/compra";









export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/compras"
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
        <Route
          path="/instrutores"
          element={<Inicio />}
        />
        <Route
          path="/perfil/instrutores"
          element={<Perfil />}
        />

        <Route
          path="/perfil/instrutores/aprovacao"
          element={<Aprovacao />}
        />
        <Route
          path="/aprovacao/:id"
          element={
            <AprovacaoAdmin />
          }
        />
        <Route
          path="/compra/:id"
          element={
            <Compra />
          }
        />


      </Routes>

    </BrowserRouter>
  );
}