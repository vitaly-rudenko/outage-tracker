import * as mihome from 'node-mihome'
import { country, password, username } from './env.js'

mihome.miioProtocol.init()

await mihome.miCloudProtocol.login(username, password)

const options = { country }
const devices = await mihome.miCloudProtocol.getDevices(null, options)

console.log(
  devices.map(d => `${d.name}: ${d.isOnline ? 'online' : 'offline'}`).join('\n')
)
