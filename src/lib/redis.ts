import { Redis } from '@upstash/redis'

// Use as env vars injetadas automaticamente pela integração Upstash na Vercel (KV_REST_API_URL / KV_REST_API_TOKEN)
// Ou as env vars nativas do Upstash (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

export const redis = url && token ? new Redis({ url, token }) : null
