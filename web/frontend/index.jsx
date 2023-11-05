import { createRoot} from "react-dom/client";

import App from "./App";
import { initI18n } from "./utils/i18nUtils";
const container = document.getElementById("app")
// Ensure that locales are loaded before rendering the app
initI18n().then(() => {

const root = createRoot(container)
 root.render(<App />);
});
 