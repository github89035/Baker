import {
  StoreList
} from 'storelist-model.js';
var storelist = new StoreList(); //实例化 home 的推荐页面
const app = getApp();

Page({
  data: {
    transClass: true,
    currentMenuIndex: 0, //选中的一级栏目
    select_index: 0, //选中的二级栏目
    // has_sub_type:[],//一级栏目是否有二级栏目
    show_sec_category: false, //二级栏目显示
    cur_categoryInfo: '', //当前显示的详情
    // sub_category: [],
    loadingHidden: false,
    test: [1, 2, 3, 4, 5, 6, 7],
  },

  onLoad: function () {
    //this._loadData();
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
  /*加载所有数据*/
  _loadData: async function (callback) {
    var that = this;
    //获取所有品牌的列表
    let brandlist = await storelist.getBrandList()
    that.setData({
      categoryTypeArr: brandlist
    });

    // 判断第一个品牌是否有二级分类

    if (brandlist[0].torgCity.length > 0) { //有二级分类
      let data = await storelist.getStoreByCity(brandlist[0].fCateNO, brandlist[0].torgCity[0].fCity); //获取第一个二级分类的产品===》我要改成获取第一个城市的门店
      var dataObj = {
        procucts: data.Data,
        torgCity: brandlist[0].torgCity[0].torgCity,
        title: brandlist[0].torgCity[0].torgCity
      };
      // this.data.has_sub_type.push(true)
      that.setData({
        // has_sub_type: this.data.has_sub_type,
        loadingHidden: true,
        cur_categoryInfo: dataObj
      });
    } else {
      console.log('getProductsByCategory1');
      let data = await storelist.getStoreByCity(brandlist[0].fCateNO, '');
      var dataObj = {
        procucts: data.Data,
        torgCity: brandlist[0].torgCity[0].torgCity,
        title: brandlist[0].torgCity[0].torgCity
      };
      that.setData({
        loadingHidden: true,
        cur_categoryInfo: dataObj
      });
    }
  },

  /*点击事件，点击后切换一级分类*/
  changeCategory: async function (event) {
    var index = storelist.getDataSet(event, 'index')
    if (this.data.currentMenuIndex == index && this.data.show_sec_category) {
      this.setData({
        'show_sec_category': false,
      })
      return;
    } else if (this.data.currentMenuIndex == index && !this.data.show_sec_category) {
      this.setData({
        'show_sec_category': true
      })
      return;
    } else if (this.data.currentMenuIndex != index && !this.data.show_sec_category) {
      this.setData({
        'show_sec_category': true,
        currentMenuIndex: index
      })
      return;
    } else if (this.data.currentMenuIndex != index && this.data.show_sec_category) {
      this.setData({
        'show_sec_category': false,
        currentMenuIndex: index
      })
      setTimeout(() => {
        this.setData({
          'show_sec_category': true,
        })
      }, 300)
      return;
    }

  },
  /* 点击二级目录 */
  click_sub_category: async function (event) {
    var index = storelist.getDataSet(event, 'index'),
      fcity = storelist.getDataSet(event, 'fcity'), //获取data-set
      fCateNO = storelist.getDataSet(event, 'fcateno') //获取data-set
    if (this.data.select_index == index && this.data.select_fCateNO == fCateNO) {
      console.log('return');
      return;
    }
    this.setData({
      transClass: false
    })
    let data = await storelist.getStoreByCity(fCateNO, fcity);
    var dataObj = {
      procucts: data.Data,
      cityName: fcity
    };
    console.log('getStoreByCity', dataObj);

    setTimeout(() => {
      this.setData({
        transClass: true,
        cur_categoryInfo: dataObj,
        show_sec_category: false,
        select_index: index,
        select_fCateNO: fCateNO,
      })
    }, 300)
    // this.setData({

    // });
  },
  hide_sec_category: function () {
    if (this.data.show_sec_category)
      this.setData({
        show_sec_category: false
      })
  },
  /*跳转到商品详情*/
  onProductsItemTap: function (event) {
    var id = storelist.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },

  /*下拉刷新页面*/
  onPullDownRefresh: function () {
    this._loadData(() => {
      wx.stopPullDownRefresh()
    });
  },

  //分享效果
  onShareAppMessage: function () {
    return {
      title: 'Pretty Vendor',
      path: 'pages/category/category'
    }
  },
  gotostoredetial: function (event) {
    console.log('function gotostoredetial')
    console.log(event);
    var fAddress = event.currentTarget.dataset.faddress;
    var fImageUrl = event.currentTarget.dataset.fimageurl;
    var fOrgName = event.currentTarget.dataset.forgname;
    var fTel = event.currentTarget.dataset.ftel;
    var fTime = event.currentTarget.dataset.ftime;
    wx.navigateTo({
      url: '../storedetial/storedetial?fAddress=' + fAddress + '&fImageUrl=' + fImageUrl + '&fOrgName=' + fOrgName + '&fTel=' + fTel + '&fTime=' + fTime,
    })
  }

})