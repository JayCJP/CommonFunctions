// 格式化单位数字
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
// 格式化时间
const formatTime = time => {
  const date = new Date(Number(time) * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

// 格式化数量
function numCount(v, n, f) {
  return `${(Number(v) / n).toFixed(2)}${f}`
}
const formatCount = n => {
  let v = (n).toString()
  if (v.includes('.')) {
    return v
  }
  switch (v.length) {
    case 4:
      v = numCount(v, 1000, '千')
      break
    case 5: case 6: case 7:
      v = numCount(v, 10000, '万')
      break
  }
  return v
}

// 复制功能
const copyLink = el => {
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
const isOverdue = (time, maxTime = 2) => {
  const currentTime = new Date().getTime()
  return (currentTime - time)/1000/60/60 < maxTime
}

// 获取两个数之间的随机数
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// 克隆对象
const clone = obj => JSON.parse(JSON.stringify(obj));

// 延迟
const sleep = t => new Promise(resolve => {
  setTimeout(resolve, t);
})

// 计算剩余时间 return 01:24:05
const formatTime = t => {
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
function printProgress (progress) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  // 美化进度
  const processStr = new Array(50).fill('▷');
  const str = processStr.map((el, i) => i < (progress / 2) ? '▶' : el).join('')

  process.stdout.write(`${str}   ${progress}%`);
}

// 秒转为播放时间 value number
const formatPlayTime = (value) => {

  let second = parseInt(value); // 秒
  let minute = 0; // 分
  let hour = 0; // 小时

  if (second > 60) {
    minute = parseInt(second / 60);
    second = parseInt(second % 60);
    if (minute > 60) {
      hour = parseInt(minute / 60);
      minute = parseInt(minute % 60);
    }
  }

  const secondStr = second >= 10 ? second : `0${second}`;
  const miunteStr = minute >= 10 ? minute : `0${minute}`
  let result = `${miunteStr}:${secondStr}`

  if (hour > 0) {
    let h = hour >= 10 ? hour : `0${hour}`
    result = `${h}:${result}`;
  }
  return result;
}

// 序列化参数
function serialiseObject (obj) {
  const prefix = '?'
  if (obj && Object.keys(obj).length) {
    return prefix + Object.keys(obj).map(key =>
      `${key}=${encodeURIComponent(obj[key])}`
    ).join('&')
  }
  return ''
}
// name 页面的名字，需要在 page({ name: '' }) 中添加 name 属性
// return 需要返回的页面栈深度
function getBackSize (name) {
  const pages = getCurrentPages()
  const index = pages.findIndex(el => el.name === name)
  // 页面栈中没有该页面
  if (index < 1) {
    return false
  } else {
    const size = pages.length - index - 1
    // 计算回退量 
    return size || 1
  }
}

