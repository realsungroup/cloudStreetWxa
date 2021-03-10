// pages/ordering-select/index.js
import { cloudRetrieve, indexOfObj } from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companies: [],
    companyIndex: 0,
    diningRooms: [],
    diningRoomIndex: 0,
    foods: [], // 菜单
    foodIndex: 0, // 当前选中菜单的下标
    allCount: 0, // 所点菜的数量
    allPrice: 0, // 所点菜的价格
  },
  selectedDate: "",
  typeCode: 0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { typeCode, selectedDate } = options;
    this.selectedDate = selectedDate;
    this.typeCode = typeCode;
    try {
      wx.showLoading({
        title: '',
      })
      const { data } = await cloudRetrieve({ resid: 516731338280 });
      const {
        companies,
        diningRoomes,
        companiesVals,
        allCompAndDin
      } = this.dealDiningRoomData(data);
      const foods = await this._getDealDiningRoomMenu(allCompAndDin[0].roomCode);
      wx.hideLoading();
      this.setData({ foods, companies, diningRooms: diningRoomes, companiesVals });
    } catch (error) {
      wx.hideLoading();
      console.error(error);
    }
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
  // 处理餐厅数据
  dealDiningRoomData(diningRooms) {
    const companies = [];
    const companiesVals = [];

    const allCompAndDin = [];

    const diningRoomes = [];
    const diningRoomesVals = [];

    diningRooms.forEach(diningRoom => {
      const company = {
        label: diningRoom['C3_547243910426'],
        value: diningRoom['C3_511301223989']
      };
      const room = {
        label: diningRoom['C3_511301160005'],
        value: diningRoom['C3_511301141786']
      };
      const comAndRoom = {
        companyName: diningRoom['C3_547243910426'],
        companyCode: diningRoom['C3_511301223989'],
        roomName: diningRoom['C3_511301160005'],
        roomCode: diningRoom['C3_511301141786']
      };
      room.companyCode = company.value;
      if (indexOfObj(companies, 'value', company.value) === -1) {
        companies.push(company);
      }
      diningRoomes.push(room);
      allCompAndDin.push(comAndRoom);
    });

    companiesVals[0] = companies[0].value;
    diningRoomesVals[0] = diningRoomes[0].value;
    return {
      companies,
      diningRoomes,
      companiesVals,
      diningRoomesVals,
      allCompAndDin
    };
  },
  // 获取餐厅菜单
  async _getDealDiningRoomMenu(diningRoomCode) {
    try {
      const { data } = await cloudRetrieve({
        resid: 553627061985,
        cmswhere: `C3_529015233619 ='${diningRoomCode}' and  ( ifnull(C3_529015275277,'')=''  or C3_529015275277 = '${this.selectedDate}') and C3_529015876735 =${this.typeCode}`,
        cmscolumns:
          'C3_529015359909,C3_529015295101,C3_529017566783,C3_530119625613,C3_529015358827,C3_529015359113,C3_529015359363',
      });
      if (data.length === 0) {
        return [];
      }
      const menus = [];
      data.forEach(menu => {
        const obj = {};
        const index = indexOfObj(menus, 'typeName', menu['C3_530119625613']);
        const foodObj = {
          key: menu['C3_529017566783'], // 发布菜单明细编号
          h1: menu['C3_529015358827'],
          h2: menu['C3_529015359363'],
          price: menu['C3_529015359113'],
          imgUrl: menu['C3_529015359909'],
          count: 0
        };
        if (index === -1) {
          obj.typeName = menu['C3_530119625613'];
          obj.index = menus.length;
          obj.isActive = false;
          obj.isSelect = false;
          obj.foodList = [];
          obj.foodList.push(foodObj);
          menus.push(obj);
        } else {
          menus[index].foodList.push(foodObj);
        }
      });
      menus[0].isActive = true;
      return menus;
    } catch (err) {
      console.error(err);
    }
  },
  // 添加食物
  addCount(e) {
    const { fooddata } = e.currentTarget.dataset;
    this.handleAddFood(fooddata);
  },
  handleAddFood: function (fooddata) {
    const { allCount, allPrice, foods, foodIndex } = this.data;
    const food = foods[foodIndex];
    // 将该种类的菜标记为已选择
    food.isSelect = true;

    food.foodList.forEach(foodObj => {
      if (fooddata.key === foodObj.key) {
        foodObj.count++;
      }
    });
    this.setData({
      allCount: allCount + 1,
      allPrice: allPrice + fooddata.price,
      foods
    });
  },
  // 减少食物
  decCount(e) {
    const { fooddata } = e.currentTarget.dataset;
    const { allCount, allPrice, foods, foodIndex } = this.data;
    const food = foods[foodIndex];
    if (fooddata.count - 1 === 0) {
      food.isSelect = false;
    }
    food.foodList.forEach(foodObj => {
      if (fooddata.key === foodObj.key) {
        foodObj.count--;
      }
    });
    this.setData(
      {
        allCount: allCount - 1,
        allPrice: allPrice - fooddata.price,
        foods
      }
    );
  },
  companyChange: function () {

  },
  // 选择餐厅
  async selectRoom(e) {
    const { value } = e.detail;
    const { diningRooms } = this.data;
    const diningRoomCode = diningRooms[value].value;
    // 获取以及处理菜单数据
    wx.showLoading({ title: '' });
    const foods = await this._getDealDiningRoomMenu(diningRoomCode);
    wx.hideLoading();
    const foodIndex = 0,
      allCount = 0,
      allPrice = 0;
    this.setData(
      {
        foodIndex,
        allCount,
        allPrice,
        foods,
        diningRoomIndex: value
      }
    );
  },
  selectType: function (e) {
    const foodIndex = e.currentTarget.dataset.index;
    const { foods } = this.data;
    foods.forEach(food => {
      food.isActive = food.index === foodIndex ? true : false;
    });
    this.setData({ foodIndex });
  },
  goDetail: function (e) {
    const { item } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/food-detail/index',
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          food: item,
          addFood: () => {
            this.handleAddFood(item);
          }
        })
      },
    })
  },
  nextStep: function () {
    const {
      foods,
      allPrice,
      allCount,
      companies,
      diningRooms,
      companyIndex,
      diningRoomIndex
    } = this.data;
    const company = companies[companyIndex];
    const diningRoom = diningRooms[diningRoomIndex];
    // 没点餐
    if (!allCount) {
      wx.showToast({
        title: '请点餐',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    const foodList = [];
    foods.forEach(food => {
      food.foodList.forEach(item => {
        if (item.count > 0) {
          const obj = Object.assign({}, item);
          foodList.push(obj);
        }
      });
    });
    wx.navigateTo({
      url: '/pages/ordering-pay/index',
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          company,
          diningRoom,
          foodList,
          allPrice,
          typeCode: this.typeCode,
          selectedDate: this.selectedDate
        })
      }
    })
  }
})