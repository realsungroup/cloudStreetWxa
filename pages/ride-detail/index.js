// pages/ride-detail/index.js
import { getOrderByIdApi, lockDeviceApi, unlockDeviceApi, startWebSocketService } from '../../utils/http/http.services';
import dayjs from 'dayjs';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: null
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
      console.log(dayjs().format('HH:mm:ss'), res);
      this.ws.send({
        data: 'pong'
      });
      if (res.data) {
        this.setData({ order: JSON.parse(res.data) });
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
  createDashboard: function () {
    const ctx = wx.createCanvasContext('dashboard');
    const startAng = 0.7 * Math.PI;
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.arc(60, 60, 50, 0.3 * Math.PI, 0.7 * Math.PI, true);
    ctx.strokeStyle = '#999999';
    ctx.stroke();

    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.arc(60, 60, 50, startAng, startAng + 1.6 * Math.PI * 0.7,);
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
    ctx.fillText('30', 60, 66);

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

    }
  },
  unlockDevice: async function () {
    try {
      await unlockDeviceApi({ goliveid: this.data.order.goliveid });
    } catch (error) {

    }
  },
})