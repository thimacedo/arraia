import Redis from 'ioredis'

// Usando o REDIS_URL fornecido
const url = process.env.ARRAIA_REDIS_URL || process.env.REDIS_URL

export const redis = url ? new Redis(url) : null

