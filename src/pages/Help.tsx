import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  HelpCircle,
  Search,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Video,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Send,
} from "lucide-react";

export const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const faqCategories = [
    {
      id: "getting-started",
      title: "Primeiros Passos",
      icon: <BookOpen className="w-5 h-5" />,
      faqs: [
        {
          question: "Como funciona a arbitragem esportiva?",
          answer:
            "A arbitragem esportiva é uma estratégia que aproveita diferenças de odds entre diferentes casas de apostas para garantir lucro independente do resultado do evento. O sistema identifica automaticamente essas oportunidades e calcula os valores ideais para cada aposta.",
        },
        {
          question: "Como fazer upload de imagens de odds?",
          answer:
            "Na página de Upload, você pode arrastar e soltar imagens de odds ou clicar para selecionar arquivos. O sistema processará automaticamente as imagens e extrairá as informações de odds usando OCR.",
        },
        {
          question: "Quais formatos de imagem são suportados?",
          answer:
            "O sistema suporta os formatos JPG, PNG, GIF e WebP. Recomendamos imagens com boa qualidade e contraste para melhor precisão na extração de dados.",
        },
        {
          question: "Como interpretar os resultados da arbitragem?",
          answer:
            "Os resultados mostram o lucro potencial, ROI, e os valores recomendados para cada aposta. Valores positivos indicam oportunidades lucrativas, enquanto valores negativos indicam que não há arbitragem viável.",
        },
      ],
    },
    {
      id: "features",
      title: "Funcionalidades",
      icon: <FileText className="w-5 h-5" />,
      faqs: [
        {
          question: "Como usar os filtros avançados?",
          answer:
            "Os filtros permitem refinar os resultados por esporte, casa de apostas, ROI mínimo, e período. Use-os para encontrar oportunidades específicas que atendam aos seus critérios.",
        },
        {
          question: "Como exportar relatórios?",
          answer:
            'Na página de Relatórios, você pode gerar relatórios personalizados em PDF, Excel ou CSV. Configure os parâmetros desejados e clique em "Gerar Relatório".',
        },
        {
          question: "Como configurar notificações?",
          answer:
            "Acesse Configurações > Notificações para ativar alertas por email, push notifications, e notificações de novas arbitragens encontradas.",
        },
        {
          question: "Como interpretar os gráficos de performance?",
          answer:
            "Os gráficos mostram tendências de lucro, distribuição por casas de apostas, e performance por esportes. Use-os para identificar padrões e otimizar sua estratégia.",
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Solução de Problemas",
      icon: <HelpCircle className="w-5 h-5" />,
      faqs: [
        {
          question: "O OCR não está funcionando corretamente",
          answer:
            "Verifique se a imagem tem boa qualidade e contraste. Evite imagens borradas ou com texto muito pequeno. Se o problema persistir, tente recortar a imagem para focar apenas nas odds.",
        },
        {
          question: "Não estou encontrando oportunidades de arbitragem",
          answer:
            "As oportunidades dependem das odds disponíveis. Tente ajustar os filtros, verificar diferentes casas de apostas, ou aguardar mudanças nas odds.",
        },
        {
          question: "Como resetar minhas configurações?",
          answer:
            'Acesse Configurações > Dados e use a opção "Restaurar Configurações Padrão". Isso resetará todas as configurações para os valores iniciais.',
        },
        {
          question: "O sistema está lento",
          answer:
            "Verifique sua conexão com a internet e tente limpar o cache do navegador. Se o problema persistir, entre em contato com o suporte.",
        },
      ],
    },
  ];

  const supportChannels = [
    {
      title: "Email",
      description: "Envie suas dúvidas por email",
      icon: <Mail className="w-6 h-6" />,
      contact: "suporte@arbweb.com",
      action: "Enviar Email",
    },
    {
      title: "Chat ao Vivo",
      description: "Fale diretamente com nossa equipe",
      icon: <MessageCircle className="w-6 h-6" />,
      contact: "Disponível 24/7",
      action: "Iniciar Chat",
    },
    {
      title: "Telefone",
      description: "Ligue para nosso suporte",
      icon: <Phone className="w-6 h-6" />,
      contact: "+55 (11) 3000-0000",
      action: "Ligar Agora",
    },
  ];

  const resources = [
    {
      title: "Guia Completo",
      description: "Tutorial passo a passo para iniciantes",
      icon: <BookOpen className="w-6 h-6" />,
      type: "PDF",
    },
    {
      title: "Vídeo Tutorial",
      description: "Demonstração em vídeo das funcionalidades",
      icon: <Video className="w-6 h-6" />,
      type: "Vídeo",
    },
    {
      title: "API Documentation",
      description: "Documentação técnica para desenvolvedores",
      icon: <FileText className="w-6 h-6" />,
      type: "Web",
    },
  ];

  const handleFaqToggle = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
  };

  const handleContactChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Central de Ajuda</h1>
          <p className="text-gray-600">Encontre respostas e suporte</p>
        </div>
        <Button leftIcon={<MessageCircle className="w-4 h-4" />}>
          Contatar Suporte
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Busque por dúvidas, problemas ou funcionalidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Canais de Suporte */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportChannels.map((channel, index) => (
          <Card key={index} className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              {channel.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {channel.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
            <p className="text-sm font-medium text-primary-600 mb-4">
              {channel.contact}
            </p>
            <Button variant="outline" size="sm" className="w-full">
              {channel.action}
            </Button>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        {faqCategories.map((category) => (
          <Card key={category.id}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {category.title}
              </h3>
            </div>
            <div className="space-y-4">
              {category.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleFaqToggle(`${category.id}-${index}`)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    {expandedFaq === `${category.id}-${index}` ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === `${category.id}-${index}` && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Recursos */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Recursos Úteis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  {resource.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {resource.title}
                  </h4>
                  <span className="text-xs text-primary-600 font-medium">
                    {resource.type}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {resource.description}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                rightIcon={<ExternalLink className="w-4 h-4" />}
              >
                Acessar
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Formulário de Contato */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Enviar Mensagem
        </h3>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <Input
                value={contactForm.name}
                onChange={(e) => handleContactChange("name", e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={contactForm.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assunto
            </label>
            <Input
              value={contactForm.subject}
              onChange={(e) => handleContactChange("subject", e.target.value)}
              placeholder="Qual é o assunto da sua mensagem?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem
            </label>
            <textarea
              rows={4}
              value={contactForm.message}
              onChange={(e) => handleContactChange("message", e.target.value)}
              placeholder="Descreva sua dúvida ou problema..."
              className="input-field"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" leftIcon={<Send className="w-4 h-4" />}>
              Enviar Mensagem
            </Button>
          </div>
        </form>
      </Card>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">
            Horário de Atendimento
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Segunda a Sexta: 8h às 18h</p>
            <p>Sábado: 9h às 14h</p>
            <p>Domingo: Fechado</p>
            <p className="text-primary-600 font-medium">Emergências: 24/7</p>
          </div>
        </Card>
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">
            Informações Úteis
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Tempo médio de resposta: 2 horas</p>
            <p>
              Status do sistema:{" "}
              <span className="text-green-600 font-medium">Online</span>
            </p>
            <p>Versão atual: v1.2.0</p>
            <p>Última atualização: 15/01/2024</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
