/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/*
 * @Author: xiaorujun
 * @Description:
 * @Date: 2020-03-16 16:52:06
 * @Last Modified by: xiaorujun
 */
const AppError = require('..')





function divide (num1, num2) {
  const value = num1 / num2

  if (value === Infinity) {
    const appError = new AppError('ZeroDivisionError', 'division by zero')

    appError.addContext({ num1, num2 })

    throw appError
  }
}


test('AppError instance is built-in Error instance', () => {
  expect(new AppError()).toBeInstanceOf(Error)
})



test('Make a `Unknown` AppError instance', () => {
  expect(new AppError().name).toEqual('UnknownError')
})



test('Cast built-in Error to AppError', () => {
  let appError, originalError

  try {
    a
  } catch (error) {
    appError = new AppError(error)
    originalError = error
  }

  expect(appError.name).toEqual('ReferenceError')
  expect(appError.isOperational).toEqual(false)
  expect(appError.toString()).toMatch(/[a-f0-9]{6}\(\w+\):\s\w+/)
  expect(appError.originalError).toBe(originalError)
})



test('Cast except built-in Error to AppError', () => {
  expect(AppError.cast('a').name).toEqual('a')
  expect(AppError.cast(111).name).toEqual(111)
  expect(AppError.cast(false).name).toEqual(AppError.settings.defaultName)
  expect(AppError.cast('ZeroDivisionError', 'division by zero').message).toEqual('division by zero')
})



test('New a isOperational AppError', () => {
  const appError = new AppError('appError', '', true)

  expect(appError.isOperational).toEqual(true)
})



test('Operate appError', () => {
  const appError = new AppError()

  expect(appError.isOperational).toEqual(false)

  appError.operate(true)

  expect(appError.isOperational).toEqual(true)
})



test('Test AppError.isAppError()', () => {
  const appError1 = new AppError()

  let appError2, originalError

  try {
    a
  } catch (error) {
    originalError = error
    appError2 = new AppError(error)
  }

  expect(AppError.isAppError(appError1)).toEqual(true)
  expect(AppError.isAppError(appError2)).toEqual(true)
  expect(AppError.isAppError(originalError)).toEqual(false)
})


test('Test addContext() method', () => {
  try {
    divide(2, 0)
  } catch (error) {
    expect(error).toBeInstanceOf(AppError)

    expect(error.toJSON()).toEqual({
      id: expect.any(String),
      name: 'ZeroDivisionError',
      message: 'division by zero',
      isOperational: false,
      created: expect.any(Number),
      context: expect.objectContaining({
        num1: 2,
        num2: 0
      }),
      stack: expect.any(String)
    })
  }
})



describe('Test toJSON() method', () => {
  test('new AppError()', () => {
    const appError = new AppError()

    expect(appError.toJSON(['id', 'message'])).toEqual({
      id: expect.any(String),
      message: ''
    })
  })

  test('new AppError(50101, \'缺失参数\', true)', () => {
    const appError = new AppError(50101, '缺失参数', true)

    expect(appError.toJSON()).toEqual({
      id: expect.any(String),
      name: 50101,
      message: '缺失参数',
      isOperational: true,
      created: expect.any(Number),
      context: undefined,
      stack: expect.any(String)
    })
  })

  test('new AppError(error)', () => {
    let appError

    try {
      a
    } catch (error) {
      appError = new AppError(error)
    }

    expect(appError.toJSON()).toEqual({
      id: expect.any(String),
      name: 'ReferenceError',
      message: expect.any(String),
      isOperational: false,
      created: expect.any(Number),
      context: undefined,
      stack: expect.any(String)
    })
  })
})



describe('After Global Setting', () => {
  beforeAll(() => {
    AppError.configure({
      namePrefix: 'Test:',

      messagePrefix: '测试消息前缀：',

      defaultName: 'AppError',
      defaultMessage: '未知异常',
      defaultIsOperational: true
    })
  })


  test('Have correct settings after global setting', () => {
    expect(AppError.settings).toEqual({
      namePrefix: 'Test:',
      nameSuffix: '',

      messagePrefix: '测试消息前缀：',
      messageSuffix: '',

      defaultName: 'AppError',
      defaultMessage: '未知异常',
      defaultIsOperational: true
    })
  })


  test('New a default AppError instance', () => {
    const appError = new AppError()

    expect(appError.toJSON()).toEqual({
      id: expect.any(String),
      name: 'Test:AppError',
      message: '测试消息前缀：未知异常',
      isOperational: true,
      created: expect.any(Number),
      context: undefined,
      stack: expect.any(String)
    })
  })


  test('Test addContext() method', () => {
    try {
      divide(2, 0)
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)

      expect(error.toJSON()).toEqual({
        id: expect.any(String),
        name: 'Test:ZeroDivisionError',
        message: '测试消息前缀：division by zero',
        isOperational: true,
        created: expect.any(Number),
        context: expect.objectContaining({
          num1: 2,
          num2: 0
        }),
        stack: expect.any(String)
      })
    }
  })

  test('new AppError(error)', () => {
    let appError

    try {
      a
    } catch (error) {
      appError = new AppError(error, '', false)
    }

    expect(appError.toJSON()).toEqual({
      id: expect.any(String),
      name: 'Test:ReferenceError',
      message: '测试消息前缀：a is not defined',
      isOperational: false,
      created: expect.any(Number),
      context: undefined,
      stack: expect.any(String)
    })
  })
})
