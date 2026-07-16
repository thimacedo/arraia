import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { redis } from "@/lib/redis"

const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || "/tmp/festa-junina"
const REDIS_KEY = "arraia:state"

export async function GET() {
  try {
    if (redis) {
      const state = await redis.get(REDIS_KEY)
      if (state) {
        return NextResponse.json({ ok: true, state })
      }
    }
    return NextResponse.json({ ok: true, state: null })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { presenca = [], comidas = [], balaio = [] } = body

    const stateToSave = {
      geradoEm: new Date().toISOString(),
      presenca,
      comidas,
      balaio,
    }

    // Grava no Redis como fonte de verdade (se configurado)
    if (redis) {
      await redis.set(REDIS_KEY, stateToSave)
    }

    // Grava em /tmp como backup best-effort
    await fs.mkdir(DOWNLOAD_DIR, { recursive: true }).catch(() => {})

    const jsonPath = path.join(DOWNLOAD_DIR, "festa-junina.json")
    await fs.writeFile(jsonPath, JSON.stringify(stateToSave, null, 2), "utf-8").catch(() => {})

    const mdLines: string[] = []
    mdLines.push("# Lista de Presença — Festa Junina\n")
    mdLines.push(`Gerado em: ${new Date().toLocaleString("pt-BR")}\n`)
    mdLines.push(`Total de responsáveis: ${presenca.length}\n`)
    mdLines.push("")
    mdLines.push("| # | Responsável | Familiares |")
    mdLines.push("|---|-------------|------------|")
    presenca.forEach((p: { nome: string; familiares: string }, i: number) => {
      const fam = (p.familiares || "").trim() || "—"
      mdLines.push(`| ${i + 1} | ${p.nome} | ${fam} |`)
    })
    const mdPath = path.join(DOWNLOAD_DIR, "presenca.md")
    await fs.writeFile(mdPath, mdLines.join("\n"), "utf-8").catch(() => {})

    return NextResponse.json({ ok: true, files: [jsonPath, mdPath] })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
