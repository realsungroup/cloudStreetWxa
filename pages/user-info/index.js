// pages/user-info/index.js
import { modifyPersonalinfo } from '../../utils/http/http.services';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.personalInfo) {
      this.setData({ userInfo: { ...app.globalData.personalInfo } });
    }
    app.$watch('personalInfo', (val, old) => {
      this.setData({ userInfo: { ...val } });
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
  handleInput: function (e) {
    const value = e.detail.value;
    const field = e.target.id;
    this.setData({ userInfo: { ...this.data.userInfo, [field]: value } })
  },
  saveUserInfo: async function () {
    try {
      const res = await modifyPersonalinfo(this.data.userInfo);
      app.setGlobalData({
        personalInfo: res.data[0]
      })
      wx.showToast({ title: '修改成功', duration: 2000 });
      setTimeout(() => {
        wx.navigateBack({
          delta: 0,
        });
      }, 2000);

    } catch (error) {
      wx.showToast({ icon: 'none', title: error.message })
    }
  }
})