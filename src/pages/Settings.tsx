import React, { useState, useRef } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useArbitrageStore } from "../stores/arbitrage";
import { useUIStore } from "../stores/ui";
import { initializeSampleData } from "../utils/sampleData";
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  X,
  CheckCircle,
  Info,
  Lock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastClose,
} from "../components/ui/Toast";
import { TooltipProvider } from "../components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

function PasswordStrengthBar({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Za-z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };
  const strength = getStrength();
  const colors = ["bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
  const labels = ["Fraca", "Média", "Boa", "Forte"];
  return (
    <div className="flex items-center gap-2 mt-2">
      <div
        className={`h-2 w-24 rounded-full transition-all ${
          colors[strength - 1] || "bg-zinc-300"
        }`}
      ></div>
      <span
        className={`text-xs font-medium ${
          colors[strength - 1] || "text-zinc-400"
        }`}
      >
        {labels[strength - 1] || "Muito Fraca"}
      </span>
    </div>
  );
}

function ProfileForm() {
  const [name, setName] = useState("João Silva");
  const [email, setEmail] = useState("joao.silva@email.com");
  const [phone, setPhone] = useState("+55 (11) 99999-9999");
  const [country, setCountry] = useState("Brasil");
  const [bio, setBio] = useState(
    "Entusiasta de arbitragem esportiva com foco em futebol e basquete."
  );
  const [photo, setPhoto] = useState<string | null>(null);
  // const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      file.size <= 2 * 1024 * 1024 &&
      ["image/jpeg", "image/png", "image/gif"].includes(file.type)
    ) {
      // setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      alert("Selecione uma imagem JPG, PNG ou GIF até 2MB.");
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  return (
    <form
      className="space-y-8 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      {/* Upload de foto premium */}
      <div className="relative mb-8 group flex flex-col items-center">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 dark:from-primary-700 dark:to-primary-900 flex items-center justify-center shadow-lg border-4 border-white dark:border-zinc-900 transition-all duration-200 group-hover:scale-105 cursor-pointer">
          <img
            src={photo || "/avatar-placeholder.png"}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
            aria-label="Alterar foto"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        <span className="text-xs text-zinc-400 mt-2">
          JPG, PNG ou GIF até 2MB
        </span>
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
          Clique para alterar a foto
        </span>
      </div>
      {/* Inputs premium com labels flutuantes */}
      <div className="relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="peer input-field w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-400 text-lg text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none rounded-xl py-3 px-4"
          placeholder="Nome Completo"
          aria-label="Nome Completo"
        />
        <label className="absolute left-4 -top-5 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-primary-500">
          Nome Completo
        </label>
      </div>
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
          className="peer input-field w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-400 text-lg text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none rounded-xl py-3 px-4"
          placeholder="Email"
          aria-label="Email"
        />
        <label className="absolute left-4 -top-5 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-primary-500">
          Email
        </label>
      </div>
      <div className="relative">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          pattern="^\+\d{2} \(\d{2}\) \d{5}-\d{4}$"
          className="peer input-field w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-400 text-lg text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none rounded-xl py-3 px-4"
          placeholder="Telefone"
          aria-label="Telefone"
        />
        <label className="absolute left-4 -top-5 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-primary-500">
          Telefone
        </label>
      </div>
      <div className="relative">
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="input-field w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-400 text-lg text-zinc-900 dark:text-zinc-100 focus:outline-none rounded-xl py-3 px-4"
          aria-label="País"
        >
          <option>Brasil</option>
          <option>Estados Unidos</option>
          <option>Portugal</option>
        </select>
        <label className="absolute left-4 -top-5 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-focus:text-primary-500">
          País
        </label>
      </div>
      <div className="relative">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="peer input-field w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-400 text-lg text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none rounded-xl py-3 px-4 resize-none"
          placeholder="Bio"
          aria-label="Bio"
        />
        <label className="absolute left-4 -top-5 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-primary-500">
          Bio
        </label>
      </div>
      <Button
        type="submit"
        className="w-full mt-8 py-4 rounded-2xl text-lg font-bold shadow-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 transition-all duration-200 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        disabled={saving}
      >
        {saving ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
        ) : success ? (
          <CheckCircle className="w-5 h-5 mr-2 text-green-500 inline" />
        ) : null}
        {saving ? "Salvando..." : success ? "Salvo!" : "Salvar Alterações"}
      </Button>
    </form>
  );
}

