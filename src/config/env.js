import { config } from 'dotenv'

config()

export const PORT = process.env.PORT || 3000

export const NODE_ENV = process.env.NODE_ENV || 'NODE_ENV'

export const AUTH_SECRET = process.env.AUTH_SECRET || 'AUTH_SECRET'

export const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID'
export const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET'

export const GITHUB_CLIENT_ID =
  process.env.GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID'
export const GITHUB_CLIENT_SECRET =
  process.env.GITHUB_CLIENT_SECRET || 'GITHUB_CLIENT_SECRET'
