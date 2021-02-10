// pages/goods-detail/index.js
import { getGoodsById, addGoodsToCart } from '../../utils/http/http.services';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    photos: [],
    isService: false,
    deviceCount: 0,
    cartGoodsCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchGoods(options.id)
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
  fetchGoods: async function (id) {
    try {
      const res = await getGoodsById(id);
      if (res.data.length) {
        const data = res.data[0]
        let deviceCount = 0
        if (data[660929208133].length) {
          deviceCount = data[660929208133][0].bookSouceAmount
        }
        this.setData({
          goods: data,
          isService: data.C3_660842519689 == 'Y',
          deviceCount,
          photos: data.goods_photos ? data.goods_photos.split(';') : []
        })
      } else {
        wx.showToast({ icon: 'none', title: '查询不到' })
      }
    } catch (error) {

    }
  },
  goAddOrder: function () {
    if (app.globalData.loginedUser) {
      const { goods } = this.data
      wx.navigateTo({
        url: '/pages/add-order/index?goods_id=' + goods.goods_id,
      });
    } else {
      wx.navigateTo({
        url: '/pages/wxauth/index',
      });
    }
  },
  addToCart: async function () {
    await addGoodsToCart({
      goods_ID: this.data.goods.goods_id,
      putaway_ID: this.data.goods.putaway_ID,
    }, 1);
    wx.showToast({
      title: '已添加到购物车'
    });
    wx.switchTab({
      url: '/pages/cart/index',
    })
  }
})