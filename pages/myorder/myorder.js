// pages/myorder/myorder.js
import {
  Order
} from '../order/order-model.js';
import {
  Screenshot
} from '../../utils/screenshot';
var screenshot = new Screenshot();
var myorder = new Order();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    index: 0, //选择的下拉列表下标
    hadselect: false,
    orderArr: [],
    pageIndex: 1,
    isLoadedAll: true,
    roleno: 0,
    language: app.globalData.language,
    langIndex: app.globalData.langIndex,
    selectData: [{
        text: '',
        value: 0
      },
      {
        text: '',
        value: 1
      },
      {
        text: '',
        value: 2
      }, {
        text: '',
        value: 3
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: this.data.language.lang_myorder_Title,
    })
    this.setData({
      selectData: [{
        text: this.data.language.lang_myorder_searchtype_order,
        value: 0
      },
      {
        text: this.data.language.lang_myorder_searchtype_name,
        value: 1
      },
      {
        text: this.data.language.lang_myorder_searchtype_phone,
        value: 2
      }, {
        text: this.data.language.lang_myorder_searchtype_address,
        value: 3
      },
    ],
    })

    // console.log('==app.globalData.tusrRole.fRoleNo==', app.globalData.tusrRole.fRoleNo);
    // this.setData({
    //   roleNo: app.globalData.tusrRole.fRoleNo
    // })
    //this._getOrders();

    //保存截屏
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1].route
    console.log(currentPage);
    wx.onUserCaptureScreen(function (res) {
      var pageData = JSON.stringify(that.data);
      console.log('pageData=====', pageData);
      screenshot.savescreenshot(app.globalData.nUserID, currentPage, pageData, (data) => {
        console.log(data)
      })
    })
  },
  _getOrders: function (searchType, keyword) {
    console.log('_getOrders');
    console.log('searchType', searchType);
    console.log('keyword', keyword);
    var that = this;
    var param = {};

    param.fUsrID = app.globalData.nUserID;

    if (searchType != undefined && keyword != undefined) {
      //console.log('=====if ========')
      // if (searchType == 0) {
      //   param.keyword = keyword;
      // } else if (searchType == 1) {
      //   param.fReciveman = keyword;
      // } else if (searchType == 2) {
      //   param.fRecivetel = keyword;
      // } else if (searchType == 3) {
      //   param.fReciveadd = keyword;
      // }
      param.searchType = searchType.toString();
      param.keyword = keyword;
    }
    else
    {
      // that.showTips('提示', '請輸入關鍵字');
      // return;
      param.searchType = "NULL";
      param.keyword = "NULL";
    }
    //console.log('====', app.globalData.tusrRole.fRoleNo)

    console.log('==param==', param);
    myorder.getOrders(param, (data) => {
      console.log(data)
      console.log(data.Data)
      var orderlist = data.Data;
      that.setData({
        loadingHidden: false
      });
      if (orderlist.length > 0) {
        that.data.orderArr.push.apply(that.data.orderArr, orderlist); //数组合并
        that.setData({
          orderArr: that.data.orderArr
        });
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
    var OrderID = event.currentTarget.dataset.orderid
    console.log('showOrderDetailInfo')
    console.log(OrderID);
    wx.navigateTo({
      url: '../order/order?from=order&OrderID=' + OrderID
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    this.data.orderArr = []; //订单初始化
    this._getOrders(() => {
      that.data.isLoadedAll = true; //是否加载完全
      that.data.pageIndex = 1;
      wx.stopPullDownRefresh();
      myorder.execSetStorageSync(false); //更新标志位
    });
  },

  // 订单审核接口
  orderReview: function (event) {
    var that = this;
    var param = {}
    param.OrderID = event.currentTarget.dataset.OrderID.toString()
    param.fUsrID = app.globalData.nUserID
    param.OperFlag = 'P'
    console.log('orderReview', param);
    myorder.orderReview(param, (data) => {
      if (data.Code == 1000) {
        var orderListTemp = that.data.orderArr;
        for (var index in orderListTemp) {
          if (orderListTemp[index].OrderID == param.OrderID) {
            orderListTemp[index].fcFlag = 3;
          }
        }
        that.setData({
          orderArr: orderListTemp
        })
        wx.showToast({
          title: '已審核',
          icon: 'success',
          color:white,
          duration: 2000
        })
      } else {
        wx.showToast({
          title: data.Msg,
          icon: 'error',
          duration: 5000
        })
      }
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
  onShow: function () {
    //this._getOrders();
    this.setData({
      language: app.globalData.language,
      langIndex: app.globalData.langIndex,
    });
    wx.setNavigationBarTitle({
      title: this.data.language.lang_myorder_Title,
    })
    this.setData({
      selectData: [{
        text: this.data.language.lang_myorder_searchtype_order,
        value: 0
      },
      {
        text: this.data.language.lang_myorder_searchtype_name,
        value: 1
      },
      {
        text: this.data.language.lang_myorder_searchtype_phone,
        value: 2
      }, {
        text: this.data.language.lang_myorder_searchtype_address,
        value: 3
      },
    ],
    })

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

  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    });
  },
})