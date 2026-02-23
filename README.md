# 📋 Todo Professional

> Um gerenciador de tarefas moderno, responsivo e profissional construído com JavaScript vanilla, seguindo as melhores práticas de desenvolvimento.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

## ✨ Funcionalidades

### 🎯 Principais
- ➕ **Adicionar tarefas** com validação inteligente
- ✏️ **Editar tarefas** em linha com modo de edição dedicado  
- ✅ **Marcar como concluída** com toggle visual
- 🗑️ **Excluir tarefas** com confirmação de segurança
- 💾 **Persistência local** usando LocalStorage

### 🔍 Busca e Filtros
- 🔎 **Busca em tempo real** com debounce otimizado
- 📊 **Filtros por status**: Todas, Pendentes, Concluídas
- 📈 **Estatísticas dinâmicas** de progresso
- 🔄 **Atualização automática** dos contadores

### 🎨 Interface e UX
- 📱 **Design responsivo** para todos os dispositivos
- 🎭 **Animações suaves** e transições fluidas
- ♿ **Acessibilidade completa** (ARIA, keyboard navigation)
- 🌙 **Visual moderno** com design system consistente
- ⌨️ **Atalhos de teclado** para produtividade

### 🛠️ Características Técnicas
- 🏗️ **Arquitetura modular** com classes ES6+
- 🧪 **Código testável** e bem documentado
- 🔒 **Segurança**: sanitização de HTML, validação de entrada
- 🚀 **Performance otimizada** com event delegation
- 📊 **Observabilidade**: logs estruturados e tratamento de erros

## 🚀 Demo

