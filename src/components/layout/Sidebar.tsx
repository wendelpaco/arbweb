import React from "react";
import {
  Home,
  Upload,
  BarChart3,
  History,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUIStore } from "../../stores/ui";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";

const menuItems = [
  { icon: <Home className="w-6 h-6" />, label: "Dashboard", href: "/" },
  { icon: <Upload className="w-6 h-6" />, label: "Upload", href: "/upload" },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    label: "Analytics",
    href: "/analytics",
  },
  {
    icon: <History className="w-6 h-6" />,
    label: "Histórico",
    href: "/history",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    label: "Relatórios",
    href: "/reports",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    label: "Configurações",
    href: "/settings",
  },
  { icon: <HelpCircle className="w-6 h-6" />, label: "Ajuda", href: "/help" },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <TooltipProvider>
      {/* Overlay para mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
          aria-label="Fechar menu"
        />
      )}
      <aside
        className={`fixed md:static z-50 h-full bg-zinc-900/95 border-r border-zinc-800 backdrop-blur-lg flex flex-col shadow-xl transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
        aria-label="Sidebar de navegação"
      >
        <div className="flex items-center justify-between px-4 py-6">
          <span className="text-primary text-2xl font-bold tracking-tight">
            A
          </span>
          <button
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Recolher sidebar" : "Expandir sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-6 h-6 text-zinc-400" />
            ) : (
              <Menu className="w-6 h-6 text-zinc-400" />
            )}
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-2 mt-4 items-center md:items-stretch">
          {menuItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-200 hover:bg-zinc-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    sidebarOpen ? "justify-start w-full" : "justify-center w-12"
                  }`}
                  tabIndex={0}
                  aria-label={item.label}
                >
                  {item.icon}
                  {sidebarOpen && (
                    <span className="ml-3 text-base font-medium text-zinc-100 group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                  )}
                </a>
              </TooltipTrigger>
              {!sidebarOpen && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
        <div className="flex items-center justify-center py-4">
          <button
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Recolher sidebar" : "Expandir sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-zinc-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
};
