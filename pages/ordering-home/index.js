// pages/ordering-home/index.js
import { cloudRetrieve } from '../../utils/util';

// 获取五天
const getDates = date => {
  const weekNum2Chinese = w => {
    return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][w];
  };

  // 获取下一天
  const getNextDay = (y, m, d) => {
    const monthDays = getMonthDays(y, m);
    if (d + 1 <= monthDays) {
      return d + 1;
    } else {
      return 1;
    }
  };
  // 获取下一个月
  const getNextMonth = m => {
    if (m + 1 > 12) {
      return 1;
    } else {
      return m + 1;
    }
  };

  // 获取下一年
  const getNextYear = y => {
    return y + 1;
  };

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
  };
  // 是否是闰年
  const isLeap = y => {
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  };
  // 小于 10 的数字，加上前缀 0
  const prefix0 = num => {
    return num < 10 ? "0" + num : num;
  };
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  const today = d;
  let w = date.getDay();
  let i = 0;
  const dates = [];
  while (i++ < 5) {
    dates.push({
      title: m + "/" + d + " " + weekNum2Chinese(w),
      content: [
        // 默认 早餐 和 午餐
        { id: 1, imgUrl: '/images/zc.png', type: "早餐", typeCode: 1 },
        { id: 2, imgUrl: '/images/wc.png', type: "午餐", typeCode: 2 },
        { id: 3, imgUrl: '/images/zc.png', type: "晚餐", typeCode: 3 },
        { id: 4, imgUrl: '/images/wc.png', type: "夜宵", typeCode: 4 }
      ],
      dateString: "" + y + prefix0(m) + prefix0(d)
    });
    d = getNextDay(y, m, d);
    if (m === 12 && d < today) {
      y = getNextYear(y);
    }
    if (d === 1) {
      m = getNextMonth(m);
    }
    if (w === 6) {
      w = 0;
    } else {
      w++;
    }
  }
  return dates;
};
// 处理从后台返回的数据
const dealData = data => {
  const arr = [];
  data.forEach(item => {
    const obj = {};
    obj.timeSlot = item["C3_554579379649"];
    obj.type = item["C3_513890663124"];
    obj.diningRoom = item["C3_517602201297"];
    obj.select = item["C3_512261273552"];
    obj.imgUrl = item["C3_514046415115"];
    obj.recId = item["REC_ID"];
    obj.isPay = item["C3_512262270614"] === "Y" ? true : false;
    obj.sub = [];
    item.subdata.forEach(sub => {
      const o = {};
      o.imgUrl = sub["C3_512140252349"];
      o.h1 = sub["C3_512140251614"];
      o.h2 = sub["C3_512140253770"];
      o.foodPrice = sub["C3_512140252005"];
      o.count = sub["C3_512140253505"];
      obj.sub.push(o);
    });
    arr.push(obj);
  });
  return arr;
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeTab: 0,
    isOrdered: false,
    selectedDate: '',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const tabs = getDates(new Date());
    this.setData({ tabs }, () => { this._getDealData(0) })
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

  _getDealData: async function (i) {
    try {
      const selectedDate = this.data.tabs[i].dateString;
      wx.showLoading({
        title: '',
      });
      this.setData({ loading: true });
      const { data } = await cloudRetrieve({
        resid: 546782725601,
        subresid: 512140171786,
        cmswhere: `C3_512140206161="${selectedDate}"`,
      })
      // 当天没有点餐
      if (data && data.length === 0) {
        const { tabs } = this.data;
        const newContent = [
          // 默认 早餐 和 午餐
          { id: 1, imgUrl: '/images/zc.png', type: "早餐", typeCode: 1 },
          { id: 2, imgUrl: '/images/wc.png', type: "午餐", typeCode: 2 },
          { id: 3, imgUrl: '/images/zc.png', type: "晚餐", typeCode: 3 },
          { id: 4, imgUrl: '/images/wc.png', type: "夜宵", typeCode: 4 }
        ];
        let index = tabs.length;
        while (index--) {
          if (tabs[index].dateString === selectedDate) {
            tabs[index].content = newContent;
            break;
          }
        }
        this.setData({
          tabs,
          isOrdered: false,
          selectedDate,
          loading: false
        });
        wx.hideLoading();
        // 当天已经点餐
      } else {
        const { tabs } = this.data;
        const newContent = dealData(data);
        let index = tabs.length;
        while (index--) {
          if (tabs[index].dateString === selectedDate) {
            tabs[index].content = newContent;
            break;
          }
        }
        this.setData({ tabs, isOrdered: true, selectedDate, loading: false });
        wx.hideLoading();
      }
    } catch (error) {
      wx.hideLoading();
      this.setData({ loading: false })
      wx.showModal({
        showCancel: false,
        content: error.message
      })
    }
  },
  onTabChange: function (e) {
    const index = e.detail.index;
    this.setData({ activeTab: index }, () => {
      this._getDealData(index);
    })
  },
  goOrder: function (e) {
    const { type } = e.currentTarget.dataset;
    const { selectedDate } = this.data;
    wx.navigateTo({
      url: `/pages/ordering-select/index?typeCode=${type}&selectedDate=${selectedDate}`,
    })
  }
})