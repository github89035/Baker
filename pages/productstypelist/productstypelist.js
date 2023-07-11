// pages/productstypelist/productstypelist.js
import {
  Productstypelist
} from 'productstypelist-model.js';
import {
  Screenshot
} from '../../utils/screenshot';
const app = getApp();
var screenshot = new Screenshot();
var productstypelist = new Productstypelist();

Page({
  data: {
    language: app.globalData.language,
    langIndex: app.globalData.langIndex,
  },
  onLoad: function (options) {
    var that = this;
    console.log('options',options);
    wx.setNavigationBarTitle({
      title: options.pProductCategoryName,
    })
    var param = {}
    param.Item_No = options.Item_No;
    param.Item_No_Prefix = options.Item_No_Prefix;
    param.Item_Name = options.pProductCategoryName;
    param.pSectionType = options.pSectionType;
    console.log('param')
    console.log(param);
    productstypelist.getProductsTypeList(param, (data) => {
      console.log('productstypelist');
      console.log(data);

      if(data.Code == "1002")
      {
        console.log(data);
        wx.navigateTo({
          url: '../product/product?Item_No=' + options.Item_No,
        })
        return;
      }

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

  onShow: function () {
    this.setData({
        language: app.globalData.language
      });
    var cartTotalCounts = wx.getStorageSync('cart').length;
    console.log('cartTotalCounts', cartTotalCounts)
    this.setData({
      cartTotalCounts: cartTotalCounts,
      searching:false,
    })
  },

  onCartTap: function () {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },

  onProductsItemTap: function (event) {
    var Item_No = event.currentTarget.dataset.ffgid;
    var Item_No_Prefix = event.currentTarget.dataset.ffgno;
    var pProductCategoryName = event.currentTarget.dataset.ffgname;
    
    var StyleNum = event.currentTarget.dataset.fstylenum;
    var ItemSize = event.currentTarget.dataset.fitem_size;

    var pSectionType = event.currentTarget.dataset.psectiontype;
    
    console.log(event.currentTarget.dataset);
    
    if(Item_No != null & Item_No_Prefix != null & pProductCategoryName != null & StyleNum != null & pSectionType != null){
      wx.navigateTo({
        url: '../product/product?Item_No=' + Item_No + '&Item_No_Prefix=' + Item_No_Prefix + '&pProductCategoryName=' + pProductCategoryName + '&StyleNum=' + StyleNum + '&pSectionType=' + pSectionType,
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