function NotificationGroup({
  settings,
  onToggle,
}: {
  settings: any[];
  onToggle: (id: string, value: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      {settings.map((setting) => (
        <div
          key={setting.id}
          className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800"
        >
          <div>
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              {setting.title}
              <span className="relative group">
                <Info className="w-4 h-4 text-zinc-400 cursor-pointer" />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden group-hover:block bg-zinc-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                  {setting.description}
                </span>
              </span>
            </h4>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={setting.enabled}
              onChange={(e) => onToggle(setting.id, e.target.checked)}
              className="sr-only peer"
              aria-label={setting.title}
            />
            <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      ))}
    </div>
  );
}

function Security2FA() {
  const [enabled, setEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 group">
          <Lock className="w-5 h-5 text-primary-600 animate-pulse" />
          Autenticação de Dois Fatores
          <span className="relative group">
            <Info className="w-4 h-4 text-zinc-400 cursor-pointer" />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden group-hover:block bg-zinc-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
              Proteja sua conta com autenticação de dois fatores (2FA).
            </span>
          </span>
          {enabled ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2 animate-bounce">
              Ativado
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-200 text-zinc-600 ml-2">
              Desativado
            </span>
          )}
        </h4>
        <Button
          variant={enabled ? "outline" : "default"}
          size="lg"
          className="rounded-xl px-8 py-3 font-semibold shadow-lg bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 transition-all duration-200 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
          onClick={() => setShowModal(true)}
        >
          {enabled ? "Desativar" : "Ativar"}
        </Button>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
        Adicione uma camada extra de segurança à sua conta.
      </p>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {enabled ? "Desativar 2FA" : "Ativar 2FA"}
            </DialogTitle>
            <DialogDescription>
              {enabled
                ? "Tem certeza que deseja desativar a autenticação de dois fatores?"
                : "Escaneie o QR code no seu app autenticador e digite o código abaixo para ativar."}
            </DialogDescription>
          </DialogHeader>
          {!enabled && (
            <div className="flex flex-col items-center my-4">
              <div className="w-32 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-16 h-16 text-primary-600 animate-bounce" />
              </div>
              <Input
                placeholder="Digite o código do app autenticador"
                className="mb-2"
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl px-6 py-2 font-medium shadow hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-xl px-6 py-2 font-semibold shadow-lg bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 transition-all duration-200 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
              onClick={() => {
                setEnabled(!enabled);
                setShowModal(false);
              }}
            >
              {enabled ? "Desativar" : "Ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SecuritySessions() {
  // Simulação de sessões ativas
  const sessions = [
    {
      id: 1,
      device: "MacBook Pro",
      location: "São Paulo, Brasil",
      lastActive: "Agora",
    },
    {
      id: 2,
      device: "iPhone 14",
      location: "Campinas, Brasil",
      lastActive: "Ontem",
    },
  ];
  const [activeSessions, setActiveSessions] = useState(sessions);
  const handleLogout = (id: number) =>
    setActiveSessions((s) => s.filter((sess) => sess.id !== id));
  return (
    <div className="mb-8">
      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        Sessões Ativas
      </h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Gerencie suas sessões ativas em outros dispositivos.
      </p>
      <ul className="space-y-3">
        {activeSessions.map((sess) => (
          <li
            key={sess.id}
            className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
          >
            <div>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {sess.device}
              </span>
              <span className="ml-2 text-xs text-zinc-500">
                {sess.location}
              </span>
              <span className="ml-2 text-xs text-zinc-400">
                {sess.lastActive}
              </span>
            </div>
            <Button
              variant="destructive"
              size="lg"
              className="rounded-xl px-6 py-2 font-semibold shadow hover:bg-red-600 transition-all"
              onClick={() => handleLogout(sess.id)}
            >
              Encerrar
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SecurityChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (newPass.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
    if (!/[0-9]/.test(newPass))
      return "A senha deve conter pelo menos um número.";
    if (!/[A-Za-z]/.test(newPass))
      return "A senha deve conter pelo menos uma letra.";
    if (!/[^A-Za-z0-9]/.test(newPass))
      return "A senha deve conter pelo menos um símbolo.";
    if (newPass !== confirm) return "As senhas não coincidem.";
    return "";
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setCurrent("");
      setNewPass("");
      setConfirm("");
      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2 group">
        <Lock className="w-5 h-5 text-primary-600 animate-pulse" />
        Alterar Senha
        <span className="relative group">
          <Info className="w-4 h-4 text-zinc-400 cursor-pointer" />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden group-hover:block bg-zinc-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
            Use uma senha forte: mínimo 8 caracteres, número, letra e símbolo.
          </span>
        </span>
      </h4>
      <div className="relative">
        <input
          type={showCurrent ? "text" : "password"}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          className="peer input-field w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-400 text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none"
          placeholder="Senha Atual"
          aria-label="Senha Atual"
        />
        <label className="absolute left-0 -top-5 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-primary-500">
          Senha Atual
        </label>
        <button
          type="button"
          onClick={() => setShowCurrent((v) => !v)}
          className="absolute right-2 top-2 text-zinc-400 focus:outline-none"
        >
          {showCurrent ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="relative">
        <input
          type={showNew ? "text" : "password"}
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
          className="peer input-field w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-400 text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none"
          placeholder="Nova Senha"
          aria-label="Nova Senha"
        />
        <label className="absolute left-0 -top-5 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-primary-500">
          Nova Senha
        </label>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="absolute right-2 top-2 text-zinc-400 focus:outline-none"
        >
          {showNew ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
        <PasswordStrengthBar password={newPass} />
      </div>
      <div className="relative">
        <input
          type={showConfirm ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="peer input-field w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-400 text-zinc-900 dark:text-zinc-100 placeholder-transparent focus:outline-none"
          placeholder="Confirmar Nova Senha"
          aria-label="Confirmar Nova Senha"
        />
        <label className="absolute left-0 -top-5 text-xs text-zinc-500 dark:text-zinc-400 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-primary-500">
          Confirmar Nova Senha
        </label>
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          className="absolute right-2 top-2 text-zinc-400 focus:outline-none"
        >
          {showConfirm ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
      <Button
        type="submit"
        className="w-full mt-6 py-4 rounded-2xl text-lg font-bold shadow-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 transition-all duration-200 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        disabled={saving}
      >
        {saving ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
        ) : success ? (
          <CheckCircle className="w-5 h-5 mr-2 text-green-500 inline" />
        ) : null}
        {saving
          ? "Salvando..."
          : success
          ? "Senha alterada!"
          : "Salvar Nova Senha"}
      </Button>
    </form>
  );
}

function AppearanceForm({ theme, setTheme, debugOcr, setDebugOcr }: any) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedDebug, setSelectedDebug] = useState(debugOcr);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setTheme(selectedTheme);
      setDebugOcr(selectedDebug);
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-10 flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-8 text-center flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <Palette className="w-8 h-8 text-primary-600 animate-spin" />{" "}
          Aparência
        </h3>
        <form onSubmit={handleSave} className="w-full space-y-8">
          {/* Tema */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Tema
            </label>
            <select
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 py-3 px-4 text-lg bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary-500 transition"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <option value="light">🌞 Claro</option>
              <option value="dark">🌙 Escuro</option>
              <option value="auto">⚡️ Automático</option>
            </select>
            <span className="text-xs text-zinc-400 mt-1 block">
              Visualize instantaneamente ao trocar.
            </span>
          </div>
          {/* Debug OCR */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Exibir debug do OCR
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDebug}
                onChange={(e) => setSelectedDebug(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-zinc-200 peer-checked:bg-primary-500 rounded-full transition relative">
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
          {/* Botão */}
          <Button
            type="submit"
            className="w-full py-3 text-base font-semibold rounded-xl shadow-md bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 transition-all duration-200"
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
            ) : success ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-500 inline" />
            ) : null}
            {saving ? "Salvando..." : success ? "Salvo!" : "Salvar Alterações"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg] = useState("");

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

  // const securitySettings = [
  //   {
  //     id: "2fa",
  //     title: "Autenticação de Dois Fatores",
  //     description: "Adicione uma camada extra de segurança",
  //     enabled: false,
  //   },
  //   {
  //     id: "session",
  //     title: "Sessões Ativas",
  //     description: "Gerencie suas sessões ativas",
  //     enabled: true,
  //   },
  //   {
  //     id: "password",
  //     title: "Alterar Senha",
  //     description: "Atualize sua senha regularmente",
  //     enabled: true,
  //   },
  // ];

  // const appearanceSettings = [
  //   {
  //     id: "theme",
  //     title: "Tema",
  //     description: "Escolha entre tema claro ou escuro",
  //     options: ["Claro", "Escuro", "Automático"],
  //     current: "Automático",
  //   },
  //   {
  //     id: "language",
  //     title: "Idioma",
  //     description: "Selecione o idioma da interface",
  //     options: ["Português", "English", "Español"],
  //     current: "Português",
  //   },
  //   {
  //     id: "timezone",
  //     title: "Fuso Horário",
  //     description: "Configure seu fuso horário local",
  //     options: ["UTC-3 (Brasília)", "UTC-4 (Manaus)", "UTC-5 (Acre)"],
  //     current: "UTC-3 (Brasília)",
  //   },
  // ];

  const { debugOcr, setDebugOcr, theme, setTheme } = useUIStore();

  // const handleSaveSettings = () => {
  //   setToastMsg("Configurações salvas com sucesso!");
  //   setShowToast(true);
  //   setTimeout(() => setShowToast(false), 2000);
  // };

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

  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    const saved = localStorage.getItem("notification-prefs");
    return saved ? JSON.parse(saved) : notificationSettings;
  });
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  const handleNotifToggle = (id: string, value: boolean) => {
    setNotificationPrefs((prev: any[]) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: value } : s))
    );
  };
  const handleNotifSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifSaving(true);
    setTimeout(() => {
      setNotifSaving(false);
      setNotifSuccess(true);
      localStorage.setItem(
        "notification-prefs",
        JSON.stringify(notificationPrefs)
      );
      setTimeout(() => setNotifSuccess(false), 2000);
    }, 1200);
  };

  return (
    <TooltipProvider>
      <ToastProvider>
        <section className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 py-2">
          <div className="max-w-screen-xl mx-auto px-4 space-y-10">
            <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Configurações
            </h1>
            <Toast
              open={showToast}
              onOpenChange={setShowToast}
              className="bg-green-600 text-white rounded-xl shadow-lg flex items-center gap-3 px-6 py-4 animate-in fade-in-0 slide-in-from-top-6"
            >
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="font-medium">{toastMsg}</span>
              <ToastClose asChild>
                <button className="ml-auto p-1 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white">
                  <X className="w-4 h-4" />
                </button>
              </ToastClose>
            </Toast>
            <ToastViewport className="fixed top-6 right-6 z-[100]" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="dark:bg-zinc-900 dark:border-zinc-800">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                            : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800"
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
                  <div className="flex flex-col items-center justify-center min-h-[80vh]">
                    <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-10 flex flex-col items-center">
                      <h3 className="text-2xl font-bold mb-10 text-center flex items-center justify-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <User className="w-8 h-8 text-primary-600 animate-bounce" />{" "}
                        Perfil do Usuário
                      </h3>
                      <ProfileForm />
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
                      <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <Bell className="w-7 h-7 text-primary-600 animate-pulse" />{" "}
                        Notificações
                      </h3>
                      <form onSubmit={handleNotifSave}>
                        <NotificationGroup
                          settings={notificationPrefs}
                          onToggle={handleNotifToggle}
                        />
                        <Button
                          type="submit"
                          className="w-full mt-8 py-4 rounded-2xl text-lg font-bold shadow-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 transition-all duration-200 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
                          disabled={notifSaving}
                        >
                          {notifSaving ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                          ) : notifSuccess ? (
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500 inline" />
                          ) : null}
                          {notifSaving
                            ? "Salvando..."
                            : notifSuccess
                            ? "Salvo!"
                            : "Salvar Alterações"}
                        </Button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
                      <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <Shield className="w-7 h-7 text-primary-600 animate-bounce" />{" "}
                        Segurança
                      </h3>
                      <Security2FA />
                      <div className="mb-12" />
                      <SecuritySessions />
                      <div className="mb-12" />
                      <SecurityChangePassword />
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <AppearanceForm
                    theme={theme}
                    setTheme={setTheme}
                    debugOcr={debugOcr}
                    setDebugOcr={setDebugOcr}
                  />
                )}

                {activeTab === "data" && (
                  <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-10 flex flex-col items-center">
                      <h3 className="text-2xl font-bold mb-10 text-center flex items-center justify-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <Database className="w-8 h-8 text-primary-600 animate-bounce" />{" "}
                        Gerenciamento de Dados
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-10">
                        {/* Exportar */}
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 shadow group hover:shadow-lg transition">
                          <Upload className="w-10 h-10 text-blue-500 group-hover:scale-110 transition" />
                          <span className="font-semibold mt-2">Exportar</span>
                          <span className="text-xs text-zinc-400 mt-1 text-center">
                            Backup de todos os seus dados em JSON
                          </span>
                          <Button
                            className="w-full py-3 text-base font-semibold rounded-xl shadow-md transition-all duration-150 hover:scale-105"
                            variant="default"
                            onClick={handleExportData}
                          >
                            Exportar
                          </Button>
                        </div>
                        {/* Importar */}
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 shadow group hover:shadow-lg transition">
                          <Download className="w-10 h-10 text-green-500 group-hover:scale-110 transition" />
                          <span className="font-semibold mt-2">Importar</span>
                          <span className="text-xs text-zinc-400 mt-1 text-center">
                            Restaure seus dados de um backup
                          </span>
                          <Button
                            className="w-full py-3 text-base font-semibold rounded-xl shadow-md transition-all duration-150 hover:scale-105"
                            variant="default"
                            onClick={handleImportData}
                          >
                            Importar
                          </Button>
                        </div>
                        {/* Resetar */}
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 shadow group hover:shadow-lg transition">
                          <RefreshCw className="w-10 h-10 text-yellow-500 group-hover:scale-110 transition" />
                          <span className="font-semibold mt-2">Resetar</span>
                          <span className="text-xs text-zinc-400 mt-1 text-center">
                            Volte aos dados de exemplo iniciais
                          </span>
                          <Button
                            className="w-full py-3 text-base font-semibold rounded-xl shadow-md transition-all duration-150 hover:scale-105"
                            variant="outline"
                            onClick={handleResetData}
                          >
                            Resetar
                          </Button>
                        </div>
                      </div>
                      {/* Zona de Perigo */}
                      <div className="mt-8 p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 flex flex-col items-center w-full">
                        <Trash2 className="w-8 h-8 text-red-500 mb-2 animate-pulse" />
                        <span className="font-bold text-red-700 mb-1">
                          Excluir Conta
                        </span>
                        <span className="text-xs text-red-600 mb-4 text-center">
                          Esta ação não pode ser desfeita. Todos os seus dados
                          serão permanentemente excluídos.
                        </span>
                        <Button
                          className="w-full py-3 text-base font-semibold rounded-xl shadow-md transition-all duration-150 hover:scale-105"
                          variant="destructive"
                          onClick={handleDeleteAccount}
                        >
                          Excluir Conta
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "integrations" && (
                  <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
                      <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <Globe className="w-7 h-7 text-primary-600 animate-spin" />{" "}
                        Integrações
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg">
                          <div>
                            <h4 className="font-medium text-zinc-100">
                              Google Analytics
                            </h4>
                            <p className="text-sm text-zinc-400">
                              Conecte sua conta do Google Analytics
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Conectar
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg">
                          <div>
                            <h4 className="font-medium text-zinc-100">Slack</h4>
                            <p className="text-sm text-zinc-400">
                              Receba notificações no Slack
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Conectar
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg">
                          <div>
                            <h4 className="font-medium text-zinc-100">
                              Telegram
                            </h4>
                            <p className="text-sm text-zinc-400">
                              Receba alertas no Telegram
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Conectar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </ToastProvider>
    </TooltipProvider>
  );
};
