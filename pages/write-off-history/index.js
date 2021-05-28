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
      currentPage: 0,
      totalPage: 10,
    },
    dealed: {
      data: [],
      currentPage: 0,
      totalPage: 10,
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
    this.getUndealed(0);
    this.getDealed(0);
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
    const { activeTab, undealed, dealed } = this.data;
    switch (activeTab) {
      case 0:
        this.getUndealed(undealed.currentPage);
        break;
      case 1:
        this.getDealed(dealed.currentPage);
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
  getDealed: async function (pageIndex = 0) {
    const { selectedDate } = this.data;
    try {
      const token = wx.getStorageSync('restaurant-manager-token');
      this.setData({ loading: true });
      const res = await cloudRetrieve({
        resid: '668700234824',
        subresid: '512140171786',
        pageSize: 10,
        pageIndex,
        cmswhere: `C3_512140206161 = '${dayjs(selectedDate).format('YYYYMMDD')}'`
      }, {
        token,
        baseUrl: 'https://finisar.realsun.me:9092'
      });
      this.setData({
        'dealed.data': res.data,
        'dealed.totalPage': Math.ceil(res.total / 10),
        'dealed.currentPage': pageIndex,
        'tabs[1].title': `已核销(${res.total})`,
        loading: false
      })
    } catch (error) {
      console.error(error);
      this.setData({ loading: false });
    }
  },
  getUndealed: async function (pageIndex = 0) {
    const { selectedDate, loading } = this.data;
    if (loading) {
      return;
    }
    try {
      this.setData({ loading: true });
      const token = wx.getStorageSync('restaurant-manager-token');
      const res = await cloudRetrieve({
        resid: '668699951366',
        subresid: '512140171786',
        pageSize: 10,
        pageIndex,
        cmswhere: `C3_512140206161 = '${dayjs(selectedDate).format('YYYYMMDD')}'`
      }, {
        token,
        baseUrl: 'https://finisar.realsun.me:9092'
      });
      this.setData({
        'undealed.data': res.data,
        'undealed.totalPage': Math.ceil(res.total / 10),
        'undealed.currentPage': pageIndex,
        'tabs[0].title': `未核销(${res.total})`,
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
          !undealed.data.length && this.getUndealed(0);
          break;
        case 1:
          !dealed.data.length && this.getDealed(0);
          break;
        default:
          break;
      }
    });
  },
  handleScrolltolower: function () {
    this.data.undealed.hasMore && this.getUndealed()
  },
  selectedDateChange: function (e) {
    const { value } = e.detail;
    this.setData({
      selectedDate: value,
      'undealed.currentPage': 0,
      'dealed.currentPage': 0,
    }, () => {
      this.getUndealed(0);
      this.getDealed(0);
    });
  },
  goDetail: function (e) {
    const { recid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/write-off-confirme/index?recid=' + recid,
    });
  },
  firstPage: function (e) {
    const { type } = e.currentTarget.dataset;
    switch (type) {
      case "undealed":
        this.getUndealed(0);
        break;
      case "dealed":
        this.getDealed(0);
        break;
      default:
        break;
    }
  },
  prePage: function (e) {
    const { undealed, dealed } = this.data;
    const { type } = e.currentTarget.dataset;
    switch (type) {
      case "undealed":
        if (undealed.currentPage > 0) {
          this.getUndealed(undealed.currentPage - 1);
        } else {
          wx.showToast({
            title: '已经是第一页了',
            icon: "none"
          })
        }
        break;
      case "dealed":
        if (dealed.currentPage > 0) {
          this.getDealed(dealed.currentPage - 1);
        } else {
          wx.showToast({
            title: '已经是第一页了',
            icon: "none"
          })
        }
        break;
      default:
        break;
    }
  },
  nextPage: function (e) {
    const { undealed, dealed } = this.data;
    const { type } = e.currentTarget.dataset;
    switch (type) {
      case "undealed":
        if (undealed.totalPage - 1 > undealed.currentPage) {
          this.getUndealed(undealed.currentPage + 1);
        } else {
          wx.showToast({
            title: '没有下一页了',
            icon: "none"
          })
        }
        break;
      case "dealed":
        if (dealed.totalPage - 1 > dealed.currentPage) {
          this.getDealed(dealed.currentPage + 1);
        } else {
          wx.showToast({
            title: '没有下一页了',
            icon: "none"
          })
        }
        break;
      default:
        break;
    }
  },
})