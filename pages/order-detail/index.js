// pages/order-detail/index.js
import { getOrderDetailData, cancelOrderApi, confirmReceiveOrder } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    goodsList: [],
    loadingData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { orderId } = options;
    this.getOrder(orderId);

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
  getOrder: async function (id) {
    try {
      this.setData({ loadingData: true });
      const res = await getOrderDetailData(id);
      this.setData({
        loadingData: false,
        order: res.data[0],
        goodsList: res.subdata.data,
        ...this.getButtonsVisible(res.data[0])
      })
    } catch (error) {
      this.setData({ loadingData: false });
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: error.message
      })
    }
  },
  getButtonsVisible: (order) => {
    const payVisiable =
      order.isPay !== "Y" && order.order_status !== "已取消" ? true : false;
    const cancelVisiable = order.order_status === "待支付" ? true : false;
    const confirmReceive = order.order_status === "待收货" ? true : false;
    const afterSaleVisible =
      order.order_status !== "待支付" && order.order_status !== "已取消"
        ? true
        : false;
    return {
      payVisiable,
      cancelVisiable,
      confirmReceive,
      afterSaleVisible
    }
  },
  cancelOrder: function () {
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单?',
      success: async (res) => {
        const { order } = this.data;
        if (res.confirm) {
          try {
            await cancelOrderApi(order.order_ID);
            const eventChannel = this.getOpenerEventChannel()
            eventChannel.emit('refreshEvent', {});
            wx.navigateBack({
              delta: 0,
            });
            wx.showToast({
              title: '订单已取消',
            });
          } catch (error) {
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: error.message
            });
          }
        }
      }
    });
  },
  confirmOrder: function () {
    wx.showModal({
      title: '确认收货',
      content: '您已经收货?',
      success: async (res) => {
        const { order } = this.data;
        if (res.confirm) {
          try {
            await confirmReceiveOrder(order.order_ID);
            const eventChannel = this.getOpenerEventChannel()
            eventChannel.emit('refreshEvent', {});
            wx.navigateBack({
              delta: 0,
            })
            wx.showToast({
              title: '确认收货成功',
            })
          } catch (error) {
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: error.message
            });
          }
        }
      }
    });
  },
  orderPay: function () {
    const { order } = this.data;
    wx.redirectTo({
      url: `/pages/order-pay/index?orderIds=${order.order_ID}&totalPrice=${order.order_allPrice}`,
    });
  }
})