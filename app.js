//app.js
import { getBusinessInfo, getPersonalinfo, miniProgramLogin, userLogin } from './utils/http/http.services'

wx.cloud.init({
  env: 'openshopwx-anj96',
  traceUser: true,
});

App({
  globalData: {
    businessInfo: {},
    miniProgramLogined: false,
    hasAuth: false,
    userLogined: false,
    loginedUser: null,
    personalInfo: {}
  },
  onLaunch: function () {
   
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setGlobalData({ hasAuth: true })
        } else {
          this.setGlobalData({ hasAuth: false })
        }
      },
    });
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
      },
    });
    this._miniProgramLogin();
    try {
      const storageUserInfo = wx.getStorageSync('userInfo');
      storageUserInfo && this._userLogin(storageUserInfo.UserCode);
    } catch (error) {
    }
  },
  _miniProgramLogin: async function () {
    try {
      const res = await miniProgramLogin({
        data: {
          Appid: 'wx70d3b74160c4e9af',
          AppSecret: 'H60ZNuT/a/Kq7bnvSnYIoi3eedgIVyuuwxPcpuByx7HZ7AhppMFuzA==',
          loginmethod: 'appid'
        }
      })
      if (res.OpResult === 'Y') {
        await wx.setStorage({
          data: res,
          key: 'miniProgramInfo',
        });
        this.setGlobalData({ miniProgramLogined: true })
        this.fetchBusinessInfo()
      }
    } catch (error) {
    }
  },
  _userLogin: async function (unionId) {
    try {
      const loginResult = await userLogin(unionId);
      if (loginResult.OpResult === 'Y') {
        wx.setStorage({
          key: 'userInfo',
          data: loginResult
        });
        this.setGlobalData({
          userLogined: true,
          loginedUser: loginResult
        });
        this.fetchUserInfo();
      } else {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: error.message
        });
      }
    } catch (error) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: error.message
      });
    }
  },
  fetchBusinessInfo: async function () {
    try {
      const businessInfo = await getBusinessInfo();
      if (businessInfo.data.length) {
        const data = businessInfo.data[0];
        this.globalData.businessInfo = data;
        this.globalData.businessId = data[660914792669][0].business_ID
      }
    } catch (error) {
      console.error(error.message)
    }
  },
  fetchUserInfo: async function () {
    try {
      const res = await getPersonalinfo();
      if (res.data.length) {
        this.setGlobalData({
          personalInfo: res.data[0]
        })
      } else {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '无个人信息'
        })
      }
    } catch (error) {
      console.error(error)
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: error.message
      })
    }
  },
  watchCallBack: {},
  watchingKeys: [],
  setGlobalData(data) {
    // 为了便于管理，应通过此方法修改全局变量
    Object.keys(data).map(key => {
      this.globalData[key] = data[key]
    })
    console.log('mutation', data);
    wx.setStorageSync('store', this.globalData)// 加入缓存
  },
  $watch(key, cb) {
    this.watchCallBack = Object.assign({}, this.watchCallBack, {
      [key]: this.watchCallBack[key] || []
    });
    this.watchCallBack[key].push(cb);
    if (!this.watchingKeys.find(x => x === key)) {
      const that = this;
      this.watchingKeys.push(key);
      let val = this.globalData[key];
      Object.defineProperty(this.globalData, key, {
        configurable: true,
        enumerable: true,
        set(value) {
          const old = that.globalData[key];
          val = value;
          that.watchCallBack[key].map(func => func(value, old));
        },
        get() {
          return val
        }
      })
    }
  }
})