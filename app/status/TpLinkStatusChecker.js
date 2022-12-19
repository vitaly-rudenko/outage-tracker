import { login } from 'tplink-cloud-api'
import { logger } from '../../logger.js'
import { RateLimitError } from '../errors/RateLimitError.js'
import { Status } from './Status.js'

export class TpLinkStatusChecker {
  _initializePromise
  _tpLink

  constructor({ username, password, terminalId }) {
    this._username = username
    this._password = password
    this._terminalId = terminalId
  }

  async check() {
    try {
      await this._init()
  
      const devices = await this._tpLink.getDeviceList();
      logger.debug({ devices }, 'TP-Link device list has been fetched')
  
      return new Status({
        raw: devices,
        isOnline: devices.some(device => device.status === 1),
        createdAt: new Date(),
      })
    } catch (error) {
      this._initializePromise = undefined

      if (error?.err?.code === -20004) {
        throw new RateLimitError()
      } else {
        logger.error(error, 'Could not run check status use case')
        throw error
      }
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