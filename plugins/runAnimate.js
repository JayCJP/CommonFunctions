
/**
 * 特殊情况
 * 
 
page = [
  {
    "elements": [
      {
        "content": "https://mmbiz.qpic.cn/mmbiz_jpg/640",
        "type": 0,
        "fontSize": 30,
        "color": "#ff4545",
        "bgColor": null,
        "animate": {
          "animateStart": "fadeIn",
          "animateEnd": "fadeOut",
          "animateZH": "淡入淡出"
        },
        "animateClass": "fadeIn",
        "stayDuration": 3,
        "top":0,
        "left":0,
        "width":100,
        "height":100,
        "screenfull": true,
        "zIndex": 1,
        "textStroke": {
          "enabled":true,
          "size":2,
          "color":"#ffeb3b",
          "text":"#ffeb3b 2px 0px 0px, #ffeb3b -2px 0px 0px, #ffeb3b 0px 2px, #ffeb3b 0px -2px, #ffeb3b 2px 2px, #ffeb3b -2px -2px, #ffeb3b 2px -2px, #ffeb3b -2px 2px;"
        },
        "fontWeight":true,
        "padding":0,
        "textAlign":"center",
        "pStyle":"z-index:1;top:0px;left:0px;width:100%;height:100%",
        "styleText":"font-size: 30px;line-height: 36px;color: #ff4545;text-align: center;text-shadow: #ffeb3b 2px 0px 0px, #ffeb3b -2px 0px 0px, #ffeb3b 0px 2px, #ffeb3b 0px -2px, #ffeb3b 2px 2px, #ffeb3b -2px -2px, #ffeb3b 2px -2px, #ffeb3b -2px 2px;font-weight: 700;",
        "st":0,
        "et":4
      }
    ]
  }
]

*/ 

import {
  formatPlayTime
} from './util.js'

class RunAniamte {
  constructor (option) {
    this.Timer = 0; // 计时器
    this.target = option.target
    this.index = option.index || 0;
    this.timeLong = option.timeLong || false;
    this.currentTime = option.currentTime || 0;
    this.pages = option.pages || 0;
    this.audio = option.audio;
    this.status = true // true playing; false pause;
    this.end = option.end;
    this.timeupdate = option.timeupdate
  }
  // 播放 计时控制
  previewRunning (startTime = 0) {
    clearInterval(this.Timer);
    this.currentTime = startTime;
    // 开启计时器 从当前时间开始 时间间隔 1 秒
    this.Timer = setInterval(() => {
      this.currentTime += 1;
      this.target.setData({
        currentTime: this.currentTime,
        [`playTime.st`]: formatPlayTime(this.currentTime)
      })
      // 进度更新
      this.target.onVtimeup({
        detail: {
          currentTime: this.currentTime,
          duration: this.timeLong
        }
      })
      // 控制播放
      this.player()
      // 超过总时长结束
      if (this.currentTime >= this.timeLong) {
        console.log("结束动画！");
        this.finishPlay()
      }
    }, 1000)
  }
  // 播放结束
  finishPlay () {
    this.target.setData({
      currentIndex: this.pages.length - 1
    })
    this.pause()
    this.target.onVend()
  }
  // 重置时间 归0
  resetTime () {
    clearInterval(this.Timer);
    this.index = 0
    this.currentTime = 0
    this.target.setData({
      currentIndex: this.index,
      currentTime: this.currentTime,
      ['playTime.st']: '00:00'
    })
  }
  // 根据起始时间 设置播放时间及播放页面
  findPage(startTime) {
    // 判断当前时间为那一页
    for (let i = 0; i < this.pages.length; i++) {
      const p = this.pages[i];
      // 找到起始时间所在的页面
      if (p.startTime <= startTime && startTime <= p.endTime) {
        // 跳到指定页并从头播放 x  startTime = p.startTime
        this.index = i;
        this.target.setData({
          currentIndex: this.index,
          currentTime: startTime,
          ['playTime.st']: formatPlayTime(startTime)
        })
        break;
      }
    }
  }
  // 音乐控制
  ctrlMusic (isp = false) {
    if (this.audio) {
      isp ? this.audio.play() : this.audio.pause()
      this.target.setData({
        audioPlaying: isp
      })
    }
  }
  // 暂停
  pause () {
    clearInterval(this.Timer);
    this.ctrlMusic(false)
    // 设置播放状态 false
    this.status = false
    this.target.setData({
      isPlaying: false,
    })
    this.target.onVpause()
  }
  // 播放
  play (startTime = 0) {
    clearInterval(this.Timer);
    if (startTime >= this.timeLong) {
      startTime  = 0
    }
    this.status = true
    // 设置播放是起始位
    if (startTime) {
      this.findPage(startTime)
    } else {
      this.resetTime()
    }
    this.target.setData({
      isPlaying: true
    })
    this.previewRunning(startTime);
    this.ctrlMusic(true)
    this.target.onVplay()
  }
  // 检查 动画元素 应用动画
  player () {
    const pageLen = this.pages.length;
    const currentPage = this.pages[this.index];
    if (!currentPage) {
      this.pause()
      return
    }
    // 当前页的元素集
    const elements = currentPage.elements;
    if (pageLen >= this.index) {
      // 超过当前页的时间，跳过下一页
      if (this.currentTime > currentPage.endTime) {
        const nextPage = this.index + 1;
        this.target.setData({
          currentIndex: nextPage
        })
        // 将上一页的 animateClass  替换为 animateStart
        const prePage = this.pages[this.index].elements
        prePage.forEach((v, i) => {
          const astart = v.animate.animateStart;
          this.target.setData({
            [`pages[${this.index}].elements[${i}].animateClass`]: astart
          })
        })
        this.index = nextPage
      }
      // 遍历每个子元素，当前时间是否有需要结束动画
      elements.forEach((v, i) => {
        if (v.et == this.currentTime) {
          const aend = v.animate.animateEnd;
          this.target.setData({
            [`pages[${this.index}].elements[${i}].animateClass`]: aend
          })
        }
      });
    }
  }
}

export default RunAniamte
