const events = require('events')
const logger = require('./log')
const MAX_LISTENERS = 50

/**
 * Base class for an app
 */
class BaseApp {

  /**
   * Constructor
   */
  constructor () {}
}
let EventEmitter = new events()
EventEmitter.setMaxListeners(MAX_LISTENERS)
EventEmitter.on('newListener', newListener)
EventEmitter.on('removeListener', removeListener)

function newListener (eventName, func) {
  logger.debug('New listener added for', eventName)
}

function removeListener (eventName, func) {
  logger.debug('Listener removed for', eventName)
}
BaseApp.EventEmitter = EventEmitter
module.exports = BaseApp
