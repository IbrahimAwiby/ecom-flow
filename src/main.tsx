import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme from localStorage on app load
const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const theme = storedTheme || (prefersDark ? "dark" : "light");
document.documentElement.classList.add(theme);

createRoot(document.getElementById("root")!).render(<App />);
