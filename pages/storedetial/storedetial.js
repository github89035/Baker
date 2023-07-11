// pages/storedetial/storedetial.js
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
    this.setData({
      fAddress: options.fAddress,
      fImageUrl: options.fImageUrl,
      fOrgName: options.fOrgName,
      fTel: options.fTel,
      fTime: options.fTime
    })

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