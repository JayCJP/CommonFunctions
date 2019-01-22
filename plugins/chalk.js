/**
 * 
 * @param {String} color 
 * @param {String} bgColor 
 * @param {String} Styles 
 * @description 美化 log https://www.npmjs.com/package/chalk
 */
const chalkLog = function (color = 'black', bgColor = '', Styles = 'bold', msg = '') {
  const argLen = arguments.length;
  let clog = '';
  switch (argLen) {
    case 2:
      color = arguments[0];
      Styles = 'bold';
      clog = chalk[color][Styles]('\n', arguments[1]);
      break;
    case 3:
      color = arguments[0];
      bgColor = arguments[1];
      Styles = 'bold';
      clog = chalk[color][bgColor][Styles]('\n', arguments[2]);
      break;
    default:
      clog = chalk[color][bgColor][Styles]('\n', msg);
      break;
  }
  console.log(clog)
}

/**
 * 
 * @param {String} url 
 * @param {Object} params 
 * @description url params 合并成一个URL
 */
function formatUrl(url, params) {
  let pAry = []
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const el = params[key];
      pAry.push(`${key}=${el}`)
    }
  }
  const paramsStr = pAry.join('&')

  return url.includes('?') ? `${url}&${paramsStr}` : `${url}?${paramsStr}`
}