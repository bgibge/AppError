/*
 * @Author: xiaorujun
 * @Description: 生成随机字符串
 * @Date: 2020-03-16 16:21:06
 * @Last Modified by: xiaorujun
 */



const CHARS = '1234567890abcdef'
const CHARS_LEN = CHARS.length




/**
 * 生成随机字符串
 *
 * @param {number} length - 字符串长度
 *
 * @returns {string}
 */
module.exports = function makeid (length) {
  var result = ''

  for (let i = 0; i < length; i++) {
    const pos = Math.floor(Math.random() * CHARS_LEN)

    result += CHARS.charAt(pos)
  }

  return result
}
