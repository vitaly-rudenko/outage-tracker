import * as mihome from 'node-mihome'
import { logger } from '../logger.js'
import { Status } from './Status.js'

export class MiHomeStatusChecker {
  constructor({ username, password, country }) {
    this.username = username
    this.password = password
    this.country = country
  }
  
  async init() {
    logger.info('Initializing Miio protocol')
    mihome.miioProtocol.init()

    logger.info('Logging into Mi Home account')
    await mihome.miCloudProtocol.login(this.username, this.password)
  }

  async check() {
    const devices = await mihome.miCloudProtocol.getDevices(null, { country: this.country })

    return new Status({
      raw: devices,
      isOnline: devices.some(device => device.isOnline),
      createdAt: new Date(),
    })
  }
}
