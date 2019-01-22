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

//判断时间是否超时
export const isOverdue = (time, maxTime = 2) => {
  const currentTime = new Date().getTime()
  return (currentTime - time)/1000/60/60 < maxTime
}

// 获取两个数之间的随机数
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// 克隆对象
export const clone = obj => JSON.parse(JSON.stringify(obj));

// 延迟
export const sleep = t => new Promise(resolve => {
  setTimeout(resolve, t);
})

// 计算剩余时间 return 01:24:05
export const formatTime = t => {
  const h = parseInt(Math.floor((t / 1000 / 60 / 60) % 60))
  const m = parseInt(Math.floor((t / 1000 / 60) % 60))
  const s = parseInt(Math.floor((t / 1000) % 60))
  return `${h}:${m}:${s}`
}

/**
 * 
 * @param {Number} progress 
 * @description 单行 输出 下载进度▶▶▷▷▷▷ 1~100
 */
function printProgress(progress) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  // 美化进度
  const processStr = new Array(50).fill('▷');
  const str = processStr.map((el, i) => i < (progress / 2) ? '▶' : el).join('')

  process.stdout.write(`${str}   ${progress}%`);
}