"use client"

import { useEffect, useState } from "react"
import {
  Plus,
  Trash2,
  Send,
  Utensils,
  Save,
  ArrowLeft,
  ArrowRight,
  PenLine,
  Undo2,
  Users,
  ClipboardCopy,
  PartyPopper,
  ShoppingBasket,
  Download,
  RotateCcw,
  Check,
  Settings,
  Pencil,
  X,
  ExternalLink,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "sonner"
import {
  type Presenca,
  type Comida,
  type BalaioItem,
  type CurrentUser,
  INITIAL_COMIDAS,
  INITIAL_BALAIO,
  WHATSAPP_GROUP_URL,
  uid,
  loadPresenca,
  loadComidas,
  loadBalaio,
  loadUser,
  loadStep,
  savePresenca,
  saveComidas,
  saveBalaio,
  saveUser,
  saveStep,
  buildWhatsAppText,
  buildWhatsAppShareUrl,
  downloadJson,
} from "@/lib/party"
import { parseWhatsAppText } from "@/lib/parser"

const STEPS = [
  { n: 1, label: "Presença", icon: Users },
  { n: 2, label: "Comidas", icon: Utensils },
  { n: 3, label: "Balaio", icon: ShoppingBasket },
  { n: 4, label: "Resumo", icon: PartyPopper },
]

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-3">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const isActive = step === s.n
        const isDone = step > s.n
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-orange-600 text-white scale-110 shadow-md"
                    : isDone
                    ? "bg-green-600 text-white"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              <span
                className={`text-[10px] sm:text-xs ${
                  step >= s.n ? "text-orange-700 font-medium" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-4 sm:w-10 h-0.5 mx-0.5 ${step > s.n ? "bg-green-600" : "bg-orange-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function AdminPanel({
  presenca,
  comidas,
  balaio,
  onChangePresenca,
  onChangeComidas,
  onChangeBalaio,
  onClose,
}: {
  presenca: Presenca[]
  comidas: Comida[]
  balaio: BalaioItem[]
  onChangePresenca: (v: Presenca[]) => void
  onChangeComidas: (v: Comida[]) => void
  onChangeBalaio: (v: BalaioItem[]) => void
  onClose: () => void
}) {
  const [tab, setTab] = useState("presenca")
  const [importText, setImportText] = useState("")

  // ----- Estados de edição inline para Presença -----
  const [editPresencaId, setEditPresencaId] = useState<string | null>(null)
  const [editPresNome, setEditPresNome] = useState("")
  const [editPresFam, setEditPresFam] = useState("")
  const [newPresNome, setNewPresNome] = useState("")
  const [newPresFam, setNewPresFam] = useState("")

  // ----- Estados de edição inline para Comidas -----
  const [editComidaId, setEditComidaId] = useState<string | null>(null)
  const [editComQtd, setEditComQtd] = useState("")
  const [editComNome, setEditComNome] = useState("")
  const [editComResp, setEditComResp] = useState("")
  const [newComQtd, setNewComQtd] = useState("")
  const [newComNome, setNewComNome] = useState("")
  const [newComResp, setNewComResp] = useState("")

  // ----- Estados de edição inline para Balaio -----
  const [editBalaioId, setEditBalaioId] = useState<string | null>(null)
  const [editBalQtd, setEditBalQtd] = useState("")
  const [editBalItem, setEditBalItem] = useState("")
  const [editBalResp, setEditBalResp] = useState("")
  const [newBalQtd, setNewBalQtd] = useState("")
  const [newBalItem, setNewBalItem] = useState("")
  const [newBalResp, setNewBalResp] = useState("")

  // ----- Handlers Presença -----
  const addPresenca = () => {
    if (!newPresNome.trim()) {
      toast.error("Digite o nome.")
      return
    }
    onChangePresenca([
      ...presenca,
      {
        id: uid(),
        nome: newPresNome.trim(),
        familiares: newPresFam.trim(),
        criadoEm: new Date().toISOString(),
      },
    ])
    setNewPresNome("")
    setNewPresFam("")
    toast.success("Pessoa adicionada.")
  }

  const startEditPresenca = (p: Presenca) => {
    setEditPresencaId(p.id)
    setEditPresNome(p.nome)
    setEditPresFam(p.familiares)
  }

  const saveEditPresenca = (id: string) => {
    if (!editPresNome.trim()) {
      toast.error("Nome não pode ficar vazio.")
      return
    }
    onChangePresenca(
      presenca.map((p) =>
        p.id === id ? { ...p, nome: editPresNome.trim(), familiares: editPresFam.trim() } : p
      )
    )
    setEditPresencaId(null)
    toast.success("Pessoa atualizada.")
  }

  const removePresenca = (id: string) => {
    onChangePresenca(presenca.filter((p) => p.id !== id))
    toast.success("Pessoa removida.")
  }

  // ----- Handlers Comidas -----
  const addComida = () => {
    if (!newComNome.trim()) {
      toast.error("Digite o nome da comida.")
      return
    }
    onChangeComidas([
      ...comidas,
      {
        id: uid(),
        quantidade: newComQtd.trim() || "1",
        comida: newComNome.trim(),
        responsavel: newComResp.trim(),
      },
    ])
    setNewComQtd("")
    setNewComNome("")
    setNewComResp("")
    toast.success("Comida adicionada.")
  }

  const startEditComida = (c: Comida) => {
    setEditComidaId(c.id)
    setEditComQtd(c.quantidade)
    setEditComNome(c.comida)
    setEditComResp(c.responsavel)
  }

  const saveEditComida = (id: string) => {
    if (!editComNome.trim()) {
      toast.error("Comida não pode ficar vazia.")
      return
    }
    onChangeComidas(
      comidas.map((c) =>
        c.id === id
          ? {
              ...c,
              quantidade: editComQtd.trim() || "1",
              comida: editComNome.trim(),
              responsavel: editComResp.trim(),
            }
          : c
      )
    )
    setEditComidaId(null)
    toast.success("Comida atualizada.")
  }

  const removeComida = (id: string) => {
    onChangeComidas(comidas.filter((c) => c.id !== id))
    toast.success("Comida removida.")
  }

  // ----- Handlers Balaio -----
  const addBalaio = () => {
    if (!newBalItem.trim()) {
      toast.error("Digite o nome do item.")
      return
    }
    onChangeBalaio([
      ...balaio,
      {
        id: uid(),
        quantidade: newBalQtd.trim() || "1",
        item: newBalItem.trim(),
        responsavel: newBalResp.trim(),
      },
    ])
    setNewBalQtd("")
    setNewBalItem("")
    setNewBalResp("")
    toast.success("Item do balaio adicionado.")
  }

  const startEditBalaio = (b: BalaioItem) => {
    setEditBalaioId(b.id)
    setEditBalQtd(b.quantidade)
    setEditBalItem(b.item)
    setEditBalResp(b.responsavel)
  }

  const saveEditBalaio = (id: string) => {
    if (!editBalItem.trim()) {
      toast.error("Item não pode ficar vazio.")
      return
    }
    onChangeBalaio(
      balaio.map((b) =>
        b.id === id
          ? {
              ...b,
              quantidade: editBalQtd.trim() || "1",
              item: editBalItem.trim(),
              responsavel: editBalResp.trim(),
            }
          : b
      )
    )
    setEditBalaioId(null)
    toast.success("Item do balaio atualizado.")
  }

  const removeBalaio = (id: string) => {
    onChangeBalaio(balaio.filter((b) => b.id !== id))
    toast.success("Item do balaio removido.")
  }

  const handleImportText = () => {
    if (!importText.trim()) {
      toast.error("Cole o texto da lista primeiro.")
      return
    }
    const result = parseWhatsAppText(importText, comidas, balaio)
    if (result) {
      onChangePresenca(result.presenca)
      onChangeComidas(result.comidas)
      onChangeBalaio(result.balaio)
      toast.success("Listas importadas com sucesso! O banco foi atualizado.")
      setImportText("")
    } else {
      toast.error("Erro ao interpretar o texto. Verifique o formato.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-stretch sm:items-center justify-center sm:p-4">
      <div className="bg-amber-50 w-full sm:max-w-5xl sm:rounded-xl shadow-2xl flex flex-col max-h-screen sm:max-h-[92vh] overflow-hidden">
        {/* Header do admin */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-orange-700 to-red-700 text-white">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <div>
              <h2 className="text-lg font-bold">Painel Admin</h2>
              <p className="text-xs text-orange-100">
                Gerencie as 3 listas. Alterações são salvas automaticamente.
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white hover:bg-white/20 h-10 w-10 p-0"
            aria-label="Fechar admin"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-orange-200 bg-white flex-1 min-h-0 flex flex-col">
          <Tabs value={tab} onValueChange={setTab} className="w-full flex-1 min-h-0 flex flex-col">
            <div className="flex-shrink-0 px-4 sm:px-6 pt-3">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="presenca" className="gap-1.5">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Presença</span>
                  <Badge className="ml-1 bg-orange-100 text-orange-800 hover:bg-orange-100 border-0 text-xs">
                    {presenca.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="comidas" className="gap-1.5">
                  <Utensils className="w-4 h-4" />
                  <span className="hidden sm:inline">Comidas</span>
                  <Badge className="ml-1 bg-orange-100 text-orange-800 hover:bg-orange-100 border-0 text-xs">
                    {comidas.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="balaio" className="gap-1.5">
                  <ShoppingBasket className="w-4 h-4" />
                  <span className="hidden sm:inline">Balaio</span>
                  <Badge className="ml-1 bg-orange-100 text-orange-800 hover:bg-orange-100 border-0 text-xs">
                    {balaio.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="import" className="gap-1.5">
                  <Download className="w-4 h-4" />
                  <span className="hidden lg:inline">Importar</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Conteúdo das tabs — área com scroll */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {/* ===== Tab Presença ===== */}
              <TabsContent value="presenca" className="m-0 p-4 sm:p-6 space-y-4">
                <Card className="border-2 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Plus className="w-4 h-4 text-orange-600" />
                      Adicionar pessoa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
                      <div>
                        <Label className="text-xs text-muted-foreground">Nome *</Label>
                        <Input
                          value={newPresNome}
                          onChange={(e) => setNewPresNome(e.target.value)}
                          placeholder="Nome do responsável"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Familiares</Label>
                        <Input
                          value={newPresFam}
                          onChange={(e) => setNewPresFam(e.target.value)}
                          placeholder="Familiares (opcional)"
                        />
                      </div>
                      <Button onClick={addPresenca} className="bg-orange-600 hover:bg-orange-700 text-white h-10">
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">📋 Pessoas confirmadas ({presenca.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-orange-100">
                      {presenca.map((p, i) => (
                        <li key={p.id} className="flex items-start gap-2 p-3">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">
                            {i + 1}
                          </div>
                          {editPresencaId === p.id ? (
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Input
                                value={editPresNome}
                                onChange={(e) => setEditPresNome(e.target.value)}
                                placeholder="Nome"
                                className="h-9"
                              />
                              <Input
                                value={editPresFam}
                                onChange={(e) => setEditPresFam(e.target.value)}
                                placeholder="Familiares"
                                className="h-9"
                              />
                              <div className="flex gap-2 sm:col-span-2 justify-end">
                                <Button size="sm" variant="outline" onClick={() => setEditPresencaId(null)} className="h-8">
                                  <X className="w-4 h-4 mr-1" /> Cancelar
                                </Button>
                                <Button size="sm" onClick={() => saveEditPresenca(p.id)} className="h-8 bg-green-600 hover:bg-green-700">
                                  <Check className="w-4 h-4 mr-1" /> Salvar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{p.nome}</div>
                                {p.familiares.trim() && (
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    + {p.familiares}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-orange-700 hover:bg-orange-50"
                                  onClick={() => startEditPresenca(p)}
                                  aria-label="Editar"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                  onClick={() => removePresenca(p.id)}
                                  aria-label="Remover"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                      {presenca.length === 0 && (
                        <li className="p-6 text-center text-muted-foreground text-sm">
                          Nenhuma pessoa na lista.
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ===== Tab Comidas ===== */}
              <TabsContent value="comidas" className="m-0 p-4 sm:p-6 space-y-4">
                <Card className="border-2 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Plus className="w-4 h-4 text-orange-600" />
                      Adicionar comida
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_1fr_auto] gap-2 items-end">
                      <div>
                        <Label className="text-xs text-muted-foreground">Qtd.</Label>
                        <Input
                          value={newComQtd}
                          onChange={(e) => setNewComQtd(e.target.value)}
                          placeholder="10"
                          inputMode="numeric"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Comida *</Label>
                        <Input
                          value={newComNome}
                          onChange={(e) => setNewComNome(e.target.value)}
                          placeholder="Ex.: Bolo de milho"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Responsável</Label>
                        <Input
                          value={newComResp}
                          onChange={(e) => setNewComResp(e.target.value)}
                          placeholder="(opcional)"
                        />
                      </div>
                      <Button onClick={addComida} className="bg-orange-600 hover:bg-orange-700 text-white h-10">
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      🌽 Comidas ({comidas.length}) — {comidas.filter((c) => c.responsavel.trim()).length} assinadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-orange-100">
                      {comidas.map((c, i) => (
                        <li key={c.id} className="flex items-start gap-2 p-3">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">
                            {i + 1}
                          </div>
                          {editComidaId === c.id ? (
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-[80px_1fr_1fr] gap-2">
                              <Input
                                value={editComQtd}
                                onChange={(e) => setEditComQtd(e.target.value)}
                                placeholder="Qtd"
                                className="h-9"
                                inputMode="numeric"
                              />
                              <Input
                                value={editComNome}
                                onChange={(e) => setEditComNome(e.target.value)}
                                placeholder="Comida"
                                className="h-9"
                              />
                              <Input
                                value={editComResp}
                                onChange={(e) => setEditComResp(e.target.value)}
                                placeholder="Responsável"
                                className="h-9"
                              />
                              <div className="flex gap-2 sm:col-span-3 justify-end">
                                <Button size="sm" variant="outline" onClick={() => setEditComidaId(null)} className="h-8">
                                  <X className="w-4 h-4 mr-1" /> Cancelar
                                </Button>
                                <Button size="sm" onClick={() => saveEditComida(c.id)} className="h-8 bg-green-600 hover:bg-green-700">
                                  <Check className="w-4 h-4 mr-1" /> Salvar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                  <span className="font-bold text-orange-700 text-sm">{c.quantidade}x</span>
                                  <span className="font-medium text-sm break-words">{c.comida}</span>
                                </div>
                                {c.responsavel.trim() && (
                                  <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-0 text-xs">
                                    👤 {c.responsavel}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-orange-700 hover:bg-orange-50"
                                  onClick={() => startEditComida(c)}
                                  aria-label="Editar"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                  onClick={() => removeComida(c.id)}
                                  aria-label="Remover"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ===== Tab Balaio ===== */}
              <TabsContent value="balaio" className="m-0 p-4 sm:p-6 space-y-4">
                <Card className="border-2 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Plus className="w-4 h-4 text-orange-600" />
                      Adicionar item ao balaio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_1fr_auto] gap-2 items-end">
                      <div>
                        <Label className="text-xs text-muted-foreground">Qtd.</Label>
                        <Input
                          value={newBalQtd}
                          onChange={(e) => setNewBalQtd(e.target.value)}
                          placeholder="1"
                          inputMode="numeric"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Item *</Label>
                        <Input
                          value={newBalItem}
                          onChange={(e) => setNewBalItem(e.target.value)}
                          placeholder="Ex.: pacote de arroz"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Responsável</Label>
                        <Input
                          value={newBalResp}
                          onChange={(e) => setNewBalResp(e.target.value)}
                          placeholder="(opcional)"
                        />
                      </div>
                      <Button onClick={addBalaio} className="bg-orange-600 hover:bg-orange-700 text-white h-10">
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      🧺 Balaio ({balaio.length}) — {balaio.filter((b) => b.responsavel.trim()).length} assinados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-orange-100">
                      {balaio.map((b, i) => (
                        <li key={b.id} className="flex items-start gap-2 p-3">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">
                            {i + 1}
                          </div>
                          {editBalaioId === b.id ? (
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-[80px_1fr_1fr] gap-2">
                              <Input
                                value={editBalQtd}
                                onChange={(e) => setEditBalQtd(e.target.value)}
                                placeholder="Qtd"
                                className="h-9"
                                inputMode="numeric"
                              />
                              <Input
                                value={editBalItem}
                                onChange={(e) => setEditBalItem(e.target.value)}
                                placeholder="Item"
                                className="h-9"
                              />
                              <Input
                                value={editBalResp}
                                onChange={(e) => setEditBalResp(e.target.value)}
                                placeholder="Responsável"
                                className="h-9"
                              />
                              <div className="flex gap-2 sm:col-span-3 justify-end">
                                <Button size="sm" variant="outline" onClick={() => setEditBalaioId(null)} className="h-8">
                                  <X className="w-4 h-4 mr-1" /> Cancelar
                                </Button>
                                <Button size="sm" onClick={() => saveEditBalaio(b.id)} className="h-8 bg-green-600 hover:bg-green-700">
                                  <Check className="w-4 h-4 mr-1" /> Salvar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                  <span className="font-bold text-orange-700 text-sm">{b.quantidade}</span>
                                  <span className="font-medium text-sm break-words">{b.item}</span>
                                </div>
                                {b.responsavel.trim() && (
                                  <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-0 text-xs">
                                    👤 {b.responsavel}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-orange-700 hover:bg-orange-50"
                                  onClick={() => startEditBalaio(b)}
                                  aria-label="Editar"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                  onClick={() => removeBalaio(b.id)}
                                  aria-label="Remover"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ===== Tab Importar ===== */}
              <TabsContent value="import" className="m-0 p-4 sm:p-6 space-y-4">
                <Card className="border-2 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Download className="w-4 h-4 text-orange-600" />
                      Importar do WhatsApp
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Cole a lista completa enviada no WhatsApp aqui. O sistema vai extrair as confirmações e sobrescrever o banco de dados (Presença, Comidas e Balaio). 
                      <strong> Importante:</strong> Certifique-se de colar a lista inteira, desde "LISTA DE PRESENÇA" até o final do Balaio.
                    </p>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Cole o texto aqui..."
                      className="w-full h-64 p-3 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                    />
                    <Button onClick={handleImportText} className="bg-orange-600 hover:bg-orange-700 text-white w-full h-10">
                      <Download className="w-4 h-4 mr-2" />
                      Sincronizar Banco de Dados
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            {/* Footer do admin */}
            <div className="flex-shrink-0 border-t border-orange-200 bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Todas as alterações são salvas automaticamente (navegador + servidor).
              </p>
              <Button onClick={onClose} className="bg-orange-600 hover:bg-orange-700 text-white h-9">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar ao fluxo
              </Button>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [hydrated, setHydrated] = useState(false)
  const [step, setStep] = useState(1)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [presenca, setPresenca] = useState<Presenca[]>([])
  const [comidas, setComidas] = useState<Comida[]>(INITIAL_COMIDAS)
  const [balaio, setBalaio] = useState<BalaioItem[]>(INITIAL_BALAIO)
  const [adminMode, setAdminMode] = useState(false)

  // Formulário da etapa 1
  const [nome, setNome] = useState("")
  const [familiares, setFamiliares] = useState("")

  // Sync do servidor
  const syncFromServer = async () => {
    try {
      const res = await fetch("/api/listas")
      if (res.ok) {
        const { state } = await res.json()
        if (state) {
          setPresenca(state.presenca || [])
          setComidas(state.comidas || INITIAL_COMIDAS)
          setBalaio(state.balaio || INITIAL_BALAIO)
        }
      }
    } catch (err) {
      console.error("Erro ao sincronizar do servidor:", err)
    }
  }

  // Hidratar do localStorage e sincronizar
  useEffect(() => {
    const p = loadPresenca()
    const c = loadComidas()
    const b = loadBalaio()
    const u = loadUser()
    const s = loadStep()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPresenca(p)
    setComidas(c)
    setBalaio(b)
    setCurrentUser(u)
    setStep(s)
    if (u) {
      setNome(u.nome)
      setFamiliares(u.familiares)
    }
    setHydrated(true)
    
    // Busca inicial do servidor após hidratar
    syncFromServer()
    
    // Sincronização periódica (10s)
    const interval = setInterval(syncFromServer, 10000)
    return () => clearInterval(interval)
  }, [])

  // Persistir
  useEffect(() => {
    if (hydrated) savePresenca(presenca)
  }, [presenca, hydrated])
  useEffect(() => {
    if (hydrated) saveComidas(comidas)
  }, [comidas, hydrated])
  useEffect(() => {
    if (hydrated) saveBalaio(balaio)
  }, [balaio, hydrated])
  useEffect(() => {
    if (hydrated) saveUser(currentUser)
  }, [currentUser, hydrated])
  useEffect(() => {
    if (hydrated) saveStep(step)
  }, [step, hydrated])

  // Salvar no servidor (debounced) — gera festa-junina.json + presenca.md
  useEffect(() => {
    if (!hydrated) return
    const t = setTimeout(() => {
      fetch("/api/listas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presenca, comidas, balaio }),
      }).catch(() => {})
    }, 1000)
    return () => clearTimeout(t)
  }, [presenca, comidas, balaio, hydrated])

  // ---------- Handlers ----------
  const handleConfirmarPresenca = () => {
    if (!nome.trim()) {
      toast.error("Digite seu nome para confirmar a presença.")
      return
    }
    const user: CurrentUser = { nome: nome.trim(), familiares: familiares.trim() }
    setCurrentUser(user)
    setPresenca((prev) => {
      const exists = prev.find((p) => p.nome.toLowerCase() === user.nome.toLowerCase())
      if (exists) {
        return prev.map((p) =>
          p.nome.toLowerCase() === user.nome.toLowerCase()
            ? { ...p, familiares: user.familiares }
            : p
        )
      }
      return [
        ...prev,
        {
          id: uid(),
          nome: user.nome,
          familiares: user.familiares,
          criadoEm: new Date().toISOString(),
        },
      ]
    })
    setStep(2)
    toast.success(`Presença confirmada, ${user.nome}! 🎉`)
  }

  const handleAssinarComida = (id: string) => {
    if (!currentUser) return
    setComidas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, responsavel: currentUser.nome } : c))
    )
    toast.success("Item assinado! Obrigado pela contribuição.")
  }

  const handleDesistirComida = (id: string) => {
    setComidas((prev) => prev.map((c) => (c.id === id ? { ...c, responsavel: "" } : c)))
    toast.success("Item liberado.")
  }

  const handleAssinarBalaio = (id: string) => {
    if (!currentUser) return
    setBalaio((prev) =>
      prev.map((b) => (b.id === id ? { ...b, responsavel: currentUser.nome } : b))
    )
    toast.success("Item do balaio assinado! 🧺")
  }

  const handleDesistirBalaio = (id: string) => {
    setBalaio((prev) => prev.map((b) => (b.id === id ? { ...b, responsavel: "" } : b)))
    toast.success("Item liberado.")
  }

  const handleRemovePresenca = (id: string) => {
    setPresenca((prev) => prev.filter((p) => p.id !== id))
    toast.success("Presença removida.")
  }

  const handleShareWhatsApp = () => {
    // wa.me/?text=... abre o WhatsApp (app ou web) com a mensagem pronta
    // para enviar. O usuário escolhe o grupo/contato na tela do WhatsApp.
    const url = buildWhatsAppShareUrl(presenca, comidas, balaio)
    window.open(url, "_blank", "noopener,noreferrer")
    toast.success(
      "WhatsApp aberto com a mensagem pronta! Escolha o grupo e toque em enviar.",
      { duration: 7000 }
    )
  }

  const handleOpenGroup = () => {
    // Abre diretamente o grupo do WhatsApp (sem texto pré-preenchido)
    window.open(WHATSAPP_GROUP_URL, "_blank", "noopener,noreferrer")
  }

  const handleCopyText = async () => {
    const text = buildWhatsAppText(presenca, comidas, balaio)
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Texto copiado para a área de transferência.")
    } catch {
      toast.error("Não foi possível copiar.")
    }
  }

  const handleDownload = () => {
    downloadJson(presenca, comidas, balaio)
    toast.success("Arquivo JSON baixado!")
  }

  const handleNovaConfirmacao = () => {
    setCurrentUser(null)
    setNome("")
    setFamiliares("")
    setStep(1)
    toast.info("Pronto para a próxima confirmação!")
  }

  // Guarda: se está em etapa >1 sem usuário, volta para 1
  useEffect(() => {
    if (hydrated && step > 1 && !currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(1)
    }
  }, [hydrated, step, currentUser])

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-orange-700">Carregando...</p>
      </div>
    )
  }

  // Contadores
  const comAssinadas = comidas.filter((c) => c.responsavel.trim()).length
  const balAssinados = balaio.filter((b) => b.responsavel.trim()).length
  const minhasComidas = currentUser
    ? comidas.filter((c) => c.responsavel === currentUser.nome).length
    : 0
  const meusBalaio = currentUser
    ? balaio.filter((b) => b.responsavel === currentUser.nome).length
    : 0

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 text-foreground">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-5 sm:py-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white/20 backdrop-blur rounded-full p-2.5 sm:p-3 flex-shrink-0">
              <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                🎉 Festa Junina — Confirmação
              </h1>
              <p className="text-amber-100 text-xs sm:text-sm mt-0.5">
                Confirme sua presença, escolha sua comida e assine um item do balaio.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => setAdminMode(true)}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur h-10 px-3"
                aria-label="Painel admin"
              >
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline text-sm font-medium">Admin</span>
              </Button>
              <Button
                onClick={() => {
                  const url = buildWhatsAppShareUrl(presenca, comidas, balaio)
                  window.open(url, "_blank", "noopener,noreferrer")
                  toast.success("Abrindo WhatsApp com a lista completa…")
                }}
                variant="secondary"
                className="bg-green-500 hover:bg-green-600 text-white border-0 h-10 px-3 shadow-md"
                aria-label="Enviar listas no WhatsApp"
                title="Enviar a lista completa (presença + comidas + balaio) no WhatsApp"
              >
                <MessageCircle className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline text-sm font-medium">Enviar listas</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Painel Admin (modal-like overlay) */}
      {adminMode && (
        <AdminPanel
          presenca={presenca}
          comidas={comidas}
          balaio={balaio}
          onChangePresenca={setPresenca}
          onChangeComidas={setComidas}
          onChangeBalaio={setBalaio}
          onClose={() => setAdminMode(false)}
        />
      )}

      {/* Stepper */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-orange-200">
        <div className="max-w-4xl mx-auto px-4">
          <Stepper step={step} />
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-24">
        {/* ============ ETAPA 1: PRESENÇA ============ */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="border-2 border-orange-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  Confirme sua presença
                </CardTitle>
                <CardDescription>
                  Seu nome será usado como responsável nas próximas etapas. Tudo é salvo automaticamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome" className="text-sm font-medium">
                    Seu nome (responsável) *
                  </Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConfirmarPresenca()
                    }}
                    placeholder="Digite seu nome completo"
                    className="mt-1.5 h-12 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="familiares" className="text-sm font-medium">
                    Familiares que irão com você
                  </Label>
                  <Textarea
                    id="familiares"
                    value={familiares}
                    onChange={(e) => setFamiliares(e.target.value)}
                    placeholder="Ex.: Maria (esposa), João (filho), Tia Ana..."
                    className="mt-1.5 min-h-[100px] resize-y"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Liste as pessoas que vão com você. Separe por vírgula ou linha.
                  </p>
                </div>
                <Button
                  onClick={handleConfirmarPresenca}
                  className="w-full h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Confirmar presença
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Lista de presença já confirmada */}
            <Card className="border-2 border-orange-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>📋 Pessoas confirmadas</span>
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-0">
                    {presenca.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-72 overflow-y-auto">
                  {presenca.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground text-sm">
                      Nenhuma confirmação ainda. Seja o primeiro! 🎈
                    </div>
                  ) : (
                    <ul className="divide-y divide-orange-100">
                      {presenca.map((p, i) => (
                        <li key={p.id} className="flex items-start gap-3 p-3 hover:bg-amber-50/50">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{p.nome}</div>
                            {p.familiares.trim() && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                + {p.familiares}
                              </div>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                            onClick={() => handleRemovePresenca(p.id)}
                            aria-label="Remover presença"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ============ ETAPA 2: COMIDAS ============ */}
        {step === 2 && currentUser && (
          <div className="space-y-4">
            <Card className="border-2 border-orange-200 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌽</span>
                  <div>
                    <h2 className="text-lg font-bold text-orange-800">
                      Olá, {currentUser.nome}! 👋
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Toque em <strong>Assinar</strong> no item que você vai levar. Você pode assinar mais de um.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-muted-foreground">
                    <strong className="text-orange-700">{comAssinadas}</strong>/{comidas.length} assinados
                  </span>
                  <span className="text-muted-foreground">
                    Você assinou: <strong className="text-green-700">{minhasComidas}</strong>
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-600" />
                  Comidas típicas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[55vh] overflow-y-auto">
                  <ul className="divide-y divide-orange-100">
                    {comidas.map((c, idx) => {
                      const isMine = c.responsavel.trim() === currentUser.nome
                      const isTaken = c.responsavel.trim() && !isMine
                      return (
                        <li
                          key={c.id}
                          className="flex items-center gap-3 p-3 hover:bg-amber-50/50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="font-bold text-orange-700">
                                {c.quantidade}x
                              </span>
                              <span className="font-medium text-sm break-words">{c.comida}</span>
                            </div>
                            {c.responsavel.trim() && (
                              <Badge
                                className={`mt-1 border-0 ${
                                  isMine
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                👤 {c.responsavel}
                              </Badge>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            {!c.responsavel.trim() && (
                              <Button
                                size="sm"
                                onClick={() => handleAssinarComida(c.id)}
                                className="h-8 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <PenLine className="w-4 h-4 mr-1" />
                                Assinar
                              </Button>
                            )}
                            {isMine && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDesistirComida(c.id)}
                                className="h-8 border-amber-300 text-amber-700 hover:bg-amber-50"
                              >
                                <Undo2 className="w-4 h-4 mr-1" />
                                Desistir
                              </Button>
                            )}
                            {isTaken && (
                              <Badge variant="outline" className="text-muted-foreground border-gray-200">
                                Indisponível
                              </Badge>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Navegação */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="h-12 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Voltar
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white"
              >
                Próxima etapa: Balaio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ============ ETAPA 3: BALAIO ============ */}
        {step === 3 && currentUser && (
          <div className="space-y-4">
            <Card className="border-2 border-orange-200 shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧺</span>
                  <div>
                    <h2 className="text-lg font-bold text-orange-800">
                      Balaio Junino
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Assine <strong>1 item por adulto</strong>. Se for um casal, assine 2 itens.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-muted-foreground">
                    <strong className="text-orange-700">{balAssinados}</strong>/{balaio.length} assinados
                  </span>
                  <span className="text-muted-foreground">
                    Você assinou: <strong className="text-green-700">{meusBalaio}</strong>
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingBasket className="w-4 h-4 text-orange-600" />
                  Itens do balaio
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[55vh] overflow-y-auto">
                  <ul className="divide-y divide-orange-100">
                    {balaio.map((b, idx) => {
                      const isMine = b.responsavel.trim() === currentUser.nome
                      const isTaken = b.responsavel.trim() && !isMine
                      return (
                        <li
                          key={b.id}
                          className="flex items-center gap-3 p-3 hover:bg-amber-50/50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="font-bold text-orange-700">
                                {b.quantidade}
                              </span>
                              <span className="font-medium text-sm break-words">{b.item}</span>
                            </div>
                            {b.responsavel.trim() && (
                              <Badge
                                className={`mt-1 border-0 ${
                                  isMine
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                👤 {b.responsavel}
                              </Badge>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            {!b.responsavel.trim() && (
                              <Button
                                size="sm"
                                onClick={() => handleAssinarBalaio(b.id)}
                                className="h-8 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <PenLine className="w-4 h-4 mr-1" />
                                Assinar
                              </Button>
                            )}
                            {isMine && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDesistirBalaio(b.id)}
                                className="h-8 border-amber-300 text-amber-700 hover:bg-amber-50"
                              >
                                <Undo2 className="w-4 h-4 mr-1" />
                                Desistir
                              </Button>
                            )}
                            {isTaken && (
                              <Badge variant="outline" className="text-muted-foreground border-gray-200">
                                Indisponível
                              </Badge>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Navegação */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="h-12 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Voltar
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="flex-1 h-12 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white"
              >
                Ver resumo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ============ ETAPA 4: RESUMO ============ */}
        {step === 4 && currentUser && (
          <div className="space-y-4">
            <Card className="border-2 border-green-300 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-6 pb-5 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h2 className="text-xl font-bold text-green-800">
                  Tudo pronto, {currentUser.nome}!
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sua confirmação foi registrada. Compartilhe as listas no grupo do WhatsApp.
                </p>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="border-2 border-orange-200 text-center">
                <CardContent className="pt-4 pb-4">
                  <div className="text-2xl font-bold text-orange-700">{presenca.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Confirmados</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-orange-200 text-center">
                <CardContent className="pt-4 pb-4">
                  <div className="text-2xl font-bold text-orange-700">
                    {comAssinadas}/{comidas.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Comidas</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-orange-200 text-center">
                <CardContent className="pt-4 pb-4">
                  <div className="text-2xl font-bold text-orange-700">
                    {balAssinados}/{balaio.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Balaio</div>
                </CardContent>
              </Card>
            </div>

            {/* Minhas contribuições */}
            <Card className="border-2 border-orange-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">✅ Suas contribuições</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">🌽 Comidas que você vai levar:</span>
                  {minhasComidas === 0 ? (
                    <span className="ml-1 text-amber-600 font-medium">nenhuma ainda</span>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {comidas
                        .filter((c) => c.responsavel === currentUser.nome)
                        .map((c) => (
                          <li key={c.id} className="flex items-center gap-2">
                            <span className="font-bold text-orange-700">{c.quantidade}x</span>
                            <span>{c.comida}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
                <Separator className="bg-orange-100" />
                <div>
                  <span className="text-muted-foreground">🧺 Itens do balaio que você assinou:</span>
                  {meusBalaio === 0 ? (
                    <span className="ml-1 text-amber-600 font-medium">nenhum ainda</span>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {balaio
                        .filter((b) => b.responsavel === currentUser.nome)
                        .map((b) => (
                          <li key={b.id} className="flex items-center gap-2">
                            <span className="font-bold text-orange-700">{b.quantidade}</span>
                            <span>{b.item}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ações principais */}
            <div className="space-y-3">
              <Button
                onClick={handleShareWhatsApp}
                className="w-full h-14 text-base font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Compartilhar listas no WhatsApp
              </Button>
              <p className="text-xs text-center text-muted-foreground -mt-1">
                Abre o WhatsApp com a mensagem pronta — escolha o grupo e toque em enviar.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleOpenGroup}
                  variant="outline"
                  className="flex-1 h-11 border-green-300 text-green-700 hover:bg-green-50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir grupo
                </Button>
                <Button
                  onClick={handleCopyText}
                  variant="outline"
                  className="flex-1 h-11 border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <ClipboardCopy className="w-4 h-4 mr-2" />
                  Copiar texto
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 h-11 border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar JSON
                </Button>
              </div>
              <Button
                onClick={handleNovaConfirmacao}
                variant="ghost"
                className="w-full h-11 text-muted-foreground hover:text-orange-700 hover:bg-orange-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Nova confirmação (outra pessoa)
              </Button>
            </div>

            {/* Voltar */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(3)}
                className="h-11 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Voltar ao balaio
              </Button>
            </div>

            <Separator className="my-4 bg-orange-200" />
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p className="flex items-center justify-center gap-1">
                <Save className="w-3 h-3" />
                Todas as listas são salvas automaticamente (navegador + arquivo no servidor).
              </p>
              <p>
                Ao compartilhar no WhatsApp, o texto é copiado e o grupo é aberto — basta colar.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-orange-900/95 text-amber-100 text-center text-xs py-4 mt-auto">
        <p className="max-w-4xl mx-auto px-4">
          🎊 Festa Junina — Confirmação de Presença, Comidas e Balaio. Feito com carinho.
        </p>
      </footer>

      <Toaster />
    </div>
  )
}
