import { Presenca, Comida, BalaioItem } from "./party"

export function parseWhatsAppText(
  text: string,
  currentComidas: Comida[],
  currentBalaio: BalaioItem[]
): { presenca: Presenca[], comidas: Comida[], balaio: BalaioItem[] } | null {
  try {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    
    let section: "presenca" | "comidas" | "balaio" | null = null
    const newPresenca: Presenca[] = []
    const newComidas = currentComidas.map(c => ({ ...c }))
    const newBalaio = currentBalaio.map(b => ({ ...b }))
    
    let comidaIndex = 0
    let balaioIndex = 0
    
    for (const line of lines) {
      if (line.includes("LISTA DE PRESENÇA")) {
        section = "presenca"
        continue
      }
      if (line.includes("COMIDAS TÍPICAS")) {
        section = "comidas"
        continue
      }
      if (line.includes("BALAIO JUNINO")) {
        section = "balaio"
        continue
      }
      
      const itemMatch = line.match(/^\d+\.\s+(.*)$/)
      if (!itemMatch) continue
      
      const content = itemMatch[1].trim()
      
      if (section === "presenca") {
        const parts = content.split(/\s*\+\s*/)
        let nome = parts[0].trim()
        let familiares = parts.slice(1).join(" + ").trim()
        
        // Remove markdown bold se a pessoa colou com *
        nome = nome.replace(/^\*|\*$/g, "").trim()
        
        newPresenca.push({
          id: "p_" + Date.now() + "_" + Math.random().toString(36).substring(7),
          nome,
          familiares,
          criadoEm: new Date().toISOString()
        })
      } else if (section === "comidas") {
        if (comidaIndex < newComidas.length) {
          const parts = content.split(/\s+[-—–]\s+/)
          if (parts.length > 1) {
            let resp = parts.pop()?.trim() || ""
            if (resp.includes("(livre)")) {
              resp = ""
            } else {
              resp = resp.replace(/^\*|\*$/g, "").trim()
            }
            newComidas[comidaIndex].responsavel = resp
          }
        }
        comidaIndex++
      } else if (section === "balaio") {
        if (balaioIndex < newBalaio.length) {
          const parts = content.split(/\s+[-—–]\s+/)
          if (parts.length > 1) {
            let resp = parts.pop()?.trim() || ""
            if (resp.includes("(livre)")) {
              resp = ""
            } else {
              resp = resp.replace(/^\*|\*$/g, "").trim()
            }
            newBalaio[balaioIndex].responsavel = resp
          }
        }
        balaioIndex++
      }
    }
    
    return {
      presenca: newPresenca,
      comidas: newComidas,
      balaio: newBalaio
    }
  } catch (err) {
    return null
  }
}
