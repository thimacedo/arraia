import { redis } from "../src/lib/redis"
import { INITIAL_PRESENCA, INITIAL_COMIDAS, INITIAL_BALAIO } from "../src/lib/party"

const REDIS_KEY = "arraia:state"

async function reset() {
  if (!redis) {
    console.error("Erro: Variáveis de ambiente do Redis não configuradas (KV_REST_API_URL e KV_REST_API_TOKEN).")
    process.exit(1)
  }

  const stateToSave = {
    geradoEm: new Date().toISOString(),
    presenca: INITIAL_PRESENCA,
    comidas: INITIAL_COMIDAS,
    balaio: INITIAL_BALAIO,
  }

  console.log("Subindo estado atualizado para o Redis...")
  await redis.set(REDIS_KEY, stateToSave)
  console.log("✅ Banco de dados atualizado com sucesso!")
}

reset()
