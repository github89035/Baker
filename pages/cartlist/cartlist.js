import {
    CartList
  } from 'cartlist-model.js';

var cartList = new CartList();
const app = getApp();

Page({
    data: {
        language: app.globalData.language,
        cartArr: []
    },
    onLoad: function () {
        var that = this;
        that._loadData();

        wx.setNavigationBarTitle({
          title: that.data.language.lang_cartlist_Title,
        })
    },
    _loadData: function (callback) {
        var that = this;
        var cartData = []
        cartList.getCartListInfo((data)=>{
            if (data.Code == 1000) {
                data.Data.forEach((item)=>{
                    if(cartData[item.nCartIndex] == undefined){
                        cartData[item.nCartIndex] = []
                    }
                    cartData[item.nCartIndex].push(JSON.parse(item.pCartData))
                })
    
                cartData = cartData.map((item,index)=>{
                    return{
                        index:index,
                        data:item,
                        sum:0
                    }
                })
    
                //計算各個購物車的總額
                cartData.forEach((item)=>{
                    var sum = 0
                    item.data.forEach((arr)=>{
                        sum = sum + parseInt(arr.List_Price) + parseInt(arr.pShippingPrice)
                    })
                    item.sum = sum
                })
    
                console.log(cartData)
                
                that.setData({
                    cartArr: cartData
                })
            } else {
                wx.showToast({
                  title: '資料讀取失敗',
                  icon: 'none',
                  image: '../../imgs/icon/delPic.png',
                  duration: 2000
                })
            }
        })
        callback && callback();
    },
    GoToCart: function (event) {
      var index = event.currentTarget.dataset.index
      console.log(this.data.cartArr[index].data)
      wx.setStorageSync('cart', this.data.cartArr[index].data);
      app.globalData.cartIndex = index
      wx.switchTab({
        url: `../cart/cart`
      });
    },
    deleteCartData: function (event,callback) {
      var that = this
      var param = {}
      param.pUID = app.globalData.nUserID
      param.pIndex = event.currentTarget.dataset.index

      cartList.deleteCartListInfo(param, (data)=>{
        if (data.Code == 1000) {
            wx.showToast({
              title: '刪除成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
                ['cartArr['+(event.currentTarget.dataset.index)+']']: null
            });
        } else {
            wx.showToast({
              title: '刪除失敗',
              icon: 'none',
              image: '../../imgs/icon/delPic.png',
              duration: 2000
            })
        }
      })
      callback && callback();
    }
})