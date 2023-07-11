import {
  Categorybody
} from 'categorybody-model.js';
var categorybody = new Categorybody();
const app = getApp();

Page({
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5', 'tanslate6', 'tanslate7'],
    transGroupClassArr: ['tanslategroup0', 'tanslategroup1', 'tanslategroup2', 'tanslategroup3', 'tanslategroup4', 'tanslategroup5', 'tanslategroup6', 'tanslategroup7'],
    currentMenuIndex: 0,
    currentTypeIndex: 99,
    currentItemIndex:99,
    loadingHidden: false,
    test: [1, 2, 3, 4, 5, 6, 7, 8],
    language: app.globalData.language,
    langIndex: app.globalData.langIndex,
  },
  
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.language.lang_category_Title,
    })
    var pBrand = options.pBrand;
    var pSection = options.pSection;
    this._loadData(pBrand, pSection);
  },

  onShow:function(){
    this.setData({
      language: app.globalData.language,
      langIndex: app.globalData.langIndex,
      searching:false,
    });
    wx.setNavigationBarTitle({
      title: this.data.language.lang_category_Title,
    })

    // 获取购物车数量
    var cartTotalCounts = wx.getStorageSync('cart').length;
    this.setData({
          cartTotalCounts:cartTotalCounts
    })
  },

  /*加载所有数据*/
  _loadData: function (pBrand, pSection) {
    var that = this;
    
    that.setData({
      categoryTypeArr: app.globalData.BrandSectionS[pBrand],
      loadingHidden: true
    });
    console.log('here')
    console.log(that.data);

    for (let i = 0; i < that.data.categoryTypeArr.length; i++) {
      if (that.data.categoryTypeArr[i].pSection == pSection) {
        that.setData({
          currentMenuIndex: i
        });
      }
    }

    that.getProductsByCategory(pBrand, pSection, (data) => {
      console.log('getProductsByCategory',data)
      console.log('currentMenuIndex',that.data.currentMenuIndex);
      that.setData(that.getDataObjForBind(that.data.currentMenuIndex, data, pBrand));
    });
  },

  /*点击事件，点击后切换分类*/
  changeCategory: function (event) {
    var index = categorybody.getDataSet(event, 'index'),
      pBrand = categorybody.getDataSet(event, 'pbrand'),
      pSection = categorybody.getDataSet(event, 'psection') 
    this.setData({
      currentMenuIndex: index,
      currentTypeIndex: 99,
      currentItemIndex: 99
    });
    //如果数据是第一次请求
    if (!this.isLoadedData(index)){
      var that = this;
      that.getProductsByCategory(pBrand, pSection, (data) => {
        that.setData(that.getDataObjForBind(index, data, pBrand));
      });
    }
  },

  /*点击事件，点击后切换分类*/
  changeGroup: function (event) {
    var index = categorybody.getDataSet(event, 'index'),
    pBrand = categorybody.getDataSet(event, 'pbrand'),
    pSection = categorybody.getDataSet(event, 'psection'),
    pProductType = categorybody.getDataSet(event, 'pproducttype')
    // this.setData({
    //   currentTypeIndex: index
    // })
    wx.navigateTo({
      url: '../categoryfoot/categoryfoot?pBrand=' + pBrand + '&pSection=' + pSection + '&pProductType=' + pProductType,
    })
  },

  changeType: function(event) {
    var index = categorybody.getDataSet(event, 'index')
    this.setData({
      currentItemIndex: index
    })
  },

  // 判断当前费雷下的商品数据是否被加载
  isLoadedData: function (index) {
    if (this.data['categoryInfo' + index]) {
      return true;
    }
    return false;
  },

  //点击后，返回组别以及产品类别
  getDataObjForBind: function (index, data, pBrand) {
    var obj = {},
      arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      baseData = this.data.categoryTypeArr[index];
    console.log('baseData',baseData);
    for (var item in arr) {
      if (item == arr[index]) {
        obj['categoryInfo' + item] = data.Data;
        console.log(obj['categoryInfo' + item]);
        return obj;
      }
    }
  },

  getProductsByCategory: function (id, id2, callback) {
    categorybody.getProductsByCategory(id, id2, (data) => {
      callback && callback(data);
    });
  },
  
  onProductsGroupTap: function (event) {
    var pBrand = categorybody.getDataSet(event, 'pBrand');
    var fgroupno = categorybody.getDataSet(event, 'fgroupno');
    var ffgtypeno = categorybody.getDataSet(event, 'ffgtypeno');
    var ffgitemno = categorybody.getDataSet(event, 'ffgitemno');
    var isSub = categorybody.getDataSet(event, 'issub');
    var isSection = categorybody.getDataSet(event, 'issection');
    var isCollection = categorybody.getDataSet(event, 'iscollection');
    var isRoomGallery = categorybody.getDataSet(event, 'isroomgallery');
    var ffgitemname = categorybody.getDataSet(event, 'ffgitemname');
    wx.navigateTo({
      url: '../productsgrouplist/productsgrouplist?pBrand=' + pBrand + '&fgroupno=' + fgroupno + '&ffgtypeno=' + ffgtypeno + '&ffgitemno=' + ffgitemno + '&isSub=' + isSub + '&isSection=' + isSection + '&isCollection=' + isCollection + '&isRoomGallery=' + isRoomGallery + '&ffgitemname=' + ffgitemname,
    })
  },

  /*下拉刷新页面*/
  onPullDownRefresh: function () {
    this._loadData(() => {
      wx.stopPullDownRefresh()
    });
  },
  /*跳转到购物车*/
  onCartTap: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  //分享效果
  onShareAppMessage: function () {
    return {
      title: 'Pretty Vendor',
      path: 'pages/categorybody/categorybody'
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