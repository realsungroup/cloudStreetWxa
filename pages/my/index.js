// pages/my/index.js
import { isURL, getQueryObject } from '../../utils/util'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userLogined: false,
    personalInfo: null,
    canDisplay: false,
    wxUserInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navHeight: app.globalData.navHeight,
      navTop: app.globalData.navTop,
    });
    if (app.globalData.businessInfo[660914792669]) {
      const businessInfo = app.globalData.businessInfo[660914792669][0]
      this.setData({
        businessInfo,
        canDisplay: businessInfo.business_fullname != '企业员工服务'
      });
    }
    app.$watch('businessInfo', (val) => {
      if (val[660914792669].length) {
        const businessInfo = val[660914792669][0];
        this.setData({
          businessInfo,
          canDisplay: businessInfo.business_fullname != '企业员工服务'
        });
      }
    });
    this.setData({
      userLogined: app.globalData.userLogined,
      personalInfo: app.globalData.personalInfo,
      wxUserInfo: app.globalData.wxUserInfo
    });
    app.$watch('userLogined', (val) => {
      this.setData({
        userLogined: val
      })
    });
    app.$watch('wxUserInfo', (val) => {
      this.setData({
        wxUserInfo: val
      })
    });

    app.$watch('personalInfo', (val) => {
      this.setData({
        personalInfo: val
      })
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  handleLogin: function () {
    if (this.data.wxUserInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/wxauth/index',
      })
    }
  },
  gotoUserInfo: function () {
    const { userLogined } = this.data;
    userLogined && wx.navigateTo({
      url: '/pages/user-info/index',
    })
  },
  gotoAccountInfo: function () {
    const { userLogined } = this.data;
    userLogined && wx.navigateTo({
      url: '/pages/account-info/index',
    });
  },
  logout: function () {
    wx.removeStorageSync('userInfo');
    app.setGlobalData({
      userLogined: false,
      loginedUser: null,
      personalInfo: {},
      wxUserInfo: null
    });
  },
  scanRide: function () {
    const { userLogined } = this.data;
    if (!userLogined) {
      return
    }
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
          wx.navigateTo({
            url: '/pages/add-order-byscan/index?timeid=' + timeid,
          })
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
  goAddressManage: function () {
    const { userLogined } = this.data;
    userLogined && wx.navigateTo({
      url: '/pages/order-list/index',
    });
  },
  goOrderingHome: function () {
    const { userLogined } = this.data;
    userLogined && wx.navigateTo({
      url: '/pages/ordering-home/index',
    });
  },
  goMyPlate: function () {
    const { userLogined } = this.data;
    userLogined && wx.navigateTo({
      url: '/pages/my-plate/index',
    });
  },
  goReceiveMealHome: function () {
    const { userLogined } = this.data;
    userLogined && wx.navigateTo({
      url: '/pages/receive-meal-home/index',
    });
  },
  goConsumeDetail: function () {
    const { userLogined } = this.data;
    userLogined && wx.navigateTo({
      url: '/pages/consume-detail/index',
    });
  },
  writeOff: function () {
    wx.navigateTo({
      url: '/pages/write-off-scan/index',
    });
  }
})