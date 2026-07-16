#!/usr/bin/env python3
"""Atualiza festa-junina.json e presenca.md com o estado mais recente."""
import json
from datetime import datetime, timezone
from pathlib import Path

DOWNLOAD_DIR = Path("/home/z/my-project/download")
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Presença (60 responsáveis — lista unificada e consolidada)
presenca_nomes = [
    "Ana Lúcia", "Ana Maria", "André", "Andrea", "Andrezza (Andrezza Lucena)", "Angélica",
    "Arthur", "Assis", "Cidinha", "Cris", "Daniele", "Fabinho", "Fernando", "Gabriel",
    "Gabriela", "Gaspar", "Helber", "Isabella", "Isadora", "Istefanie", "João", "João Filho",
    "João Pedro", "Joãozinho", "Kaio", "Letícia", "Lorena", "Luana", "Lucas (Luquinhas)",
    "Magda", "Malu", "Manuela", "Marcão", "Marcelo (Rodrigo)", "Maria Fernanda", "Neto",
    "Nicole", "Nivaldo", "Nivianne", "Pablo", "Pavila", "Pedro Helber", "Pedro Henrique", "Priscila", "Regia",
    "Rita", "Rosa", "Sayonara (Sayô)", "Silberto", "Simon", "Simone", "Tetê",
    "Thaís Lucena", "Thaís Macedo", "Thiago", "Tia Bia", "Valentina", "Willy",
    "Ana Claudia", "Rodrigo",
]
presenca = [
    {"id": f"p{i+1}", "nome": n, "familiares": "", "criadoEm": "2026-07-10T00:00:00.000Z"}
    for i, n in enumerate(presenca_nomes)
]

