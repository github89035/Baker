import {
  Home
} from 'home-model.js';
var home = new Home(); //实例化 首页 对象
const app = getApp();
Page({
  data: {
    loadingHidden: false,
    showPopup: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: null, //下拉列表的数据
    index: 0, //选择的下拉列表下标
    hadselect: false,
    searching:false,
    lock:true,
    cartTotalCounts:0,
    language: app.globalData.language,
    langIndex: app.globalData.langIndex,
  },
  onLoad: function () {
    var that = this;
    wx.hideTabBar({
      animation: true,
    })
    // that._loadData();chooseStore
    that._loadData();
  },
  /*加载所有数据*/
  _loadData: function (callback) {
    var that = this;
    app.toLogin().then(()=>{
      // console.log('app.globalData.tusrOrg',app.globalData.tusrOrg.length)
      that.setData({
        fUsrID: app.globalData.nUserID,
        StoreInfoS: app.globalData.StoreInfoS,
        SelectStoreID: app.globalData.SelectStoreID,
      })
      //console.log('fUsrID',that.data.fUsrID);
      if (that.data.fUsrID){
        home.getFirstPage(that.data.fUsrID, (data) => {
          that.setData({
            loadingHidden: true
          });
      
          //console.log('app.globalData.nUserID', app.globalData.nUserID);
          that.setData({
            selectData: data.Data,
          });
          wx.showTabBar({
            animation: true,
          })
        });
      }
    })
  },
  onShow:function(){
    this.setData({
        language: app.globalData.language,
        langIndex: app.globalData.langIndex,
        searching: false,
      });

    var cartTotalCounts = wx.getStorageSync('cart').length;
    //console.log('cartTotalCounts',cartTotalCounts)
    this.setData({
          cartTotalCounts:cartTotalCounts
    })
  },
  onProductsItemTap: function (event) {
    var fFgID = event.currentTarget.dataset.ffgid;
    wx.navigateTo({
      url: '../product/product?fFgID=' + fFgID,
    })
  },

  onThemesItemTap: function (event) {
    var id = home.getDataSet(event, 'id')
    var name = home.getDataSet(event, 'name')
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name,
    })
  },

  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },

  // 点击下拉列表,shezhi
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    var stationId = e.currentTarget.dataset.stationid;
    this.setData({
      index: Index,
      show: !this.data.show,
      hadselect: true,
      stationId: stationId
    });
    this.onLoad()
  },

  collection: function () {
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
  designerproducts: function () {
    wx.navigateTo({
      url: '../designerproducts/designerproducts',
    })
  },
  onstore: function () {
    wx.navigateTo({
      url: '../storelist/storelist',
    })
  },

  gotocategory: function (event) {
    var pBrand = event.currentTarget.dataset.pbrand;
    //console.log(pBrand);
    app.globalData.pBrand = pBrand;
    wx.switchTab({
      url: '../category/category',
    })

  },
  gotoculture: function(){
    wx.navigateTo({
      url: '../culture/culture?',
    })

  },
  gotocaselist: function(){
    wx.navigateTo({
      url: '../caselist/caselist',
    })
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
  gotoSKU: function(){
    wx.navigateTo({
      url: '../SKU/SKU',
    })
  },
  //选择门店
  chooseStore: function(event){
    wx.showTabBar();
    //console.log('before',app.globalData.SelectStoreID)
    var StoreID = event.currentTarget.dataset.nstoreid;
    app.globalData.SelectStoreID = StoreID;
    //console.log('after',app.globalData.SelectStoreID)
    this.setData({
      SelectStoreID: app.globalData.SelectStoreID,
    })

    this.setData({
      lock:false,
      showPopup:false
    })
  },
  
  /*跳转到购物车*/
  onCartTap: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },

  //切换门店
  changeStore: function(event){
    this.setData({
      lock:true,
      showPopup:true
    })
  }
})