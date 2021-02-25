// pages/aftersale-detail/index.js
import { getAfterSaleData } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    order: {},
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    id && this.getData(id);
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
  getData: async function (id) {
    try {
      this.setData({ loading: true });
      const res = await getAfterSaleData(id);
      this.setData({ loading: false });
      if (res.data.length) {
        this.setData({ loading: false, order: res.data[0], goodsList: res.subdata.data });
      }
    } catch (error) {
      console.error(error);
      this.setData({ loading: false });
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: error.message
      })
    }
  }
})