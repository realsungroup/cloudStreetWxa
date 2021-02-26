// pages/shops/index.js
import { getShops } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shops: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchShops();
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
  fetchShops: async function () {
    try {
      const res = await getShops();
      this.setData({ shops: res.data });
    } catch (error) {
      console.error(error);
      wx.showModal({
        showCancel: false,
        content: error.message
      })
    }
  },
  goShop: (e) => {
    const { shop } = (e.currentTarget.dataset);
    wx.navigateTo({
      url: '/pages/shop/index',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', { shop });
      }
    })
  }
})