🌐 **[Ver Demonstração Online](https://mandresoeiro.github.io/To-Do-List)**

![Preview da Aplicação](./img/preview.png)

*Interface limpa e intuitiva com design profissional*

## 📦 Instalação e Uso

### 🎯 Método 1: Uso Direto
```bash
# Clone o repositório
git clone https://github.com/mandresoeiro/To-Do-List.git

# Navegue para o diretório
cd To-Do-List

# Abra o arquivo index.html no navegador
# Não precisa de build ou dependências!
```

### 🛠️ Método 2: Desenvolvimento (com ferramentas)
```bash
# Clone e instale dependências
git clone https://github.com/mandresoeiro/To-Do-List.git
cd To-Do-List
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Ou execute outros comandos
npm run lint        # Verificar código
npm run format      # Formatar código
npm run build       # Build de produção
```

## 🏗️ Arquitetura

### 📁 Estrutura do Projeto
```
Todo-Professional/
├── 📄 index.html           # Estrutura HTML semântica
├── 🎨 css/
│   └── style.css          # Estilos com design tokens
├── ⚡ js/
│   └── app.js             # Lógica da aplicação (ES6+)
├── 🖼️ img/               # Imagens e ícones
├── ⚙️ .eslintrc.json      # Configuração ESLint
├── 🎨 .prettierrc.json    # Configuração Prettier
├── 📦 package.json        # Dependências e scripts
└── 📋 README.md           # Documentação

Características:
✅ Zero dependências externas (runtime)
✅ Vanilla JavaScript ES6+
✅ CSS Grid e Flexbox
✅ Mobile-First responsive
✅ Semantic HTML5
```

### 🧱 Arquitetura de Código

#### 🎯 **Separação de Responsabilidades**
```javascript
📦 TodoApp              # Orquestrador principal
├── 🧠 TodoManager      # Lógica de negócio e estado
├── 💾 StorageService   # Persistência de dados
├── 🎨 UIController     # Manipulação de DOM
├── 📋 TodoItem         # Modelo de dados
└── 🛠️ Utils            # Funções utilitárias
```

#### 🔄 **Fluxo de Dados**
```
User Action → Event Handler → State Update → UI Render → Storage Persist
     ↑                                                        ↓
     ←←←←←←←←←←← Feedback/Animation ←←←←←←←←←←←←←←←←←←←←←←←←
```

## 🎨 Design System

### 🎯 **Design Tokens**
```css
/* Cores Principais */
--color-primary-600: #269fe6    /* Azul principal */
--color-success-600: #059669    /* Verde sucesso */
--color-error-600: #dc2626      /* Vermelho erro */

/* Tipografia */
--font-primary: 'Inter', sans-serif
--font-weight-regular: 400
--font-weight-semibold: 600

/* Espaçamento */
--space-md: 1.6rem             /* 16px */
--space-lg: 2.4rem             /* 24px */

/* Bordas e Sombras */
--radius-md: 0.8rem
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
```

### 📱 **Responsividade**
- 🖥️ **Desktop**: Layout em grid otimizado
- 💻 **Tablet**: Adaptação fluida dos componentes  
- 📱 **Mobile**: Interface mobile-first consolidada

## 🧪 Funcionalidades Avançadas

### ⌨️ **Atalhos de Teclado**
- `Enter`: Adicionar/Salvar tarefa
- `Escape`: Cancelar edição ou limpar busca
- `Ctrl+F`: Focar no campo de busca

### 🔍 **Busca Inteligente**
- Busca em tempo real com debounce (300ms)
- Insensível a maiúsculas/minúsculas  
- Destacar termos encontrados
- Limpar busca com botão ou Escape

### 📊 **Validações**
- Texto obrigatório (não vazio)
- Limite máximo de caracteres (100)
- Sanitização de HTML (prevenção XSS)
- Feedback visual de erros

## 🛡️ Segurança e Performance

### 🔒 **Medidas de Segurança**
- ✅ Sanitização de conteúdo HTML
- ✅ Validação rigorosa de entrada
- ✅ Prevenção de XSS
- ✅ CSP headers recomendados

### ⚡ **Otimizações de Performance**
- ✅ Event delegation para listas dinâmicas
- ✅ Debouncing para busca em tempo real
- ✅ Lazy loading de componentes
- ✅ Minificação de assets (build)
- ✅ Caching de LocalStorage otimizado

## 🧪 Testes e Qualidade

### 📋 **Ferramentas de Qualidade**
```bash
# Verificação de código
npm run lint           # ESLint
npm run lint:fix       # Corrigir automaticamente

# Formatação
npm run format         # Prettier

# Testes (futuro)
npm test              # Jest unit tests
```

### 📏 **Padrões de Código**
- ✅ ESLint com Standard config
- ✅ Prettier para formatação consistente
- ✅ Nomenclatura descritiva e consistente
- ✅ Comentários JSDoc nas funções principais
- ✅ Tratamento de erros robusto

## 🌐 Compatibilidade

### 📱 **Navegadores Suportados**
- ✅ Chrome 90+ (Desktop/Mobile)
- ✅ Firefox 88+ (Desktop/Mobile)
- ✅ Safari 14+ (Desktop/Mobile) 
- ✅ Edge 90+
- ⚠️ Internet Explorer: Não suportado

### 📊 **Recursos Utilizados**
- ✅ ES6+ Classes, Modules, Destructuring
- ✅ CSS Grid e Flexbox
- ✅ LocalStorage API
- ✅ Fetch API (futuras extensões)
- ✅ Intersection Observer (animações)

## 🗺️ Roadmap

### 🎯 **Próximas Versões**

#### v1.1.0 - Recursos Avançados
- [ ] 🌙 Modo escuro toggle
- [ ] 🏷️ Sistema de tags/categorias
- [ ] ⭐ Prioridade de tarefas
- [ ] 📅 Datas de vencimento
- [ ] 🔔 Notificações browser

#### v1.2.0 - Colaboração
- [ ] 📊 Relatórios e analytics
- [ ] 📤 Exportar para JSON/CSV
- [ ] 🔄 Sincronização cloud
- [ ] 👥 Compartilhamento de listas

#### v2.0.0 - PWA
- [ ] 📱 Progressive Web App
- [ ] 🔄 Service Worker (offline)
- [ ] 📲 App installable
- [ ] 🔄 Sincronização background

## 🤝 Contribuição

### 🎯 **Como Contribuir**

1. **Fork** o repositório
2. **Clone** sua fork localmente
3. **Crie** uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
4. **Desenvolva** seguindo os padrões do projeto
5. **Teste** suas alterações
6. **Commit** com mensagem descritiva: `feat: adiciona funcionalidade X`
7. **Push** para sua branch: `git push origin feature/nova-funcionalidade` 
8. **Abra** um Pull Request

### 📋 **Convenção de Commits**
```
feat: nova funcionalidade
fix: correção de bug  
docs: atualização de documentação
style: formatação, pontuação
refactor: melhoria de código existente
test: adição de testes
chore: tarefas de manutenção
```

### 🧪 **Diretrizes de Desenvolvimento**
- ✅ Siga os padrões ESLint configurados
- ✅ Adicione testes para novas funcionalidades
- ✅ Mantenha cobertura de código > 80%
- ✅ Documente APIs públicas
- ✅ Teste em múltiplos navegadores

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
Copyright (c) 2026 Márcio Soeiro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👤 Autor

**Márcio Soeiro**
- 🌐 Website: [soeirotech.com.br](https://soeirotech.com.br)
- 💼 LinkedIn: [Márcio Soeiro](https://linkedin.com/in/marciosoeiro)
- 🐙 GitHub: [@mandresoeiro](https://github.com/mandresoeiro)
- 📧 Email: contato@soeirotech.com.br

---

## 🙏 Agradecimentos

- 🎨 **Font Awesome** pelos ícones de qualidade
- 📝 **Google Fonts** pela tipografia Inter
- 🏗️ **VS Code** pela excelente experiência de desenvolvimento
- 🧪 **ESLint & Prettier** pelas ferramentas de qualidade

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

</div>