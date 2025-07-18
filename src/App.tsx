import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { useUIStore } from "./stores/ui";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Upload } from "./pages/Upload";
import { Analytics } from "./pages/Analytics";
import { History } from "./pages/History";
import { Performance } from "./pages/Performance";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Help } from "./pages/Help";
import { initializeSampleData } from "./utils/sampleData";

const App: React.FC = () => {
  const { theme } = useUIStore();

  useEffect(() => {
    // Inicializa dados de exemplo se não existirem
    initializeSampleData();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else if (theme === "auto") {
      // Seguir o sistema operacional
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      // Atualizar ao mudar o sistema
      const handler = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<History />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
