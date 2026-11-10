// Conecta la lógica (src/logic.js) con la página. Aquí sí hay DOM y localStorage.
import { APP_NAME } from "./logic.js";

const app = document.getElementById("app");
app.dataset.ready = "true";
document.title = APP_NAME;