# Comidas (53 itens — lista unificada)
comidas = [
    {"id": "c1",  "quantidade": "1",   "comida": "Caldo (tipo a sua escolha)",   "responsavel": "Thiago"},
    {"id": "c2",  "quantidade": "1",   "comida": "Caldo (tipo a sua escolha)",   "responsavel": "Andrezza (Andrezza Lucena)"},
    {"id": "c3",  "quantidade": "20",  "comida": "mini Cachorro-quente",         "responsavel": "Neto"},
    {"id": "c4",  "quantidade": "20",  "comida": "mini cachorro-quente",         "responsavel": "Thaís Macedo"},
    {"id": "c5",  "quantidade": "20",  "comida": "mini cachorro-quente",         "responsavel": ""},
    {"id": "c6",  "quantidade": "10",  "comida": "Milho cozido",                 "responsavel": "Sayonara (Sayô)"},
    {"id": "c7",  "quantidade": "10",  "comida": "Milho cozido",                 "responsavel": "Sayonara (Sayô)"},
    {"id": "c8",  "quantidade": "1",   "comida": "Empadão",                      "responsavel": ""},
    {"id": "c9",  "quantidade": "1",   "comida": "Empadão",                      "responsavel": ""},
    {"id": "c10", "quantidade": "1",   "comida": "Empadão",                      "responsavel": ""},
    {"id": "c11", "quantidade": "1",   "comida": "Torta salgada",                "responsavel": ""},
    {"id": "c12", "quantidade": "1",   "comida": "Torta salgada",                "responsavel": ""},
    {"id": "c13", "quantidade": "1",   "comida": "Torta salgada",                "responsavel": "Ana Claudia"},
    {"id": "c14", "quantidade": "100", "comida": "Salgados",                     "responsavel": "Fabinho"},
    {"id": "c15", "quantidade": "100", "comida": "Salgados",                     "responsavel": "Cidinha"},
    {"id": "c16", "quantidade": "100", "comida": "Salgados",                     "responsavel": "João Filho"},
    {"id": "c17", "quantidade": "100", "comida": "Salgados",                     "responsavel": "Gabriel"},
    {"id": "c18", "quantidade": "10",  "comida": "Cuscuz temperado",             "responsavel": "Marcelo (Rodrigo)"},
    {"id": "c19", "quantidade": "10",  "comida": "Cuscuz temperado",             "responsavel": ""},
    {"id": "c20", "quantidade": "10",  "comida": "Cuscuz temperado",             "responsavel": ""},
    {"id": "c21", "quantidade": "20",  "comida": "mini sanduíches",              "responsavel": ""},
    {"id": "c22", "quantidade": "20",  "comida": "mini sanduíches",              "responsavel": ""},
    {"id": "c23", "quantidade": "20",  "comida": "mini sanduíches",              "responsavel": ""},
    {"id": "c24", "quantidade": "10",  "comida": "Arroz-doce",                   "responsavel": "Regia"},
    {"id": "c25", "quantidade": "10",  "comida": "Arroz-doce",                   "responsavel": ""},
    {"id": "c26", "quantidade": "10",  "comida": "Arroz-doce",                   "responsavel": ""},
    {"id": "c27", "quantidade": "1",   "comida": "Pote de Paçoquinhas",          "responsavel": "Silberto"},
    {"id": "c28", "quantidade": "1",   "comida": "Bolo de milho",                "responsavel": "Istefanie"},
    {"id": "c29", "quantidade": "1",   "comida": "Bolo de macaxeira",            "responsavel": "Rosa"},
    {"id": "c30", "quantidade": "1",   "comida": "Bolo de cenoura com chocolate","responsavel": "Rodrigo"},
    {"id": "c31", "quantidade": "1",   "comida": "Canjica",                      "responsavel": "Tia Bia"},
    {"id": "c32", "quantidade": "20",  "comida": "Saquinhos com pipoca",         "responsavel": ""},
    {"id": "c33", "quantidade": "20",  "comida": "Saquinhos com pipoca",         "responsavel": ""},
    {"id": "c34", "quantidade": "10",  "comida": "Espigas de Milho para assar",  "responsavel": "Regia"},
    {"id": "c35", "quantidade": "10",  "comida": "Espigas de Milho para assar",  "responsavel": ""},
    {"id": "c36", "quantidade": "10",  "comida": "Espigas de Milho para assar",  "responsavel": ""},
    {"id": "c37", "quantidade": "5",   "comida": "Pamonhas",                     "responsavel": ""},
    {"id": "c38", "quantidade": "5",   "comida": "Pamonhas",                     "responsavel": "Fernando"},
    {"id": "c39", "quantidade": "5",   "comida": "Pamonhas",                     "responsavel": ""},
    {"id": "c40", "quantidade": "5",   "comida": "Pamonhas",                     "responsavel": ""},
    {"id": "c41", "quantidade": "30",  "comida": "Pratos descartáveis",          "responsavel": "André"},
    {"id": "c42", "quantidade": "30",  "comida": "Pratos descartáveis",          "responsavel": "Thaís Lucena"},
    {"id": "c43", "quantidade": "30",  "comida": "Pratos descartáveis",          "responsavel": "Lucas (Luquinhas)"},
    {"id": "c44", "quantidade": "20",  "comida": "Cubas p/ caldo descartáveis",  "responsavel": "Magda"},
    {"id": "c45", "quantidade": "20",  "comida": "Cubas p/ caldo descartáveis",  "responsavel": "Magda"},
    {"id": "c46", "quantidade": "50",  "comida": "Garfos",                       "responsavel": "Cris"},
    {"id": "c47", "quantidade": "50",  "comida": "Garfos",                       "responsavel": "Thaís Lucena"},
    {"id": "c48", "quantidade": "50",  "comida": "Colheres",                     "responsavel": "Lucas (Luquinhas)"},
    {"id": "c49", "quantidade": "50",  "comida": "Colheres",                     "responsavel": "Lucas (Luquinhas)"},
    {"id": "c50", "quantidade": "50",  "comida": "Colheres",                     "responsavel": "Lucas (Luquinhas)"},
    {"id": "c51", "quantidade": "100", "comida": "Copos descartáveis",           "responsavel": "João Filho"},
    {"id": "c52", "quantidade": "100", "comida": "Copos descartáveis",           "responsavel": "Isabella"},
    {"id": "c53", "quantidade": "100", "comida": "Copos descartáveis",           "responsavel": "Maria Fernanda"},
]

