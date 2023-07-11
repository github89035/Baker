import {
  Home
} from '../home/home-model.js';
var home = new Home();
const app = getApp();
// pages/brand/brand.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取站点信息
    home.getFirstPage(app.globalData.fUsrID, (data) => {
      console.log(data.Data);
      that.setData({
        brandData: data.Data[2].tbarndInfo,
      });
      console.log('brandData')
      console.log(that.data.brandData);
    });
  },
  onShow: function () {
    var cartTotalCounts = wx.getStorageSync('cart').length;
    console.log('cartTotalCounts', cartTotalCounts)
    this.setData({
      cartTotalCounts: cartTotalCounts
    })
  },
  gotocategory: function (event) {
    var fBrandNo = event.currentTarget.dataset.fbrandno;
    wx.reLaunch({
      url: '../category/category?fBrandNo=' + fBrandNo,
    })
  },
  /*跳转到购物车*/
  onCartTap: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
})