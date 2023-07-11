// var CartObj = require('cart-model.js');

import {
  Productsgrouplist
} from 'productsgrouplist-model.js';
import {
  Screenshot
} from '../../utils/screenshot';
const app = getApp();
var screenshot = new Screenshot();
var productsgrouplist = new Productsgrouplist();
//实例化 购物车
var x1 = 0;
var x2 = 0;

Page({
  data: {
    pageIndex: 1,
    loadingHidden: false,
    selectedCounts: 0, //总的商品数
    selectedTypeCounts: 0, //总的商品类型数
    language: app.globalData.language,
  },

  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.pProductCategoryName,
    })
    var param = {}
    param.pBrand = options.pBrand;
    param.pSection = options.pSection;
    param.pProductType = options.pProductType;
    param.pProductCategory = options.pProductCategory;
    param.IsSub = options.isSub;
    param.IsSection = options.isSection;
    param.IsCollection = options.isCollection;
    param.IsRoomGallery = options.isRoomGallery;
    param.pSectionType = options.pSectionType;
    console.log('param')
    console.log(param);
    productsgrouplist.getProductsGroupList(param, (data) => {
      
      that.setData({
        loadingHidden: true
      });

      console.log('productsgrouplist', data);
      this.setData({
        cartData: data.Data
      })
    })

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

  onReachBottom: function () {
    console.log('onReachBottom');
  },


  /*
   * 页面重新渲染，包括第一次，和onload方法没有直接关系
   */
  onShow: function () {
    this.setData({
        language: app.globalData.language,
        searching:false,
      });
      
    var param = {};
    var productsgrouplist = new Productsgrouplist();
    productsgrouplist.getProductsGroupList()
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

  /*查看商品详情*/
  onProductsItemTap: function (event) {
    var Item_No = event.currentTarget.dataset.ffgid;
    var Item_No_Prefix = event.currentTarget.dataset.ffgno;
    var pProductCategoryName = event.currentTarget.dataset.ffgname;
    var btypelist = event.currentTarget.dataset.btypelist;
    var pSectionType = event.currentTarget.dataset.psectiontype;
    console.log('Item_No_Prefix',Item_No_Prefix);
    console.log('pSectionType',pSectionType);
    if(btypelist == "true")
    {
      wx.navigateTo({
        url: '../productstypelist/productstypelist?Item_No=' + Item_No + '&Item_No_Prefix=' + Item_No_Prefix + '&pProductCategoryName=' + pProductCategoryName + '&pSectionType=' + pSectionType,
      })
    }
    else
    {
      wx.navigateTo({
        url: '../product/product?Item_No=' + Item_No + '&Item_No_Prefix=' + Item_No_Prefix + '&pProductCategoryName=' + pProductCategoryName + '&pSectionType=' + pSectionType,
      })
    }
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
})