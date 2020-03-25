/*
 * @Author: xiaorujun
 * @Description: AppError
 * @Date: 2020-03-16 16:24:04
 * @Last Modified by: xiaorujun
 */
const makeid = require('./makeid')





class AppError extends Error {
  /**
   * @constructor
   *
   * @param {string|number|Error} name - error type, or built-in Error object
   * @param {string} [message=''] - erorr message
   * @param {boolean} [isOperational=false] - is expected and can ignore it
   * @param {*} context - error context
   */
  constructor (name, message = '', isOperational, context) {
    var namePrefix = AppError.settings.namePrefix
    var nameSuffix = AppError.settings.nameSuffix

    if (typeof name === 'number') {
      namePrefix = +namePrefix || 0
      nameSuffix = +nameSuffix || 0
    }

    if (!name) {
      return new AppError(
        AppError.settings.defaultName,
        AppError.settings.defaultMessage,
        AppError.settings.defaultIsOperational
      )
    }

    if (name instanceof Error) {
      return AppError.cast(name, message, isOperational, context)
    }

    name = namePrefix + name + nameSuffix
    message = AppError.settings.messagePrefix + message + AppError.settings.messageSuffix
    isOperational = !!(typeof isOperational === 'boolean' ? isOperational : AppError.settings.defaultIsOperational)


    var id = makeid(6)

    super(`${id}(${name}): ${message}`)

    this.id = id
    this.name = name
    this.message = message
    this.created = Date.now()
    this.isOperational = isOperational
    this.context = context || undefined

    if (!this.stack) {
      Error.captureStachTrace(this)
    }
  }


  /**
   * overwirte toString
   *
   * @returns {string} - id(name): message\n  stack
   */
  toString () {
    return `${this.id}(${this.name}): ${this.message}\n  ${this.stack}`
  }


  /**
   * isOperational()
   *
   * @param {boolean} [isOperational=true] - is expected and can ignore it
   *
   * @returns {boolean}
   */
  operate (isOperational = true) {
    this.isOperational = !!isOperational

    return this.isOperational
  }


  /**
   * Set appError context
   *
   * @param {*} context - Any Data can help you understand what happen
   *
   * @returns {*}
   */
  addContext (context) {
    this.context = context

    return this.context
  }


  /**
   * Return json app error
   *
   * @param {string[]} - The picked object properties
   *
   * @returns {Object} - Returns the new object
   */
  toJSON (paths) {
    const obj = {}

    if (Object.prototype.toString.call(paths) !== '[object Array]') {
      paths = [
        'id',
        'name',
        'message',
        'isOperational',
        'context',
        'created',
        'stack'
      ]
    }

    paths.forEach(field => {
      obj[field] = this[field]
    })

    return obj
  }
}



AppError.name = AppError.prototype.name = 'AppError'



/**
 * Default AppError Settings
 *
 * @property
 */
Object.defineProperty(AppError, 'defaultSettings', {
  value: {
    namePrefix: '',
    nameSuffix: '',

    messagePrefix: '',
    messageSuffix: '',

    defaultName: 'UnknownError',
    defaultMessage: '',
    defaultIsOperational: false
  }
})



/**
 * AppError setting
 */
const __setting__ = AppError.defaultSettings




AppError.cast = function cast (error, message, isOperational, context) {
  if (!error) {
    return new AppError()
  }

  if (!(error instanceof Error)) {
    return new AppError(error, message, isOperational, context)
  }

  const name = error.name

  message = message || error.message
  context = context || error.context || null

  const appError = new AppError(name, message, isOperational, context)

  appError.originalError = error

  return appError
}


/**
 * Checks if value is instance of AppError
 *
 * @param {*} value - The value to check.
 *
 * @returns {boolean} - Returns true if value is instance of AppError, else false.
 */
AppError.isAppError = function isAppError (value) {
  return value instanceof AppError
}



AppError.configure = function configure (opts) {
  const defaultSettings = AppError.defaultSettings

  const settingKeys = Object.keys(defaultSettings)

  var i
  for (i = 0; i < settingKeys.length; i++) {
    var key = settingKeys[i]

    if (opts[key] === null || opts[key] === undefined) {
      continue
    }

    if (key === 'defaultIsOperational') {
      __setting__[key] = !!opts[key]
    } else {
      __setting__[key] = opts[key]
    }
  }
}



/**
 * Actual AppError Settings
 */
Object.defineProperty(AppError, 'settings', {
  get () {
    return __setting__
  }
})



module.exports = AppError // Export AppError as module