# Balaio (31 itens — lista unificada)
balaio = [
    {"id": "b1",  "quantidade": "1", "item": "kg de arroz",                "responsavel": "Cidinha"},
    {"id": "b2",  "quantidade": "1", "item": "kg de feijão",               "responsavel": "Rosa"},
    {"id": "b3",  "quantidade": "1", "item": "pacote de macarrão",         "responsavel": "Sayonara (Sayô)"},
    {"id": "b4",  "quantidade": "1", "item": "kg de açúcar",               "responsavel": "Andrezza (Andrezza Lucena)"},
    {"id": "b5",  "quantidade": "1", "item": "pacote de café",             "responsavel": "Fabinho"},
    {"id": "b6",  "quantidade": "1", "item": "pacote de café",             "responsavel": "André"},
    {"id": "b7",  "quantidade": "1", "item": "pacote de farinha de trigo", "responsavel": "Ana Claudia"},
    {"id": "b8",  "quantidade": "1", "item": "pacote de fubá",             "responsavel": "Thaís Lucena"},
    {"id": "b9",  "quantidade": "1", "item": "pacote de fubá",             "responsavel": "Thaís Lucena"},
    {"id": "b10", "quantidade": "1", "item": "pacote de macarrão",         "responsavel": "Rodrigo"},
    {"id": "b11", "quantidade": "1", "item": "pacote de macarrão",         "responsavel": ""},
    {"id": "b12", "quantidade": "1", "item": "litro de óleo",              "responsavel": "Silberto"},
    {"id": "b13", "quantidade": "1", "item": "caixa de leite",             "responsavel": "Gabriel"},
    {"id": "b14", "quantidade": "1", "item": "pacote de biscoito",         "responsavel": "Pedro"},
    {"id": "b15", "quantidade": "1", "item": "molho de tomate",            "responsavel": "Thaís Macedo"},
    {"id": "b16", "quantidade": "1", "item": "lata de sardinha",           "responsavel": "Thaís Macedo"},
    {"id": "b17", "quantidade": "1", "item": "pacote de milho de pipoca",  "responsavel": "Marcelo (Rodrigo)"},
    {"id": "b18", "quantidade": "1", "item": "pacote de canjica",          "responsavel": "João Filho"},
    {"id": "b19", "quantidade": "1", "item": "pacote de amendoim",         "responsavel": "Sayonara (Sayô)"},
    {"id": "b20", "quantidade": "1", "item": "vinho",                      "responsavel": "Magda"},
    {"id": "b21", "quantidade": "1", "item": "coca cola",                  "responsavel": "João Filho"},
    {"id": "b22", "quantidade": "1", "item": "leite condensado",           "responsavel": "Neto"},
    {"id": "b23", "quantidade": "1", "item": "leite condensado",           "responsavel": "Lucas (Luquinhas)"},
    {"id": "b24", "quantidade": "1", "item": "queijo coalho",              "responsavel": ""},
    {"id": "b25", "quantidade": "1", "item": "creme de leite",             "responsavel": "Tia Bia"},
    {"id": "b26", "quantidade": "1", "item": "creme de leite",             "responsavel": "Isabella"},
    {"id": "b27", "quantidade": "1", "item": "goiabada",                   "responsavel": "Istefanie"},
    {"id": "b28", "quantidade": "1", "item": "goiabada",                   "responsavel": "Lorena"},
    {"id": "b29", "quantidade": "1", "item": "caixa de chocolate",         "responsavel": ""},
    {"id": "b30", "quantidade": "1", "item": "kg de farinha de mandioca",  "responsavel": "Maria Fernanda"},
    {"id": "b31", "quantidade": "1", "item": "Surpresa",                   "responsavel": "Cidinha"},
    {"id": "b32", "quantidade": "1", "item": "pacote de farinha de trigo",    "responsavel": "Regia"},
    {"id": "b33", "quantidade": "1", "item": "pacote de massa para cuscuz",  "responsavel": "Regia"},
]

data = {
    "geradoEm": datetime.now(timezone.utc).isoformat(),
    "presenca": presenca,
    "comidas": comidas,
    "balaio": balaio,
}

json_path = DOWNLOAD_DIR / "festa-junina.json"
json_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")

# Markdown de presença
md_lines = [
    "# Lista de Presença — Festa Junina",
    "",
    f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}",
    f"Total de responsáveis: {len(presenca)}",
    "",
    "| # | Responsável | Familiares |",
    "|---|-------------|------------|",
]
for i, p in enumerate(presenca, 1):
    fam = (p["familiares"] or "").strip() or "—"
    md_lines.append(f"| {i} | {p['nome']} | {fam} |")
md_path = DOWNLOAD_DIR / "presenca.md"
md_path.write_text("\n".join(md_lines), encoding="utf-8")

# Resumo
com_assinados = sum(1 for c in comidas if c["responsavel"].strip())
bal_assinados = sum(1 for b in balaio if b["responsavel"].strip())
print(f"OK JSON salvo em {json_path}")
print(f"OK MD  salvo em {md_path}")
print(f"   Presenca: {len(presenca)} responsaveis")
print(f"   Comidas:  {com_assinados}/{len(comidas)} assinados")
print(f"   Balaio:   {bal_assinados}/{len(balaio)} assinados")
