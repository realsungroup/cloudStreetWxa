// pages/consume-detail/index.js
import { cloudRetrieve } from '../../utils/util';

const getTimes = () => {
  const date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  const times = [];
  const timesVal = [];
  for (let i = 0; i < 6; i++) {
    const ym = y + '年' + m + '月';
    times.push({
      label: ym,
      value: ym
    });
    timesVal.push(ym);
    y = (m === 1 ? --y : y);
    m = (m === 1 ? 12 : --m);
  }
  const defaultTime = timesVal[0];
  return { times, timesVal, defaultTime };
}
/**
 * 就餐明细
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    times: [],
    timesVal: [],
    defaultTime: '',
    timeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { times, timesVal, defaultTime } = getTimes();
    console.log({ times, timesVal, defaultTime });
    // const { y, m } = this._transformYM(selectedData);
    // const { data } = await getConsumeDetail(y, m < 10 ? '0' + m : m);
    // const records = this._getRecords(data);
    // const consume = this._calConsume(records);
    this.setData({
      times, timesVal, defaultTime
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

  }
})