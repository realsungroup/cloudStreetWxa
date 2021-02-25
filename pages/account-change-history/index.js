// pages/account-change-history/index.js
import { } from '../../utils/http/http.services';

const resconfig = {
  jieyu: { resid: 547242318548, moneyField: 'C3_513211237538' },
  jizan: { resid: 547242337091, moneyField: 'C3_513211239944' },
  xianjin: { resid: 547242352190, moneyField: 'C3_513211250100' }
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trades: [],
    moneyField: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { type } = options;
    this.setData({ moneyField: resconfig[type].moneyField });
    this.getEnterprice(options.type);
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
  getEnterprice: function (type) {
    const userInfo = (wx.getStorageSync('wxUserInfo'));
    if (userInfo) {
      wx.showNavigationBarLoading();
      wx.cloud.callFunction({
        name: 'retrieve',
        data: {
          unionid: userInfo.unionId,
          data: {
            resid: resconfig[type].resid,
            cmscolumns:
              'C3_513556649938,C3_511317786208,C3_513211237538,C3_533054370167',
          }
        },
        success: res => {
          const response = res.result;
          wx.hideNavigationBarLoading();
          if (response.error == 0) {
            if (response.data.length) {
              console.log(response.data);
              this.setData({ trades: response.data });
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