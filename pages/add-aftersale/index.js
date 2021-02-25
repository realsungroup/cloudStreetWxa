// pages/add-aftersale/index.js
import { addAftersale } from '../../utils/http/http.services';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    goodsList: [],
    typeArr: [],
    reasonArr: [],
    typeindex: undefined,
    reasonindex: undefined,
    otherReason: '',
    error: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({ reasonArr: app.globalData.aftersaleReasons.map(reason => reason.return_reason) });
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', ({ order, goodsList, }) => {
      this.setData({
        order, goodsList,
        typeArr: order.order_status === "待发货"
          ? ["退款"]
          : ["退货退款", "换货",],
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
  checkedItem: function (event) {
    let itemIndex = event.currentTarget.dataset.itemIndex;
    const { goodsList } = this.data;
    goodsList[itemIndex].checked = !goodsList[itemIndex].checked;
    this.setData({
      goodsList,
    });
  },
  typeChange: function (e) {
    this.setData({
      typeindex: e.detail.value
    })
  },
  reasonChange: function (e) {
    this.setData({
      reasonindex: e.detail.value
    })
  },
  handleSubmit: async function () {
    const { typeArr, typeindex, reasonArr, reasonindex, order, goodsList, otherReason } = this.data;
    const seletedGoods = goodsList.filter(goods => goods.checked);
    if (typeindex == undefined) {
      return this.setData({ error: '售后类型为必选项' });
    }
    if (reasonindex == undefined) {
      return this.setData({ error: '售后理由为必选项' });
    }
    if (reasonArr[reasonindex] == "其他" && !otherReason) {
      return this.setData({ error: '请输入其他理由' });
    }
    if (seletedGoods.length == 0) {
      return this.setData({ error: '请选择商品' });
    }
    try {
      const data = {
        resid: 654108166979,
        maindata: {
          afterSale_type: typeArr[typeindex],
          afterSale_reason:
            reasonArr[reasonindex] === "其他" ? otherReason : reasonArr[reasonindex],
          order_ID: order.order_ID,
          _state: "added",
          _id: 0,
        },
        subdata: seletedGoods.map((goods, index) => {
          delete goods.REC_ID;
          return {
            resid: 654108194889,
            maindata: {
              ...goods,
              goods_num: goods.counts,
              _state: "added",
              _id: index,
            },
          };
        }),
      };
      wx.showLoading()
      const res = await addAftersale([data]);
      wx.hideLoading();
      const afterSaleId = res.data[0].maindata.afterSale_ID;
      wx.redirectTo({
        url: '/pages/aftersale-detail/index?id=' + afterSaleId,
      })
    } catch (error) {
      wx.hideLoading();
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: error.message
      })
    }
  },
  tiphide: function () {
    this.setData({ error: '' })
  }
})