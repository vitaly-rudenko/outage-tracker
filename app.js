import * as mihome from 'node-mihome'
import { country, password, username } from './env.js'

async function start() {
  mihome.miioProtocol.init()

  console.log('Logging into Mi Cloud...')
  await mihome.miCloudProtocol.login(username, password)

  const options = { country }

  console.log('Fetching devices...')
  const devices = await mihome.miCloudProtocol.getDevices(null, options)

  console.log(
    devices.map(d => `${d.name}: ${d.isOnline ? 'online' : 'offline'}`).join('\n')
  )
}

start()
  .then(() => console.log('Started!'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
