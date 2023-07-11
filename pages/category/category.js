import {
  Category
} from 'category-model.js';
var category = new Category();
const app = getApp();

Page({
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5', 'tanslate6'],
    transGroupClassArr: ['tanslategroup0', 'tanslategroup1', 'tanslategroup2', 'tanslategroup3', 'tanslategroup4', 'tanslategroup5', 'tanslategroup6'],
    currentMenuIndex: 0,
    currentTypeIndex: 99,
    currentItemIndex:99,
    loadingHidden: false,
    test: [1, 2, 3, 4, 5, 6, 7, 8],
    language: app.globalData.language,
    langIndex: app.globalData.langIndex,
  },
  
  onLoad: function (options) {
    var pBrand = app.globalData.pBrand;
    wx.setNavigationBarTitle({
      title: this.data.language.lang_category_Title,
    })
    this._loadData(pBrand);
    
    this.setData({
      pBrand: pBrand,
    })
  },

  onShow:function(){
    //console.log('pBrand',this.data.pBrand);
    //console.log('app.pBrand',this.data.pBrand);
    if(this.data.pBrand != app.globalData.pBrand)
    {
      this._loadData(app.globalData.pBrand);
      
      this.setData({
        pBrand: app.globalData.pBrand,
      })
    }

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
    //console.log('cartTotalCounts',cartTotalCounts)
    this.setData({
          cartTotalCounts:cartTotalCounts
    })
  },

  /*加载所有数据*/
  _loadData: function (pBrand) {
    var that = this;

    //获取所有分类以及第一个分类的产品
    var categoryData = category.getCategoryType();
    //console.log('categoryData',categoryData);
    that.setData({
      categoryTypeArr: categoryData,
      loadingHidden: true
    });
    
    //第一次加载时，获取默认获取第一个分类的产品
    if (typeof (pBrand) == "undefined") {
      pBrand = categoryData[0].pBrand
    }
    // if (pBrand == 'SKU') {
    //   that.setData({
    //     currentMenuIndex: 3
    //   });
    // }
    if (pBrand == 'store') {
      that.setData({
        currentMenuIndex: 4
      });
    }
    for (let i = 0; i < categoryData.length; i++) {
      if (categoryData[i].pBrand == pBrand) {
        that.setData({
          currentMenuIndex: i
        });
      }
    }
    
    that.getProductsByCategory(pBrand, (data) => {
      //console.log('getProductsByCategory')
      //console.log(data);
      that.setData(that.getDataObjForBind(that.data.currentMenuIndex, data, pBrand));
    });
  },

  /*点击事件，点击后切换分类*/
  changeCategory: function (event) {
    var index = category.getDataSet(event, 'index'),
      pBrand = category.getDataSet(event, 'pbrand') //获取data-set
    this.setData({
      currentMenuIndex: index,
      currentTypeIndex: 99,
      currentItemIndex: 99,
      pBrand: pBrand,
    });
    app.globalData.pBrand = pBrand;
    //如果数据是第一次请求
    if (!this.isLoadedData(index)){
      var that = this;
      that.getProductsByCategory(pBrand, (data) => {
        that.setData(that.getDataObjForBind(index, data, pBrand));
      });
    }
  },

  /*点击事件，点击后切换分类*/
  changeGroup: function (event) {
    var index = category.getDataSet(event, 'index'),
    pBrand = category.getDataSet(event, 'pbrand'),
    pSection = category.getDataSet(event, 'psection')
    wx.navigateTo({
      url: '../categorybody/categorybody?pBrand=' + pBrand + '&pSection=' + pSection,
    })
  },

  changeType: function(event)
  {
    var index = category.getDataSet(event, 'index')
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
      arr = [0, 1, 2, 3, 4, 5],
      baseData = this.data.categoryTypeArr[index];
    // console.log(baseData);
    for (var item in arr) {
      if (item == arr[index]) {
        obj['categoryInfo' + item] = data.Data;
        //console.log(obj['categoryInfo' + item]);

        for (let i = 0; i < obj['categoryInfo' + item].length; i++) {
          obj['categoryInfo' + item][i].pBrand = pBrand;
        }
        //console.log('=======obj=================')
        //console.log(obj);
        return obj;
      }
    }
  },

  getProductsByCategory: function (id, callback) {
    category.getProductsByCategory(id, (data) => {
      callback && callback(data);
    });
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
      path: 'pages/category/category'
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