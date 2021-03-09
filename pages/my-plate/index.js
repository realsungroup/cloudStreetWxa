// pages/my-plate/index.js
import { cloudRetrieve, transformDate } from '../../utils/util';

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
    this.getMyPlateWeek();
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

  _getTime(date) {
    // 获取上一天的 年 月 日
    const getPreDay = (y, m, d) => {
      if (d === 1) {
        if (m === 1) {
          m = 12;
          y--;
        } else {
          m--;
        }
        d = getMonthDays(y, m);
      } else {
        d--;
      }
      return { y, m, d };
    }
    // 获取某个月的天数
    const getMonthDays = (y, m) => {
      if ([1, 3, 5, 7, 8, 10, 12].indexOf(m) !== -1) {
        return 31;
      }
      if ([4, 6, 9, 11].indexOf(m) !== -1) {
        return 30;
      }
      if (isLeap(y)) {
        return 29;
      } else {
        return 28;
      }
    }
    // 是否是闰年
    const isLeap = (y) => {
      return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0;
    }
    // 小于 10 的数字，加上前缀 0
    const prefix0 = (num) => {
      return num < 10 ? '0' + num : num;
    }
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();

    const endTime = Number(y + prefix0(m) + prefix0(d));
    for (let i = 0; i < 6; i++) {
      const { y: _y, m: _m, d: _d } = getPreDay(y, m, d);
      y = _y;
      m = _m;
      d = _d;
    }
    const startTime = Number(y + prefix0(m) + prefix0(d));
    return { startTime, endTime };
  },
  // 处理从后台返回的数据
  _getRecords(data) {
    const arr = [];
    data.forEach((item) => {
      const obj = {};
      obj.timeSlot = item['C3_554579379649'];
      obj.type = item['C3_513890663124'];
      obj.diningRoom = item['C3_517602201297'];
      obj.select = item['C3_512261273552'];
      obj.imgUrl = item['C3_514046415115'];
      obj.recId = item['REC_ID'];
      obj.isPay = item['C3_512262270614'] === 'Y' ? true : false;
      obj.time = transformDate(item['C3_512140206161'], '/');
      obj.sub = [];
      item.subdata.forEach((sub) => {
        const o = {};
        o.imgUrl = sub['C3_512140252349'];
        o.h1 = sub['C3_512140251614'];
        o.h2 = sub['C3_512140253770'];
        o.foodPrice = sub['C3_512140252005'];
        o.count = sub['C3_512140253505'];
        obj.sub.push(o);
      });
      arr.push(obj);
    })
    return arr;
  },
  getMyPlateWeek: async function () {
    try {
      this.setData({ loading: true })
      const { startTime, endTime } = this._getTime(new Date());
      const { data } = await cloudRetrieve({
        resid: 546782725601,
        subresid: 512140171786,
        cmswhere: `C3_512140206161 between '${startTime}' and '${endTime}'`
      });
      const records = this._getRecords(data);
      console.log(data)
      this.setData({
        list: records
      });
      this.setData({ loading: false });
    } catch (error) {
      this.setData({ loading: false });
      console.error(error)
    }
  },
  goDetail: function (e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/ordering-detail/index',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: item });
      }
    })
  }
})