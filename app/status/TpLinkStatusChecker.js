import { login } from 'tplink-cloud-api'
import { logger } from '../../logger.js'
import { Status } from './Status.js'

export class TpLinkStatusChecker {
  _initializePromise

  constructor({ username, password, terminalId }) {
    this._username = username
    this._password = password
    this._terminalId = terminalId
  }

  async check() {
    try {
      await this._init()
  
      const devices = await this._tpLink.getDeviceList();
  
      return new Status({
        raw: devices,
        isOnline: devices.some(device => device.status === 1),
        createdAt: new Date(),
      })
    } catch (error) {
      logger.error(error, 'Could not check status, resetting the status checker')
      this._initializePromise = undefined
      throw error
    }
  }

  async _init() {
    if (!this._initializePromise) {
      this._initializePromise = (async () => {
        this._tpLink = await login(this._username, this._password, this._terminalId)
      })()
    }

    return this._initializePromise
  }
}