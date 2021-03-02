// pages/search/index.js
import { getSearchHistory, addSearchHistory, getTags } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    tags: [],
    histories: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchHistories();
    this.fetchTags();
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
  fetchHistories: async function () {
    try {
      const res = await getSearchHistory();
      this.setData({ histories: res.data })
    } catch (error) {
    }
  },
  fetchTags: async function () {
    try {
      const res = await getTags();
      this.setData({ tags: res.data });
    } catch (error) {
      console.error(error)
    }
  },
  searchValueChange: function (e) {
    this.setData({ searchValue: e.detail.value });
  },
  handleSearch: function () {
    const { searchValue } = this.data;
    if (!searchValue.trim()) {
      return wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
    }
    addSearchHistory({ word: searchValue });
    wx.navigateTo({
      url: '/pages/search-result/index?searchText=' + searchValue,
    });
  },
  handleTagTap: function (e) {
    const { text } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/search-result/index?searchText=' + text,
    });
  }
})