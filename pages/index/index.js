//index.js
import { addGoodsToCart, clearCache, getBusinessGoods, getOrdersApi, queryDeviceByTimeId, saveDevice, modifyOrderApi } from '../../utils/http/http.services';
import { isURL, getQueryObject } from '../../utils/util';
import dayjs from 'dayjs';

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
    loginedUser: null,

    background: ['http://pwapp.oss-cn-beijing.aliyuncs.com/cloudstree/34021608706894_.pic_hd.jpg', 'http://pwapp.oss-cn-beijing.aliyuncs.com/cloudstree/34031608706896_.pic_hd.jpg',
      'http://pwapp.oss-cn-beijing.aliyuncs.com/cloudstree/34041608706898_.pic_hd.jpg'],
    interval: 5000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    pageIndex: 0,
    pageSize: 10,
    hasMore: true,
    backTopVisible: false
  },
  fetchOrdersTimer: null,
  onReady: function () {

  },
  onUnload: function () {
    clearInterval(this.fetchOrdersTimer);
  },
  onLoad: function (option) {
    // clearCache();
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
    })
    if (app.globalData.miniProgramLogined) {
      this.fetchBusinessGoods();
    }
    app.$watch('miniProgramLogined', (val, old) => {
      this.setData({ miniProgramLogined: val });
      if (val && !old) {
        this.fetchBusinessGoods(0);
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

    if (app.globalData.loginedUser) {
      this.setData({ loginedUser: app.globalData.loginedUser })
    }
    app.$watch('loginedUser', (val) => {
      this.setData({ loginedUser: val })
      if (val) {
        this.getAccountInfo();
        this.fetchOrders();
        // this.fetchOrdersTimer = setInterval(() => {
        //   this.fetchOrders();
        // }, 5000);
      } else {
        clearInterval(this.fetchOrdersTimer);
        this.setData({
          hasOrder: false,
          orders: [],
          currentOrder: null,
        })
      }
    });
  },
  onReachBottom: function () {
    const { hasMore } = this.data;
    hasMore && this.fetchBusinessGoods();
  },
  onShow: function () {
    this.data.loginedUser && this.fetchOrders();
  },
  onPageScroll: function (e) {
    this.setData({
      backTopVisible: e.scrollTop > 300 ? true : false
    })
  },
  fetchBusinessGoods: async function () {
    try {
      const { pageSize, pageIndex, goods } = this.data;
      const res = await getBusinessGoods(pageIndex);
      const { total, data } = res;
      if (data.length) {
        const hasMore = total > pageSize * (pageIndex + 1);
        this.setData({
          goods: goods.concat(data),
          hasMore,
          pageIndex: hasMore ? pageIndex + 1 : pageIndex
        });
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
      } else {
        this.setData({
          hasOrder: false,
          currentOrder: null,
          orders: [],
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
              // res = await saveDevice(res.data[0]);
              const data = res.data[0]
              if (data.isonline === 'Y') {
                // 设备当前状态
                const deviceState = data[661964358786][0]
                if (deviceState.devicestate === '繁忙') {
                  if (deviceState[661964402374].length) {
                    // 设备当前订单
                    const deviceOrder = deviceState[661964402374][0];
                    if (deviceOrder.userid === this.data.loginedUser.UserInfo.EMP_ID) {
                      this.setData({ scanDevice: data });
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
        C3_658000358736: 'Y',
      });
      this.setData({ scanDevice: null });
      wx.navigateTo({
        url: '/pages/ride-detail/index?orderid=' + currentOrder.orderid,
      })
    } catch (error) {
      wx.showModal({
        title: '提示',
        content: error.message,
        showCancel: false
      })
    }
  },
  cancelRide: function () {
    this.setData({ scanDevice: null });
  },
  goRideDetail: function () {
    wx.navigateTo({
      url: '/pages/ride-detail/index?orderid=' + this.data.currentOrder.orderid,
    })
  },
  pay: function (e) {
    const { currentOrder } = this.data
    wx.cloud.callFunction({ //调用云函数
      name: 'wxpay',
      data: {
        goods_name: currentOrder.good_name,
        orderid: currentOrder.orderid,
        totalFee: currentOrder.money * 100
      },
      success: res => {
        const payment = res.result.payment
        wx.requestPayment({
          ...payment,
          success(res) {
            console.log('pay success', res)
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1500
            })
          },
          fail(res) {
            console.error('pay fail', res)
          }
        })
      },
      fail: console.error,
    })
  },
  refund: function () {
    const { currentOrder } = this.data;
    if (!currentOrder.paywxTransid) {
      return wx.showToast({
        title: '无法退款',
        icon: 'none',
        duration: 1500
      });
    }
    wx.cloud.callFunction({ //调用云函数
      name: 'refund',
      data: {
        out_refund_no: currentOrder.orderid + dayjs().valueOf(),
        transaction_id: currentOrder.paywxTransid,
        out_trade_no: currentOrder.orderid,
        refund_fee: currentOrder.money * 100,
        totalFee: currentOrder.money * 100
      },
      success: res => {
        wx.showToast({
          title: '退款成功',
          icon: 'success',
          duration: 1500
        });
      },
      fail: console.error,
    })
  },
  goGoodsDetail: function (e) {
    wx.navigateTo({
      url: '/pages/goods-detail/index?id=' + e.currentTarget.dataset.goods.putaway_ID,
    })
  },
  goAddOrder: function (e) {
    if (app.globalData.loginedUser) {
      wx.navigateTo({
        url: '/pages/add-order/index?goods_id=' + e.currentTarget.dataset.goods.goods_id,
      });
    } else {
      wx.navigateTo({
        url: '/pages/wxauth/index',
      });
    }
  },
  getAccountInfo: function () {
    //fetchAccountInfo()
    const userInfo = (wx.getStorageSync('wxUserInfo'));
    if (userInfo) {
      // wx.cloud.callFunction({ //调用云函数
      //   name: 'enterpricePay',
      //   data: {
      //     unionid: userInfo.unionId,
      //   },
      //   success: res => {
      //     const response =  res.result;
      //     if(response.error == 0){
      //       // if(response.data.length){
      //       //   console.log(response.data[0]);
      //       // }
      //     }
      //   },
      //   fail: console.error,
      // });
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
  handleScroll: function (e) {
    console.log(e)
  },
  buy: async function (e) {
    const goods = e.currentTarget.dataset.goods;
    if (!app.globalData.loginedUser) {
      return wx.navigateTo({
        url: '/pages/wxauth/index',
      });
    }
    try {
      wx.showLoading();
      await addGoodsToCart({
        goods_ID: goods.goods_id,
        putaway_ID: goods.putaway_ID,
      }, 1);
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
})
