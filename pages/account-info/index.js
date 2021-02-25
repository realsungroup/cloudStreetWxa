// pages/account-info/index.js
import {  } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    enterpriceAccount: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEnterprice();
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
  getEnterprice: function () {
    const userInfo = (wx.getStorageSync('wxUserInfo'));
    if (userInfo) {
      wx.showNavigationBarLoading();
      wx.cloud.callFunction({ //调用云函数
        name: 'getEnterpriceUserinfo',
        data: {
          unionid: userInfo.unionId,
        },
        success: res => {
          const response = res.result;
          wx.hideNavigationBarLoading();
          if (response.error == 0) {
            if (response.data.length) {
              this.setData({
                enterpriceAccount: response.data[0],
              })
            }
          } else {
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: response.message
            })
          }
        },
        fail: () => {
          console.error;
          wx.hideNavigationBarLoading();
        },
      });
      }
  },
})