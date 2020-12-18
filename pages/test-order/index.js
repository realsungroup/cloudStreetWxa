// pages/test-order/index.js
import { getBicycles, sendOrderApi } from '../../utils/http/http.services';
import dayjs from 'dayjs';

const sendOrderFunc = {
  lock: function (id) {
    const data = {
      resid: "655381000293",
      data: [{
        goliveid: id,
      }]
    }
    return data
  },
  unlock: function (id) {
    const data = {
      resid: "655381000294",
      data: [{
        goliveid: id,
      }]
    }
    return data
  },
  restart: function (id) {
    const data = {
      resid: "655381000295",
      data: [{
        goliveid: id,
      }]
    }
    return data
  },
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bicycles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchBicycles()
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
  fetchBicycles: async function () {
    try {
      const res = await getBicycles();
      // console.log(res.data[0][660929208133][0][656958416948])
      this.setData({
        bicycles: res.data[0][660929208133][0][656958416948]
      })
    } catch (error) {
    }
  },
  sendOrder: async function (e) {
    const targetDatasetName = e.target.dataset.order;
    const device = e.currentTarget.dataset.device;
    if (!targetDatasetName || targetDatasetName === 'device') {
      return;
    }
    let data = {}
    if (targetDatasetName === 'order') {
      data = {
        resid: '657376311984',
        data: [{
          starttime: dayjs().format("YYYY-MM-DDTHH:mm"),
          endtime: dayjs().add(5, "minute").format("YYYY-MM-DDTHH:mm"),
          goliveid: device.goliveid
        }]
      }
    } else {
      data = sendOrderFunc[targetDatasetName](device.goliveid)
    }
    try {
      await sendOrderApi(data)
      wx.showToast({ title: '指令发送成功', duration: 1500 })
    } catch (error) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: error.message
      })
    }
  },
  addorder: function (e) {
    const goliveid = e.target.dataset.device.goliveid;
    wx.navigateTo({
      url: '/pages/add-order/index?goliveid=' + goliveid,
    })
  }
})