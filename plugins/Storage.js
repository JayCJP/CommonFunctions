// 封装本地存储 localStorage
export const Storage = function () {
  this.get = key => {
    const temp = localStorage.getItem(key);
    try {
      const obj = JSON.parse(temp);
      return obj;
    } catch (error) {
      const tmp = Number(temp);
      if (Number.isNaN(tmp)) {
        return temp;
      } else {
        return tmp;
      }
    }
  };

  this.set = (key, value) => {
    const data = value;
    if (typeof data === 'object') {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, data);
    }
  };
};