// pages/ride-detail/index.js
import { getOrderByIdApi, lockDeviceApi, unlockDeviceApi, startWebSocketService, queryDeviceByTimeId, modifyOrderApi } from '../../utils/http/http.services';
import dayjs from 'dayjs';
import { isURL, getQueryObject } from '../../utils/util';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    scanDevice: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
    });
    this.fetchOrder(options.orderid);
    this.createDashboard();
  },
  ws: null,
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
    this.ws && this.ws.close()
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
  fetchOrder: async function (id) {
    try {
      const res = await getOrderByIdApi(id);
      if (res.data.length) {
        const data = res.data[0]
        this.setData({ order: data });
        this.createDashboard(data.leftminutes / 60);
        if (res.data[0].goliveid) {
          try {
            const resp = await startWebSocketService(data.certfile, data.certpass);
            this._connetSocket(res.data[0].webSocketAdress)
          } catch (error) {
          }
        };
      }
    } catch (error) {

    }
  },
  _connetSocket: function (url) {
    this.ws = wx.connectSocket({
      url,
    });
    this.ws.onOpen((res) => {
      console.log('open');
    });
    this.ws.onMessage((res) => {
      this.ws.send({
        data: 'pong'
      });
      if (res.data) {
        const data = JSON.parse(res.data);
        this.createDashboard(data.leftminutes / 60);
        console.log(dayjs().format('HH:mm:ss'), data);
        this.setData({ order: { ...this.data.order, ...data } });
      }
    });
    this.ws.onClose((e) => {
      console.log('closed', e)
      if (e.code !== 1000) {
        console.log('重新连接')
        this._connetSocket(url)
      }
    });
    this.ws.onError((e) => {
      console.log('error', e);
    })
  },
  createDashboard: function (leftTime = 0) {
    const ctx = wx.createCanvasContext('dashboard');
    const startAng = 0.7 * Math.PI;
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.arc(60, 60, 50, 0.3 * Math.PI, 0.7 * Math.PI, true);
    ctx.strokeStyle = '#999999';
    ctx.stroke();

    ctx.lineWidth = 15;
    ctx.beginPath();
    const leftPercent = leftTime > 60 ? 1 : (leftTime / 60);
    ctx.arc(60, 60, 50, startAng, startAng + 1.6 * Math.PI * leftPercent,);
    // ctx.strokeStyle = '#FD8D3C';
    const grd = ctx.createLinearGradient(0, 0, 120, 0)
    grd.addColorStop(0, '#FD8D3C')
    grd.addColorStop(1, '#FA541C')
    ctx.setStrokeStyle(grd)
    ctx.stroke();

    ctx.setFontSize(24);
    ctx.setTextAlign("center");
    ctx.setTextBaseline("middle");
    ctx.setFillStyle("#FA541C");
    ctx.fillText(leftTime.toFixed(1), 60, 66);

    ctx.setFontSize(14);
    ctx.setTextAlign("center");
    ctx.setTextBaseline("middle");
    ctx.setFillStyle("#ffffff");
    ctx.fillText('剩余', 60, 36);

    ctx.setFontSize(14);
    ctx.setTextAlign("center");
    ctx.setTextBaseline("middle");
    ctx.setFillStyle("#ffffff");
    ctx.fillText('分钟', 60, 100);

    ctx.draw()

  },
  lockDevice: async function () {
    try {
      await lockDeviceApi({ goliveid: this.data.order.goliveid });
    } catch (error) {
      wx.showModal({
        showCancel: false,
        content: error.message
      })
    }
  },
  unlockDevice: async function () {
    try {
      const res = await getOrderByIdApi(this.data.order.orderid);
      if(res.data.length){
        const data = res.data[0]
        if(data.leftminutes>0){
          await unlockDeviceApi({ goliveid: this.data.order.goliveid });
        }
        this.setData({order:data})
        this.createDashboard(data.leftminutes / 60);
      }
    } catch (error) {
      wx.showModal({
        showCancel: false,
        content: error.message
      })
    }
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
                content: '设备id无效'
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
  cancelRide: function () {
    this.setData({ scanDevice: null });
  },
  rideRightNow: async function (e) {
    const { order, scanDevice } = this.data
    try {
      await modifyOrderApi({
        ...order,
        goliveid: scanDevice.goliveid,
        C3_658000358736: 'Y',
      });
      this.setData({ scanDevice: null });
    } catch (error) {
      wx.showModal({
        title: '提示',
        content: error.message,
        showCancel: false
      })
    }
  },
  hanldeGoHome: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  handleBack: function () {
    wx.navigateBack()
  },
})