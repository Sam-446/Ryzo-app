import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Unregister any old service workers from previous builds
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => reg.unregister());
  });
}

createRoot(document.getElementById("root")!).render(<App />);
