// pages/my/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userLogined: false,
    personalInfo: null,
    avatarUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
    });
    if (app.globalData.businessInfo[660914792669]) {
      this.setData({ businessInfo: app.globalData.businessInfo[660914792669][0] })
    }
    app.$watch('businessInfo', (val) => {
      if (val[660914792669].length) {
        this.setData({ businessInfo: val[660914792669][0] })
      }
    });
    this.setData({
      userLogined: app.globalData.userLogined
    });
    app.$watch('userLogined', (val) => {
      this.setData({
        userLogined: val
      })
    });
    this.setData({
      personalInfo: app.globalData.personalInfo
    });
    app.$watch('personalInfo', (val) => {
      this.setData({
        personalInfo: val
      })
    });
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
    !this.data.avatarUrl && wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl
              })
            }
          })
        }
      },
    });
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
  handleLogin: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/login/index',
          })
        } else {
          wx.navigateTo({
            url: '/pages/wxauth/index',
          })
        }
      },
    })
  },
  gotoUserInfo:function(){
    wx.navigateTo({
      url: '/pages/user-info/index',
    })
  }
})