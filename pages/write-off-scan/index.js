// pages/write-off-scan/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    password: '',
    logined: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const account = wx.getStorageSync('restaurant-manager-account');
    const password = wx.getStorageSync('restaurant-manager-password');
    this.setData({
      account: account || '',
      password: password || ''
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

  login: function () {
    const { password, account } = this.data;
    wx.showLoading();
    wx.cloud.callFunction({
      name: 'restaurant-login',
      data: {
        password,
        account
      },
      success: res => {
        const response = res.result;
        wx.hideLoading();
        if (response.OpResult === 'Y') {
          // 登录成功
          wx.setStorageSync('restaurant-manager-token', response.AccessToken);
          wx.setStorageSync('restaurant-manager-account', account);
          wx.setStorageSync('restaurant-manager-password', password);
          this.setData({ logined: true });
        } else {
          wx.hideLoading();
          wx.showModal({
            showCancel: false,
            content: response.ErrorMsg
          });
        }
      },
      fail: (error) => {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          content: error.message
        });
      },
    });
  },
  handleScan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        wx.navigateTo({
          url: '/pages/write-off-confirme/index?recid=' + res.result,
        });
      }
    })
  },
  goHistory: function () {
    wx.navigateTo({
      url: '/pages/write-off-history/index',
    })
  }
})