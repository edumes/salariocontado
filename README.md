# 💰 SalarioContado - Contador de Ganhos em Tempo Real

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

Um aplicativo web moderno e elegante para rastrear seus ganhos em tempo real baseado no seu salário e horário de trabalho.

<img width="1466" height="726" alt="image" src="https://github.com/user-attachments/assets/b720901f-2636-4de0-a634-8cee4823a481" />

## ✨ Características

- **🕒 Rastreamento em Tempo Real**: Veja quanto você está ganhando por segundo, minuto, hora e dia
- **⚙️ Configuração Flexível**: Suporte para salário mensal, anual ou por hora
- **🎨 Interface Moderna**: Design elegante com efeitos de vidro líquido e animações suaves
- **🌙 Modo Escuro**: Suporte completo para tema escuro
- **💾 Persistência Local**: Configurações salvas automaticamente no navegador
- **📱 Responsivo**: Funciona perfeitamente em desktop e dispositivos móveis
- **🎯 Metas Diárias**: Acompanhe seu progresso em relação às metas diárias, semanais e mensais

## 🚀 Tecnologias Utilizadas

- **Framework**: [Next.js 15](https://nextjs.org/) com App Router
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animações**: [GSAP](https://greensock.com/gsap/) e [Framer Motion](https://www.framer.com/motion/)
- **Componentes**: [Radix UI](https://www.radix-ui.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/salariocontado.git
   cd salariocontado
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

4. **Abra o navegador**
   Acesse [http://localhost:3000](http://localhost:3000) para ver o aplicativo.

## 🎯 Como Usar

1. **Configure seus dados de trabalho**:
   - Clique no botão "Configurar" no card de configurações
   - Defina o tipo de salário (mensal, anual ou por hora)
   - Insira o valor do seu salário
   - Configure as horas de trabalho por dia
   - Defina os dias de trabalho por semana
   - Especifique o horário de início e fim do trabalho

2. **Acompanhe seus ganhos**:
   - O aplicativo mostrará automaticamente seus ganhos em tempo real
   - Veja quanto você ganha por segundo, minuto e hora
   - Acompanhe o progresso em relação às metas diárias, semanais e mensais

3. **Personalize a experiência**:
   - As configurações são salvas automaticamente no seu navegador
   - O aplicativo funciona offline após o carregamento inicial

## 🏗️ Estrutura do Projeto

```
salariocontado/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── page.tsx           # Página principal
│   │   ├── about/             # Página sobre
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes base (Button, Input, etc.)
│   │   ├── kokonutui/        # Componentes de vidro líquido
│   │   ├── magicui/          # Componentes mágicos
│   │   └── gsap/             # Componentes com animações GSAP
│   └── lib/                  # Utilitários e hooks
├── public/                   # Arquivos estáticos
└── package.json             # Dependências e scripts
```

## 🎨 Componentes Principais

- **LiquidGlassCard**: Card com efeito de vidro líquido
- **ThemeToggle**: Alternador de tema claro/escuro
- **EarningsTracker**: Componente principal de rastreamento de ganhos
- **SettingsDialog**: Modal de configurações

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 🌟 Funcionalidades Avançadas

- **Cálculo Inteligente**: Calcula ganhos baseado apenas nas horas de trabalho
- **Persistência**: Configurações salvas automaticamente no localStorage
- **Animações Suaves**: Transições e animações fluidas em toda a interface
- **Design Responsivo**: Adapta-se perfeitamente a diferentes tamanhos de tela

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) pela excelente framework
- [Tailwind CSS](https://tailwindcss.com/) pelos estilos
- [Radix UI](https://www.radix-ui.com/) pelos componentes acessíveis
- [GSAP](https://greensock.com/gsap/) pelas animações
- [Lucide](https://lucide.dev/) pelos ícones

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, por favor [abra uma issue](https://github.com/seu-usuario/salariocontado/issues).

---

**Desenvolvido com ❤️ para ajudar você a acompanhar seus ganhos em tempo real!**
