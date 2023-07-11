// pages/success/success.js
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
    // 订单类型   1销售订单  2售后服务单   3安装服务单   4客流登记
    var type = options.type;
    //单号
    var orderid = options.orderid;
    //操作   1新增   2修改
    var operation = options.operation;

    this.setData({
      type: type,
      orderid: orderid,
      operation: operation,
    })
  },

  backListPage: function (e) {
    let type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '../myorder/myorder',
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '../aftersaleslist/aftersaleslist',
      })
    } else if (type == 3) {
      wx.navigateTo({
        url: '../installorderlist/installorderlist',
      })
    } else if (type == 4) {
      wx.navigateTo({
        url: '../customerflowlist/customerflowlist',
      })
    }
  },
  backHome: function (e) {
    wx.switchTab({
      url: '../home/home',
    })
  }
})