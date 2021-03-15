// pages/write-off-history/index.js
import { cloudRetrieve, } from '../../utils/util';
import dayjs from 'dayjs';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeTab: 0,
    tabSwiperHeight: 700,
    selectedDate: dayjs().format('YYYY-MM-DD'),
    undealed: {
      data: [],
      hasMore: true
    },
    dealed: {
      data: [],
      hasMore: true
    },
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const sysInfo = wx.getSystemInfoSync();
    const menuButtonObject = wx.getMenuButtonBoundingClientRect();
    const statusBarHeight = sysInfo.statusBarHeight,
      navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight + 2) * 2;//导航高度
    const tabSwiperHeight = sysInfo.windowHeight - navHeight - 44 - 30;
    const tabs = [
      { title: '未核销' },
      { title: '已核销' },
    ]
    this.setData({ tabs, tabSwiperHeight });
    this.getUndealed();
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
    const { activeTab } = this.data;
    switch (activeTab) {
      case 0:
        this.getUndealed();
        break;
      case 1:
        this.getDealed();
        break;
      default:
        break;
    }
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
    const { selectedDate } = this.data;
    try {
      const token = wx.getStorageSync('restaurant-manager-token');
      this.setData({ loading: true });
      const res = await cloudRetrieve({
        resid: '668700234824',
        subresid: '512140171786',
        cmswhere: `C3_512140206161 = '${dayjs(selectedDate).format('YYYYMMDD')}'`
      }, {
        token,
        baseUrl: 'https://finisar.realsun.me:9092'
      });
      this.setData({
        'dealed.data': res.data,
        'tabs[1].title': `已核销(${res.data.length})`,
        loading: false
      })
    } catch (error) {
      console.error(error);
      this.setData({ loading: false });
    }
  },
  getUndealed: async function () {
    const { selectedDate } = this.data;
    try {
      this.setData({ loading: true });
      const token = wx.getStorageSync('restaurant-manager-token');
      const res = await cloudRetrieve({
        resid: '668699951366',
        subresid: '512140171786',
        cmswhere: `C3_512140206161 = '${dayjs(selectedDate).format('YYYYMMDD')}'`
      }, {
        token,
        baseUrl: 'https://finisar.realsun.me:9092'
      });
      this.setData({
        'undealed.data': res.data,
        'tabs[0].title': `未核销(${res.data.length})`,
        loading: false
      });
    } catch (error) {
      console.error(error);
      this.setData({ loading: false });
    }
  },
  onChange: function (e) {
    const { index } = e.detail;
    this.setData({ activeTab: index }, () => {
      const { undealed, dealed } = this.data;
      switch (index) {
        case 0:
          !undealed.data.length && this.getUndealed();
          break;
        case 1:
          !dealed.data.length && this.getDealed();
          break;
        default:
          break;
      }
    });
  },
  selectedDateChange: function (e) {
    const { value } = e.detail;
    this.setData({ selectedDate: value }, () => {
      this.getUndealed();
      this.getDealed();
    });
  },
  goDetail: function (e) {
    const { recid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/write-off-confirme/index?recid=' + recid,
    });
  }
})