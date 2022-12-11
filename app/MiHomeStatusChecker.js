import * as mihome from 'node-mihome'
import { logger } from '../logger.js'
import { Status } from './Status.js'

export class MiHomeStatusChecker {
  _initializePromise

  constructor({ username, password, country }) {
    this._username = username
    this._password = password
    this._country = country
  }

  async check() {
    await this._init()

    const devices = await mihome.miCloudProtocol.getDevices(null, { country: this._country })

    return new Status({
      raw: devices,
      isOnline: devices.some(device => device.isOnline),
      createdAt: new Date(),
    })
  }

  async _init() {
    if (!this._initializePromise) {
      this._initializePromise = (async () => {
        mihome.miioProtocol.init()
        await mihome.miCloudProtocol.login(this._username, this._password)
      })()
    }

    return this._initializePromise
  }
}
