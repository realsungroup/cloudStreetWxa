// pages/wxauth/index.js
// import { getWXUserInfo } from '../../utils/http/http.services'
import { getWXUserInfo } from '../../utils/util'

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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.loginedUser) {
      wx.navigateBack({
        delta: 0,
      })
    } else if(app.globalData.wxUserInfo){
      wx.redirectTo({
        url: '/pages/login/index',
      });
    }
  },

  getUserInfo: function () {
    wx.getUserProfile({
      desc: '获取您的微信信息',
      success(wxinfo){
        wx.login({
          success: async res => {
            const code = res.code
            // 发送code 到后台换取 openId, sessionKey, unionId
            if (code) {
              try {
                const result = await getWXUserInfo();
                const userinfo = wxinfo.userInfo
                userinfo.openId = result.openid
                userinfo.appid = result.appid
                userinfo.unionId = result.unionid
                app.setGlobalData({'wxUserInfo': userinfo})
                wx.setStorageSync('wxUserInfo', userinfo);
                wx.redirectTo({
                  url: '/pages/login/index',
                });
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
    })
  },
})