// Tipos e dados da Festa Junina

export type Presenca = {
  id: string
  nome: string
  familiares: string
  criadoEm: string
}

export type Comida = {
  id: string
  quantidade: string
  comida: string
  responsavel: string
}

export type BalaioItem = {
  id: string
  quantidade: string
  item: string
  responsavel: string
}

export type CurrentUser = {
  nome: string
  familiares: string
}

const PRESENCA_KEY = "festa-presenca-v9"
const COMIDAS_KEY = "festa-comidas-v9"
const BALAIO_KEY = "festa-balaio-v9"
const USER_KEY = "festa-current-user-v9"
const STEP_KEY = "festa-step-v9"

export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/K5mZ872Uiqh1h440Nxc1U2"

// 53 itens de comidas típicas + descartáveis (lista unificada — Lista 1 + Lista 2)
export const INITIAL_COMIDAS: Comida[] = [
  { id: "c1",  quantidade: "1",   comida: "Caldo (tipo a sua escolha)",       responsavel: "Thiago" },
  { id: "c2",  quantidade: "1",   comida: "Caldo (tipo a sua escolha)",       responsavel: "Andrezza (Andrezza Lucena)" },
  { id: "c3",  quantidade: "20",  comida: "mini Cachorro-quente",             responsavel: "Neto" },
  { id: "c4",  quantidade: "20",  comida: "mini cachorro-quente",             responsavel: "Thaís Macedo" },
  { id: "c5",  quantidade: "20",  comida: "mini cachorro-quente",             responsavel: "" },
  { id: "c6",  quantidade: "10",  comida: "Milho cozido",                     responsavel: "Sayonara (Sayô)" },
  { id: "c7",  quantidade: "10",  comida: "Milho cozido",                     responsavel: "Sayonara (Sayô)" },
  { id: "c8",  quantidade: "1",   comida: "Empadão",                          responsavel: "" },
  { id: "c9",  quantidade: "1",   comida: "Empadão",                          responsavel: "" },
  { id: "c10", quantidade: "1",   comida: "Empadão",                          responsavel: "" },
  { id: "c11", quantidade: "1",   comida: "Torta salgada",                    responsavel: "" },
  { id: "c12", quantidade: "1",   comida: "Torta salgada",                    responsavel: "" },
  { id: "c13", quantidade: "1",   comida: "Torta salgada",                    responsavel: "Ana Claudia" },
  { id: "c14", quantidade: "100", comida: "Salgados",                         responsavel: "Fabinho" },
  { id: "c15", quantidade: "100", comida: "Salgados",                         responsavel: "Cidinha" },
  { id: "c16", quantidade: "100", comida: "Salgados",                         responsavel: "João Filho" },
  { id: "c17", quantidade: "100", comida: "Salgados",                         responsavel: "" },
  { id: "c18", quantidade: "10",  comida: "Cuscuz temperado",                 responsavel: "Marcelo (Rodrigo)" },
  { id: "c19", quantidade: "10",  comida: "Cuscuz temperado",                 responsavel: "" },
  { id: "c20", quantidade: "10",  comida: "Cuscuz temperado",                 responsavel: "" },
  { id: "c21", quantidade: "20",  comida: "mini sanduíches",                  responsavel: "" },
  { id: "c22", quantidade: "20",  comida: "mini sanduíches",                  responsavel: "" },
  { id: "c23", quantidade: "20",  comida: "mini sanduíches",                  responsavel: "" },
  { id: "c24", quantidade: "10",  comida: "Arroz-doce",                       responsavel: "" },
  { id: "c25", quantidade: "10",  comida: "Arroz-doce",                       responsavel: "" },
  { id: "c26", quantidade: "10",  comida: "Arroz-doce",                       responsavel: "" },
  { id: "c27", quantidade: "1",   comida: "Pote de Paçoquinhas",              responsavel: "Silberto" },
  { id: "c28", quantidade: "1",   comida: "Bolo de milho",                    responsavel: "Istefanie" },
  { id: "c29", quantidade: "1",   comida: "Bolo de macaxeira",                responsavel: "Rosa" },
  { id: "c30", quantidade: "1",   comida: "Bolo de cenoura com chocolate",    responsavel: "Rodrigo" },
  { id: "c31", quantidade: "1",   comida: "Canjica",                          responsavel: "Tia Bia" },
  { id: "c32", quantidade: "20",  comida: "Saquinhos com pipoca",             responsavel: "" },
  { id: "c33", quantidade: "20",  comida: "Saquinhos com pipoca",             responsavel: "" },
  { id: "c34", quantidade: "10",  comida: "Espigas de Milho para assar",      responsavel: "" },
  { id: "c35", quantidade: "10",  comida: "Espigas de Milho para assar",      responsavel: "Kaio" },
  { id: "c36", quantidade: "10",  comida: "Espigas de Milho para assar",      responsavel: "Letícia" },
  { id: "c37", quantidade: "5",   comida: "Pamonhas",                         responsavel: "" },
  { id: "c38", quantidade: "5",   comida: "Pamonhas",                         responsavel: "Fernando" },
  { id: "c39", quantidade: "5",   comida: "Pamonhas",                         responsavel: "" },
  { id: "c40", quantidade: "5",   comida: "Pamonhas",                         responsavel: "" },
  // Descartáveis
  { id: "c41", quantidade: "30",  comida: "Pratos descartáveis",              responsavel: "André" },
  { id: "c42", quantidade: "30",  comida: "Pratos descartáveis",              responsavel: "Thaís Lucena" },
  { id: "c43", quantidade: "30",  comida: "Pratos descartáveis",              responsavel: "Lucas (Luquinhas)" },
  { id: "c44", quantidade: "20",  comida: "Cubas p/ caldo descartáveis",      responsavel: "Magda" },
  { id: "c45", quantidade: "20",  comida: "Cubas p/ caldo descartáveis",      responsavel: "Magda" },
  { id: "c46", quantidade: "50",  comida: "Garfos",                           responsavel: "Cris" },
  { id: "c47", quantidade: "50",  comida: "Garfos",                           responsavel: "Thaís Lucena" },
  { id: "c48", quantidade: "50",  comida: "Colheres",                         responsavel: "Lucas (Luquinhas)" },
  { id: "c49", quantidade: "50",  comida: "Colheres",                         responsavel: "Lucas (Luquinhas)" },
  { id: "c50", quantidade: "50",  comida: "Colheres",                         responsavel: "Lucas (Luquinhas)" },
  { id: "c51", quantidade: "100", comida: "Copos descartáveis",               responsavel: "João Filho" },
  { id: "c52", quantidade: "100", comida: "Copos descartáveis",               responsavel: "Isabella" },
  { id: "c53", quantidade: "100", comida: "Copos descartáveis",               responsavel: "Maria Fernanda" },
]

