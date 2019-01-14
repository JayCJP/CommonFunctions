// 格式化单位数字
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
// 格式化时间
export const formatTime = time => {
  const date = new Date(Number(time) * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

// 格式化数数量 K,W
function numCount (v, n) {
  return `${(Number(v) / n).toFixed(2)}K`
}
// 格式化数量
export const formatCount = n => {
  let v = (n).toString()
  switch (v.length) {
    case 4:
      v = numCount(v, 1000)
      break
    case 5: case 6:
      v = numCount(v, 10000)
      break
  }
  return v
}

// 复制功能
export const copyLink = el => {
  let range = document.createRange()
  let selection = window.getSelection()
  range.selectNode(el)
  selection.removeAllRanges()
  selection.addRange(range)
  let bool = document.execCommand('copy', 'false', null)
  document.execCommand('unselect', 'false', null)
  if (bool) {
    return true
  } else {
    return false
  }
}

//判断时间是否超过两个小时
const isOverdue = (time) => {
  const currentTime = new Date().getTime()
  return (currentTime - time)/1000/60/60 < 2
}

// 获取两个数之间的随机数
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
