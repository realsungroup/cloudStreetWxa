// pages/shop/index.js
import { getShops, getShopGoods } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop: {},
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
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      const { shop } = data;
      this.setData({ shop });
      this.getGoods(shop.shopid, true);
    })
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
    const { shop } = this.data;
    this.getGoods(shop.shopid, true);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { hasMore, shop,loadingMore } = this.data;
    hasMore && !loadingMore && this.getGoods(shop.shopid);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPageScroll: function (e) {
    this.setData({
      backTopVisible: e.scrollTop > 300 ? true : false
    })
  },
  getGoods: async function (id, isFirst = false) {
    let { pageindex, pagesize, goodsList } = this.data;
    try {
      if (isFirst) {
        this.setData({ refreshing: true });
        pageindex = 0;
      } else {
        this.setData({ loadingMore: true });
      }
      const res = await getShopGoods({ id, pagesize, pageindex });
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
  goGoodsDetail: function (e) {
    wx.navigateTo({
      url: '/pages/goods-detail/index?id=' + e.currentTarget.dataset.goods.putaway_ID,
    });
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.shop.shop_phone,
    })
  }
})