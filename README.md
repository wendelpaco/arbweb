# ArbWeb - Sistema de Arbitragem Esportiva Premium

Um sistema web premium para análise de arbitragem esportiva que processa imagens de odds de casas de apostas e gera métricas detalhadas.

## 🚀 Funcionalidades -

### Core Features

- **Upload de Imagens**: Interface drag & drop premium para upload de imagens de odds
- **Processamento OCR**: Extração automática de dados de casas de apostas, odds e métricas
- **Dashboard Premium**: Métricas em tempo real, gráficos interativos e análises avançadas
- **Gestão de Arbitragens**: Tabela completa com filtros, busca e ordenação
- **Cálculos Automáticos**: ROI, lucro garantido, distribuição ótima de apostas

### Design System Premium

- **Paleta de Cores**: Azul profissional (#2563eb), Verde sucesso (#059669), Vermelho alerta (#dc2626)
- **Componentes UI**: Cards com sombras sutis, botões com gradientes, animações suaves
- **Responsividade**: Mobile-first design com breakpoints otimizados
- **Acessibilidade**: Contraste adequado, navegação por teclado, labels apropriados

## 🛠️ Stack Tecnológica

### Frontend

- **React 18** com TypeScript
- **Zustand** para gerenciamento de estado
- **Tailwind CSS** com configuração premium
- **Recharts** para gráficos interativos
- **Lucide React** para ícones
- **React Dropzone** para upload de arquivos

### Estrutura de Dados

```typescript
interface ArbitrageData {
  id: string;
  timestamp: Date;
  match: {
    team1: string;
    team2: string;
    sport: string;
    competition: string;
  };
  bookmakers: {
    name: string;
    odds: number;
    betType: string;
    stake: number;
    profit: number;
  }[];
  metrics: {
    totalProfit: number;
    profitPercentage: number;
    roi: number;
    totalStake: number;
    arbitragePercentage: number;
  };
  imageUrl: string;
  status: "processed" | "pending" | "error";
}
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Card, Input)
│   ├── dashboard/       # Componentes do dashboard
│   ├── upload/          # Componentes de upload
│   ├── charts/          # Componentes de gráficos
│   └── layout/          # Header e Sidebar
├── pages/               # Páginas principais
├── stores/              # Stores Zustand
├── utils/               # Utilitários (OCR, cálculos, formatação)
├── types/               # Tipos TypeScript
└── styles/              # Estilos globais
```

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 16+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd arbweb

# Instale as dependências
npm install

# Execute o projeto
npm start
```

### Scripts Disponíveis

```bash
npm start          # Executa o servidor de desenvolvimento
npm run build      # Gera build de produção
npm test           # Executa os testes
npm run eject      # Ejecta configurações (irreversível)
```

## 🎨 Design System

### Cores

- **Primary**: #2563eb (Azul profissional)
- **Secondary**: #059669 (Verde sucesso)
- **Accent**: #dc2626 (Vermelho alerta)
- **Background**: #f8fafc (Cinza claro)
- **Surface**: #ffffff (Branco)
- **Text**: #1e293b (Cinza escuro)

### Componentes

- **Cards**: Sombras sutis, bordas arredondadas, hover effects
- **Buttons**: Gradientes premium, estados interativos
- **Tables**: Zebra striping, ordenação visual, paginação
- **Forms**: Validação em tempo real, animações suaves

## 📊 Funcionalidades Avançadas

### Dashboard

- Métricas em tempo real (lucro total, ROI médio, taxa de sucesso)
- Gráficos interativos (lucro ao longo do tempo, distribuição por casas)
- Tabela de oportunidades com filtros avançados
- Cards de métricas com indicadores de tendência

### Upload e Processamento

- Interface drag & drop premium
- Preview de imagens antes do processamento
- Validação de tipos de arquivo e tamanho
- Compressão automática de imagens
- Processamento OCR simulado

### Analytics

- Gráfico de lucro ao longo do tempo
- Distribuição por casas de apostas
- Ranking de melhores arbitragens
- Análise de performance por esporte

## 🔧 Configuração

### Tailwind CSS

O projeto usa Tailwind CSS com configuração customizada para cores premium e componentes específicos.

### Zustand Stores

- **arbitrage.ts**: Gerencia dados de arbitragem e métricas
- **ui.ts**: Controla estado da UI (sidebar, tema, filtros)
- **auth.ts**: Gerencia autenticação e preferências do usuário

## 🚀 Próximas Funcionalidades

### Fase 2: Enhancement

- [ ] Integração com APIs de odds em tempo real
- [ ] Sistema de notificações push
- [ ] Exportação de dados (CSV, PDF)
- [ ] Backup automático dos dados

### Fase 3: Premium Features

- [ ] Análise preditiva de oportunidades
- [ ] Alertas automáticos para arbitragens
- [ ] Integração com Firebase
- [ ] Sistema de backup em nuvem

## 📝 Licença

Este projeto é desenvolvido como um sistema premium de arbitragem esportiva.

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas, entre em contato através do email: suporte@arbweb.com

---

**ArbWeb** - Sistema Premium de Arbitragem Esportiva
