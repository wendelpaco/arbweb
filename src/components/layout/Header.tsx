import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import {
  Bell,
  Settings,
  User,
  Menu,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { useUIStore } from "../../stores/ui";
import { useAuthStore } from "../../stores/auth";

export const Header: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fechar menu quando mudar de página
  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Mapeamento de rotas para títulos
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return { title: "Dashboard", subtitle: "Visão geral do sistema" };
      case "/upload":
        return { title: "Upload", subtitle: "Envie imagens para análise" };
      case "/analytics":
        return {
          title: "Analytics",
          subtitle: "Análise detalhada de performance e métricas",
        };
      case "/history":
        return {
          title: "Histórico",
          subtitle: "Timeline completo de arbitragens",
        };
      case "/performance":
        return {
          title: "Performance",
          subtitle: "Análise detalhada de performance e conquistas",
        };
      case "/reports":
        return {
          title: "Relatórios",
          subtitle: "Geração e gerenciamento de relatórios",
        };
      case "/settings":
        return {
          title: "Configurações",
          subtitle: "Gerencie suas preferências e configurações",
        };
      case "/help":
        return {
          title: "Central de Ajuda",
          subtitle: "Encontre respostas e suporte",
        };
      default:
        return { title: "Dashboard", subtitle: "Visão geral do sistema" };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between h-12">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                ArbWeb
              </h1>
              <p className="text-xs text-gray-500 leading-tight">
                Sistema de Arbitragem
              </p>
            </div>
          </div>
        </div>

        {/* Center - Page Title (hidden on mobile) */}
        <div className="hidden md:flex items-center justify-center flex-1 px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center space-x-3">
          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 px-3">
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3">
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Settings */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 pl-2 border-l border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="User menu"
              aria-expanded={userMenuOpen}
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  {user?.email || "usuario@exemplo.com"}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "usuario@exemplo.com"}
                  </p>
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <UserIcon className="w-4 h-4 mr-3" />
                    Meu Perfil
                  </button>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <Settings className="w-4 h-4 mr-3" />
                    Configurações
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Page Title */}
      <div className="md:hidden mt-3 text-center">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </header>
  );
};
