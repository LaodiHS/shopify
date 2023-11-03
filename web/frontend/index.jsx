import {render} from "react-dom";

import App from "./App";
import { initI18n } from "./utils/i18nUtils";

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
  render(<App />, document.getElementById("app"));
});
