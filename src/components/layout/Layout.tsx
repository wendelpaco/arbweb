import React from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Header />
      <main className="flex-1 pt-24 md:pt-28 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto space-y-6 text-zinc-900 dark:text-zinc-100">
        {children}
      </main>
    </div>
  );
};
