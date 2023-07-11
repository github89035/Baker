import {
  AfterSales
} from '../aftersales/aftersales-model';
import {
  Screenshot
} from '../../utils/screenshot';
var screenshot = new Screenshot();
var aftersales = new AfterSales();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [{
        text: '销售单号',
        value: 0
      },
      {
        text: '售后服务单号',
        value: 1
      },
      {
        text: '客户姓名',
        value: 2
      }
    ], //下拉列表的数据
    index: 0, //选择的下拉列表下标
    hadselect: false,
    returnOrderArr: [],
    pageIndex: 1,
    isLoadedAll: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this._loadData()
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

  _loadData: function () {
    this._getAfterSalesOrderList();
  },

  _getAfterSalesOrderList: function (searchType, keyword) {
    var that = this;
    var param = {};
    param.fUsrID = app.globalData.fUsrID;
    param.fOrgID = app.globalData.fOrgID;
    param.ShowPage = this.data.pageIndex;

    if (searchType != undefined && keyword != undefined) {
      console.log('=====if ========')
      if (searchType == 0) {
        param.fOrdNo = keyword;
      } else if (searchType == 1) {
        param.fOrdReturnNo = keyword;
      } else if (searchType == 2) {
        param.fReciveman = keyword;
      }
    }

    aftersales.getAfterSalesOrderList(param, (data) => {
      console.log('data.Data', data.Data)
      var returnOrderList = data.Data
      console.log('returnOrderList', returnOrderList)
      if (returnOrderList.length > 0) {
        that.data.returnOrderArr.push.apply(that.data.returnOrderArr, returnOrderList); //数组合并
        that.setData({
          returnOrderArr: that.data.returnOrderArr
        });
      } else {
        that.data.isLoadedAll = true; //已经全部加载完毕
        // that.data.pageIndex = 1;
      }

    })

  },

  // 到达底部，触发加载其他页面
  onReachBottom: function () {
    console.log('onReachBottom');
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this._getAfterSalesOrderList(this.data.searchType, this.data.keyword);
    }
  },
  showReturnOrderDetailInfo: function (event){
    var fOrdReturnID = event.currentTarget.dataset.fordreturnid
    console.log('showReturnOrderDetailInfo', fOrdReturnID);
    wx.navigateTo({
      url: '../aftersales/aftersales?from=list&fOrdReturnID=' + fOrdReturnID,
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
      returnOrderArr: []
    })
    this._getAfterSalesOrderList(this.data.searchType, this.data.keyword);
    this.setData({
      keyword: keyword,
      searchType: searchType,
    })
  },

  //获取订单搜索关键字
  getInput: function (event){
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