import { Provider } from "./components/ui/provider";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { defaultSystem } from "@chakra-ui/react";

//import createSystem
//const system = createSystem(defaultConfig, { preflight: false });
//npm uninstall @chakra-ui/icons

ReactDOM.createRoot(document.getElementById("root")!).render(
	<Provider>
		<App />
	</Provider>
);
