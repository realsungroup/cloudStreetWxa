// pages/search-result/idnex.js
import { searchGoods } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '',
    pagesize: 10,
    pageindex: 0,
    hasMore: true,
    goodsList: [],
    loadingMore: false,
    refreshing: false,
    backTopVisible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { searchText } = options;
    this.setData({ searchText });
    this.fetchGoodsList(searchText, true);
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
    const { hasMore, searchText, loadingMore } = this.data;
    hasMore && !loadingMore && this.fetchGoodsList(searchText);
  },
  onPageScroll: function (e) {
    this.setData({
      backTopVisible: e.scrollTop > 300 ? true : false
    })
  },
  fetchGoodsList: async function (searchText, isFirst = false) {
    let { pageindex, pagesize, goodsList } = this.data;
    try {
      if (isFirst) {
        this.setData({ refreshing: true });
        pageindex = 0;
      } else {
        this.setData({ loadingMore: true });
      }
      const res = await searchGoods({ searchText, pagesize, pageindex });
      const { total, data } = res;
      const hasMore = total > pagesize * (pageindex + 1);
      this.setData({
        goodsList: isFirst ? data : goodsList.concat(data),
        hasMore,
        pageindex: hasMore ? pageindex + 1 : pageindex,
        loadingMore: false,
        refreshing: false
      });
    } catch (error) {
      this.setData({
        loadingMore: false,
        refreshing: false
      })
      console.error(error);
    }
  },
  goGoodsDetail: function (e) {
    wx.navigateTo({
      url: '/pages/goods-detail/index?id=' + e.currentTarget.dataset.goods.putaway_ID,
    });
  },
  backTop: function () {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        showCancel: false
      })
    }
  },
})