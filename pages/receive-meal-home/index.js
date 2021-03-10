// pages/receive-meal/index.js
import { cloudRetrieve, transformDate } from '../../utils/util';
import dayjs from 'dayjs';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
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
  getData: async function () {
    const dateString = dayjs().format('YYYYMMDD');
    try {
      this.setData({ loading: true });
      const { data } = await cloudRetrieve({
        resid: 546782725601,
        cmswhere: `C3_512140206161="${dateString}" and C3_512262270614="Y"`,
        subresid: 512140171786,
      });
      console.log(data);
      const orderList = this.dealOrdersData(data);
      this.setData({ list: orderList, loading: false });
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
  goDetail: function (e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/ordering-detail/index',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: item });
      }
    });
  },
  receiveMeal: function (e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/receive-meal/index',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: item });
      }
    });
  }
})