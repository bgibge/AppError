/*
 * @Author: xiaorujun
 * @Description: AppError
 * @Date: 2020-03-16 16:24:04
 * @Last Modified by: xiaorujun
 */
const makeid = require('./makeid')



class AppError extends Error {
  /**
   * 构造函数
   * @param {string} name - error name or code，to describe a class of error. or built-in Error object
   * @param {string} [message=''] - erorr messgae
   * @param {boolean} [isOperational=false] - is expected and can ignore it
   * @param {*} context - error context
   */
  constructor (name, message = '', isOperational = false, context) {
    if (!name) {
      return new AppError('Unknown', 'Unknown Error')
    }

    if (name instanceof Error) {
      return AppError.cast(name)
    }

    const id = makeid(6)

    super(`${id}(${name}): ${message}`)

    this.id = id
    this.name = name
    this.message = message
    this.created = Date.now()
    this.isOperational = !!isOperational
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




AppError.cast = function cast (error, message, isOperational = false, context) {
  if (!(error instanceof Error)) {
    return new AppError('Unknown', 'Unknown Error')
  }

  const name = error.name
  message = message || error.message
  isOperational = isOperational || false

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



module.exports = AppError // Export AppError as module
