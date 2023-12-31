// import { Address } from '../../utils/address.js';
import {
  Order
} from '../order/order-model.js';
import {
  My
} from '../my/my-model.js';
const app = getApp();

// var address = new Address();
var order = new Order();
var my = new My();
Page({
  data: {
    pageIndex: 1,
    isLoadedAll: false,
    loadingHidden: false,
    FunctionAuth: 0,
    StoreAuth: 0,
    orderArr: [],
    language: '',
    languages: ['繁體中文', '简体中文'],
    langIndex: 0,
    // addressInfo: null
  },
  onLoad: function () {
    var langIndexTmp = app.globalData.langIndex;
    if(langIndexTmp>=0){
      this.setData({
        langIndex: langIndexTmp
      });
    }
    else
    {
      this.setData({
        langIndex: 0
      });
    }
    this.setLanguage();
    wx.setNavigationBarTitle({
      title: this.data.language.lang_my_Title,
    })

    this._loadData();

    // this._getAddressInfo();
  },

  onShow: function () {
    //更新订单,相当自动下拉刷新,只有  非第一次打开 “我的”页面，且有新的订单时 才调用。
    // var newOrderFlag = order.hasNewOrder();
    // if (this.data.loadingHidden && newOrderFlag) {
    //   this.onPullDownRefresh();
    // }
    var cartTotalCounts = wx.getStorageSync('cart').length;
    console.log('cartTotalCounts',cartTotalCounts)
    this.setData({
          cartTotalCounts:cartTotalCounts,
          searching:false,
    })
  },

  _loadData: function (){
    var that = this;
    my.getUserInfo((data) => {
      that.setData({
        userInfo: data,
        FunctionAuth:app.globalData.FunctionAuth,
        StoreAuth:app.globalData.StoreAuth,
        fUsrName:app.globalData.pUserName
      });
      console.log(data);
    });

    that.setData({
      FunctionAuth:app.globalData.FunctionAuth,
      StoreAuth:app.globalData.StoreAuth,
      fUsrName:app.globalData.pUserName,
      appversion:app.globalData.appversion,
    });

    console.log('FunctionAuth', that.data.FunctionAuth);
    console.log('?????', (that.data.FunctionAuth & 536870912) == 536870912);

    // this._getOrders();
    // order.execSetStorageSync(false);  //更新标志位
  },
  goToMyOrder: function () {
    wx.navigateTo({
      url: '../myorder/myorder'
    });
  },

  changeLanguage(e) {
    let index = e.detail.value;
    this.setData({	// (1)
      langIndex: index
    });

    wx.T.setLocaleByIndex(index);
    this.setLanguage();

    wx.setStorageSync('langIndex', this.data.langIndex);
    app.globalData.langIndex = this.data.langIndex;
    
    wx.setNavigationBarTitle({
      title: this.data.language.lang_my_Title,
    })
  },

  setLanguage() {
    app.globalData.language= wx.T.getLanguage();
    this.setData ({
      language: wx.T.getLanguage()
    });
  },

  // showOrderDetailInfo: function (event) {
  //   var id = order.getDataSet(event, 'id');
  //   wx.navigateTo({
  //     url: '../order/order?from=order&id=' + id
  //   });
  // },
  /**地址信息**/
  // _getAddressInfo: function () {
  //   var that = this;
  //   address.getAddress((addressInfo) => {
  //     that._bindAddressInfo(addressInfo);
  //   });
  // },

  // /*修改或者添加地址信息*/
  // editAddress: function () {
  //   var that = this;
  //   wx.chooseAddress({
  //     success: function (res) {
  //       var addressInfo = {
  //         name: res.userName,
  //         mobile: res.telNumber,
  //         totalDetail: address.setAddressInfo(res)
  //       };
  //       if (res.telNumber) {
  //         that._bindAddressInfo(addressInfo);
  //         //保存地址
  //         address.submitAddress(res, (flag) => {
  //           if (!flag) {
  //             that.showTips('操作提示', '地址信息更新失败！');
  //           }
  //         });
  //       }
  //       //模拟器上使用
  //       else {
  //         that.showTips('操作提示', '地址信息更新失败,手机号码信息为空！');
  //       }
  //     }
  //   })
  // },

  /*绑定地址信息*/
  // _bindAddressInfo: function (addressInfo) {
  //   this.setData({
  //     addressInfo: addressInfo
  //   });
  // },

  /*订单信息*/
  // _getOrders: function (callback) {
  //   var that = this;
  //   order.getOrders(this.data.pageIndex, (res) => {
  //     var data = res.data.data;
  //     that.setData({
  //       loadingHidden: false
  //     });
  //     if (data.length > 0) {
  //       that.data.orderArr.push.apply(that.data.orderArr, res.data.data);  //数组合并
  //       // console.log(that.data.orderArr);
  //       that.setData({
  //         orderArr: that.data.orderArr
  //       });
  //     } else {
  //       that.data.isLoadedAll = true;  //已经全部加载完毕
  //       that.data.pageIndex = 1;
  //     }
  //     callback && callback();
  //   });
  // },

  /*显示订单的具体信息*/
  // showOrderDetailInfo: function (event) {
  //   var id = order.getDataSet(event, 'id');
  //   var source = order.getDataSet(event, 'source');
  //   wx.navigateTo({
  //     url: '../order/order?from=order&id=' + id + '&source=' + source
  //   });
  // },

  /*未支付订单再次支付*/
  // rePay: function (event) {
  //   var id = order.getDataSet(event, 'id'),
  //     index = order.getDataSet(event, 'index');

  //   //online 上线实例，屏蔽支付功能
  //   if (order.onPay) {
  //     this._execPay(id, index);
  //   } else {
  //     this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽');
  //   }
  // },

  /*支付*/
  // _execPay: function (id, index) {
  //   var that = this;
  //   order.execPay(id, (statusCode) => {
  //     if (statusCode > 0) {
  //       var flag = statusCode == 2;

  //       //更新订单显示状态
  //       if (flag) {
  //         that.data.orderArr[index].status = 2;
  //         that.setData({
  //           orderArr: that.data.orderArr
  //         });
  //       }

  //       //跳转到 成功页面
  //       wx.navigateTo({
  //         url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my'
  //       });
  //     } else {
  //       that.showTips('支付失败', '商品已下架或库存不足');
  //     }
  //   });
  // },

  /*下拉刷新页面*/
  // onPullDownRefresh: function () {
  //   var that = this;
  //   this.data.orderArr = [];  //订单初始化
  //   this._getOrders(() => {
  //     that.data.isLoadedAll = false;  //是否加载完全
  //     that.data.pageIndex = 1;
  //     wx.stopPullDownRefresh();
  //     order.execSetStorageSync(false);  //更新标志位
  //   });
  // },


  // onReachBottom: function () {
  //   if (!this.data.isLoadedAll) {
  //     this.data.pageIndex++;
  //     this._getOrders();
  //   }
  // },

  /*
   * 提示窗口
   * params:
   * title - {string}标题
   * content - {string}内容
   * flag - {bool}是否跳转到 "我的页面"
   */
  // showTips: function (title, content) {
  //   wx.showModal({
  //     title: title,
  //     content: content,
  //     showCancel: false,
  //     success: function (res) {

  //     }
  //   });
  // },
  goToAfterSalesList: function () {
    wx.navigateTo({
      url: '../aftersaleslist/aftersaleslist',
    });
  },
  gotoInstallOrderList: function () {
    wx.navigateTo({
      url: '../installorderlist/installorderlist',
    });
  },
  goToCustomerFlowList: function () {
    wx.navigateTo({
      url: '../customerflowlist/customerflowlist',
    });
  },
  goToSuccess: function () {
    wx.navigateTo({
      url: '../success/success',
    });
  },
  /*跳转到购物车*/
  onCartTap: function () {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },

  onSearching: function () {
    this.setData({
      searching:true
    })
  },
  onCancle: function () {
    this.setData({
      searching:false
    })
  },
  goToMyCartList: function () {
    wx.navigateTo({
      url: '../cartlist/cartlist'
    });
  },
})