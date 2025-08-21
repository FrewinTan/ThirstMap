import { registerSW } from "virtual:pwa-register"
registerSW({immediate: true})

import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
      <App />
			<Analytics/>
      <SpeedInsights />
    </BrowserRouter>
);
