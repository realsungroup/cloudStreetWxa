// pages/write-off-confirme/index.js
import { cloudRetrieve, transformDate, save100 } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { recid } = options;
    this.getData(recid);
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
  getData: async function (recid) {
    try {
      this.setData({ loading: true });
      const token = wx.getStorageSync('restaurant-manager-token');
      const { data } = await cloudRetrieve({
        resid: 668699951366,
        subresid: 512140171786,
        cmswhere: `REC_ID = '${recid}'`,
      }, {
        token,
        baseUrl: 'https://finisar.realsun.me:9092'
      });
      if (data.length == 1) {
        const orderList = this.dealOrdersData(data);
        this.setData({ order: orderList[0], loading: false });
      } else {
        wx.showModal({
          showCancel: false,
          content: '无此记录',
          success(res) {
            wx.navigateBack();
          }
        })
      }
    } catch (error) {
      this.setData({ loading: false });
      console.error(error);
    }
  },
  // 处理餐盘数据
  dealOrdersData(ordersData) {
    const arr = [];
    ordersData.forEach(order => {
      const obj = {};
      obj.timeSlot = order['C3_554579379649'];
      obj.type = order['C3_513890663124'];
      obj.diningRoom = order['C3_517602201297'];
      obj.select = order['C3_512261273552'];
      obj.imgUrl = order['C3_514046415115'];
      obj.recId = order['REC_ID'];
      obj.time = transformDate(order['C3_512140206161'], '/');
      obj.sub = [];
      order.subdata.forEach(sub => {
        const o = {};
        o.imgUrl = sub['C3_512140252349'];
        o.h1 = sub['C3_512140251614'];
        o.h2 = sub['C3_512140253770'];
        o.foodPrice = sub['C3_512140252005'];
        o.count = sub['C3_512140253505'];
        obj.sub.push(o);
      });
      arr.push(obj);
    });
    return arr;
  },
  confirmWriteOff: async function () {
    const { order } = this.data;
    const token = wx.getStorageSync('restaurant-manager-token');
    try {
      wx.showLoading();
      const data = [{
        'REC_ID': order.recId,
        'C3_512262253052': 'Y',
        '_state': 'modified',
        '_id': 1
      }];
      await save100({
        resid: 668699951366,
        data: JSON.stringify(data),
      }, {
        token,
        baseUrl: 'https://finisar.realsun.me:9092'
      });
      wx.hideLoading();
      wx.showToast({
        title: '核销成功',
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
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