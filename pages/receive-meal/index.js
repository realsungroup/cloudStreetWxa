// pages/receive-meal/index.js
import { save100 } from '../../utils/util';

var QRCode = require('../../utils/qrcode.js')

const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;

// 300rpx 在6s上为 150px
const code_w = 300 / rate;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    code_w: code_w
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', ({ data }) => {
      this.qrcode = new QRCode('canvas', {
        text: data.recId + "",
        width: code_w,
        height: code_w,
        colorDark: "#000000",
        colorLight: "white",
        correctLevel: QRCode.CorrectLevel.H,
      });
      this.setData({ order: data });
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

  receiveMeal: async function () {
    const { order } = this.data;
    try {
      wx.showLoading({
        title: '领餐中'
      });
      const data = [{
        'REC_ID': order.recId,
        'C3_512262253052': 'Y',
        '_state': 'modified',
        '_id': 1
      }];
      await save100({
        resid: 529086370280,
        data: JSON.stringify(data),
      });
      wx.hideLoading();
      wx.showToast({
        title: '领餐成功',
        success: () => {
          setTimeout(() => {
            const pages = getCurrentPages();
            const targetIndex = pages.findIndex(page => page.route == 'pages/my/index');
            const currentIndex = pages.findIndex(page => page.route == this.route);
            if (!isNaN(targetIndex)) {
              wx.navigateBack({
                delta: currentIndex - targetIndex,
              })
            } else {
              wx.navigateBack({
                delta: currentIndex - 0,
              });
            }
          }, 2000);
        }
      });
    } catch (err) {
      wx.hideLoading();
      wx.showModal({
        showCancel: false,
        content: err.message
      })
    }
  }
})