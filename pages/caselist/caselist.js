// pages/caselist/caselist.js
import {
  Case
} from 'case-model.js';
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
  onLoad: function () {
    this._loadData();
    console.log(caseobject)
  },
  _loadData: function(callback) {
    var that = this;
    caseobject.getCaseList((data) => {
      console.log(data.Data);
      that.setData({
        caseListData:data.Data
      })
    })
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
  goToCaseDetial:function(event){
    console.log('goToCaseDetial')
    var fDesignCaseID = event.currentTarget.dataset.fdesigncaseid;
    var fDesignName = event.currentTarget.dataset.fdesignname;

    console.log(fDesignCaseID);
    wx.navigateTo({
      url: '../casedetial/casedetial?fDesignCaseID='+fDesignCaseID+'&fDesignName='+fDesignName,
    })
  }
})