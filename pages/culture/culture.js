// pages/culture/culture.js
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

  },

  onShow:function(){
    var cartTotalCounts = wx.getStorageSync('cart').length;
    console.log('cartTotalCounts',cartTotalCounts)
    this.setData({
          cartTotalCounts:cartTotalCounts
    })
  },
  /*跳转到购物车*/
  onCartTap: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  
})