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
export function validNum100(val) {
  const reg = /^((?!0)\d{1,2}|100)$/;
  return reg.test(Number(val))

}
/**
 *正数校验
 * @param {*} val
 * @param {*} dyVal
 */
export function validZNum(val) {

  const reg = /^(0+)?(99(\.99?)?|(\.99?)?|\.[0-9]+|0?[0-9](\.[0-9]{0,2})?|(0+)?[0-9][0-9](\.[0-9][0-9]?)?)$/;
  return reg.test(Number(val));


}
/**
 * 工作分成 动态调整上限值
 */
export function validDyNum(val, dyVal) {
  // if(val >= 0 && val <= dyVal){
  //   return
  // }
  // const reg =  new RegExp("^((?!0)\\d{1,2}|"+dyVal+")$")
  // // const reg = eval("\/^((?!0)\\d{1,2}|"+dyVal+")$\/");
  // return reg.test(Number(val))
  return (val >= 0 && val <= dyVal)
}
/**
 * 提成分成 <15
 */
export function validNum15(val) {
  return (val >= 0 && val <= 15)

}
/**
 *
 * 开户分成
 */
export function validNum20(val) {
  return (val > 0 && val <= 20)

}
/**
 *
 * 分润比例
 */
export function validNum2(val) {
  let len = 0;
  if(val.toString().indexOf('.')>0){
    if(val.toString().split(".")){
      len = val.toString().split(".")[1].length;
    }
  }

  return (val > 0 && val <= 2 &&  len<=1)

}
/**
 * 过滤银行卡号中间的空格
 */
export function filterSpace(val) {
  let sstr = val.replace(/\s*/g, '')
  return sstr;
}


/**
 * 保留有效数字位数（四舍五入）
 */
export function getFloat(num, n) {
	n = n ? parseInt(n) : 0;
	if(n <= 0) {
		return Math.round(num);
	}
	num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
	num = Number(num).toFixed(n); //补足位数
	return num;
};
