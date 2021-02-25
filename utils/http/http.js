
import config from './config';


const { path: { baseURL, saveData,save200Data } } = config;

const getHeader = () => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  };

  let userInfo;
  userInfo = (wx.getStorageSync('userInfo'));
  if (userInfo) {
    return Object.assign(headers, {
      userCode: userInfo.UserCode,
      accessToken: userInfo.AccessToken,
    });
  }
  return headers;
}

const getMiniProgramInfoHeader = () => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  };

  let miniProgramInfo;
  miniProgramInfo = wx.getStorageSync('miniProgramInfo');
  if (miniProgramInfo) {
    return Object.assign(headers, {
      userCode: miniProgramInfo.UserCode,
      accessToken: miniProgramInfo.AccessToken,
    });
  }
  return headers;
}


function showErrToast(e) {
  wx.showToast({
    title: e,
    icon: 'none',
    duration: 1500
  })
}

function getPromise(url, data, method, isBusiness = false) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseURL}${url}`,
      header: isBusiness ? getMiniProgramInfoHeader() : getHeader(),
      method: method,
      data: data,
      success: function (res) {
        if (res.data.error == 0 || res.data.Error == 0) {
          resolve(res.data)
        } else {
          reject(new Error(res.data.message));
        }
      },
      fail: function (err) {
        reject(new Error(err.errMsg));
      }
    })
  })
}

const http = {
  get: function (url, data, isBusiness = false) {
    return getPromise(url, data, 'GET', isBusiness)
  },
  post: function (url, data, isBusiness = false) {
    return getPromise(url, data, 'POST', isBusiness)
  },
  addRecords: function (data, isBusiness = false, isEditOrAdd = false) {
    const _data = { ...data };
    _data.data = JSON.stringify(_data.data.map((item, index) => {
      return {
        ...item, _id: index,
        _state: isEditOrAdd ? 'editoradd' : 'added'
      }
    }));
    return getPromise(saveData, _data, 'POST', isBusiness)
  },
  add200Records: function (data) {
    return getPromise(save200Data, JSON.stringify({data}), 'POST', false)
  },
  modifyRecords: function (data, isBusiness = false) {
    const _data = { ...data };
    _data.data = JSON.stringify(_data.data.map((item, index) => {
      return {
        ...item, _id: index,
        _state: 'modified'
      }
    }));
    return getPromise(saveData, _data, 'POST', isBusiness)
  },
  deleteRecords: function (data, isBusiness = false) {
    const _data = { ...data };
    _data.data = JSON.stringify(_data.data.map((item, index) => {
      return {
        ...item, _id: index,
        _state: 'removed'
      }
    }));
    return getPromise(saveData, _data, 'POST', isBusiness)
  },
}

export { getHeader, getMiniProgramInfoHeader }
export default http