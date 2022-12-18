import * as mihome from 'node-mihome'
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
        const originalParseJson = mihome.miCloudProtocol._parseJson.bind(mihome.miCloudProtocol)
        mihome.miCloudProtocol._parseJson = (value) => {
          const result = originalParseJson(value)

          if (result.notificationUrl) {
            console.log('Notification URL:', result.notificationUrl)
          }

          return result
        }
        await mihome.miCloudProtocol.login(this._username, this._password)
      })()
    }

    return this._initializePromise
  }
}
