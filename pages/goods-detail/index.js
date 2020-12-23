// pages/goods-detail/index.js
import { getGoodsById } from '../../utils/http/http.services';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    photos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchGoods(options.id)
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
  fetchGoods: async function (id) {
    try {
      const res = await getGoodsById(id);
      if (res.data.length) {
        const data = res.data[0]
        this.setData({ goods: data });
        this.setData({ photos: data.goods_photos ? data.goods_photos.split(';') : [] })
      } else {
        wx.showToast({ icon: null, title: '查询不到' })
      }
    } catch (error) {

    }
  },
  goAddOrder: function(){
    if (app.globalData.loginedUser) {
      wx.navigateTo({
        url: '/pages/add-order/index',
      });
    } else {
      wx.navigateTo({
        url: '/pages/wxauth/index',
      });
    }
  }
})