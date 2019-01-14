// 依赖
import axios from 'axios';
import qs from 'qs';

const baseInfo = {
  baseUrl: 'your api'
  tk: '', // token缓存的key
  tkt: '' // token过期时间缓存的key
};
// 取消请求
const CancelToken = axios.CancelToken;

class BaseHttp {
  constructor() {
    this.$http = axios.create({ baseURL: baseInfo.baseUrl });
    this.config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
	// 取消请求
    this.cancel = ''
  }

  get(url, params = {}) {
    return this.$http.get(url, Object.assign(params, { cancelToken: new CancelToken(c => {
      this.cancel = c
    })}));
  }

  post(url, data = {}, config = {}) {
    return this.$http.post(url, qs.stringify(data), Object.assign(this.config, config));
  }

  // 添加公共参数
  setData(action, data) {
    if (action.includes('token')) {
      return data;
    }
    data = Object.assign(
      {
		// 一些公共参数
        token: sessionStorage.getItem(baseInfo.tk) || undefined,
      },
      data
    );

    return data;
  }
  // get 请求
  requestGet(action, params = {}) {
    let url = '/get';
    if (action.includes('token')) {
      url = action;
    }
    return this.get(url, { params: this.setData(action, params) })
      .then(res => res.data)
      .catch(error => {
        if (axios.isCancel(error)) {
          return { code: 0, msg: `请求已取消！` };
        } else {
          return { code: 0, msg: `请求出错了,${error}` };
        }
      });
  }
  // post 请求
  requestPost(action, data) {
    return this.post('/post', this.setData(action, data), { cancelToken: new CancelToken(c => {
        this.cancel = c
      })})
      .then(res => res.data)
      .catch(error => {
        if (axios.isCancel(error)) {
          return { code: 0, msg: `请求已取消！` };
        } else {
          return { code: 0, msg: `请求出错了,${error}` };
        }
      });
  }
}

export default BaseHttp;

// 根据 API 另做修改
