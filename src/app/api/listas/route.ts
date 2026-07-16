import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || "/tmp/festa-junina"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { presenca = [], comidas = [], balaio = [] } = body

    await fs.mkdir(DOWNLOAD_DIR, { recursive: true })

    // Salva tudo em um único JSON
    const jsonPath = path.join(DOWNLOAD_DIR, "festa-junina.json")
    await fs.writeFile(
      jsonPath,
      JSON.stringify(
        {
          geradoEm: new Date().toISOString(),
          presenca,
          comidas,
          balaio,
        },
        null,
        2
      ),
      "utf-8"
    )

    // Salva a lista de presença em Markdown
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
    await fs.writeFile(mdPath, mdLines.join("\n"), "utf-8")

    return NextResponse.json({ ok: true, files: [jsonPath, mdPath] })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
