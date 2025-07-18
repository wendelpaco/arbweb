import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUIStore } from "../../stores/ui";
import {
  Home,
  Upload,
  BarChart3,
  History,
  Settings,
  HelpCircle,
  TrendingUp,
  BookOpen,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`sidebar-item w-full text-left ${isActive ? "active" : ""}`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: <Upload className="w-5 h-5" />,
      label: "Upload",
      href: "/upload",
    },
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
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Performance",
      href: "/performance",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Relatórios",
      href: "/reports",
    },
  ];

  const bottomMenuItems = [
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Configurações",
      href: "/settings",
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: "Ajuda",
      href: "/help",
    },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-gray-900">ArbWeb</h2>
            <p className="text-xs text-gray-500">Premium</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname === item.href}
              onClick={() => handleNavigation(item.href)}
            />
          ))}
        </nav>

        {/* Bottom menu */}
        <div className="px-4 py-6 border-t border-gray-200 space-y-2">
          {bottomMenuItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname === item.href}
              onClick={() => handleNavigation(item.href)}
            />
          ))}
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Usuário Premium
              </p>
              <p className="text-xs text-gray-500">Plano Ativo</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
