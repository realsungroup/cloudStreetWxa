// pages/goods-detail/index.js
import { getGoodsById, addGoodsToCart, getCartGoods } from '../../utils/http/http.services';

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
    this._id = options.id;
    this.fetchGoods(options.id);
    this.fetchCart();
  },
  _id: undefined,
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
  onPullDownRefresh: async function () {
    await this.fetchGoods(this._id);
    wx.stopPullDownRefresh();
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
        wx.setNavigationBarTitle({
          title: data.goods_name
        });
        this.setData({
          goods: data,
          isService: data.C3_660842519689 == 'Y',
          deviceCount,
          photos: data.goods_photos ? data.goods_photos.split(';') : []
        })
      } else {
        wx.showToast({ icon: 'none', title: '商品不见了' })
      }
    } catch (error) {

    }
  },
  fetchCart: async function () {
    if (!app.globalData.loginedUser) {
      return
    }
    try {
      const res = await getCartGoods();
      let cartCounts = 0;
      res.data.forEach(item => {
        cartCounts += item.goods_counts;
      });
      this.setData({
        cartGoodsCount: cartCounts
      })
    } catch (error) {
      console.error(error)
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
    if (!app.globalData.loginedUser) {
      return wx.navigateTo({
        url: '/pages/wxauth/index',
      });
    }
    const { goods } = this.data;
    if (!goods.goods_id) {
      return;
    }
    try {
      wx.showLoading();
      await addGoodsToCart({
        goods_ID: goods.goods_id,
        putaway_ID: goods.putaway_ID,
      }, 1);
      this.fetchCart();
      wx.hideLoading();
      wx.showToast({
        title: '已添加到购物车'
      });
    } catch (error) {
      wx.hideLoading();
      wx.showModal({
        title: '添加购物车失败',
        content: error.message,
        showCancel: false
      })
    }
  },
  buy: async function () {
    if (!app.globalData.loginedUser) {
      return wx.navigateTo({
        url: '/pages/wxauth/index',
      });
    }
    const { goods } = this.data;
    if (!goods.goods_id) {
      return;
    }
    try {
      wx.showLoading();
      await addGoodsToCart({
        goods_ID: goods.goods_id,
        putaway_ID: goods.putaway_ID,
      }, 1);
      this.fetchCart();
      wx.hideLoading();
      wx.switchTab({
        url: '/pages/cart/index',
      });
    } catch (error) {
      wx.hideLoading();
      wx.showModal({
        title: '添加购物车失败',
        content: error.message,
        showCancel: false
      })
    }
  },
  goToCart: function () {
    if (!app.globalData.loginedUser) {
      return wx.navigateTo({
        url: '/pages/wxauth/index',
      });
    }
    wx.switchTab({
      url: '/pages/cart/index',
    });
  }
})