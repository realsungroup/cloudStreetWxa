// pages/cart/index.js
const app = getApp();

import {
  getCartGoods,
  addGoodsToCart,
  deleteGoodsToCart
} from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsAmount": 0.00
    },
    checkedAllStatus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.$watch('userLogined', (val) => {
      if (!val) {
        this.setData({
          cartGoods: [],
          cartTotal: {
            "goodsCount": 0,
            "goodsAmount": 0.00,
            "checkedGoodsAmount": 0.00
          },
          checkedAllStatus: false,
        })
      }
    });
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
    app.globalData.userLogined && this.getCart()
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
  getCart: async function () {
    try {
      const res = await getCartGoods();
      let checkedGoodsAmount = 0;
      const cartGoods = res.data.map(item => {
        checkedGoodsAmount += item.goods_price * item.goods_counts;
        return ({ ...item, checked: true })
      })
      this.setData({
        cartGoods,
        checkedAllStatus: true,
        "cartTotal.checkedGoodsAmount": checkedGoodsAmount.toFixed(2)
      })
    } catch (error) {
      wx.showToast({
        title: error.message,
      })
    }

  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    const { cartGoods } = this.data;
    cartGoods[itemIndex].checked = !cartGoods[itemIndex].checked;
    this.setData({
      cartGoods: cartGoods,
      checkedAllStatus: this.isCheckedAll(),
    }, this.getCheckedAmount)
  },
  getCheckedAmount: function () {
    let amount = 0;
    this.data.cartGoods.forEach(item => {
      if (item.checked) {
        amount += item.goods_price * item.goods_counts;
      }
    });
    this.setData({
      "cartTotal.checkedGoodsAmount": amount.toFixed(2)
    })
  },
  changeNumber: async function (event) {
    const { itemIndex, opration } = event.target.dataset;

    const { cartGoods } = this.data;
    const data = this.data.cartGoods[itemIndex];
    if (opration == 'sub' && data.goods_counts == 1) {
      return wx.showToast({
        title: '不能再减了',
        icon: 'none'
      })
    }
    const res = await addGoodsToCart(data, 1, opration);
    res.data[0].checked = true;
    cartGoods[itemIndex] = res.data[0];
    this.setData({
      cartGoods: cartGoods
    }, this.getCheckedAmount)
  },
  deleteGoods: async function (event) {
    wx.showModal({
      title: '确认删除？',
      success: async (res) => {
        if (res.confirm) {
          const { itemIndex } = event.target.dataset;
          await deleteGoodsToCart(this.data.cartGoods[itemIndex]);
          this.getCart();
        }
      }
    })

  },
  checkedAll: function () {
    const { checkedAllStatus, cartGoods } = this.data;
    cartGoods.forEach(item => {
      item.checked = !checkedAllStatus;
    })
    this.setData({ cartGoods, checkedAllStatus: !checkedAllStatus }, this.getCheckedAmount)
  },
  checkoutOrder: function () {
    const { cartGoods } = this.data;
    const cartgoods = cartGoods.filter((item => item.checked));
    if (cartgoods.length > 0) {
      wx.navigateTo({
        url: '/pages/order-confirm/index',
        success: (res) => {
          // 通过eventChannel向被打开页面传送数据
          let shopIds = [... new Set(cartgoods.map(goods => goods.shop_ID))];
          const data = shopIds.map((id, index) => {
            const goods = cartgoods.filter(_goods => _goods.shop_ID == id);
            let TotalNum = 0;
            goods.forEach(item => {
              TotalNum += Number(item.goods_counts)
            })
            const orderInfoParams = {
              counts: TotalNum,
              putaway_ID: goods[0].putaway_ID,
            };
            return {
              resid: 654539359386,
              maindata: { ...orderInfoParams, _state: "added", _id: index },
              subdata: goods.map((item, ind) => {
                return {
                  resid: 654539372974,
                  maindata: { ...item, counts: item.goods_counts, _state: "added", _id: ind },
                };
              }),
            }
          });
          res.eventChannel.emit('acceptDataFromOpenerPage', { data })
        }
      })
    }
  }

})