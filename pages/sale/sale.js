import {
    Sale
  } from 'sale-model.js';

var sale = new Sale();
const app = getApp()

Page({
    data: {
        language: app.globalData.language,
        saleList:[
            // {name:'開幕', percent:'15', start:'2022/05/19', end:'2022/07/19', check:false},
            // {name:'促銷', percent:'15', start:'2022/05/19', end:'2022/08/19', check:false},
        ]
    },
    onLoad: function () {
        var that = this;
        wx.setNavigationBarTitle({
          title: that.data.language.lang_sale_Title,
        })

        if(app.globalData.sales==''){
            that._loadData();
        }else{
            that.setData({
                saleList:app.globalData.sales
            })
        }
    },
    _loadData: function (callback) {
        var that = this;
        sale.getSaleInfo((data)=>{
            var sales = data.Data.map((item)=>{
                return{
                    num:item.nSerialNum,
                    name:item.nSaleComment,
                    type:item.nSaleType,
                    percent:item.nSaleType == 1 ? item.nSaleValue : 0,
                    price:item.nSaleType == 2 ? item.nSaleValue : 0,
                    start:item.m_StartTime.split('T')[0],
                    end:item.m_EndTime.split('T')[0],
                    check:false
                }
            })
            that.setData({
                saleList:sales
            })
        })
        callback && callback();
    },
    checkboxChange(e) {
        var that = this
        that.setData({
            ['saleList['+e.currentTarget.dataset.listindex+'].check']: !that.data.saleList[e.currentTarget.dataset.listindex].check
        })
    },
    submit(e) {
        var that = this
        var count = 0 //已選擇幾張折價卷
        var post_value = e.detail.value
        var error = false

        that.data.saleList.forEach((item,index)=>{
            if(item.check == true){
                count++
                if(item.type == 2 && item.price == 0){
                    if (!post_value.price) {
                        error = true
                    }
                    that.setData({
                      ['saleList['+index+'].price'] : post_value.price
                    })
                }
            }
        })

        if(error){
            that.showTips('提示', '請填寫金額')
            return
        }
        if(count > 2){
            that.showTips('提示', '至多選擇2張')
            return
        }
        
        console.log(that.data.saleList)
        app.globalData.sales = that.data.saleList
        wx.navigateBack()
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
    }
})