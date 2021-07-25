// pages/login/index.js
import { register, unionidIsExist, userLogin } from '../../utils/http/http.services'
import { getWXPhone } from '../../utils/util'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getPhoneNumber(e) {
    const detail = e.detail;
    wx.showLoading({
      title: '登录中',
    });
    if (detail.errMsg === 'getPhoneNumber:ok') {
      this.loginOrRegister(detail)
    } else {
      wx.showModal({
        title: '提示',
        content: '需要通过授权才能继续，请重新点击并授权！',
        showCancel: false
      })
    }
  },
  loginOrRegister: function (detail) {
    wx.login({
      success: async res => {
        const code = res.code
        if (code) {
          try {
            const result = await getWXPhone(detail.cloudID);
            const wxUserInfo = wx.getStorageSync('wxUserInfo');
            const isExist = await unionidIsExist(wxUserInfo.unionId)
            const business_ID = app.globalData.businessId;
            if (isExist.data) {
              try {
                const loginResult = await userLogin(wxUserInfo.unionId);
                if (loginResult.OpResult === 'Y') {
                  wx.setStorageSync('userInfo', loginResult);
                  wx.navigateBack({
                    delta: 0,
                  });
                  app.setGlobalData({
                    userLogined: true,
                    loginedUser: loginResult
                  });
                  app.fetchUserInfo();
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
            } else {
              try {
                await register({
                  unionid: wxUserInfo.unionId,
                  openid: wxUserInfo.openId,
                  nickname: wxUserInfo.nickName,
                  wxappid: 'wx70d3b74160c4e9af',
                  phoneNumber: result.data.phoneNumber,
                  dept_id: business_ID
                })
                const loginResult = await userLogin(wxUserInfo.unionId);
                if (loginResult.OpResult === 'Y') {
                  wx.setStorageSync('userInfo', loginResult);
                  wx.navigateBack({
                    delta: 0,
                  });
                  app.setGlobalData({
                    userLogined: true,
                    loginedUser: loginResult
                  });
                  app.fetchUserInfo();
                } else {
                  wx.showModal({
                    showCancel: false,
                    title: '提示',
                    content: '登录失败'
                  });
                }
              } catch (error) {
                console.log(error)
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: error.message
                });
              }
            }
            wx.hideLoading();
          } catch (error) {
            wx.hideLoading();
            wx.showToast({
              title: '请再试一遍',
              duration: 1500,
              icon: 'none'
            })
          }

        }
      },
    })
  }
})