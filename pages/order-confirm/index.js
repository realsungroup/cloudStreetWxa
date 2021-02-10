// pages/order-confirm/index.js
import { addOrderData, modifyPreOrder, submitOrder } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: null,
    shopGoods: [],
    totalPrice: "0.00",
    remark: '',
    originData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    const address = wx.getStorageSync('wxaddress');
    if (address) {
      this.setData({ addressInfo: address });
    }
    eventChannel.on('acceptDataFromOpenerPage', async ({ data }) => {
      wx.showLoading({
        title: "",
      })
      try {
        const res = await addOrderData(data);
        const res1 = await modifyPreOrder(res.data.map((i) => {
          return { REC_ID: i.maindata.REC_ID };
        }));
        let totalPrice = 0;
        const _data = res.data.map((item, index) => {
          const allprice = res1.data[index].order_allPrice
          totalPrice += Number(allprice);
          return {
            data: item.subdata.map((it) => {
              return it.maindata;
            }),
            title: res1.data[index].shop_name,
            order_allPrice: allprice,
            logistics_price: res1.data[index].logistics_price,
          };
        });
        wx.hideLoading();
        this.setData({ shopGoods: _data, totalPrice, originData: data });
      } catch (error) {
        wx.hideLoading();
        wx.showToast({
          title: error.message,
        })
      }
    })
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
  getAddress: function () {
    wx.chooseAddress({
      success: (res) => {
        wx.setStorage({
          data: res,
          key: 'wxaddress',
        })
        this.setData({ addressInfo: res });
      }
    })
  },
  handleSubmit: async function () {
    const { addressInfo, originData, remark } = this.data;
    if (!addressInfo) {
      return wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
    }
    try {
      wx.showLoading({
        title: "",
      });
      const data = originData.map(item => {
        return {
          resid: "652530887844",
          maindata: {
            ...item.maindata,
            name: addressInfo.userName,
            phone: addressInfo.telNumber,
            address: addressInfo.provinceName + addressInfo.cityName + addressInfo.countyName,
            order_remark: remark,
          },
          subdata: item.subdata.map(subItem => {
            return {
              ...subItem,
              resid: '652531033941'
            }
          })
        }
      });
      const response = await submitOrder(data);
      wx.hideLoading();
      const ids = response.data.map((item) => item.maindata.REC_ID).join(',')
      wx.redirectTo({
        url: `/pages/order-pay/index?orderIds=${ids}&totalPrice=${this.data.totalPrice}`,
      });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: error.message,
      })
    }
  }
})