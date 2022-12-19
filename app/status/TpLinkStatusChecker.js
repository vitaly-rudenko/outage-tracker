import { login } from 'tplink-cloud-api'
import { logger } from '../../logger.js'
import { RateLimitError } from '../errors/RateLimitError.js'
import { Status } from './Status.js'

export class TpLinkStatusChecker {
  _initializePromise
  _tpLink
  _offlineStatuses = 0

  constructor({ username, password }) {
    this._username = username
    this._password = password
  }

  async check() {
    try {
      await this._init()
  
      const devices = await this._tpLink.getDeviceList();
      logger.debug({ devices }, 'TP-Link device list has been fetched')

      const isOnline = devices.some(device => device.status === 1)
      if (!isOnline) {
        this._offlineStatuses++
        if (this._offlineStatuses === 5) {
          logger.debug({}, 'Too many offline statuses in a row, logging out')
          this._offlineStatuses = 0
          this._initializePromise = undefined
        }
      }
  
      return new Status({
        raw: devices,
        isOnline,
        createdAt: new Date(),
      })
    } catch (error) {
      logger.debug(error, 'Failed to check status, logging out')
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
        this._tpLink = await login(this._username, this._password)
      })()
    }

    return this._initializePromise
  }
}