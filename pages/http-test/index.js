// pages/http-test/index.js
import dayjs from 'dayjs';

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
  http: function (e) {
    wx.cloud.callFunction({ //调用云函数
      name: 'wxpay',
      success: res => {
        const payment = res.result.payment
        wx.requestPayment({
          ...payment,
          success(res) {
            console.log('pay success', res)
          },
          fail(res) {
            console.error('pay fail', res)
          }
        })
      },
      fail: console.error,
    })
  },
  receive: function (e) {
    wx.cloud.callFunction({ //调用云函数
      name: 'refund',
      data: {
        out_refund_no: dayjs().valueOf() + '',
        transaction_id: '4200000804202012186409047494',
        out_trade_no: '1217752501201407033233361010'
      },
      success: res => {
        console.log(res)
      },
      fail: console.error,
    })
  },
  notice: function () {
    wx.cloud.callFunction({ //调用云函数
      name: 'receiveWxpaymentNotice',
      data: {
      },
      success: res => {
        console.log(res)
      },
      fail: console.error,
    })
  }
})