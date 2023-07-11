import {
  KeywordModel
} from '../../models/keyword.js';
import {
  ProductModel
} from '../../models/product.js';

const keywordModel = new KeywordModel()
const productModel = new ProductModel()
const app = getApp()


// components/search/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    historyWords:[],
    searching:false,
    language: app.globalData.language,
    langIndex: app.globalData.langIndex,
  },
  attached() {
    this.setData({
      historyWords: keywordModel.getHistory(),
      language: app.globalData.language,
      langIndex: app.globalData.langIndex,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onCancel: function (event) {
      console.log('onCancel===')
      this.triggerEvent('cancle', {}, {})
    },
    onDelete:function (event){
      console.log('onDelete===')
      this.setData({
        historyWords: keywordModel.getHistory(),
        'q':'',
        searching:false
      })
    },
    onConfirm: function (event) {
      this.setData({
        searching:true
      })
      const q = event.detail.value||event.detail.text;
      keywordModel.addToHistory(q);
      console.log('event', event);
      console.log('-------------q-------------', q);
      productModel.search("1",q,"1",(data) => {
        console.log(data)
        this.setData({
          showProducts:true,
          productsArr:data.Data
        })
      })
    },
    onProductsItemTap: function (event) {
      console.log(event)
      // var fFgID = event.currentTarget.dataset.ffgid;
      // wx.navigateTo({
      //   url: '../product/product?fFgID=' + fFgID,
      // })

      var Item_No = event.currentTarget.dataset.ffgid;
      var Item_No_Prefix = event.currentTarget.dataset.ffgno;
      var pProductCategoryName = event.currentTarget.dataset.ffgname;
      var btypelist = event.currentTarget.dataset.btypelist;
      console.log('Item_No_Prefix');
      console.log(Item_No_Prefix);
      console.log(pProductCategoryName);
      if(btypelist == "true")
      {
        wx.navigateTo({
          url: '../productstypelist/productstypelist?Item_No=' + Item_No + '&Item_No_Prefix=' + Item_No_Prefix + '&pProductCategoryName=' + pProductCategoryName,
        })
      }
      else
      {
        wx.navigateTo({
          url: '../product/product?Item_No=' + Item_No + '&Item_No_Prefix=' + Item_No_Prefix + '&pProductCategoryName=' + pProductCategoryName,
        })
      }
    },
  }
})