# Festa Junina — Hotpage

Hotpage simples para organizar a Festa Junina com 3 listas:
- **Presença** (60 responsáveis confirmados)
- **Comidas Típicas** (53 itens, 33 assinados)
- **Balaio Junino** (33 itens, 30 assinados)

Inclui botão para enviar a lista completa no WhatsApp.

## Como rodar localmente

### Requisitos
- Node.js 18+ (ou Bun)
- npm / pnpm / bun

### Passos
```bash
# 1. Instalar dependências
npm install
# ou: bun install

# 2. Rodar em modo dev
npm run dev
# ou: bun run dev

# 3. Acessar http://localhost:3000
```

## Como fazer deploy

### Vercel (recomendado)
1. Faça upload do projeto no GitHub
2. Conecte o repositório em https://vercel.com/new
3. A Vercel detecta Next.js automaticamente
4. Clique em "Deploy" — pronto em ~30s

### Netlify
1. Faça upload no GitHub
2. Conecte em https://app.netlify.com/start
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Adicione o plugin `@netlify/plugin-nextjs`

### Cloudflare Pages
1. Faça upload no GitHub
2. Conecte em https://dash.cloudflare.com/?to=/:account/pages
3. Framework preset: Next.js
4. Build command: `npm run build`
5. Output directory: `.next`

### Outro servidor (VPS / Docker)
```bash
# Build de produção
npm run build

# Start do servidor (porta 3000)
npm run start

# Ou com Docker, expondo a porta 3000
# (crie um Dockerfile com node:20-alpine)
```

## Estrutura do projeto

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout raiz (HTML + fontes do sistema)
│   │   ├── page.tsx            # Hotpage principal com tabs + admin panel
│   │   ├── icon.svg            # Favicon (Next.js injeta automaticamente)
│   │   ├── globals.css         # Tailwind v4 + tokens de cor
│   │   └── api/
│   │       ├── route.ts        # GET /api (hello world)
│   │       └── listas/route.ts # POST /api/listas (salva JSON local)
│   ├── components/ui/          # Componentes shadcn (10 usados)
│   ├── hooks/use-toast.ts      # Hook de toast
│   └── lib/
│       ├── party.ts            # Tipos + dados iniciais + funções
│       └── utils.ts            # cn() helper
├── public/
│   ├── logo.svg                # Logo Z.ai
│   ├── favicon.ico             # Favicon binário (16x16)
│   └── robots.txt
├── package.json                # 13 deps + 7 devDeps (mínimo)
├── next.config.ts              # Config Next.js 16
├── tsconfig.json               # TypeScript strict
├── postcss.config.mjs          # Tailwind v4 PostCSS
└── scripts/
    └── update-festa-json.py    # Script Python para regenerar JSON/MD
```

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript 5** (strict)
- **Tailwind CSS 4** (via PostCSS)
- **shadcn/ui** (componentes: button, card, input, label, tabs, textarea, badge, separator, toast, toaster)
- **lucide-react** (ícones)
- **sonner** (toasts)
- **Radix UI** (primitivos: tabs, toast, slot, separator, label)

## Persistência de dados

Os dados das listas são salvos no **localStorage** do navegador (com versionamento — atualmente v8). Cada usuário vê sua própria cópia local, e pode exportar para JSON ou enviar para o WhatsApp usando o botão no topo da página.

## Estado atual das listas (v8)

### Presença (60 responsáveis)
Ana Lúcia, Ana Maria, André, Andrea, Andrezza (Andrezza Lucena), Angélica, Arthur, Assis, Cidinha, Cris, Daniele, Fabinho, Fernando, Gabriel, Gabriela, Gaspar, Helber, Isabella, Isadora, Istefanie, João, João Filho, João Pedro, Joãozinho, Kaio, Letícia, Lorena, Luana, Lucas (Luquinhas), Magda, Malu, Manuela, Marcão, Marcelo (Rodrigo), Maria Fernanda, Neto, Nicole, Nivaldo, Nivianne, Pablo, Pavila, Pedro Helber, Pedro Henrique, Priscila, Regia, Rita, Rosa, Sayonara (Sayô), Silberto, Simon, Simone, Tetê, Thaís Lucena, Thaís Macedo, Thiago, Tia Bia, Valentina, Willy, Ana Claudia, Rodrigo

### Comidas (33/53 assinados)
Inclui: Caldos, mini cachor-quente, milho cozido, empadão, torta salgada, salgados, cuscuz, mini sanduíches, arroz-doce, paçoquinhas, bolos, canjica, pipoca, milho para assar, pamonhas, e descartáveis (pratos, cubas, garfos, colheres, copos)

### Balaio (30/33 assinados)
Inclui: arroz, feijão, macarrão, açúcar, café, farinha de trigo, fubá, óleo, leite, biscoito, molho de tomate, sardinha, milho de pipoca, canjica, amendoim, vinho, coca cola, leite condensado, queijo coalho, creme de leite, goiabada, chocolate, farinha de mandioca, massa para cuscuz, e uma Surpresa

## Editando as listas

Todas as listas são definidas em `src/lib/party.ts`:
- `INITIAL_PRESENCA` — array de nomes
- `INITIAL_COMIDAS` — array de objetos `{id, quantidade, comida, responsavel}`
- `INITIAL_BALAIO` — array de objetos `{id, quantidade, item, responsavel}`

Para adicionar uma nova confirmação, basta editar o array correspondente e fazer rebuild.

Para forçar o refresh em todos os dispositivos (ignorar localStorage antigo), suba o número da versão nas constantes:
```ts
const PRESENCA_KEY = "festa-presenca-v8"  // mude para v9
const COMIDAS_KEY = "festa-comidas-v8"    // mude para v9
const BALAIO_KEY = "festa-balaio-v8"      // mude para v9
```

## Licença

Projeto pessoal para organização de festa. Livre para uso.
