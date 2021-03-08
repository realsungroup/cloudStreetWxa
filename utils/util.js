const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isURL(str_url) {// 验证url
  var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
    + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
    + "|" // 允许IP和DOMAIN（域名）
    + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
    + "[a-z]{2,6})" // first level domain- .com or .museum
    + "(:[0-9]{1,4})?" // 端口- :80
    + "((/?)|" // a slash isn't required if there is no file name
    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  var re = new RegExp(strRegex);
  return re.test(str_url);
}

function getQueryObject(url = '') {
  const theRequest = new Object();
  if (url.indexOf("?") != -1) {
    const qsString = url.split('?')[1]
    const strs = qsString.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

const cloudRetrieve = (data) => {
  const userInfo = wx.getStorageSync('wxUserInfo');
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'retrieve',
      data: {
        unionid: userInfo.unionId,
        data
      },
      success: res => {
        const response = res.result;
        if (response.error == 0 || response.Error == 0) {
          resolve(response);
        } else {
          reject(new Error(response.message));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}
const save100 = (data) => {
  const userInfo = wx.getStorageSync('wxUserInfo');
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'save100',
      data: {
        unionid: userInfo.unionId,
        data
      },
      success: res => {
        const response = res.result;
        if (response.error == 0 || response.Error == 0) {
          resolve(response);
        } else {
          reject(new Error(response.message));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
}
/**
 * 返回数组（数组中元素为对象）中存在值为 val 的对象的下标（类似 Array.prototype.indexOf）
 * @param {Array} arr 数组，数组元素为对象
 * @param {String} key 要在数组元素（对象）中寻找的键
 * @param {基本类型} val
 * @return -1 或 n（n 大于等于 0）
 */
const indexOfObj = (arr, key, val) => {
  let index = -1;
  arr.forEach((obj, i) => {
    if (obj[key] === val) {
      index = i;
    }
  });
  return index;
};
/**
 * 将日期字符串格式转为带分隔符的日期字符串格式（*代表某个分隔符）
 * @param {String} dateString 日期字符串，如 "20180404"
 * @param {String} sep 分隔符，如 "-"
 * @return {String} 加上分隔符的日期字符串，如 "2018-04-04"
 */
const transformDate = (dateString, sep) => {
  const arr = dateString.split('');
  arr.splice(4, 0, sep);
  arr.splice(7, 0, sep);
  return arr.join('');
};

module.exports = {
  formatTime: formatTime,
  isURL: isURL,
  getQueryObject: getQueryObject,
  cloudRetrieve,
  indexOfObj,
  transformDate,
  save100
}
