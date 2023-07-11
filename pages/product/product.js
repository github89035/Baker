// pages/product/product.js
import {
  Product
} from 'product-model.js';
import {
  Cart
} from '../cart/cart-model.js';
import {
  Screenshot
} from '../../utils/screenshot';
var screenshot = new Screenshot();
var product = new Product(); //实例化 首页 对象
var cart = new Cart();
const app = getApp();

//無條件進位到百位數
function ToRound(price) {
  price = Math.ceil(price/100)*100
  return price
}

Page({

  /**
   * 页面的初始数据
   */
  startPageX: 0,
  currentView: 0,
  data: {
    loadingHidden: false,
    hiddenSmallImg: true,
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    productCounts: 1,
    currentTabsIndex: 0,
    cartTotalCounts: 0,
    arrowLeftShow: true,
    arrowRightShow: false,
    ImageIndex: 0,
    bImage: false,
    srcArray: [],
    ProductPrice: 0,
    FinishPrice: 0,
    OptionSPrice: 0,
    FullPrice: 0,
    language: app.globalData.language,
    tmpOptions: null,
    tmpDefaultOption: [],
    tmpSeatOption: null,
    tmpBackPillowOption: null,
    tmpThrowPillowOption: null,
    tmpOtherOption: null,
    //bespoke option
    tmpArmStyleOption: [],
    tmpLegOption: [],
    tmpFrameOption: [],
    tmpBackStyleOption: [],
    tmpOverallDepthOption: [],
    tmpEdgeOption: [],
    tmpNailOption: [],
    tmpOptionsOption: [],
    tmpSelfDeckingOption: [],
    tmpCushionOption: [],
    tmpButtonedOption: [],
    tmpBackPillowBespokeOption: [],
    tmpSwivelBaseOption: [],
    tmpLegBaseOption: [],
    tmpFillOption: [],
    tmpDecorativeOption: [],
    FinishIndex: 0, //option看用的index
    FinishChileIndex: 0, //option看用的index
    Finish2Index: 0, //option看用的index
    Finish2ChileIndex: 0, //option看用的index
    StyleIndex: 0, //option看用的index
    Style_No_Index: 0, //option看用的index
    StyleChileIndex: 0, //option看用的index
    bFinishBtn: false,
    bFinish2Btn: false,
    bStyleBtn: false,
    bCart: false,
    CartIndex: -1,
    bPillowBtn: false,
    bFLShow: false,
    nowPillowNo: 0,
    tmpPillowIndex: 0,
    tmpPillowTypeNo: 0,
    tmpPillowChileNo: 0,
    PillowAddPrice: 0,
    bInventory: false,
    InventoryIndex: 0,
    InventoryArray: [],
    SizeSet: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (cartItem) {
    var that = this;
    console.log('cartItem',cartItem);
    this.data.language = app.globalData.language;

    this.data.Item_No = cartItem.Item_No;
    this.data.Item_No_Prefix = cartItem.Item_No_Prefix;
    this.data.StyleType = cartItem.StyleType;
    this.data.Style_No_Index = cartItem.Style_No_Index;

    this.data.ItemName = cartItem.pProductCategoryName;

    this.data.pSectionType = cartItem.pSectionType;
    
    this.data.StyleNum = cartItem.StyleNum;
    this.data.FinishTexture = cartItem.FinishTexture;
    this.data.Finish2Texture = cartItem.Finish2Texture;
    this.data.StyleTexture = cartItem.StyleTexture;
    this.data.Options = cartItem.Options;
    this.data.SetSize = cartItem.SetSize;
    this.data.PillowS = cartItem.PillowS;

    if(cartItem.CartIndex != undefined)
    {
      that.data.bCart = true;
      this.data.CartIndex = Number(cartItem.CartIndex);
    }
    
    that.setData({
      bCart: that.data.bCart,
      searching:false,
    });

    console.log('first load data',this.data);
    this._loadData();


    //保存截屏
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1].route
    console.log(currentPage);
    wx.onUserCaptureScreen(function (res) {
      var pageData = JSON.stringify(that.data);
      console.log('pageData=====', pageData);
      screenshot.savescreenshot(app.globalData.nUserID, currentPage, pageData, (data) => {
        console.log('screenshot',data)
      })
    })
  },

  /*加载所有数据*/
  _loadData: function (callback) {
    var that = this;
    // 获得产品信息
    product.getDetialInfo(this.data.Item_No, this.data.Item_No_Prefix, this.data.StyleNum, this.data.ItemName, this.data.FinishTexture, this.data.Finish2Texture, this.data.StyleTexture, this.data.Options, this.data.SetSize, this.data.PillowS, this.data.pSectionType, (data) => {

      // console.log('product.getDetialInfo');
      console.log('Data',data.Data[0]);

      that.setData({
        cartTotalCounts: wx.getStorageSync('cart').length,
        product: data.Data[0],
        loadingHidden: true,
      });
      app.globalData.cartTotalCounts = that.data.cartTotalCounts
      callback && callback();
      that.data.product.source = 1; //设置供货来源
      console.log(that.data.product)

      that.data.product.tfgImage.forEach(e => {
        that.data.srcArray.push(e.fImageUrl);
      });
      
      var OptionTypeArr = []
      if(!(that.data.product.Item_OptionS == null || that.data.product.Item_OptionS == undefined || that.data.product.Item_OptionS.length == 0)){
        that.data.product.Item_OptionS.forEach((item)=>{
          OptionTypeArr.push(item.Option_Type)
        })
        console.log('OptionTypeArr',OptionTypeArr)
      }

      if(!(that.data.product.OptionStr == null || that.data.product.OptionStr == undefined || that.data.product.OptionStr.length == 0))
      {
        var optionName = []
        that.data.tmpOptions = that.data.product.OptionStr;
        OptionTypeArr.forEach((item,index)=>{
          optionName[item] = that.data.tmpOptions.filter((y)=>{
              return parseInt(y/10000)==index
          })
        })
        console.log(optionName)

        for (var key in optionName) {
          if(that.data.product.pSectionType != "Bespoke"){
            if(key == 'Option')
            {
              that.data.tmpDefaultOption = optionName[key];
            }
            else if(key == 'Seat Cushion')
            {
              that.data.tmpSeatOption = optionName[key][0].toString();
            }
            else if(key == 'Back Pillow')
            {
              that.data.tmpBackPillowOption = optionName[key][0].toString();
            }
            else if(key == 'Throw Pillow')
            {
              that.data.tmpThrowPillowOption = optionName[key][0].toString();
            }
          }else{
            if(key.indexOf('Arm') >=0)
            {
              that.data.tmpArmStyleOption = optionName[key][0].toString();
            }
            else if(key.indexOf('Leg') >=0)
            {
              that.data.tmpLegOption = optionName[key];
            }
            else if(key.indexOf('Frame') >=0)
            {
              that.data.tmpFrameOption = optionName[key];
            }
            else if(key == 'Back Style')
            {
              that.data.tmpBackStyleOption = optionName[key];
            }
            else if(key == 'Back Pillow')
            {
              that.data.tmpBackPillowOption = optionName[key];
            }
            else if(key == 'Your Depth')
            {
              that.data.tmpOverallDepthOption = optionName[key];
            }
            else if(key.indexOf('Edge') >=0)
            {
              that.data.tmpEdgeOption = optionName[key];
            }
            else if(key == 'Nail Options')
            {
              that.data.tmpNailOption = optionName[key];
            }
            else if(key == 'OPTIONS')
            {
              that.data.tmpOptionsOption = optionName[key];
            }
            else if(key == 'SELF DECKING')
            {
              that.data.tmpSelfDeckingOption = optionName[key];
            }
            else if(key == 'CUSHION OPTIONS')
            {
              that.data.tmpCushionOption = optionName[key];
            }
            else if(key == 'Buttoned Option')
            {
              that.data.tmpButtonedOption = optionName[key];
            }
            else if(key == 'BACK PILLOW OPTIONS')
            {
              that.data.tmpBackPillowBespokeOption = optionName[key];
            }
            else if(key == 'SWIVEL BASE OPTION')
            {
              that.data.tmpSwivelBaseOption = optionName[key];
            }
            else if(key == 'LEG/BASE UPCHARGES')
            {
              that.data.tmpLegBaseOption = optionName[key];
            }
            else if(key == 'FILL OPTIONS')
            {
              that.data.tmpFillOption = optionName[key];
            }
            else if(key == 'DECORATIVE OPTIONS')
            {
              that.data.tmpDecorativeOption = optionName[key];
            }
          }
        }
      }

      if(!(that.data.product.Item_Finishes == null || that.data.product.Item_Finishes == undefined || that.data.product.Item_Finishes.length == 0))
      {
        that.data.FinishIndex= that.data.product.nFinishIndex;
        that.data.FinishChileIndex= that.data.product.Item_Finishes[that.data.FinishIndex].nChileSelect;
      }

      if(!(that.data.product.Item_Finishes2 == null || that.data.product.Item_Finishes2 == undefined || that.data.product.Item_Finishes2.length == 0))
      {
        that.data.Finish2Index= that.data.product.nFinish2Index;
        that.data.Finish2ChileIndex= that.data.product.Item_Finishes2[that.data.Finish2Index].nChileSelect;
      }

      if(!(that.data.product.Item_StyleS == null || that.data.product.Item_StyleS == undefined || that.data.product.Item_StyleS.length == 0))
      {
        that.data.StyleIndex= that.data.product.nStyleIndex;
        that.data.Style_No_Index= that.data.product.Item_StyleS[that.data.StyleIndex].Style_No_Index;
        that.data.StyleChileIndex= that.data.product.Item_StyleS[that.data.StyleIndex].Item_Style_NoS[that.data.Style_No_Index].nChileSelect;
      }

      that.data.product.pSale = Number(that.data.product.pSale);
      that.data.product.pShippingSale = Number(that.data.product.pShippingSale);
      that.data.product.pDesignSale = Number(that.data.product.pDesignSale);

      var tmpPrice = parseInt(that.data.product.List_Price);

      if(that.data.product.m_SKUS.length > 0 && that.data.product.m_StoreProductS.length > 0)
      {
        that.data.InventoryArray= [
          {
            index: 0,
            id: 'store',
            name: '台庫存'
          },
          {
            index: 1,
            id: 'SKU',
            name: '美庫存'
          }
        ]
      }
      else if(that.data.product.m_StoreProductS.length > 0)
      {
        that.data.InventoryArray= [
          {
            index: 0,
            id: 'store',
            name: '台庫存'
          }
        ]
      }
      else if(that.data.product.m_SKUS.length > 0)
      {
        that.data.InventoryArray= [
          {
            index: 0,
            id: 'SKU',
            name: '美庫存'
          }
        ]
      }
      
      var imageCnt = that.data.product.tfgImage.length;
      that.setData({
        tmpOptions: that.data.tmpOptions,
        tmpDefaultOption: that.data.tmpDefaultOption,
        tmpSeatOption: that.data.tmpSeatOption,
        tmpBackPillowOption: that.data.tmpBackPillowOption,
        tmpThrowPillowOption: that.data.tmpThrowPillowOption,
        tmpOtherOption: that.data.tmpOtherOption,
        tmpArmStyleOption: that.data.tmpArmStyleOption,
        tmpLegOption: that.data.tmpLegOption,
        tmpFrameOption: that.data.tmpFrameOption,
        tmpBackStyleOption: that.data.tmpBackStyleOption,
        tmpOverallDepthOption: that.data.tmpOverallDepthOption,
        tmpEdgeOption: that.data.tmpEdgeOption,
        tmpNailOption: that.data.tmpNailOption,
        tmpOptionsOption: that.data.tmpOptionsOption,
        tmpSelfDeckingOption: that.data.tmpSelfDeckingOption,
        tmpCushionOption: that.data.tmpCushionOption,
        tmpButtonedOption: that.data.tmpButtonedOption,
        tmpBackPillowBespokeOption: that.data.tmpBackPillowBespokeOption,
        tmpSwivelBaseOption: that.data.tmpSwivelBaseOption,
        tmpLegBaseOption: that.data.tmpLegBaseOption,
        tmpFillOption: that.data.tmpFillOption,
        tmpDecorativeOption: that.data.tmpDecorativeOption,
        FinishIndex: that.data.FinishIndex,
        FinishChileIndex: that.data.FinishChileIndex,
        Finish2Index: that.data.Finish2Index,
        Finish2ChileIndex: that.data.Finish2ChileIndex,
        StyleIndex: that.data.StyleIndex,
        Style_No_Index: that.data.Style_No_Index,
        StyleChileIndex: that.data.StyleChileIndex,
        ProductPrice: tmpPrice,
        product: that.data.product,
        InventoryArray: that.data.InventoryArray,
        arrowRightShow: (imageCnt<=5)
      });

      if(that.data.bCart)
      {
        this.FinishPriceCheck();
        this.StylePriceCheck();
        this.OptionPriceCheck();
        this.PillowPriceSet();
        this.GetFullPrice();
      }
    });
  },
  FinishPriceCheck: function(){
    this.setData({
      FinishPrice: Number(this.data.product.Item_Finishes[this.data.FinishIndex].pPrice),
    });
  },
  StylePriceCheck: function(){
    this.setData({
      ProductPrice: Number(this.data.product.Item_StyleS[this.data.StyleIndex].Item_Style_NoS[this.data.Style_No_Index].fPrice),
    });
  },
  OptionPriceCheck: function(){
    var that = this;

    var tmpPrice = 0;

    console.log('tmpOptionS',that.data.tmpOptions)
    if(that.data.tmpOptions == '' || that.data.tmpOptions == null || that.data.tmpOptions == undefined)
    {
      that.setData({
        OptionSPrice: tmpPrice,
      });
      return;
    }

    var checkboxOptions = that.data.tmpOptions;
    checkboxOptions.forEach(x => {
      var TypeNum = parseInt(x/10000);
      var OptionNum = (x%10000)/100;
      // console.log('Foreach x: ', x);
      // console.log('Foreach TypeNum: ', TypeNum);
      // console.log('Foreach OptionNum: ', OptionNum);

      var aTmpIndex = that.data.product.Item_OptionS[TypeNum].m_Option_Chiles[OptionNum].nChile;
      var aTmp = that.data.product.Item_OptionS[TypeNum].m_Option_Chiles[OptionNum].m_Option_Chiles[aTmpIndex];
      //console.log('aTmp : ', aTmp);
      var CountPrice = 0;
      CountPrice = parseInt(aTmp.nPrice);
      //console.log('CountPrice : ', CountPrice);
      tmpPrice = tmpPrice + CountPrice;
    });
    //console.log('tmpPrice : ', tmpPrice);
    that.data.OptionSPrice = tmpPrice;

    that.setData({
      OptionSPrice: tmpPrice,
      product: that.data.product,
    });
  },
  bindPickerChange_TypeObj: function (e) {
    var that = this;
    //console.log('e',e);

    var TypeNum = parseInt(e.currentTarget.dataset.index/10000);
    var OptionNum = (e.currentTarget.dataset.index%10000)/100;
    //console.log('TypeNum: ', TypeNum);
    //console.log('OptionNum: ', OptionNum);
    //console.log('Chile: ', e.detail.value);
    
    that.data.product.Item_OptionS[TypeNum].m_Option_Chiles[OptionNum].nChile = e.detail.value;

    that.setData({
      product: that.data.product
    });

    this.OptionPriceCheck();
    this.GetFullPrice();
  },
  //选择购买数目
  bindPickerChange: function (e) {
    this.setData({
      productCounts: this.data.countsArray[e.detail.value],
    })
  },
  //选择购买数目
  // bindPickerChange: function (event) {
  //   // console.log(event);
  //   var index = event.detail.value;
  //   var selectedCount = this.data.countsArray[index];
  //   this.setData({
  //     productCounts: selectedCount
  //   })
  // },
  //切换详情面板
  onTabsItemTap: function (event) {
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    })
  },
  //切换详情面板
  onImagesItemTap: function (event) {
    var index = product.getDataSet(event, 'index');
    this.setData({
      ImageIndex: index
    })
    this.currentView = index;
  },

  OnSizeChange: function(e) {
    var that = this;
    console.log('e',e);

    var tempSetSize = e.detail.value.toFixed(1);
    that.data.product.fSetSize = tempSetSize;

    this.setData({
      SizeSet: tempSetSize,
      product: that.data.product,
    })
  },

  /*添加到购物车*/
  onAddingToCartTap: function (events) {
    //防止快速点击
    if (this.data.isFly) {
      return;
    }
    console.log('events');
    console.log(events);
    this._flyToCartEffect(events); //动画效果
    this.addToCart();
  },
  onEditToCartTap: function (events) {
    console.log('events');
    console.log(events);
    this.addToCart();
    wx.navigateBack({
      changed: true,
    })
  },

  /*将商品数据添加到内存中*/
  addToCart: function () {
    var tempObj = {},
      keys = ['CartIndex','pSectionType','Item_No', 'Item_No_Prefix', 'Product_Name', 'Brand_Category', 'List_Price', 'fImageUrl','Level','StyleNo','FinishTexture','StyleTexture','Finish2Texture','OptionS','pShippingPrice','pDesignPrice','pSale','pShippingSale','pDesignSale','FinishTypeName','FinishName','Finish2Name','StyleTypeName','StyleNoName','bShip','bDesign','SetSize','PillowS','InventoryData','InventoryLimit'];

    console.log('this.data.product', this.data.product);
    keys.forEach(e => {
        if(e == 'CartIndex')
        {
          tempObj[e] = this.data.CartIndex;
        }
        //加pSectionType來區分是否為Bespoke
        else if(e == 'pSectionType'){
          tempObj[e] = this.data.product.pSectionType;
        }
        else if(e == 'fImageUrl')
        {
          if(this.data.bImage)
          {
            tempObj[e] = this.data.product.tfgImage[this.data.ImageIndex].fImageUrl;
          }
          else
          {
            tempObj[e] = this.data.product.tfgImage[0].fImageUrl;
          }
        }
        else if(e == 'Level')
        {
          if(this.data.product.Item_StyleS == null || this.data.product.Item_StyleS == undefined || this.data.product.Item_StyleS.length == 0)
          {
            tempObj[e] = '';
          }
          else
          {
            tempObj[e] = this.data.product.Item_StyleS[this.data.StyleIndex].Item_Style_NoS[this.data.Style_No_Index].pLevel;
          }
        }
        else if(e == 'FinishTypeName')
        {
          if(this.data.product.Item_Finishes == null || this.data.product.Item_Finishes == undefined || this.data.product.Item_Finishes.length <= 1)
          {
            tempObj[e] = '';
          }
          else
          {
            tempObj[e] = this.data.product.Item_Finishes[this.data.FinishIndex].pFinishName;
          }
        }
        else if(e == 'FinishName')
        {
          if(this.data.product.Item_Finishes == null || this.data.product.Item_Finishes == undefined || this.data.product.Item_Finishes.length <= 1)
          {
            tempObj[e] = '';
          }
          else
          {
            if(this.data.product.Item_Finishes[this.data.FinishIndex].m_Finish_ChileS.length > 0)
            {
              tempObj[e] = this.data.product.Item_Finishes[this.data.FinishIndex].m_Finish_ChileS[this.data.FinishChileIndex].pFinishChileName;
            }
            else
            {
              tempObj[e] = '';
            }
          }
        }
        else if(e == 'Finish2Name')
        {
          if(this.data.product.Item_Finishes2 == null || this.data.product.Item_Finishes2 == undefined || this.data.product.Item_Finishes2.length <= 1)
          {
            tempObj[e] = '';
          }
          else
          {
            if(this.data.product.Item_Finishes2[this.data.Finish2Index].m_Finish_ChileS.length > 0)
            {
              tempObj[e] = this.data.product.Item_Finishes2[this.data.Finish2Index].m_Finish_ChileS[this.data.Finish2ChileIndex].pFinishChileName;
            }
            else
            {
              tempObj[e] = '';
            }
          }
        }
        else if(e == 'StyleTypeName')
        {
          if(this.data.product.Item_StyleS == null || this.data.product.Item_StyleS == undefined || this.data.product.Item_StyleS.length == 0)
          {
            tempObj[e] = '';
          }
          else
          {
            tempObj[e] = this.data.product.Item_StyleS[this.data.StyleIndex].StyleType;
          }
        }
        else if(e == 'StyleNoName')
        {
          if(this.data.product.Item_StyleS == null || this.data.product.Item_StyleS == undefined || this.data.product.Item_StyleS.length == 0)
          {
            tempObj[e] = '';
          }
          else
          {
            tempObj[e] = this.data.product.Item_StyleS[this.data.StyleIndex].Item_Style_NoS[this.data.Style_No_Index].m_StyleChileS[this.data.StyleChileIndex].pStyleChileName;
          }
        }
        else if(e == 'FinishTexture')
        {
          if(this.data.product.Item_Finishes == null || this.data.product.Item_Finishes == undefined || this.data.product.Item_Finishes.length <= 1)
          {
            tempObj[e] = '';
          }
          else
          {
            var FinishNum = this.data.product.Item_Finishes[this.data.FinishIndex].pNum;
            if(this.data.product.Item_Finishes[this.data.FinishIndex].m_Finish_ChileS.length <= 0)
            {
              tempObj[e] = FinishNum + ',' + 0;
            }
            else
            {
              var FinishChileNum = this.data.product.Item_Finishes[this.data.FinishIndex].m_Finish_ChileS[this.data.FinishChileIndex].pNum;

              tempObj[e] = FinishNum + ',' + FinishChileNum;
            }
          }
        }
        else if(e == 'StyleTexture')
        {
          if(this.data.product.Item_StyleS == null || this.data.product.Item_StyleS == undefined || this.data.product.Item_StyleS.length == 0)
          {
            tempObj[e] = '';
          }
          else
          {
            var tmpChileNum = this.data.product.Item_StyleS[this.data.StyleIndex].Item_Style_NoS[this.data.Style_No_Index].m_StyleChileS[this.data.StyleChileIndex].pNum;

            tempObj[e] = tmpChileNum;
          }
          
        }
        else if(e == 'Finish2Texture')
        {
          if(this.data.product.Item_Finishes2 == null || this.data.product.Item_Finishes2 == undefined || this.data.product.Item_Finishes2.length <= 1)
          {
            tempObj[e] = '';
          }
          else
          {
            var FinishNum = this.data.product.Item_Finishes2[this.data.Finish2Index].pNum;
            if(this.data.product.Item_Finishes2[this.data.Finish2Index].m_Finish_ChileS.length <= 0)
            {
              tempObj[e] = FinishNum + ',' + 0;
            }
            else
            {
              console.log(this.data.Finish2Index)
              console.log(this.data.Finish2ChileIndex)
              var FinishChileNum = this.data.product.Item_Finishes2[this.data.Finish2Index].m_Finish_ChileS[this.data.Finish2ChileIndex].pNum;

              tempObj[e] = FinishNum + ',' + FinishChileNum;
            }
          }
        }
        else if(e == 'OptionS')
        {
          var OptionStr = '';

          if(this.data.product.Item_OptionS == null || this.data.product.Item_OptionS == undefined || this.data.product.Item_OptionS.length == 0)
          {
            tempObj[e] = OptionStr;
          }
          else
          {
            this.data.product.Item_OptionS.forEach(x => {
              x.m_Option_Chiles.forEach(y => {
                if(y.bCheck == true)
                {
                  if(OptionStr == '')
                  {
                    OptionStr += (parseInt(y.uNum) + parseInt(y.nChile)).toString();
                  }
                  else
                  {
                    OptionStr +=  ',' + (parseInt(y.uNum) + parseInt(y.nChile)).toString();
                  }
                }
              })
            })

            tempObj[e] = OptionStr;
          }
        }
        else if(e == 'SetSize')
        {
          if(this.data.product.fSetSize <= 0)
          {
            tempObj[e] = '';
          }
          else
          {
            tempObj[e] = this.data.product.fSetSize;
          }
        }
        else if (e == 'PillowS')
        {
          var PillowStr = '';
          if(this.data.product.m_PillowS.length > 0)
          {
            this.data.product.m_PillowS.forEach(x => {
              if(x.bCustomized)
              {
                if(PillowStr == '')
                {
                  PillowStr += x.nNum.toString() + ','
                            + ((x.pTypeName != '')?x.pTypeName.toString():'') + ','
                            + ((x.pSize != '')?x.pSize.toString():'') + ','
                            + ((x.nFLChileNo != '')?x.nFLChileNo.toString():'') + ','
                            + ((x.nFLIndex != '')?x.nFLIndex.toString():'') + ','
                            + ((x.nFLTypeNo != '')?x.nFLTypeNo.toString():'')+ ','
                            + ((x.pFLNo != '')?x.pFLNo.toString():'');
                }
                else
                {
                  PillowStr +=  '_' + x.nNum.toString() + ','
                            + ((x.pTypeName != '')?x.pTypeName.toString():'') + ','
                            + ((x.pSize != '')?x.pSize.toString():'') + ','
                            + ((x.nFLChileNo != '')?x.nFLChileNo.toString():'') + ','
                            + ((x.nFLIndex != '')?x.nFLIndex.toString():'') + ','
                            + ((x.nFLTypeNo != '')?x.nFLTypeNo.toString():'')+ ','
                            + ((x.pFLNo != '')?x.pFLNo.toString():'');
                }
              }
            })
            tempObj[e] = PillowStr;
          }
          else
          {
            tempObj[e] = '';
          }
        }
        else if(e == 'List_Price')
        {
          this.GetFullPrice();
          tempObj[e] = ToRound(this.data.FullPrice * (1 + this.data.product.PriceListRate) * this.data.product.Rate)
        }
        else if(e == 'pShippingPrice')
        {
          this.GetFullPrice();
          tempObj[e] = 0
        }
        // else if(e == 'pDesignPrice')
        // {
        //   this.GetFullPrice();
        //   var price = this.data.FullPrice * 0.05;
          
        //   if((price/100)%10 >= 5){
        //     tempObj[e] = Math.ceil(price/1000)*1000
        //   }else{
        //     tempObj[e] = Math.floor(price/1000)*1000
        //   }
        // }
        else if (e == 'InventoryData')
        {
          tempObj[e] = '';
        }
        else if (e == 'InventoryWood')
        {
          tempObj[e] = '';
        }
        else if (e == 'InventoryFL')
        {
          tempObj[e] = '';
        }
        else if (e == 'InventoryLimit')
        {
          tempObj[e] = '';
        }
        else
        {
          tempObj[e] = this.data.product[e];
        }
    });
    // for (var key in keys) {
        
    // }
    console.log('tempObj', tempObj);
    cart.add(tempObj, this.data.productCounts);
  },

  /*加入购物车动效*/
  _flyToCartEffect: function (events) {
    //获得当前点击的位置，距离可视区域左上角
    var touches = events.touches[0];
    var diff = {
        x: '25px',
        y: 25 - touches.clientY + 'px'
      },
      style = 'display: block;-webkit-transform:translate(' + diff.x + ',' + diff.y + ') rotate(350deg) scale(0)'; //移动距离
    this.setData({
      isFly: true,
      translateStyle: style
    });
    var that = this;
    setTimeout(() => {
      that.setData({
        isFly: false,
        translateStyle: '-webkit-transform: none;', //恢复到最初状态
        isShake: true,
      });
      setTimeout(() => {
        that.setData({
          isShake: false,
          cartTotalCounts: wx.getStorageSync('cart').length
        });
        app.globalData.cartTotalCounts = that.data.cartTotalCounts
      }, 200);
    }, 1000);
  },

  /*跳转到购物车*/
  onCartTap: function () {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
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
      title: '零食商贩 Pretty Vendor',
      path: 'pages/product/product?id=' + this.data.id
    }
  },
  onKuJiaLe: function (event) {
    wx.navigateTo({
      url: '../kujiale/kujiale',
    })
  },
  radioChange: function (event) {
    console.log(event.detail.key);
    var that = this;
    console.log(that.data.product.source);
    that.data.product.source = event.detail.key;
    console.log(that.data.product);
  },
  onImageLoaded: function (e) {
    var width = e.detail.width;
    var height = e.detail.height;
    
    var that = this;
  },
  previewImg: function(e){
    var index = product.getDataSet(e, 'index');
    
    var that = this;
    wx.previewImage({
      current: that.data.srcArray[index],
      urls: that.data.srcArray,
    })
  },
  onImageScroll: function(e){
    var that = this;
    that.setData({
      arrowLeftShow: false,
      arrowRightShow: false,
    })
  },
  onToupper: function(e){
    var that = this;
    that.setData({
      arrowLeftShow: true,
      arrowRightShow: false,
    })
  },
  onTolower: function(e){
    var that = this;
    that.setData({
      arrowLeftShow: false,
      arrowRightShow: true
    })
  },
  touchStart(e) {
    this.startPageX = e.changedTouches[0].pageX;
  },

  touchEnd(e) {
    var that = this;
    const moveX = e.changedTouches[0].pageX - this.startPageX;
    const maxPage = this.data.product.tfgImage.length - 1;
    if (Math.abs(moveX) >= 150){
      if (moveX > 0) {
        this.currentView = this.currentView !== 0 ? this.currentView - 1 : 0;
      } else {
        this.currentView = this.currentView !== maxPage ? this.currentView + 1 : maxPage;
      }
    }
    // console.log('currentView',this.currentView)
    // console.log('maxPage',maxPage)
    this.setData({
      ImageIndex: this.currentView,
    })
  },

  bindCheckShip: function (e) {
    var that = this;
    //console.log(e);
    that.data.product.bShip = !that.data.product.bShip

    that.setData({
      product: that.data.product,
    });
  },
  bindCheckDesign: function (e) {
    var that = this;
    //console.log(e);
    that.data.product.bDesign = !that.data.product.bDesign

    that.setData({
      product: that.data.product,
    });
  },

  OptionChange: function (e) {
    //console.log('checkbox发生change事件，携带value值为：', e);
    // tmpOptions: null,
    // tmpDefaultOption: null,
    // tmpSeatOption: null,
    // tmpBackPillowOption: null,
    // tmpThrowPillowOption: null,
    var that = this;
    console.log(e);

    if(e.currentTarget.dataset.option_type == 'Option')
    {
      that.data.tmpDefaultOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'Seat Cushion')
    {
      that.data.tmpSeatOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'Back Pillow')
    {
      that.data.tmpBackPillowOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'Throw Pillow')
    {
      that.data.tmpThrowPillowOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type.indexOf('Arm') >=0)
    {
      that.data.tmpArmStyleOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type.indexOf('Leg') >=0)
    {
      that.data.tmpLegOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type.indexOf('Frame') >=0)
    {
      that.data.tmpFrameOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'Back Style')
    {
      that.data.tmpBackStyleOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type.indexOf('Your Depth') >=0)
    {
      that.data.tmpOverallDepthOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type.indexOf('Edge') >=0)
    {
      that.data.tmpEdgeOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'Nail Options' )
    {
      that.data.tmpNailOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'OPTIONS')
    {
      that.data.tmpOptionsOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'Self Decking')
    {
      that.data.tmpSelfDeckingOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'Cushion Fill')
    {
      that.data.tmpCushionOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'Buttoned Option')
    {
      that.data.tmpButtonedOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'BACK PILLOW OPTIONS')
    {
      that.data.tmpBackPillowBespokeOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'Swivel Base Option')
    {
      that.data.tmpSwivelBaseOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'LEG/BASE UPCHARGES')
    {
      that.data.tmpLegBaseOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'FILL OPTIONS')
    {
      that.data.tmpFillOption = e.detail.value;
    }
    else if(e.currentTarget.dataset.option_type == 'DECORATIVE OPTIONS')
    {
      that.data.tmpDecorativeOption = e.detail.value;
    }
    else
    {
      that.data.tmpOtherOption = e.detail.value;
    }
    console.log('tmpDefaultOption',that.data.tmpDefaultOption);
    console.log('tmpSeatOption',that.data.tmpSeatOption);
    console.log('tmpBackPillowOption',that.data.tmpBackPillowOption);
    console.log('tmpThrowPillowOption',that.data.tmpThrowPillowOption);
    console.log('tmpOtherOption',that.data.tmpOtherOption);
    console.log('tmpArmStyleOption',that.data.tmpArmStyleOption);
    console.log('tmpLegOption',that.data.tmpLegOption);
    console.log('tmpFrameOption',that.data.tmpFrameOption);
    console.log('tmpBackStyleOption',that.data.tmpBackStyleOption);
    console.log('tmpOverallDepthOption',that.data.tmpOverallDepthOption);
    console.log('tmpEdgeOption',that.data.tmpEdgeOption);
    console.log('tmpNailOption',that.data.tmpNailOption);
    console.log('tmpOptionsOption',that.data.tmpOptionsOption);
    console.log('tmpSelfDeckingOption',that.data.tmpSelfDeckingOption);
    console.log('tmpCushionOption',that.data.tmpCushionOption);
    console.log('tmpButtonedOption',that.data.tmpButtonedOption);
    console.log('tmpBackPillowBespokeOption',that.data.tmpBackPillowBespokeOption);
    console.log('tmpSwivelBaseOption',that.data.tmpSwivelBaseOption);
    console.log('tmpLegBaseOption',that.data.tmpLegBaseOption);
    console.log('tmpFillOption',that.data.tmpFillOption);
    console.log('tmpDecorativeOption',that.data.tmpDecorativeOption);

    var checkboxOptions = [];
    if(that.data.tmpDefaultOption != null && that.data.tmpDefaultOption.length > 0)
    {
      that.data.tmpDefaultOption.forEach(y => {
        checkboxOptions.push(y);
      });
    }
    if(that.data.tmpSeatOption != null && that.data.tmpSeatOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpSeatOption);
    }
    if(that.data.tmpBackPillowOption != null && that.data.tmpBackPillowOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpBackPillowOption);
    }
    if(that.data.tmpThrowPillowOption != null && that.data.tmpThrowPillowOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpThrowPillowOption);
    }
    if(that.data.tmpArmStyleOption != null && that.data.tmpArmStyleOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpArmStyleOption);
    }
    if(that.data.tmpLegOption != null && that.data.tmpLegOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpLegOption);
    }
    if(that.data.tmpFrameOption != null && that.data.tmpFrameOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpFrameOption);
    }
    if(that.data.tmpBackStyleOption != null && that.data.tmpBackStyleOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpBackStyleOption);
    }
    if(that.data.tmpOverallDepthOption != null && that.data.tmpOverallDepthOption.length > 0)
    {
      that.data.tmpOverallDepthOption.forEach(y => {
        checkboxOptions.push(y);
      });
    }
    if(that.data.tmpEdgeOption != null && that.data.tmpEdgeOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpEdgeOption);
    }
    if(that.data.tmpNailOption != null && that.data.tmpNailOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpNailOption);
    }
    if(that.data.tmpOptionsOption != null && that.data.tmpOptionsOption.length > 0)
    {
      that.data.tmpOptionsOption.forEach(y => {
        checkboxOptions.push(y);
      });
    }
    if(that.data.tmpSelfDeckingOption != null && that.data.tmpSelfDeckingOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpSelfDeckingOption);
    }
    if(that.data.tmpCushionOption != null && that.data.tmpCushionOption.length > 0)
    {
      that.data.tmpCushionOption.forEach(y => {
        checkboxOptions.push(y);
      });
    }
    if(that.data.tmpButtonedOption != null && that.data.tmpButtonedOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpButtonedOption);
    }
    if(that.data.tmpBackPillowBespokeOption != null && that.data.tmpBackPillowBespokeOption.length > 0)
    {
      checkboxOptions.push(that.data.tmpBackPillowBespokeOption);
    }
    if(that.data.tmpSwivelBaseOption != null && that.data.tmpSwivelBaseOption.length > 0)
    {
      that.data.tmpSwivelBaseOption.forEach(y => {
        checkboxOptions.push(y);
      });
    }
    if(that.data.tmpLegBaseOption != null && that.data.tmpLegBaseOption.length > 0)
    {
      that.data.tmpLegBaseOption.forEach(y => {
        checkboxOptions.push(y);
      });
    }
    if(that.data.tmpFillOption != null && that.data.tmpFillOption.length > 0)
    {
      that.data.tmpFillOption.forEach(y => {
        checkboxOptions.push(y);
      });
    }
    if(that.data.tmpDecorativeOption != null && that.data.tmpDecorativeOption.length > 0)
    {
      that.data.tmpDecorativeOption.forEach(y => {
        checkboxOptions.push(y);
      });
    }
    if(that.data.tmpOtherOption != null && that.data.tmpOtherOption.length > 0)
    {
      that.data.tmpOtherOption.forEach(y => {
        checkboxOptions.push(y);
      });
    }
    console.log('checkboxOptions',checkboxOptions);
    
    that.data.product.Item_OptionS.forEach(x => {
      x.m_Option_Chiles.forEach(y => {
        y.bCheck = false;
      })
    })
    that.data.tmpOptions = checkboxOptions;

    var tmpPrice = 0;
    checkboxOptions.forEach(x => {
      var TypeNum = parseInt(x/10000);
      var OptionNum = (x%10000)/100;
      // console.log('Foreach x: ', x);
      // console.log('Foreach TypeNum: ', TypeNum);
      // console.log('Foreach OptionNum: ', OptionNum);
      that.data.product.Item_OptionS[TypeNum].m_Option_Chiles[OptionNum].bCheck = true;
    });

    that.setData({
      product: that.data.product,
      tmpOptions: that.data.tmpOptions,
      tmpDefaultOption: that.data.tmpDefaultOption,
      tmpSeatOption: that.data.tmpSeatOption,
      tmpBackPillowOption: that.data.tmpBackPillowOption,
      tmpThrowPillowOption: that.data.tmpThrowPillowOption,
      tmpOtherOption: that.data.tmpOtherOption,
      tmpArmStyleOption: that.data.tmpArmStyleOption,
      tmpLegOption: that.data.tmpLegOption,
      tmpFrameOption: that.data.tmpFrameOption,
      tmpBackStyleOption: that.data.tmpBackStyleOption,
      tmpOverallDepthOption: that.data.tmpOverallDepthOption,
      tmpEdgeOption: that.data.tmpEdgeOption,
      tmpNailOption: that.data.tmpNailOption,
      tmpOptionsOption: that.data.tmpOptionsOption,
      tmpSelfDeckingOption: that.data.tmpSelfDeckingOption,
      tmpCushionOption: that.data.tmpCushionOption,
      tmpButtonedOption: that.data.tmpButtonedOption,
      tmpBackPillowBespokeOption: that.data.tmpBackPillowBespokeOption,
      tmpSwivelBaseOption: that.data.tmpSwivelBaseOption,
      tmpLegBaseOption: that.data.tmpLegBaseOption,
      tmpFillOption: that.data.tmpFillOption,
      tmpDecorativeOption: that.data.tmpDecorativeOption,
    });

    this.OptionPriceCheck();
    this.GetFullPrice();
  },

  onFinishTextureBtn: function (e) {
    var that = this;

    that.data.FinishIndex = that.data.product.nFinishIndex;
    that.data.FinishChileIndex = that.data.product.Item_Finishes[that.data.FinishIndex].nChileSelect;

    var tmpbool = true
    if(that.data.bFinishBtn) tmpbool = false;
    
    this.setData({
      FinishIndex: that.data.FinishIndex,
      FinishChileIndex: that.data.FinishChileIndex,
      bFinishBtn: tmpbool,
    })
  },

  onFinish2TextureBtn: function (e) {
    var that = this;

    that.data.Finish2Index = that.data.product.nFinish2Index;
    that.data.Finish2ChileIndex = that.data.product.Item_Finishes2[that.data.Finish2Index].nChileSelect;

    var tmpbool = true
    if(that.data.bFinish2Btn) tmpbool = false;

    this.setData({
      Finish2Index: that.data.Finish2Index,
      Finish2ChileIndex: that.data.Finish2ChileIndex,
      bFinish2Btn: tmpbool,
    })
  },

  onStyleChangeBtn: function (e) {
    var that = this;

    that.data.StyleIndex = that.data.product.nStyleIndex;
    that.data.Style_No_Index = that.data.product.Item_StyleS[that.data.StyleIndex].Style_No_Index;
    that.data.StyleChileIndex = that.data.product.Item_StyleS[that.data.StyleIndex].Item_Style_NoS[that.data.Style_No_Index].nChileSelect;

    var tmpbool = true
    if(that.data.bStyleBtn == true) tmpbool = false;

    this.setData({
      StyleIndex: that.data.StyleIndex,
      Style_No_Index: that.data.Style_No_Index,
      StyleChileIndex: that.data.StyleChileIndex,
      bStyleBtn: tmpbool,
    })
  },

  FinishChange: function (e) {
    this.setData({
      FinishIndex: e.detail.value,
      FinishChileIndex: 0,
    })
  },
  FinishChileChange: function (e) {
    var that = this;
    //console.log('e',e);

    that.data.product.nFinishIndex = that.data.FinishIndex;
    that.data.product.Item_Finishes[that.data.FinishIndex].nChileSelect = e.currentTarget.dataset.index;
    
    this.setData({
      FinishPrice: Number(that.data.product.Item_Finishes[that.data.FinishIndex].pPrice),
      FinishChileIndex: e.currentTarget.dataset.index,
      product: that.data.product,
    })
    this.GetFullPrice();
    this.onFinishTextureBtn(null);
  },

  FinishPreviewImg: function(e){
    var index = product.getDataSet(e, 'index');
    //console.log('e',e);
    var that = this;

    var tmpURLS = [];
    that.data.product.Item_Finishes[that.data.FinishIndex].m_Finish_ChileS.forEach(x => {
      //console.log('x',x);
      tmpURLS.push(x.pImgURL);
    })
    //console.log('tmpURLS',tmpURLS);
    wx.previewImage({
      current: tmpURLS[index],
      urls: tmpURLS,
    })
  },

  Finish2Change: function (e) {
    this.setData({
      Finish2Index: e.detail.value,
      Finish2ChileIndex: 0,
    })
  },
  Finish2ChileChange: function (e) {
    var that = this;
    //console.log('e',e);

    that.data.product.nFinish2Index = that.data.Finish2Index;
    that.data.product.Item_Finishes2[that.data.Finish2Index].nChileSelect = e.currentTarget.dataset.index;
    
    this.setData({
      // FinishPrice: Number(that.data.product.Item_Finishes[that.dat。a.FinishIndex].pPrice),
      Finish2ChileIndex: e.currentTarget.dataset.index,
      product: that.data.product,
    })
    this.GetFullPrice();
    this.onFinish2TextureBtn(null);
  },

  Finish2PreviewImg: function(e){
    var index = product.getDataSet(e, 'index');
    //console.log('e',e);
    var that = this;

    var tmpURLS = [];
    that.data.product.Item_Finishes2[that.data.Finish2Index].m_Finish_ChileS.forEach(x => {
      //console.log('x',x);
      tmpURLS.push(x.pImgURL);
    })
    //console.log('tmpURLS',tmpURLS);
    wx.previewImage({
      current: tmpURLS[index],
      urls: tmpURLS,
    })
  },

  StyleChange: function(e) {
    //console.log('e',e);
    this.setData({
      StyleIndex: e.detail.value,
      Style_No_Index: 0,
      StyleChileIndex: 0,
    })
  },
  bindPickerChange_style: function (e) {
    //console.log('e',e);
    this.setData({
      Style_No_Index: e.detail.value,
      StyleChileIndex: 0,
    })
  },
  StyleChileChange: function (e) {
    // console.log('e',e);
    var that = this;

    that.data.product.nStyleIndex = that.data.StyleIndex;
    that.data.product.Item_StyleS[that.data.StyleIndex].Style_No_Index = that.data.Style_No_Index;
    that.data.product.Item_StyleS[that.data.StyleIndex].Item_Style_NoS[that.data.Style_No_Index].nChileSelect = e.currentTarget.dataset.index;

    for (var i = 0; i<that.data.product.m_PillowS.length; i++) {
      if(!that.data.product.m_PillowS[i].bCustomized)
      {
        that.data.product.m_PillowS[i].nFLIndex = that.data.StyleIndex;
        that.data.product.m_PillowS[i].nFLTypeNo = that.data.Style_No_Index;
        that.data.product.m_PillowS[i].nFLChileNo = e.currentTarget.dataset.index;
        that.data.product.m_PillowS[i].pFLNo = that.data.product.Item_StyleS[that.data.StyleIndex].Item_Style_NoS[that.data.Style_No_Index].m_StyleChileS[that.data.StyleChileIndex].pStyleChileName;
      }
    }

    var nStylePrice = Number(that.data.product.Item_StyleS[that.data.StyleIndex].Item_Style_NoS[that.data.Style_No_Index].fPrice);

    this.setData({
      ProductPrice: nStylePrice,
      StyleChileIndex: e.currentTarget.dataset.index,
      product: that.data.product,
    })
    this.GetFullPrice();
    this.onStyleChangeBtn(null);
  },

  StylePreviewImg: function(e){
    var index = product.getDataSet(e, 'index');
    //console.log('e',e);
    var that = this;

    var tmpURLS = [];
    that.data.product.Item_StyleS[that.data.StyleIndex].Item_Style_NoS[that.data.Style_No_Index].m_StyleChileS.forEach(x => {
      //console.log('x',x);
      tmpURLS.push(x.pImgURL);
    })
    //console.log('tmpURLS',tmpURLS);
    wx.previewImage({
      current: tmpURLS[index],
      urls: tmpURLS,
    })
  },

  onPillowChange: function (e) {
    var that = this;

    var tmpbool = true
    if(that.data.bPillowBtn == true) tmpbool = false;

    this.setData({
      bPillowBtn: tmpbool,
    })
  },
  onPillowFLBack: function (e) {
    var that = this;

    var tmpbool = true
    if(that.data.bFLShow == true) tmpbool = false;

    this.setData({
      bFLShow: tmpbool,
      tmpPillowIndex: 0,
      tmpPillowTypeNo: 0,
      tmpPillowChileNo: 0,
    })
  },
  onPillowFLBtn: function (e) {
    var that = this;
    //console.log('e',e);
    var nowPillowNo = e.currentTarget.dataset.pillowno;
    
    var tmpbool = true
    if(that.data.bFLShow == true) tmpbool = false;

    this.setData({
      bFLShow: tmpbool,
      nowPillowNo: nowPillowNo,
      tmpPillowIndex: that.data.product.m_PillowS[nowPillowNo].nFLIndex,
      tmpPillowTypeNo: that.data.product.m_PillowS[nowPillowNo].nFLTypeNo,
      tmpPillowChileNo: that.data.product.m_PillowS[nowPillowNo].nFLChileNo,
    })
  },
  PillowFLChange: function(e) {
    //console.log('e',e);



    this.setData({
      tmpPillowIndex: e.detail.value,
      tmpPillowTypeNo: 0,
    })
  },
  bindPickerChange_PillowFL: function (e) {
    //console.log('e',e);
    this.setData({
      tmpPillowTypeNo: e.detail.value,
    })
  },
  PillowFLPreviewImg: function(e){
    var index = product.getDataSet(e, 'index');
    //console.log('e',e);
    var that = this;

    var tmpURLS = [];
    var tmpPillow = that.data.product.m_PillowS[that.data.nowPillowNo];
    that.data.product.Item_StyleS[tmpPillow.nFLIndex].Item_Style_NoS[tmpPillow.nFLTypeNo].m_StyleChileS.forEach(x => {
      //console.log('x',x);
      tmpURLS.push(x.pImgURL);
    })
    //console.log('tmpURLS',tmpURLS);
    wx.previewImage({
      current: tmpURLS[index],
      urls: tmpURLS,
    })
  },
  onPillowFLChangeBtn: function (e) {
    var that = this;

    that.data.product.m_PillowS[that.data.nowPillowNo].nFLIndex = that.data.tmpPillowIndex;
    that.data.product.m_PillowS[that.data.nowPillowNo].nFLTypeNo = that.data.tmpPillowTypeNo;
    that.data.product.m_PillowS[that.data.nowPillowNo].nFLChileNo = e.currentTarget.dataset.index;
    that.data.product.m_PillowS[that.data.nowPillowNo].pFLNo = that.data.product.Item_StyleS[that.data.tmpPillowIndex].Item_Style_NoS[that.data.tmpPillowTypeNo].m_StyleChileS[e.currentTarget.dataset.index].pStyleChileName;
    that.data.product.m_PillowS[that.data.nowPillowNo].bCustomized = true;

    var tmpbool = true
    if(that.data.bFLShow == true) tmpbool = false;

    this.setData({
      bFLShow: tmpbool,
      product: that.data.product,
    })
    
    this.PillowPriceSet();
    this.GetFullPrice();
  },
  onPillowFLReBtn: function (e) {
    var that = this;

    that.data.product.m_PillowS[that.data.nowPillowNo].nFLIndex = that.data.StyleIndex;
    that.data.product.m_PillowS[that.data.nowPillowNo].nFLTypeNo = that.data.Style_No_Index;
    var tmpChileNo = that.data.product.Item_StyleS[that.data.StyleIndex].Item_Style_NoS[that.data.Style_No_Index].nChileSelect;
    that.data.product.m_PillowS[that.data.nowPillowNo].nFLChileNo = tmpChileNo;
    that.data.product.m_PillowS[that.data.nowPillowNo].pFLNo = that.data.product.Item_StyleS[that.data.StyleIndex].Item_Style_NoS[that.data.Style_No_Index].m_StyleChileS[tmpChileNo].pStyleChileName;
    that.data.product.m_PillowS[that.data.nowPillowNo].bCustomized = false;

    var tmpbool = true
    if(that.data.bFLShow == true) tmpbool = false;

    this.setData({
      bFLShow: tmpbool,
      product: that.data.product,
    })
    
    this.PillowPriceSet();
    this.GetFullPrice();
  },
  PillowPriceSet: function () {
    var that = this;
    var tmpPillowPrice = 0;

    if(that.data.product.m_PillowS.length > 0){
      var nowStyleLevelStr = that.data.product.Item_StyleS[that.data.StyleIndex].Item_Style_NoS[that.data.Style_No_Index].pLevel;
      var nowStyleLevelNumber = this.LevelSet(nowStyleLevelStr);
      
      that.data.product.m_PillowS.forEach(x => {
        //console.log('x',x);
        var PillowLevelStr = that.data.product.Item_StyleS[x.nFLIndex].Item_Style_NoS[x.nFLTypeNo].pLevel;
        var PillowLevelNumber = this.LevelSet(PillowLevelStr);
        
        if(PillowLevelNumber > nowStyleLevelNumber)
        {
          var CutLevel = (PillowLevelNumber - nowStyleLevelNumber);
          var DiffLevel = parseInt(CutLevel / 5) + (((CutLevel % 5) > 0)? 1 : 0);
          tmpPillowPrice += parseInt(3600 * DiffLevel);
        }
      })
    }

    this.setData({
      PillowAddPrice: tmpPillowPrice,
    })
  },
  LevelSet: function (e) {
    switch(e){
      case 'A':
        return 14;
      case 'B':
        return 19;
      case 'C':
        return 23;
      case 'D':
        return 27;
      case 'E':
        return 31;
      case 'F':
        return 36;
      case 'G':
        return 40;
      case 'H':
        return 44;
      case 'I':
        return 48;
      case 'J':
        return 53;
      case 'K':
        return 57;
      case 'L':
        return 61;
      case 'M':
        return 65;
      case 'N':
        return 70;
      default:
        return parseInt(e);
    }
  },

  GetFullPrice: function () {
    var that = this;

    console.log('StylePrice',that.data.ProductPrice);
    console.log('FinishPrice',that.data.FinishPrice);
    console.log('OptionSPrice',that.data.OptionSPrice);
    console.log('PillowAddPrice',that.data.PillowAddPrice);

    var FullPrice = parseInt(that.data.ProductPrice) + parseInt(that.data.FinishPrice) + parseInt(that.data.OptionSPrice) + parseInt(that.data.PillowAddPrice);

    that.data.product.List_Price = FullPrice;
    that.data.FullPrice = FullPrice;

    this.setData({
      FullPrice: that.data.FullPrice,
      product: that.data.product,
    })

    console.log('product',that.data.product);
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
  
  onSearching: function () {
    this.setData({
      searching:true
    })
  },

  onInventory: function () {
    var that = this;

    var tmpbool = true
    if(that.data.bInventory == true) tmpbool = false;

    this.setData({
      bInventory: tmpbool,
    })
  },
  InventoryChange: function(e) {
    console.log('e',e);

    this.setData({
      InventoryIndex: e.detail.value,
    })
  },
  AddInventory: function (x) {
    //console.log('x', x);
    var aStoreProduct = x.currentTarget.dataset.storeproduct;
    console.log('aStoreProduct', aStoreProduct);
    var tempObj = {},
      keys = ['CartIndex','Item_No', 'Item_No_Prefix', 'Product_Name', 'Brand_Category', 'List_Price', 'fImageUrl','Level','StyleNo','FinishTexture','Finish2Texture','StyleTexture','OptionS','pShippingPrice','pDesignPrice','pSale','pShippingSale','pDesignSale','FinishTypeName','FinishName','Finish2Name','StyleTypeName','StyleNoName','bShip','bDesign','SetSize','PillowS','InventoryData','InventoryWood','InventoryFL','InventoryLimit'];

    //console.log('this.data.product', this.data.product);
    keys.forEach(e => {
        if(e == 'CartIndex')
        {
          tempObj[e] = this.data.CartIndex;
        }
        else if(e == 'fImageUrl')
        {
          if(this.data.bImage)
          {
            tempObj[e] = this.data.product.tfgImage[this.data.ImageIndex].fImageUrl;
          }
          else
          {
            tempObj[e] = this.data.product.tfgImage[0].fImageUrl;
          }
        }
        else if(e == 'Level')
        {
          tempObj[e] = '';
        }
        else if(e == 'FinishTypeName')
        {
          tempObj[e] = '';
        }
        else if(e == 'FinishName')
        {
          tempObj[e] = '';
        }
        else if(e == 'Finish2Name')
        {
          tempObj[e] = aStoreProduct.pMetal;
        }
        else if(e == 'StyleTypeName')
        {
          tempObj[e] = '';
        }
        else if(e == 'StyleNoName')
        {
          tempObj[e] = '';
        }
        else if(e == 'FinishTexture')
        {
          tempObj[e] = '';
        }
        else if(e == 'Finish2Texture')
        {
          tempObj[e] = '';
        }
        else if(e == 'StyleTexture')
        {
          tempObj[e] = '';
        }
        else if(e == 'OptionS')
        {
          tempObj[e] = '';
        }
        else if(e == 'SetSize')
        {
          tempObj[e] = '';
        }
        else if (e == 'PillowS')
        {
          tempObj[e] = '';
        }
        else if(e == 'pShippingPrice')
        {
          tempObj[e] = 0;
        }
        else if(e == 'pDesignPrice')
        {
          tempObj[e] = Number(aStoreProduct.nDesign_Price);
        }
        else if(e == 'List_Price')
        {
          tempObj[e] = ToRound(Number(aStoreProduct.nBase_Price) * (1 + this.data.product.PriceListRate) * this.data.product.Rate);
        }
        else if (e == 'InventoryData')
        {
          tempObj[e] = aStoreProduct.nSerialNum;
        }
        else if (e == 'InventoryWood')
        {
          tempObj[e] = aStoreProduct.pWood;
        }
        else if (e == 'InventoryFL')
        {
          if (aStoreProduct.pFabric != '')
          {
            tempObj[e] = aStoreProduct.pFabric;
          }
          else if (aStoreProduct.pLeather != '')
          {
            tempObj[e] = aStoreProduct.pLeather;
          }
          else
          {
            tempObj[e] = '';
          }
        }
        else if (e == 'InventoryLimit')
        {
          tempObj[e] = aStoreProduct.pOrder_Qty;
        }
        else
        {
          tempObj[e] = this.data.product[e];
        }
    });
    // for (var key in keys) {
        
    // }
    console.log('tempObj', tempObj);
    cart.add(tempObj, this.data.productCounts);
  },

  onCancle: function () {
    this.setData({
      searching:false
    })
  },
})