// 31 itens do balaio junino (lista unificada — Lista 1 + Lista 2)
export const INITIAL_BALAIO: BalaioItem[] = [
  { id: "b1",  quantidade: "1", item: "kg de arroz",                responsavel: "Cidinha" },
  { id: "b2",  quantidade: "1", item: "kg de feijão",               responsavel: "Rosa" },
  { id: "b3",  quantidade: "1", item: "pacote de macarrão",         responsavel: "Sayonara (Sayô)" },
  { id: "b4",  quantidade: "1", item: "kg de açúcar",               responsavel: "Andrezza (Andrezza Lucena)" },
  { id: "b5",  quantidade: "1", item: "pacote de café",             responsavel: "Fabinho" },
  { id: "b6",  quantidade: "1", item: "pacote de café",             responsavel: "André" },
  { id: "b7",  quantidade: "1", item: "pacote de farinha de trigo", responsavel: "Ana Claudia" },
  { id: "b8",  quantidade: "1", item: "pacote de fubá",             responsavel: "Thaís Lucena" },
  { id: "b9",  quantidade: "1", item: "pacote de fubá",             responsavel: "Thaís Lucena" },
  { id: "b10", quantidade: "1", item: "pacote de macarrão",         responsavel: "Rodrigo" },
  { id: "b11", quantidade: "1", item: "pacote de macarrão",         responsavel: "" },
  { id: "b12", quantidade: "1", item: "litro de óleo",              responsavel: "Silberto" },
  { id: "b13", quantidade: "1", item: "caixa de leite",             responsavel: "" },
  { id: "b14", quantidade: "1", item: "pacote de biscoito",         responsavel: "Pedro" },
  { id: "b15", quantidade: "1", item: "molho de tomate",            responsavel: "Thaís Macedo" },
  { id: "b16", quantidade: "1", item: "lata de sardinha",           responsavel: "Thaís Macedo" },
  { id: "b17", quantidade: "1", item: "pacote de milho de pipoca",  responsavel: "Marcelo (Rodrigo)" },
  { id: "b18", quantidade: "1", item: "pacote de canjica",          responsavel: "João Filho" },
  { id: "b19", quantidade: "1", item: "pacote de amendoim",         responsavel: "Sayonara (Sayô)" },
  { id: "b20", quantidade: "1", item: "vinho",                      responsavel: "Magda" },
  { id: "b21", quantidade: "1", item: "coca cola",                  responsavel: "João Filho" },
  { id: "b22", quantidade: "1", item: "leite condensado",           responsavel: "Neto" },
  { id: "b23", quantidade: "1", item: "leite condensado",           responsavel: "Lucas (Luquinhas)" },
  { id: "b24", quantidade: "1", item: "queijo coalho",              responsavel: "" },
  { id: "b25", quantidade: "1", item: "creme de leite",             responsavel: "Tia Bia" },
  { id: "b26", quantidade: "1", item: "creme de leite",             responsavel: "Isabella" },
  { id: "b27", quantidade: "1", item: "goiabada",                   responsavel: "Istefanie" },
  { id: "b28", quantidade: "1", item: "goiabada",                   responsavel: "Lorena" },
  { id: "b29", quantidade: "1", item: "caixa de chocolate",         responsavel: "" },
  { id: "b30", quantidade: "1", item: "kg de farinha de mandioca",  responsavel: "Maria Fernanda" },
  { id: "b31", quantidade: "1", item: "Surpresa",                   responsavel: "Cidinha" },
]

