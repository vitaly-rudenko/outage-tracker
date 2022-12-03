import { config } from 'dotenv'

if (process.env.USE_NATIVE_ENV !== 'true') {
  console.log('Using .env file')
  config()
}

export const username = process.env.MI_CLOUD_USERNAME
export const password = process.env.MI_CLOUD_PASSWORD
export const country = process.env.MI_CLOUD_COUNTRY
export const databaseUrl = process.env.DATABASE_URL
export const logLevel = process.env.LOG_LEVEL || 'info'
