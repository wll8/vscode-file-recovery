/**
 * 判断数据是否为 type, 或返回 type
 * @param {*} data
 * @param {*} type
 * @returns
 */
function isType(data, type = undefined) {
  const dataType = Object.prototype.toString
    .call(data)
    .match(/\s(.+)]/)[1]
    .toLowerCase()
  return type ? dataType === type.toLowerCase() : dataType
}

/**
 * 时间格式化
 * @param {string} fmt 格式
 * @param {Date} date 时间对象
 */
function dateFormat(fmt, date) {
  if (date === undefined) {
    return ``
  }
  date = new Date(date)
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'D+': date.getDate().toString(), // 日
    'h+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (let k in opt) {
    ret = new RegExp(`(${k})`).exec(fmt)
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, `0`)
      )
    }
  }
  return fmt
}

export default {
  dateFormat,
  isType,
}
