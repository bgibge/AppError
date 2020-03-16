/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/*
 * @Author: xiaorujun
 * @Description:
 * @Date: 2020-03-16 16:52:06
 * @Last Modified by: xiaorujun
 */
const AppError = require('..')




test('AppError instance is built-in Error instance', () => {
  expect(new AppError()).toBeInstanceOf(Error)
})



test('Make a `Unknown` AppError instance', () => {
  expect(new AppError().name).toEqual('Unknown')
})



test('Cast built-in Error to AppError', () => {
  let appError

  try {
    a
  } catch (error) {
    appError = new AppError(error)
  }

  expect(appError.name).toEqual('ReferenceError')
  expect(appError.isOperational).toEqual(false)
  expect(appError.toString()).toMatch(/[a-f0-9]{6}\(\w+\):\s\w+/)
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
