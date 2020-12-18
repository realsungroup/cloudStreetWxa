// pages/add-order/index.js
import dayjs from 'dayjs'
import { addOrderApi } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    starttime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    endtime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    goliveid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.goliveid);
    this.setData({ goliveid: options.goliveid })
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
  onStartChange: function (e) {
    this.setData({ starttime: e.detail.value })
  },
  onEndChange: function (e) {
    this.setData({ endtime: e.detail.value })
  },
  saveOrder: async function () {
    const { starttime, endtime, goliveid } = this.data;
    try {
      await addOrderApi({ starttime, endtime, shopname: '测试商品', good_name: '骑行' });
      wx.showToast({ title: '添加成功', duration: 1500 })
      setTimeout(() => {
        wx.navigateBack({
          delta: 0,
        })
      }, 1500);
    } catch (error) {

    }
  }
})