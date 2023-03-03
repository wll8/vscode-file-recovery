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

export default {
  isType,
}
