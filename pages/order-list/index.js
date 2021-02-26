// pages/address-list/index.js
import {
  getAllOrderData,
  getOrderPayingData,
  getOrderWaitSendData,
  getOrderWaitReceiveData,
  getOrderOrderDoneData,
  deleteOrderById
} from '../../utils/http/http.services';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    allOrder: [],
    unpayOrders: [],
    waitsendOrders: [],
    waitreceiveOrders: [],
    doneOrders: [],
    loadingData: false,
    activeTab: 0,
    tabSwiperHeight: 700
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const sysInfo = wx.getSystemInfoSync();
    const menuButtonObject = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight,
      navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight + 2) * 2;//导航高度
    const tabSwiperHeight = sysInfo.windowHeight - navHeight - 44;
    const tabs = [
      { title: '全部', getData: this.getAllOrder },
      { title: '待付款', getData: this.getUnpayOrders },
      { title: '待发货', getData: this.getWaitSendOrders },
      { title: '待收货', getData: this.getWaitreceiveOrders },
      { title: '已完成', getData: this.getDoneOrders }];
    this.setData({ tabs, tabSwiperHeight });
    this.getAllOrder();
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
  onTabCLick(e) {
    const index = e.detail.index
    this.setData({ activeTab: index }, this.data.tabs[index].getData)
  },
  onChange(e) {
    const index = e.detail.index;
    this.setData({ activeTab: index }, this.data.tabs[index].getData)
  },
  handleClick: function (e) {
    const id = e.currentTarget.dataset.orderId;
    wx.navigateTo({
      url: '/pages/order-detail/index?orderId=' + id,
      events: {
        refreshEvent: (data) => {
          const { tabs, activeTab } = this.data;
          tabs[activeTab].getData();
        }
      }
    })
  },
  getAllOrder: async function () {
    try {
      this.setData({ loadingData: true });
      const res = await getAllOrderData();
      this.setData({
        allOrder: res.data,
        loadingData: false
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
  getWaitSendOrders: async function () {
    try {
      this.setData({ loadingData: true });
      const res = await getOrderWaitSendData();
      this.setData({
        waitsendOrders: res.data,
        loadingData: false
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
  getUnpayOrders: async function () {
    try {
      this.setData({ loadingData: true });
      const res = await getOrderPayingData();
      this.setData({
        unpayOrders: res.data,
        loadingData: false
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
  getWaitreceiveOrders: async function () {
    try {
      this.setData({ loadingData: true });
      const res = await getOrderWaitReceiveData();
      this.setData({
        waitreceiveOrders: res.data,
        loadingData: false
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
  getDoneOrders: async function () {
    try {
      this.setData({ loadingData: true });
      const res = await getOrderOrderDoneData();
      this.setData({
        doneOrders: res.data,
        loadingData: false
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
  deleteOrder: async function (e) {
    const id = e.currentTarget.dataset.orderId;
    const { activeTab } = this.data;
    try {
      await deleteOrderById(id);
      this.data.tabs[activeTab].getData()
    } catch (error) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: error.message
      });
    }
  }
})