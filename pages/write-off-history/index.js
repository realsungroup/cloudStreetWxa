// pages/write-off-history/index.js
import { cloudRetrieve, } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeTab: 0,
    tabSwiperHeight: 700,
    undealed: {
      data: [],
      hasMore: true
    },
    dealed: {
      data: [],
      hasMore: true
    },
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
      { title: '未核销' },
      { title: '已核销' },
    ]
    this.setData({ tabs, tabSwiperHeight });
    this.getDealed();
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
  getDealed: async function () {
    try {
      const token = wx.getStorageSync('restaurant-manager-token');
      const res = await cloudRetrieve({
        resid: '668700234824',
        subresid: '512140171786'
      }, {
        token,
        baseUrl: 'https://finisar.realsun.me:9092'
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  },
  getUndealed: async function () {
    try {
      const token = wx.getStorageSync('restaurant-manager-token');
      const res = await cloudRetrieve({
        resid: '668699951366',
        subresid: '512140171786'
      }, {
        token,
        baseUrl: 'https://finisar.realsun.me:9092'
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  },
})