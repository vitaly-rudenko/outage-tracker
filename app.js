import * as mihome from 'node-mihome'
import { config } from 'dotenv'
config()

mihome.miioProtocol.init()

const username = process.env.MI_CLOUD_USERNAME
const password = process.env.MI_CLOUD_PASSWORD
const country = process.env.MI_CLOUD_COUNTRY

await mihome.miCloudProtocol.login(username, password)

const options = { country }
const devices = await mihome.miCloudProtocol.getDevices(null, options)

console.log(
  devices.map(d => `${d.name}: ${d.isOnline ? 'online' : 'offline'}`).join('\n')
)
