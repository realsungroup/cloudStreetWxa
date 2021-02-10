// pages/order-pay/index.js
import { addPayTable, modifyOrdersPayId } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { value: 'weixin', name: '微信支付' },
    ],
    selectedPayway: 'weixin',
    totalPrice: "0.00",
    enterpriceAccount: null,
    waitingPayOrders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { totalPrice, orderIds } = options;
    if (totalPrice && orderIds) {
      this.setData({
        // totalPrice: 0.01,
        totalPrice,
        waitingPayOrders: orderIds.split(',')
      })
    }
    this.getEnterprice();
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
  radioChange: function (e) {
    this.setData({ selectedPayway: e.detail.value })
  },
  getEnterprice: function () {
    const userInfo = (wx.getStorageSync('wxUserInfo'));
    if (userInfo) {
      wx.cloud.callFunction({ //调用云函数
        name: 'getEnterpriceUserinfo',
        data: {
          unionid: userInfo.unionId,
        },
        success: res => {
          const response = res.result;
          if (response.error == 0) {
            if (response.data.length) {
              this.setData({
                enterpriceAccount: response.data[0],
                items: [...this.data.items, { value: 'enterprice', name: '企业账户支付' }],
                selectedPayway: 'enterprice'
              })
            }
          }
        },
        fail: console.error,
      })
    }
  },
  handleSubmit: function () {
    const { selectedPayway } = this.data;
    if (selectedPayway == 'weixin') {
      this.wxpay()
    } else {
      this.enterprisePay()
    }
  },
  wxpay: async function () {
    const { totalPrice, waitingPayOrders } = this.data;
    try {
      wx.showLoading({
        title: '支付中',
      })
      const res = await addPayTable([{ pay_money: totalPrice }]);
      const _payID = res.data[0].pay_ID
      await modifyOrdersPayId(
        waitingPayOrders.map((item) => ({
          REC_ID: item,
          pay_ID: _payID,
        }))
      )
      wx.cloud.callFunction({ //调用云函数
        name: 'wxpay',
        data: {
          goods_name: "商城小程序-" + _payID,
          orderid: _payID,
          totalFee: Number(totalPrice) * 100
        },
        success: res => {
          wx.hideLoading();
          const payment = res.result.payment;
          wx.requestPayment({
            ...payment,
            success(res) {
              wx.hideLoading();
              wx.showModal({
                showCancel: false,
                title: '支付成功',
                content: '您的订单支付成功',
                success(res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '/pages/index/index',
                    })
                  }
                }
              });
            },
            fail(res) {
              console.error('pay fail', res)
            }
          })
        },
        fail: console.error,
      })
    } catch (error) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: error.message,
        showCancel: false
      })
    }
  },
  enterprisePay: async function () {
    const { totalPrice, waitingPayOrders } = this.data;
    try {
      wx.showLoading({
        title: '支付中',
      })
      const res = await addPayTable([{ pay_money: totalPrice }]);
      const _payID = res.data[0].pay_ID
      await modifyOrdersPayId(
        waitingPayOrders.map((item) => ({
          REC_ID: item,
          pay_ID: _payID,
        }))
      );
      const userInfo = (wx.getStorageSync('wxUserInfo'));
      if (userInfo) {
        wx.cloud.callFunction({ //调用云函数
          name: 'enterpricePay',
          data: {
            unionid: userInfo.unionId,
            tradeNo: _payID,
            totalMoney: totalPrice
          },
          success: res => {
            const response = res.result;
            if (response.error == 0) {
              wx.hideLoading();
              wx.showModal({
                showCancel: false,
                title: '支付成功',
                content: '您的订单支付成功',
                success(res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '/pages/index/index',
                    })
                  }
                }
              });
            }
          },
          fail: (error) => {
            console.error(error);
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: error.message,
              showCancel: false
            })
          },
        });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: error.message,
        showCancel: false
      })
    }
  }
})