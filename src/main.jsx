import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <GoogleOAuthProvider clientId="337060969671-u0kvppbs1bpl70f0i4cefghb6ev7v157.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>

);