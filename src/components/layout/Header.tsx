import React, { useState } from "react";
import {
  Home,
  Upload,
  BarChart3,
  History,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: <Home className="w-5 h-5" />, label: "Dashboard", href: "/" },
  { icon: <Upload className="w-5 h-5" />, label: "Upload", href: "/upload" },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Analytics",
    href: "/analytics",
  },
  {
    icon: <History className="w-5 h-5" />,
    label: "Histórico",
    href: "/history",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Relatórios",
    href: "/reports",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Configurações",
    href: "/settings",
  },
  { icon: <HelpCircle className="w-5 h-5" />, label: "Ajuda", href: "/help" },
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-lg border-b border-zinc-200 dark:border-zinc-800",
        "transition-all duration-300"
      )}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="text-primary text-2xl font-bold tracking-tight">
            ArbWeb
          </span>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition font-medium text-sm"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-primary" />
          ) : (
            <Menu className="w-5 h-5 text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-lg">
          <nav className="px-6 py-4 space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-all duration-200 font-medium"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
