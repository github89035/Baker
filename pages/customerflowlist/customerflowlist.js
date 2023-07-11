// pages/list/list.js
import {
  Customerflow
} from '../customerflow/customerflow-model.js';
import {
  Screenshot
} from '../../utils/screenshot';
var screenshot = new Screenshot();
var customerflow = new Customerflow();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [{
        text: '客戶ID',
        value: 0
      },
      {
        text: '客戶姓名',
        value: 1
      },
      {
        text: '電話',
        value: 2
      },
      {
        text: '電子信箱',
        value: 3
      }
    ], //下拉列表的数据
    index: 0, //选择的下拉列表下标
    hadselect: false,
    orderArr: [],
    pageIndex: 1,
    isLoadedAll: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //保存截屏
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1].route
    console.log(currentPage);
    wx.onUserCaptureScreen(function (res) {
      var pageData = JSON.stringify(that.data);
      console.log('pageData=====', pageData);
      screenshot.savescreenshot(app.globalData.fUsrID, currentPage, pageData, (data) => {
        console.log(data)
      })
    })
    //this._getOrders();
  },
  onShow: function () {
    var cartTotalCounts = wx.getStorageSync('cart').length;
    console.log('cartTotalCounts', cartTotalCounts)
    this.setData({
      cartTotalCounts: cartTotalCounts
    })
  },

  /*跳转到购物车*/
  onCartTap: function () {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },


  _getOrders: function (searchType, keyword) {
    var that = this;
    var param = {};
    param.pUID = app.globalData.nUserID;
    param.pAccount = app.globalData.pUserAccount;

    if (searchType != undefined && keyword != undefined) {
      console.log('=====if ========')
      if (searchType == 0) {
        param.pCustomUID = keyword;
      } else if (searchType == 1) {
        param.pCustomName = keyword;
      }
    }

    if (searchType == undefined) {
      searchType = '';
    }
    if (keyword == undefined) {
      keyword = '';
    }

    param.pSearchType = searchType.toString();
    param.pSearchText = keyword;

    console.log('===param===', param);
    customerflow.getCustomerFlowList(param, (data) => {
      var orderlist = data.Data;
      that.setData({
        loadingHidden: false
      });
      if (orderlist.length > 0) {
        that.data.orderArr.push.apply(that.data.orderArr, orderlist); //数组合并
        that.setData({
          orderArr: that.data.orderArr
        });
        console.log(that.data.orderArr)
      } else {
        that.data.isLoadedAll = true; //已经全部加载完毕

      }
    });
  },
  
  // onReachBottom: function () { // 往下拉後更新頁數資料
  //   console.log('onReachBottom');
  //   if (!this.data.isLoadedAll) {
  //     this.data.pageIndex++;
  //     this._getOrders(this.data.searchType, this.data.keyword);
  //   }
  // },

  showOrderDetailInfo: function (event) {
    console.log('test', event.currentTarget.dataset)
    var pCustomUID = event.currentTarget.dataset.pcustomuid
    console.log('pCustomUID', pCustomUID)
    wx.navigateTo({
      url: '../customerflow/customerflow?from=list&pCustomUID=' + pCustomUID
    });
  },

  goToAddCustomerFlow: function (event) {
    wx.navigateTo({
      url: '../customerflow/customerflow?from=add',
    })
  },
  searchOrder: function (event) {
    let keyword = event.currentTarget.dataset.keyword; //获取点击的下拉列表的下标
    let searchType = event.currentTarget.dataset.searchtype;
    console.log('keyword', keyword);
    console.log('searchType', searchType);
    console.log('searchOrder');
    this.setData({
      orderArr: []
    })
    this._getOrders(searchType, keyword);
    this.setData({
      keyword: keyword,
      searchType: searchType,
    })
  },

  //获取订单搜索关键字
  getInput: function (event) {
    console.log('getInput', event.detail.value)
    this.setData({
      keyword: event.detail.value
    })
  },
  //获取点击的搜索条件的下标
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;
    this.setData({
      index: Index,
      show: !this.data.show,
      hadselect: true,
      searchType: Index
    });
  },
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
})