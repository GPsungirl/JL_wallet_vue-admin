/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}


/**
 * 手机号 验证
 */
export function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}
/**
 * 贝壳收入 验证1-100
 */
export function validNum100(val){
  const reg = /^((?!0)\d{1,2}|100)$/;
  return reg.test(Number(val))

}

/**
 * 过滤银行卡号中间的空格
 */
export function filterSpace(val){
  let sstr = val.replace(/\s*/g, '')
  return sstr;
}
