import {
  Case
} from '../caselist/case-model.js';
var caseobject = new Case();

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
    console.log('fDesignCaseID')
    console.log(options.fDesignCaseID)
    console.log('fDesignName')
    console.log(options.fDesignName)
    var fDesignCaseID = options.fDesignCaseID;
    var fDesignName = options.fDesignName;
    this._loadData(fDesignCaseID, fDesignName)
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
  _loadData: function (fDesignCaseID, fDesignName) {
    console.log('_loadData')
    console.log(fDesignCaseID)
    console.log(fDesignName)

    var that = this;
    // that.setData({

    // })
    caseobject.getCaseDetial(fDesignCaseID, (data) => {
      console.log(data.Data);
      that.setData({
        CaseDetialData: data.Data,
        fDesignName: fDesignName
      })
    })
  },

})