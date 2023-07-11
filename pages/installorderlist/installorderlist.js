// pages/installorderlist/installorderlist.js
import {
  InstallOrder
} from '../installorder/installorder-model.js';
import {
  Screenshot
} from '../../utils/screenshot';
var screenshot = new Screenshot();
var installorder = new InstallOrder();
const app = getApp();

Page({
  data: {
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [{
        text: '安装服务单号',
        value: 0
      },
      {
        text: '客户姓名',
        value: 1
      }
    ], //下拉列表的数据
    index: 0, //选择的下拉列表下标
    hadselect: false,
    returnOrderArr: [],
    orderArr: [],
    pageIndex: 1,
    isLoadedAll: false,
  },

  onLoad: function (options) {
    var that = this;
    this._getOrders();
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
  },
  _getOrders: function (searchType, keyword) {
    var that = this;
    var param = {};
    param.fUsrID = app.globalData.fUsrID;
    param.fOrgID = app.globalData.fOrgID;
    param.ShowPage = this.data.pageIndex;

    if (searchType != undefined && keyword != undefined) {
      console.log('=====if ========')
      if (searchType == 0) {
        param.fOrdServerNo = keyword;
      } else if (searchType == 1) {
        param.fReciveman = keyword;
      }
    }
    console.log('=====installorder111')
    installorder.getInstallOrderList(param, (data) => {
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
  onReachBottom: function () {
    console.log('onReachBottom');
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this._getOrders(this.data.searchType, this.data.keyword);
    }
  },
  showOrderDetailInfo: function (event) {
    var fOrdServerID = event.currentTarget.dataset.fordserverid
    console.log('fOrdServerID', fOrdServerID)
    wx.navigateTo({
      url: '../installorder/installorder?from=list&fOrdServerID=' + fOrdServerID
    });
  },


  // 订单搜索有关函数
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
})