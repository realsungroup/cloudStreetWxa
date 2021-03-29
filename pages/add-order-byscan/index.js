// pages/add-order-byscan/index.js
import { queryDeviceByTimeId, addOrderApi, modifyOrderApi } from '../../utils/http/http.services';
import dayjs from 'dayjs';
import { getQueryObject } from '../../utils/util'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minutesArr: [5, 10, 20, 30, 40, 50, 60, 120, 240, 360],
    value: undefined,
    scanDevice: {},//扫到的设备信息
    loginedUser: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { q, timeid } = options;
    if (app.globalData.loginedUser) {
      this.afterLogined(timeid, q);
      this.setData({ loginedUser: app.globalData.loginedUser })
    }
    app.$watch('loginedUser', (val,old) => {
      this.setData({ loginedUser: val });
      if (val && !old) {
        this.afterLogined(timeid, q);
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
  afterLogined: function (timeid, q) {
    if (timeid) {
      this.fetchData(timeid);
      return;
    }
    if (q) {
      const id = getQueryObject(decodeURIComponent(q)).id
      if (id) {
        this.fetchData(id);
      } else {
        wx.showModal({
          showCancel: false,
          content: '二维码不正确，请重新扫码',
          title: '提示',
        });
      }
    } else {
      wx.showModal({
        showCancel: false,
        content: '二维码不正确，请重新扫码',
        title: '提示',
      });
    }
  },

  fetchData: async function (timeid) {
    try {
      let res = await queryDeviceByTimeId(timeid);
      if (res.data.length) {
        const data = res.data[0]
        if (data.isonline === 'Y') {
          // 设备当前状态
          const deviceState = data[661964358786][0]
          if (deviceState.devicestate === '繁忙') {
            if (deviceState[661964402374].length) {
              // 设备当前订单
              const deviceOrder = deviceState[661964402374][0];
              if (this.data.loginedUser && (deviceOrder.userid === this.data.loginedUser.UserInfo.EMP_ID)) {
                wx.redirectTo({
                  url: '/pages/ride-detail/index?orderid=' + deviceOrder.orderid,
                });
              } else {
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: '当前设备已占用'
                });
              }
            } else {
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '繁忙但无订单'
              });
            }
          } else {
            this.setData({ scanDevice: data });
          }
        } else {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '设备不在线'
          });
        }
      } else {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '二维码已过期，请重新扫码'
        });
      }
    } catch (error) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: error.message
      })
    }
  },

  minutesChange: function (e) {
    const value = e.detail.value
    this.setData({ value })
  },
  addOrder: async function () {
    const { scanDevice } = this.data;
    if (!app.globalData.loginedUser) {
      return wx.showModal({
        showCancel: false,
        content: '您尚未登录，即将前往登录页面',
        title: '提示',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/wxauth/index',
            });
          }
        }
      })
    }

    if (scanDevice.REC_ID) {
      if (isNaN(this.data.value)) {
        return wx.showToast({
          title: '请选择骑行时长',
          icon: 'none'
        })
      }
      const { value, minutesArr } = this.data;
      const good_id = scanDevice[660929208133][0].shopservice_id;
      const starttime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const endtime = dayjs().add(minutesArr[value], 'minute').format('YYYY-MM-DD HH:mm:ss');
      try {
        wx.showToast({
          title: '下单并支付',
          icon: 'loading',
          duration: 0
        })
        // 下单
        const orderRes = await addOrderApi({
          starttime,
          endtime,
          good_id,
          goliveid: scanDevice.goliveid,
          C3_658000358736: 'Y',
        });
        const order = orderRes.data[0];
        // 支付
        wx.cloud.callFunction({ //调用云函数
          name: 'wxpay',
          data: {
            goods_name: order.good_name,
            orderid: order.orderid,
            totalFee: order.money * 100
          },
          success: res => {
            const payment = res.result.payment
            wx.requestPayment({
              ...payment,
              success: async (res) => {
                wx.redirectTo({
                  url: '/pages/ride-detail/index?orderid=' + order.orderid,
                });
              },
              fail(res) {
                console.error('pay fail', res);
                wx.showToast({
                  title: '用户取消支付',
                  icon: 'none'
                })
              }
            })
          },
          fail: console.error,
        })
      } catch (error) {
        wx.showModal({
          showCancel: false,
          content: error.message,
          title: '提示'
        });
      }
    } else {
      wx.showToast({
        title: '设备不可用请重新扫码',
        icon: 'none'
      })
    }
  }
})