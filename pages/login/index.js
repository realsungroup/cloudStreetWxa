// pages/login/index.js
import { getWXUserInfo, register, unionidIsExist, userLogin } from '../../utils/http/http.services'

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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  getPhoneNumber(e) {
    const detail = e.detail;
    const wxUserInfo = wx.getStorageSync('wxUserInfo');
    wx.showLoading({
      title: '登录中',
    });
    if (detail.errMsg === 'getPhoneNumber:ok') {
      if (wxUserInfo) {
        this.loginOrRegister(detail)
      } else {
        wx.login({
          success: async res => {
            const code = res.code;
            if (code) {
              wx.getUserInfo({
                success: async (res) => {
                  const { iv, encryptedData } = res
                  try {
                    const result = await getWXUserInfo({
                      code,
                      AppId: app.globalData.businessInfo.wxa_appid,
                      AppSecret: app.globalData.businessInfo.wxa_appsecrect,
                      iv: iv,
                      encrypteddata: encryptedData
                    });
                    const openId = result.openId;
                    const unionId = result.unionId;
                    if (openId && unionId) {
                      wx.setStorageSync('wxUserInfo', result);
                      this.loginOrRegister(detail);
                    }
                  } catch (error) {
                  }
                }
              })
            }
          },
        })
      }
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
            const result = await getWXUserInfo({
              code,
              AppId: app.globalData.businessInfo.wxa_appid,
              AppSecret: app.globalData.businessInfo.wxa_appsecrect,
              iv: detail.iv,
              encrypteddata: (detail.encryptedData)
            });
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
                  phoneNumber: result.phoneNumber,
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