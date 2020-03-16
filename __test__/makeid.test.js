/*
 * @Author: xiaorujun
 * @Description:
 * @Date: 2020-03-16 16:51:31
 * @Last Modified by: xiaorujun
 */
const makeid = require('../lib/makeid')




test('Make a string of length 6', () => {
  expect(makeid(6)).toHaveLength(6)
})



test('Make a string of length 100', () => {
  expect(makeid(100)).toHaveLength(100)
})
