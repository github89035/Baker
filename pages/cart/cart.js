// var CartObj = require('cart-model.js');

import {
  Cart
} from 'cart-model.js';
import {
  Screenshot
} from '../../utils/screenshot';

const app = getApp();

var screenshot = new Screenshot();

var cart = new Cart(); //实例化 购物车
var x1 = 0;
var x2 = 0;

Page({
  data: {
    loadingHidden: false,
    selectedCounts: 0, //总的商品数
    selectedTypeCounts: 0, //总的商品类型数
    language: app.globalData.language,
  },

  onLoad: function () {
    var that = this;
    
    wx.setNavigationBarTitle({
      title: this.data.language.lang_cart_Title,
    })
    
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1].route
    // console.log(currentPage);
    wx.onUserCaptureScreen(function (res) {
      var pageData = JSON.stringify(that.data);
      // console.log('pageData=====', pageData);
      screenshot.savescreenshot(app.globalData.fUsrID, currentPage, pageData, (data) => {
        // console.log(data)
      })
    })
  },

  /*
   * 页面重新渲染，包括第一次，和onload方法没有直接关系
   */
  onShow: function () {
    console.log(app.globalData.cartIndex)
    this.setData({
      language: app.globalData.language
    });
    wx.setNavigationBarTitle({
      title: this.data.language.lang_cart_Title,
    })

    var cartData = cart.getCartDataFromLocal();
    var countsInfo = cart.getCartTotalCounts(true);
    // console.log('countsInfo', countsInfo);
    var brandData = [];
    var temp = [];
    var brandIndex = 0;

    for (var index in cartData) {
      var flag = true;
      var temp = {}
      temp.Brand_Category = cartData[index].Brand_Category;
      temp.Brand_Category = cartData[index].Brand_Category;
      for (var index2 in brandData) {
        if (temp.Brand_Category == brandData[index2].Brand_Category) {
          flag = !flag;
          break;
        }
      }
      if (flag) {
        // console.log('=================if')
        brandData[brandIndex] = {};
        brandData[brandIndex].Brand_Category = cartData[index].Brand_Category;
        brandData[brandIndex].Brand_Category = cartData[index].Brand_Category;
        brandIndex++;
      }
    }
    console.log('cartData', cartData);
    console.log('brandData', brandData);

    // for (var index in app.globalData.tfgBrandGroup) {
    //   brandData.push(app.globalData.tfgBrandGroup[index])
    // }

    // console.log('cartData', cartData);
    var newData = this._calcTotalAccountAndCounts(cartData); /*重新计算总金额和商品总数*/
    this.setData({
      selectedCounts: countsInfo.counts1,
      selectedTypeCounts: countsInfo.counts2,
      account: newData.account,
      loadingHidden: true,
      cartData: cartData,
      brandData: brandData,
      priceStr: newData.priceStr,
    });
  },

  /*离开页面时，更新本地缓存*/
  onHide: function () {
    cart.execSetStorageSync(this.data.cartData);
  },

  /*更新购物车商品数据*/
  _resetCartData: function () {
    var newData = this._calcTotalAccountAndCounts(this.data.cartData); /*重新计算总金额和商品总数*/
    this.setData({
      account: newData.account,
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      cartData: this.data.cartData,
      priceStr: newData.priceStr,
    });
  },

  /*
   * 计算总金额和选择的商品总数
   * */
  _calcTotalAccountAndCounts: function (data) {
    var len = data.length,
      account = 0,
      selectedCounts = 0,
      selectedTypeCounts = 0,
      priceStr = '0';
    let multiple = 100;
    for (let i = 0; i < len; i++) {
      console.log('data[' + i + ']', data[i]);
      //避免 0.05 + 0.01 = 0.060 000 000 000 000 005 的问题，乘以 100 *100
      if (data[i].selectStatus) {
        account += data[i].counts * multiple * (Number(data[i].List_Price) + (data[i].bShip?Number(data[i].pShippingPrice):0)+ (data[i].bDesign?Number(data[i].pDesignPrice):0)) * multiple;
        selectedCounts += data[i].counts;
        selectedTypeCounts++;
      }
    }
    account = account / (multiple * multiple);
    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account,
      priceStr: this.ToPriceStr(account),
    }
  },


  /*调整商品数目*/
  changeCounts: function (event) {
    var Item_No = cart.getDataSet(event, 'item_no'),
      Product_Name = cart.getDataSet(event, 'product_name'),
      Item_No_Prefix = cart.getDataSet(event, 'item_no_prefix'),
      StyleNo = cart.getDataSet(event, 'styleno'),
      FinishTexture = cart.getDataSet(event, 'finishtexture'),
      StyleTexture = cart.getDataSet(event, 'styletexture'),
      OptionS = cart.getDataSet(event, 'options'),
      SetSize = cart.getDataSet(event, 'setsize'),
      PillowS = cart.getDataSet(event, 'pillows'),
      InventoryData = cart.getDataSet(event, 'inventorydata'),
      InventoryFL = cart.getDataSet(event, 'inventoryfl'),
      InventoryLimit = cart.getDataSet(event, 'inventorylimit'),
      InventoryWood = cart.getDataSet(event, 'inventorywood'),
      type = cart.getDataSet(event, 'type'),
      index = this._getProductIndexByIdAndSource(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData),
      counts = 1;
    if (type == 'add') {
      cart.addCounts(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData);
    } else {
      counts = -1;
      cart.cutCounts(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData);
    }
    //更新商品页面
    // console.log('this.data.cartData[index].counts')
    // console.log(this.data.cartData[index].counts)

    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  /*根据商品id得到 商品所在下标*/
  _getProductIndexByIdAndSource: function (Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData) {
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      if (data[i].Item_No_Prefix == Item_No_Prefix && data[i].Product_Name == Product_Name && data[i].StyleNo == StyleNo && data[i].FinishTexture == FinishTexture && data[i].StyleTexture == StyleTexture && data[i].OptionS == OptionS && data[i].SetSize == SetSize && data[i].PillowS == PillowS && data[i].InventoryData == InventoryData) {
        return i;
      }
    }
  },

  /*删除商品*/
  delete: function (event) {
    console.log(event)
    var Item_No = cart.getDataSet(event, 'item_no');
    var Product_Name = cart.getDataSet(event, 'product_name');
    var Item_No_Prefix = cart.getDataSet(event, 'item_no_prefix');
    var StyleNo = cart.getDataSet(event, 'styleno');
    var FinishTexture = cart.getDataSet(event, 'finishtexture');
    var StyleTexture = cart.getDataSet(event, 'styletexture');
    var OptionS = cart.getDataSet(event, 'options');
    var SetSize = cart.getDataSet(event, 'setsize');
    var PillowS = cart.getDataSet(event, 'pillows');
    
    var InventoryData = cart.getDataSet(event, 'inventorydata');
    var InventoryFL = cart.getDataSet(event, 'inventoryfl');
    var InventoryLimit = cart.getDataSet(event, 'inventorylimit');
    var InventoryWood = cart.getDataSet(event, 'inventorywood');

    var index = this._getProductIndexByIdAndSource(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData);
    console.log('this.data.cartData',this.data.cartData)
    this.data.cartData.splice(index, 1); //删除某一项商品
    //console.log(this.data.cartData)

    this._resetCartData();
    //this.toggleSelectAll();

    cart.delete(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData); //内存中删除该商品

    this.setData({
      cartData: cart.getCartDataFromLocal(),
    })
  },

  /*选择商品*/
  toggleSelect: function (event) {
    var Item_No = cart.getDataSet(event, 'item_no');
    var Product_Name = cart.getDataSet(event, 'product_name');
    var Item_No_Prefix = cart.getDataSet(event, 'item_no_prefix');
    var StyleNo = cart.getDataSet(event, 'styleno');
    var FinishTexture = cart.getDataSet(event, 'finishtexture');
    var StyleTexture = cart.getDataSet(event, 'styletexture');
    var OptionS = cart.getDataSet(event, 'options');
    var SetSize = cart.getDataSet(event, 'setsize');
    var PillowS = cart.getDataSet(event, 'pillows');
    var InventoryData = cart.getDataSet(event, 'inventorydata');
    var InventoryFL = cart.getDataSet(event, 'inventoryfl');
    var InventoryLimit = cart.getDataSet(event, 'inventorylimit');
    var InventoryWood = cart.getDataSet(event, 'inventorywood');
    var status = cart.getDataSet(event, 'status');
    var index = this._getProductIndexByIdAndSource(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData);
    // console.log('Item_No', Item_No);
    console.log('status', status);
    // console.log('index', index);
    console.log('cartData[' + index + ']', this.data.cartData[index]);

    this.data.cartData[index].selectStatus = !status;
    this._resetCartData();
  },

  /*全选*/
  toggleSelectAll: function (event) {
    var status = cart.getDataSet(event, 'status') == 'true';
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      data[i].selectStatus = !status;
    }
    this._resetCartData();
  },

  /*提交订单*/
  submitOrder: function () {
    var that = this;
    // var cartData = cart.getCartDataFromLocal(true);
    // console.log('cartData',cartData);
    var brand = [];
    // console.log('that.data.cartData', that.data.cartData);
    var cartDataTemp = that.data.cartData;
    // console.log('cartDataTemp', cartDataTemp);

    // return;


    for (var index in cartDataTemp) {
      // console.log('cartData[index].selectStatus', that.data.cartData[index].selectStatus);
      if (that.data.cartData[index].selectStatus) {
        if (brand.indexOf(that.data.cartData[index].Brand_Category)) {
          brand.push(that.data.cartData[index].Brand_Category)
        }
      }
    }
    // console.log('brand', brand);
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart'
    });
  },

  /*儲存購物車的資料*/
  submitCart: function () {
    var that = this
    var param = {}
    param.pUID = app.globalData.nUserID
    param.pIndex = app.globalData.cartIndex
    param.pCartData = ''
    that.data.cartData.forEach((item)=>{
      param.pCartData += JSON.stringify(item) + '&'
    })

    cart.doCart(param, (data) => {
      if (data.Code == 1000) {
        console.log('success')
        this.setData({
          cartData: []
        });
        app.globalData.cartIndex = -1
      } else {
        wx.showToast({
          title: '儲存失敗',
          icon: 'none',
          image: '../../imgs/icon/delPic.png',
          duration: 2000
        })
      }
    })
  },

  /*查看商品详情*/
  onProductsItemTap: function (event) {
    console.log("e",event);
    var pSectionType = event.currentTarget.dataset.psectiontype;
    var Item_No = event.currentTarget.dataset.item_no;
    var Item_No_Prefix = event.currentTarget.dataset.item_no_prefix;
    
    var Product_Name = event.currentTarget.dataset.product_name;

    var StyleNo = event.currentTarget.dataset.styleno;
    var FinishTexture = event.currentTarget.dataset.finishtexture;
    var Finish2Texture = event.currentTarget.dataset.finish2texture;
    var StyleTexture = event.currentTarget.dataset.styletexture;
    var Options = event.currentTarget.dataset.options;
    var SetSize = event.currentTarget.dataset.setsize;
    var PillowS = event.currentTarget.dataset.pillows;
    var InventoryData = event.currentTarget.dataset.inventorydata;
    var InventoryFL = event.currentTarget.dataset.inventoryfl;
    var InventoryLimit = event.currentTarget.dataset.inventorylimit;
    var InventoryWood = event.currentTarget.dataset.inventorywood;

    var CartIndex = this._getProductIndexByIdAndSource(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, Options, SetSize, PillowS, InventoryData);
    
    // console.log('Item_No', Item_No);
    console.log('CartIndex', CartIndex);
    wx.navigateTo({
      url: '../product/product?Item_No=' + Item_No + '&Item_No_Prefix=' + Item_No_Prefix + '&pProductCategoryName=' + Product_Name + '&FinishTexture=' + FinishTexture + '&Finish2Texture=' + Finish2Texture + '&StyleTexture=' + StyleTexture + '&Options=' + Options + '&SetSize=' + SetSize + '&PillowS=' + PillowS + '&StyleNum=' + StyleNo + '&CartIndex=' + CartIndex + '&InventoryData=' + InventoryData + '&pSectionType=' + pSectionType,
    })
  },
  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    });
  },

  ToPriceStr: function (e) {
    var tmpNum = e.toString();
    var tmpStr = '';
    var strIndex = 0;
    for (var i = (tmpNum.length - 1); i >= 0; i--) {
      if(((strIndex % 3) == 0) && (strIndex != 0))
      {
        tmpStr = tmpNum[i] + "," + tmpStr;
      }
      else
      {
        tmpStr = tmpNum[i] + tmpStr;
      }

      strIndex = strIndex + 1;
    }
    return tmpStr;
  },
  //商品順序兩兩交換
  exchange:function (e) {
    var that = this

    that.setData({
      ['cartData['+e.currentTarget.dataset.index+'].CartIndex']: e.currentTarget.dataset.index + 1,
      ['cartData['+(e.currentTarget.dataset.index + 1)+'].CartIndex']: e.currentTarget.dataset.index,
      ['cartData['+e.currentTarget.dataset.index+']']: that.data.cartData[e.currentTarget.dataset.index + 1],
      ['cartData['+(e.currentTarget.dataset.index + 1)+']']: that.data.cartData[e.currentTarget.dataset.index],
  })
  }
})