import { Storage } from './utils/util';

export default class Undo {
  constructor () {
    this.data = {
      // 缓存数据
      stack: [],
      // 当前索引
      index: 0
    };
    this.MAX_LEN = 10;
    this.OP_INDEX = 'op_index';
    this.OP_DATA = 'op_data';
    this.store = new Storage();
    this.init();
  }
  // 获取缓存中的数据
  init () {
    const stack = this.store.get(this.OP_DATA);
    if (stack && stack.length) {
      this.data.stack = stack;
      this.data.index = this.data.stack.length;
    }
  }

  // 取值
  get (i) {
    this.store.set(this.OP_INDEX, i);
    const data = this.data.stack[i - 1];
    return data;
  }

  // 更新数据
  setData (data) {
    const newItem = JSON.parse(JSON.stringify(data));
    this.data.stack[this.data.stack.length - 1] = newItem;
    this.data.index = this.data.stack.length;
  }

  // 插入
  push (newValue) {
    // 拷贝
    if (typeof newValue === 'object') {
      newValue = JSON.parse(JSON.stringify(newValue));
    }
    const len = this.data.stack.length;
    // 当前的指针不在最顶部，清空多余数据
    if (this.data.index !== len) {
      const i = this.data.index;
      const diffCount = len - i;
      this.data.stack.splice(i, diffCount);
    }
    // 超过限制长度，移除第一个
    if (len >= this.MAX_LEN) {
      this.data.stack.shift();
    }
    // 加入当前数据
    this.data.index += 1;
    this.data.stack.push(newValue);
    // 存入本地缓存
    this.store.set(this.OP_INDEX, this.data.index);
    this.store.set(this.OP_DATA, this.data.stack);
  };

  // 撤销
  undo () {
    // 边界控制
    this.data.index -= 1;
    if (this.data.index <= 0) {
      this.data.index = 1;
    }
    return this.get(this.data.index);
  };

  // 恢复
  redo () {
    // 边界控制
    this.data.index += 1;
    const len = this.data.stack.length;
    if (this.data.index > len) {
      this.data.index = len;
      return;
    }
    return this.get(this.data.index);
  };
};
