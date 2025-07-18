import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useArbitrageStore } from "../stores/arbitrage";
import { useUIStore } from "../stores/ui";
import { Toast } from "../components/ui/Toast";
import { initializeSampleData } from "../utils/sampleData";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
} from "lucide-react";

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const tabs = [
    { id: "profile", label: "Perfil", icon: <User className="w-4 h-4" /> },
    {
      id: "notifications",
      label: "Notificações",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "security",
      label: "Segurança",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "appearance",
      label: "Aparência",
      icon: <Palette className="w-4 h-4" />,
    },
    { id: "data", label: "Dados", icon: <Database className="w-4 h-4" /> },
    {
      id: "integrations",
      label: "Integrações",
      icon: <Globe className="w-4 h-4" />,
    },
  ];

  const notificationSettings = [
    {
      id: "email",
      title: "Notificações por Email",
      description: "Receba alertas importantes por email",
      enabled: true,
    },
    {
      id: "push",
      title: "Notificações Push",
      description: "Receba notificações em tempo real",
      enabled: true,
    },
    {
      id: "arbitrage",
      title: "Novas Arbitragens",
      description: "Alertas quando encontrar novas oportunidades",
      enabled: true,
    },
    {
      id: "profit",
      title: "Alertas de Lucro",
      description: "Notificações quando atingir metas de lucro",
      enabled: false,
    },
    {
      id: "reports",
      title: "Relatórios Automáticos",
      description: "Receba relatórios programados",
      enabled: true,
    },
  ];

  const securitySettings = [
    {
      id: "2fa",
      title: "Autenticação de Dois Fatores",
      description: "Adicione uma camada extra de segurança",
      enabled: false,
    },
    {
      id: "session",
      title: "Sessões Ativas",
      description: "Gerencie suas sessões ativas",
      enabled: true,
    },
    {
      id: "password",
      title: "Alterar Senha",
      description: "Atualize sua senha regularmente",
      enabled: true,
    },
  ];

  const appearanceSettings = [
    {
      id: "theme",
      title: "Tema",
      description: "Escolha entre tema claro ou escuro",
      options: ["Claro", "Escuro", "Automático"],
      current: "Automático",
    },
    {
      id: "language",
      title: "Idioma",
      description: "Selecione o idioma da interface",
      options: ["Português", "English", "Español"],
      current: "Português",
    },
    {
      id: "timezone",
      title: "Fuso Horário",
      description: "Configure seu fuso horário local",
      options: ["UTC-3 (Brasília)", "UTC-4 (Manaus)", "UTC-5 (Acre)"],
      current: "UTC-3 (Brasília)",
    },
  ];

  const { debugOcr, setDebugOcr, theme, setTheme } = useUIStore();

  const handleSaveSettings = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const { clearAllData } = useArbitrageStore();

  const handleExportData = () => {
    const data = localStorage.getItem("arbitrage-storage");
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "arbitrage-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            localStorage.setItem("arbitrage-storage", JSON.stringify(data));
            window.location.reload();
          } catch (error) {
            console.error("Erro ao importar dados:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetData = () => {
    if (
      confirm(
        "Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita."
      )
    ) {
      clearAllData();
      initializeSampleData();
      window.location.reload();
    }
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 min-h-screen bg-background dark:bg-gray-900 dark:text-gray-100 transition-colors">
      {showToast && (
        <Toast
          message="Configurações salvas com sucesso!"
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie suas preferências e configurações
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Perfil do Usuário
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Alterar Foto
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG ou GIF até 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <Input defaultValue="João Silva" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input type="email" defaultValue="joao.silva@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <Input defaultValue="+55 (11) 99999-9999" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <select className="input-field">
                      <option>Brasil</option>
                      <option>Estados Unidos</option>
                      <option>Portugal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    className="input-field"
                    placeholder="Conte um pouco sobre você..."
                    defaultValue="Entusiasta de arbitragem esportiva com foco em futebol e basquete."
                  />
                </div>
              </div>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Configurações de Notificações
              </h3>
              <div className="space-y-4">
                {notificationSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {setting.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {setting.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={setting.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Configurações de Segurança
              </h3>
              <div className="space-y-6">
                {securitySettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {setting.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {setting.description}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>
                ))}

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Alterar Senha
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha atual"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Digite a nova senha"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <Input
                        type="password"
                        placeholder="Confirme a nova senha"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Configurações de Aparência
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Tema
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Escolha entre tema claro, escuro ou automático
                    </p>
                  </div>
                  <select
                    className="input-field w-48 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                    value={theme}
                    onChange={(e) =>
                      setTheme(e.target.value as "light" | "dark" | "auto")
                    }
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>
                {/* Toggle Debug OCR */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Exibir debug do OCR
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Ative para visualizar o texto OCR extraído das imagens na
                      tela de upload.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={debugOcr}
                      onChange={(e) => setDebugOcr(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "data" && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Gerenciamento de Dados
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Exportar Dados
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Faça backup de todos os seus dados em formato JSON
                    </p>
                    <Button
                      variant="outline"
                      leftIcon={<Download className="w-4 h-4" />}
                      onClick={handleExportData}
                    >
                      Exportar
                    </Button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Importar Dados
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Restaure seus dados de um arquivo de backup
                    </p>
                    <Button
                      variant="outline"
                      leftIcon={<Upload className="w-4 h-4" />}
                      onClick={handleImportData}
                    >
                      Importar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Resetar Dados
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Volte aos dados de exemplo iniciais
                    </p>
                    <Button
                      variant="outline"
                      leftIcon={<Trash2 className="w-4 h-4" />}
                      onClick={handleResetData}
                    >
                      Resetar
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Zona de Perigo
                  </h4>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-800 mb-2">
                      Excluir Conta
                    </h5>
                    <p className="text-sm text-red-600 mb-4">
                      Esta ação não pode ser desfeita. Todos os seus dados serão
                      permanentemente excluídos.
                    </p>
                    <Button
                      variant="danger"
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Excluir Conta
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "integrations" && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Integrações
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Google Analytics
                    </h4>
                    <p className="text-sm text-gray-500">
                      Conecte sua conta do Google Analytics
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Slack</h4>
                    <p className="text-sm text-gray-500">
                      Receba notificações no Slack
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Telegram</h4>
                    <p className="text-sm text-gray-500">
                      Receba alertas no Telegram
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