// 60 pessoas confirmadas (lista unificada e consolidada — aliases e duplicatas resolvidos)
export const INITIAL_PRESENCA: Presenca[] = [
  "Ana Lúcia", "Ana Maria", "André", "Andrea", "Andrezza (Andrezza Lucena)", "Angélica",
  "Arthur", "Assis", "Cidinha", "Cris", "Daniele", "Fabinho", "Fernando", "Gabriel",
  "Gabriela", "Gaspar", "Helber", "Isabella", "Isadora", "Istefanie", "João", "João Filho",
  "João Pedro", "Joãozinho", "Kaio", "Letícia", "Lorena", "Luana", "Lucas (Luquinhas)",
  "Magda", "Malu", "Manuela", "Marcão", "Marcelo (Rodrigo)", "Maria Fernanda", "Neto",
  "Nicole", "Nivaldo", "Nivianne", "Pablo", "Pavila", "Pedro Helber", "Pedro Henrique", "Priscila", "Regia",
  "Rita", "Rosa", "Sayonara (Sayô)", "Silberto", "Simon", "Simone", "Tetê",
  "Thaís Lucena", "Thaís Macedo", "Thiago", "Tia Bia", "Valentina", "Willy",
  "Ana Claudia", "Rodrigo",
].map((nome, i) => ({
  id: `p${i + 1}`,
  nome,
  familiares: "",
  criadoEm: "2026-07-10T00:00:00.000Z",
}))

export function uid() {
  return `i_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // silencioso
  }
}

export const loadPresenca = () => load<Presenca[]>(PRESENCA_KEY, INITIAL_PRESENCA)
export const loadComidas = () => load<Comida[]>(COMIDAS_KEY, INITIAL_COMIDAS)
export const loadBalaio = () => load<BalaioItem[]>(BALAIO_KEY, INITIAL_BALAIO)
export const loadUser = () => load<CurrentUser | null>(USER_KEY, null)
export const loadStep = () => load<number>(STEP_KEY, 1)

export const savePresenca = (v: Presenca[]) => save(PRESENCA_KEY, v)
export const saveComidas = (v: Comida[]) => save(COMIDAS_KEY, v)
export const saveBalaio = (v: BalaioItem[]) => save(BALAIO_KEY, v)
export const saveUser = (v: CurrentUser | null) => save(USER_KEY, v)
export const saveStep = (v: number) => save(STEP_KEY, v)

export function buildWhatsAppText(
  presenca: Presenca[],
  comidas: Comida[],
  balaio: BalaioItem[]
): string {
  const lines: string[] = []
  lines.push("🎉 *FESTA JUNINA — CONFIRMAÇÃO* 🎉\n")

  // Presença
  const totalFamiliares = presenca.reduce((sum, p) => {
    const famCount = p.familiares.trim()
      ? p.familiares.trim().split(/[,;\n]+/).filter(Boolean).length
      : 0
    return sum + 1 + famCount
  }, 0)
  lines.push(`📋 *LISTA DE PRESENÇA* (${presenca.length} responsáveis, ~${totalFamiliares} pessoas):`)
  if (presenca.length === 0) {
    lines.push("  (nenhuma confirmação ainda)")
  } else {
    presenca.forEach((p, i) => {
      const fam = p.familiares.trim() ? ` + ${p.familiares.trim()}` : ""
      lines.push(`${i + 1}. ${p.nome}${fam}`)
    })
  }
  lines.push("")

  // Comidas
  const comAssinadas = comidas.filter((c) => c.responsavel.trim()).length
  lines.push(`🌽 *COMIDAS TÍPICAS* (${comAssinadas}/${comidas.length} assinados):`)
  comidas.forEach((c, i) => {
    const r = c.responsavel.trim() ? ` — *${c.responsavel}*` : " — (livre)"
    lines.push(`${i + 1}. ${c.quantidade}x ${c.comida}${r}`)
  })
  lines.push("")

  // Balaio
  const balAssinados = balaio.filter((b) => b.responsavel.trim()).length
  lines.push(`🧺 *BALAIO JUNINO* (${balAssinados}/${balaio.length} assinados):`)
  balaio.forEach((b, i) => {
    const r = b.responsavel.trim() ? ` — *${b.responsavel}*` : " — (livre)"
    lines.push(`${i + 1}. ${b.quantidade} ${b.item}${r}`)
  })

  return lines.join("\n")
}

export function downloadJson(
  presenca: Presenca[],
  comidas: Comida[],
  balaio: BalaioItem[]
) {
  const data = {
    geradoEm: new Date().toISOString(),
    presenca,
    comidas,
    balaio,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "festa-junina-listas.json"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Gera um link wa.me que abre o WhatsApp com a mensagem pronta para enviar.
// O usuário escolhe o grupo/contato na tela do WhatsApp.
export function buildWhatsAppShareUrl(
  presenca: Presenca[],
  comidas: Comida[],
  balaio: BalaioItem[]
): string {
  const text = buildWhatsAppText(presenca, comidas, balaio)
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
