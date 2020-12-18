// pages/ride-detail/index.js
import { getOrderByIdApi } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchOrder(options.orderid)
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
  fetchOrder: async function (id) {
    try {
      const res = await getOrderByIdApi(id);
      if (res.data.length) {
        this.setData({ order: res.data[0] });
        this._connetSocket(res.data[0].webSocketAdress)
      }
    } catch (error) {

    }
  },
  _connetSocket: function (url) {
    const ws = wx.connectSocket({
      url,
    });
    ws.onOpen((res) => {
      console.log(res)
    });
    ws.onMessage((res) => {
      console.log(res)
    })
  }
})