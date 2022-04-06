// pages/add-order/index.js
import dayjs from 'dayjs'
import { addOrderApi } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    minutesArr: [30,60],
    value: [0],
    good_id: '',
    adding:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ good_id: options.goods_id })
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
  bindChange: function (e) {
    const value = e.detail.value
    this.setData({ value })
  },
  saveOrder: async function () {
    const { value, minutesArr, good_id,adding } = this.data;
    if(adding){
      return;
    }
    this.setData({adding:true});
    wx.showLoading({
      title:'正在添加订单'
    })
    const starttime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const endtime = dayjs().add(minutesArr[value[0]], 'minute').format('YYYY-MM-DD HH:mm:ss');
    try {
      await addOrderApi({ starttime, endtime, good_id });
      wx.showToast({ title: '添加成功', duration: 1500 });
      this.setData({adding:false});
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1500);
      wx.hideLoading();
    } catch (error) {
      this.setData({adding:false});
      wx.hideLoading();
      wx.showModal({
        showCancel: false,
        content: error.message,
        title: '提示'
      })
    }
  }
})