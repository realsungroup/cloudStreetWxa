// pages/categories/index.js
import { getCategories } from '../../utils/http/http.services';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    lv1Categoryies: [],
    subCategoryies: [],
    selectedLv1: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchCategories();
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
  fetchCategories: async function () {
    try {
      this.setData({ loading: true });
      const res = await getCategories();
      const subCategoryies = res.data[this.data.selectedLv1][656532954878].map((item) => {
        return { data: item[656533024235], title: item.name };
      });
      this.setData({
        subCategoryies,
        lv1Categoryies: res.data
      });
      this.setData({ loading: false });
    } catch (error) {
      this.setData({ loading: false });
      console.error(error);
    }
  },
  changeLv1: function (e) {
    const { index } = e.currentTarget.dataset;
    const subCategoryies = this.data.lv1Categoryies[index] ? this.data.lv1Categoryies[index][656532954878].map((item) => {
      return { data: item[656533024235], title: item.name };
    }) : this.data.subCategoryies;
    this.setData({ selectedLv1: index, subCategoryies });
  },
  goCategoryGoods: function (e) {
    const { category } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/category-goods/index?id=${category.id}&name=${category.name}`,
    });
  }
})