import React from "react";
import { createRoot } from "react-dom/client";
import LandingV2 from "./landing-v2";
import "./styles.css";

createRoot(document.getElementById("root")!).render(<React.StrictMode><LandingV2 /></React.StrictMode>);
