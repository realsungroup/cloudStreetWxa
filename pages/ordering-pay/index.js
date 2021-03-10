// pages/ordering-pay/index.js
import { transformDate, cloudRetrieve } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    enterpriceAccount: {},
    timeIntervals: [],
    timeIntervalIndex: 0,
    company: {},
    diningRoom: {},
    foodList: '',
    allPrice: '',
    type: '',
    typeCode: '',
    date: '',
    selectedDate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    this.getEnterprice();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      const { company,
        diningRoom,
        foodList,
        allPrice,
        typeCode,
        selectedDate } = data;
      const type = this.transformType(typeCode);
      this.getDiningTimeInterval(typeCode);
      this.setData({
        company,
        diningRoom,
        foodList,
        allPrice,
        type,
        typeCode,
        date: transformDate(selectedDate, '/'),
        selectedDate
      })
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

  // 数字 转换为 文字
  transformType(typeCode) {
    if (typeCode == 1) {
      return '早餐';
    } else if (typeCode == 2) {
      return '午餐';
    } else if (typeCode == 3) {
      return '晚餐';
    } else if (typeCode == 4) {
      return '夜宵';
    }
  },
  getEnterprice: function () {
    const userInfo = (wx.getStorageSync('wxUserInfo'));
    if (userInfo) {
      wx.cloud.callFunction({ //调用云函数
        name: 'getEnterpriceUserinfo',
        data: {
          unionid: userInfo.unionId,
        },
        success: res => {
          const response = res.result;
          if (response.error == 0) {
            if (response.data.length) {
              const accountData = response.data[0];
              this.setData({
                enterpriceAccount: accountData,
              })
            }
          }
        },
        fail: console.error,
      })
    }
  },
  getDiningTimeInterval: async function (typeCode) {
    try {
      wx.showLoading({})
      const { data } = await cloudRetrieve({ resid: 554579578747 });
      const {
        timeIntervals,
        defaultTimeInterval,
        timeValues
      } = this.dealTimeData(data, typeCode);
      wx.hideLoading();
      this.setData({ timeIntervals, defaultTimeInterval });
    } catch (error) {
      wx.hideLoading();
      console.error(error)
    }
  },
  // 处理就餐时间段数据
  dealTimeData(timeData, typeCode) {
    const timeIntervals = [];
    let timeValues = [];
    // 如果是早餐，则固定就餐时间段（07:00 ~ 09:00）
    if (typeCode == 1) {
      timeIntervals.push({
        label: '07:00~09:00',
        value: '07:00~09:00'
      });
      // 午餐
    } else if (typeCode == 2) {
      timeIntervals.push({
        label: '',
        value: ''
      });
      timeData.forEach(time => {
        timeIntervals.push({
          label: time['C3_554579471647'],
          value: time['C3_554579471647']
        });
      });
      // 晚餐，夜宵
    } else {
      timeData.forEach(time => {
        timeIntervals.push({
          label: '',
          value: ''
        });
      });
    }
    const defaultTimeInterval = timeIntervals[0].label;
    timeValues[0] = timeIntervals[0].label;
    return { timeIntervals, defaultTimeInterval, timeValues };
  },
  timeIntervalsChange: function (e) {
    const { value } = e.detail;
    this.setData({ timeIntervalIndex: value });
  },
  confirmPay: async function () {
    const { foodList, selectedDate, typeCode, enterpriceAccount, timeIntervalIndex, timeIntervals } = this.data;
    try {
      wx.showLoading({ title: '', })
      const obj = {
        C3_512140211520: 'wxxcx', // 表示是在微信小程序端点的餐
        C3_512140205598: enterpriceAccount.C3_511317349145,
        C3_512261263145: '个人',
        C3_529018752697: '工作餐菜单',
        C3_512261273552: '自选',
        C3_512140206161: selectedDate,
        C3_512387510239: 'N',
        C3_554579379649: timeIntervals[timeIntervalIndex].value,
        C3_512140206692: typeCode,
        C3_512140206411: this._getTypeNo(typeCode),
        _state: 'added',
        _id: 1,
        '512140171786': []
      };
      foodList.forEach((food, i) => {
        obj['512140171786'].push({
          C3_529017510535: '工作餐菜单',
          C3_512344320145: food.key,
          C3_512140253505: food.count,
          _state: 'added',
          _id: i + 1
        });
      });
      const orderData = [obj];
      const userInfo = (wx.getStorageSync('wxUserInfo'));
      const res = await new Promise((resolve, reject) => {
        wx.cloud.callFunction({ //调用云函数
          name: 'dinnerOrderPay',
          data: {
            unionid: userInfo.unionId,
            data: {
              resid: 529086370280,
              data: JSON.stringify(orderData),
              subresid: 512140171786,
            }
          },
          success: res => {
            const response = res.result;
            if (response.error == 0 || response.Error == 0) {
              resolve(response);
            } else {
              reject(new Error(response.message));
            }
          },
          fail: (error) => {
            reject(error);
          },
        })
      });
      wx.hideLoading();
      wx.showToast({
        title: '支付成功',
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
    } catch (error) {
      wx.hideLoading();
      wx.showModal({
        showCancel: false,
        content: error.message
      })
    }

  },
  // 返回餐别时段编号
  _getTypeNo(typeCode) {
    switch (Number(typeCode)) {
      // 早餐
      case 1:
        return '553606369550';
      // 午餐
      case 2:
        return '512265030442';
      // 晚餐
      case 3:
        return '513562789500';
      // 夜宵
      case 4:
        return '512267664333';
    }
  }
})