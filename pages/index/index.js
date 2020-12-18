//index.js
import { getBusinessGoods, getOrdersApi, queryDeviceByTimeId, saveDevice, modifyOrderApi } from '../../utils/http/http.services'
import { isURL, getQueryObject } from '../../utils/util'
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    businessInfo: {},
    goods: [],
    miniProgramLogined: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasOrder: false,
    orders: [],
    currentOrder: null,
    scanDevice: null, //扫码扫到的设备信息

    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    interval: 5000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },
  onReady: function () {
  },
  onLoad: function (option) {
    // console.log(decodeURIComponent(option.q));

    const ws = wx.connectSocket({
      url: 'wss://kingofdinner.realsun.me/bicycle?resid=660941167468&recid=661605903052',
    })
    ws.onMessage((res) => {
      console.log('message-----', res)
    });
    ws.onOpen((res) => {
      console.log('open-----', res);
      ws.send({
        data: 'ping'
      })
    });
    ws.onClose(() => {
      console.log('ws-close');
    })
    ws.onError(() => {
      console.log('ws-onerror')
    })
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
    })
    this.fetchOrders();
    if (app.globalData.miniProgramLogined) {
      this.fetchBusinessGoods();
    }
    app.$watch('miniProgramLogined', (val, old) => {
      this.setData({ miniProgramLogined: val });
      if (val && !old) {
        this.fetchBusinessGoods();
      }
    });
    if (app.globalData.hasAuth) {
      this.setData({ hasUserInfo: true })
    }
    app.$watch('hasAuth', (val) => {
      if (val) {
        this.setData({ hasUserInfo: true })
      }
    });
    if (app.globalData.businessInfo[660914792669]) {
      this.setData({ businessInfo: app.globalData.businessInfo[660914792669][0] })
    }
    app.$watch('businessInfo', (val) => {
      if (val[660914792669].length) {
        this.setData({ businessInfo: val[660914792669][0] })
      }
    });
  },
  fetchBusinessGoods: async function () {
    try {
      const goods = await getBusinessGoods();
      if (goods.data.length) {
        this.setData({
          goods: goods.data
        })
      }
    } catch (error) {
      console.error(error)
    }
  },
  fetchOrders: async function () {
    try {
      const orders = await getOrdersApi();
      if (orders.data.length) {
        this.setData({
          hasOrder: true,
          currentOrder: orders.data[0],
          orders: orders.data,
        })
      }
    } catch (error) {
      console.error(error)
    }
  },
  testOrders: function () {
    wx.navigateTo({
      url: '/pages/test-order/index',
    })
  },
  handleScan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'QR_CODE',
      success: async (res) => {
        const result = res.result;
        let qrCodeValid = false;
        let timeid = '';
        if (isURL(result)) {
          const qs = getQueryObject(result);
          if (qs.id) {
            qrCodeValid = true;
            timeid = qs.id;
          }
        }
        if (qrCodeValid) {
          try {
            let res = await queryDeviceByTimeId(timeid);
            if (res.data.length) {
              res = await saveDevice(res.data[0]);
              const data = res.data[0]
              if (data.isonline === 'Y') {
                this.setData({ scanDevice: data })
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
        } else {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '二维码不正确'
          })
        }
      },
      fail: function () {

      }
    })
  },
  rideRightNow: async function (e) {
    const { currentOrder, scanDevice } = this.data
    try {
      const res = await modifyOrderApi({
        ...currentOrder,
        goliveid: scanDevice.goliveid,
        C3_658000358736: 'Y'
      });
      console.log(res);
      this.setData({ scanDevice: null });
      wx.navigateTo({
        url: '/pages/ride-detail/index',
      })
    } catch (error) {
      console.log(error)
    }
  },
  cancelRide: function () {
    this.setData({ scanDevice: null });
  },
  goRideDetail: function () {
    // wx.navigateTo({
    //   url: '/pages/ride-detail/index?orderid=' + this.data.currentOrder.orderid,
    // })
    wx.navigateTo({
      url: '/pages/http-test/index',
    })
  },
  pay: function (e) {
    const { currentOrder } = this.data
    wx.cloud.callFunction({ //调用云函数
      name: 'wxpay',
      data: {
        goods_name: currentOrder.good_name,
        orderid: currentOrder.orderid
      },
      success: res => {
        const payment = res.result.payment
        wx.requestPayment({
          ...payment,
          success(res) {
            console.log('pay success', res)
          },
          fail(res) {
            console.error('pay fail', res)
          }
        })
      },
      fail: console.error,
    })
  },
  refund: function (e) {
    const { currentOrder } = this.data
    wx.cloud.callFunction({ //调用云函数
      name: 'refund',
      data: {
        out_refund_no: currentOrder.orderid + dayjs().valueOf(),
        transaction_id: '4200000804202012186409047494',
        out_trade_no: currentOrder.orderid
      },
      success: res => {
        console.log(res)
      },
      fail: console.error,
    })
  },
})
