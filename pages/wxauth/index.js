// pages/wxauth/index.js
import { getWXUserInfo } from '../../utils/http/http.services'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.navigateTo({
    //         url: '/pages/login/index',
    //       });
    //     }
    //   },
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          if (app.globalData.loginedUser) {
            wx.navigateBack({
              delta: 0,
            })
          } else {
            wx.redirectTo({
              url: '/pages/login/index',
            });
          }
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function (e) {
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      wx.showModal({
        title: '提示',
        content: '需要通过授权才能继续，请重新点击并授权！',
        showCancel: false
      });
    } else {
      app.setGlobalData({ hasAuth: true, });
      const { detail } = e;
      wx.login({
        success: async res => {
          const code = res.code
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (code) {
            try {
              const result = await getWXUserInfo({
                code,
                AppId: app.globalData.businessInfo.wxa_appid,
                AppSecret: app.globalData.businessInfo.wxa_appsecrect,
                iv: detail.iv,
                encrypteddata: (detail.encryptedData)
              });
              const openId = result.openId;
              const unionId = result.unionId;
              if (openId && unionId) {
                wx.setStorageSync('wxUserInfo', result);
                wx.redirectTo({
                  url: '/pages/login/index',
                });
              }
            } catch (error) {
              console.log(error)
              wx.showToast({
                title: '请再试一遍',
                duration: 2000,
                icon: 'none'
              })
            }
          }
        },
      })
    }
  },
})