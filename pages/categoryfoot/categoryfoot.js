import {
  Categoryfoot
} from 'categoryfoot-model.js';
var categoryfoot = new Categoryfoot();
const app = getApp();

Page({
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5', 'tanslate6'],
    transGroupClassArr: ['tanslategroup0', 'tanslategroup1', 'tanslategroup2', 'tanslategroup3', 'tanslategroup4', 'tanslategroup5', 'tanslategroup6'],
    currentMenuIndex: 0,
    currentTypeIndex: 99,
    currentItemIndex:99,
    loadingHidden: false,
    test: [1, 2, 3, 4, 5, 6, 7],
    nowSection: '',
    language: app.globalData.language,
    langIndex: app.globalData.langIndex,
  },
  
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.language.lang_category_Title,
    })
    var pBrand = options.pBrand;
    var pSection = options.pSection;
    var pProductType = options.pProductType;
    
    this._loadData(pBrand, pSection, pProductType);
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
    console.log('cartTotalCounts',cartTotalCounts)
    this.setData({
          cartTotalCounts:cartTotalCounts
    })
  },

  /*加载所有数据*/
  _loadData: function (pBrand, pSection, pProductType) {
    var that = this;
    
    that.setData({
      categoryTypeArr: app.globalData.SectionProductTypeS[pBrand][pSection],
      loadingHidden: true,
      nowSection: pSection,
    });

    for (let i = 0; i < that.data.categoryTypeArr.length; i++) {
      if (that.data.categoryTypeArr[i].pProductType == pProductType) {
        that.setData({
          currentMenuIndex: i
        });
      }
    }
    
    that.getProductsByCategory(pBrand, pSection, pProductType, (data) => {
      console.log('getProductsByCategory')
      console.log(data);
      that.setData(that.getDataObjForBind(that.data.currentMenuIndex, data, pBrand));
    });
  },

  /*点击事件，点击后切换分类*/
  changeCategory: function (event) {
    var index = categoryfoot.getDataSet(event, 'index'),
      pBrand = categoryfoot.getDataSet(event, 'pbrand'),
      pSection = categoryfoot.getDataSet(event, 'psection'),
      pProductType = categoryfoot.getDataSet(event, 'pproducttype')
    this.setData({
      currentMenuIndex: index,
      currentTypeIndex: 99,
      currentItemIndex: 99
    });
    //如果数据是第一次请求
    if (!this.isLoadedData(index)){
      var that = this;
      that.getProductsByCategory(pBrand, pSection, pProductType, (data) => {
        that.setData(that.getDataObjForBind(index, data, pBrand));
      });
    }
  },

  /*点击事件，点击后切换分类*/
  changeGroup: function (event) {
    var index = categoryfoot.getDataSet(event, 'index'),
    pBrand = categoryfoot.getDataSet(event, 'pbrand') //获取data-set
    // this.setData({
    //   currentTypeIndex: index
    // })
    // wx.navigateTo({
    //   url: '../categoryfoot/categoryfoot?fBrandNo=' + pBrand,
    // })
  },

  changeType: function(event)
  {
    var index = categoryfoot.getDataSet(event, 'index')
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
    // console.log(baseData);
    for (var item in arr) {
      if (item == arr[index]) {
        obj['categoryInfo' + item] = data.Data;
        console.log(obj['categoryInfo' + item]);
        return obj;
      }
    }
  },

  getProductsByCategory: function (id, id2, id3, callback) {
    categoryfoot.getProductsByCategory(id, id2, id3, (data) => {
      callback && callback(data);
    });
  },
  
  onProductsGroupTap: function (event) {
    var pBrand = categoryfoot.getDataSet(event, 'pbrand');
    var pSection = categoryfoot.getDataSet(event, 'psection');
    var pProductType = categoryfoot.getDataSet(event, 'pproducttype');
    var pProductCategory = categoryfoot.getDataSet(event, 'pproductcategory');
    var isSub = categoryfoot.getDataSet(event, 'issub');
    var isSection = categoryfoot.getDataSet(event, 'issection');
    var isCollection = categoryfoot.getDataSet(event, 'iscollection');
    var isRoomGallery = categoryfoot.getDataSet(event, 'isroomgallery');
    var pProductCategoryName = categoryfoot.getDataSet(event, 'pproductcategoryname');
    wx.navigateTo({
      url: '../productsgrouplist/productsgrouplist?pBrand=' + pBrand + '&pSection=' + pSection + '&pProductType=' + pProductType + '&pProductCategory=' + pProductCategory + '&isSub=' + isSub + '&isSection=' + isSection + '&isCollection=' + isCollection + '&isRoomGallery=' + isRoomGallery + '&pProductCategoryName=' + pProductCategoryName,
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
      path: 'pages/categoryfoot/categoryfoot'
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