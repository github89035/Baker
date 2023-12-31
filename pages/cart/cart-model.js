/**
 * Created by jimmy on 17/03/05.
 */
import { Base } from '../../utils/base.js';

/*
* 购物车数据存放在本地，
* 当用户选中某些商品下单购买时，会从缓存中删除该数据，更新缓存
* 当用用户全部购买时，直接删除整个缓存
*
*/
class Cart extends Base {
  constructor() {
    super();
    this._storageKeyName = 'cart';
  };

  /*
  * 获取购物车
  * param
  * flag - {bool} 是否过滤掉不下单的商品
  */
  getCartDataFromLocal(flag) {
     var res = wx.getStorageSync(this._storageKeyName);
    if (!res) {
      res = [];
    }
    //在下单的时候过滤不下单的商品，
    if (flag) {
      var newRes = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].selectStatus) {
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }

    return res;
  };

  /*
  *获得购物车商品总数目,包括分类和不分类
  * param:
  * flag - {bool} 是否区分选中和不选中
  * return
  * counts1 - {int} 不分类
  * counts2 -{int} 分类
  */
  getCartTotalCounts(flag) {
    var data = this.getCartDataFromLocal(),
      counts1 = 0,
      counts2 = 0;
    for (let i = 0; i < data.length; i++) {
      if (flag) {
        if (data[i].selectStatus) {
          counts1 += data[i].counts;
          counts2++;
        }
      } else {
        counts1 += data[i].counts;
        counts2++;
      }
    }
    return {
      counts1: counts1,
      counts2: counts2
    };
  };

  /*本地缓存 保存／更新*/
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
  };


  /*
  * 加入到购物车
  * 如果之前没有样的商品，则直接添加一条新的记录， 数量为 counts
  * 如果有，则只将相应数量 + counts
  * @params:
  * item - {obj} 商品对象,
  * counts - {int} 商品数目,
  * */
  add(item, counts) {
    var cartData = this.getCartDataFromLocal();
    if (!cartData) {
      cartData = [];
    }
    
    if (item.CartIndex == -1) { //新商品
      item.CartIndex = Number(cartData.length);
      item.counts = counts;
      item.selectStatus = true;  //默认在购物车中为选中状态
      cartData.push(item);
    }
    else { //已有商品
      var isHadInfo = this._isHasThatOne(item.Item_No_Prefix, item.Product_Name, item.StyleNo, item.FinishTexture, item.StyleTexture, item.OptionS, item.SetSize, item.PillowS, item.InventoryData, cartData);
      
      if (isHadInfo.index == -1)
      {
        item.counts = counts;
        item.selectStatus = true;
        cartData[item.CartIndex] = item;
      }
      else
      {
        cartData[item.CartIndex].counts += counts;
      }
    }

    this.execSetStorageSync(cartData);  //更新本地缓存
    return cartData;
  };

  /*
  * 修改商品数目
  * params:
  * id - {int} 商品id
  * counts -{int} 数目
  * */
  _changeCounts(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData, counts) {
    var cartData = this.getCartDataFromLocal(),
      hasInfo = this._isHasThatOne(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData, cartData);
    // console.log('cartData');
    // console.log(cartData);

    // console.log('hasInfo')
    // console.log(hasInfo)

    //购物车存在该商品，数量增加
    if (hasInfo.index != -1) {
      if (hasInfo.data.counts >= 1) {
        cartData[hasInfo.index].counts += counts;
      }
    }
    this.execSetStorageSync(cartData);  //更新本地缓存
  };

  /*
  * 增加商品数目
  * */
  addCounts(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData) {
    this._changeCounts(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData, 1);
  };

  /*
  * 购物车减
  * */
  cutCounts(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData) {
    this._changeCounts(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData, -1);
  };

  /*购物车中是否已经存在该商品*/
  _isHasThatOne(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData, arr) {
    var item,
      result = { index: -1 };
    for (let i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item.Item_No_Prefix == Item_No_Prefix && item.Product_Name == Product_Name && item.StyleNo == StyleNo && item.FinishTexture == FinishTexture && item.StyleTexture == StyleTexture && item.OptionS == OptionS && item.SetSize == SetSize && item.PillowS == PillowS && item.InventoryData == InventoryData) {
        result = {
          index: i,
          data: item
        };
        console.log('result', result);
        break;
      }
    }
    return result;
  }

  /*
  * 删除某些商品
  */
  delete(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData) {
    // if (!(ids instanceof Array)) {
    //   ids = [ids];
    // }
    var cartData = this.getCartDataFromLocal();
    // console.log('ids'); console.log(ids);
    // console.log('cartData'); console.log(cartData);

    //for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(Item_No_Prefix, Product_Name, StyleNo, FinishTexture, StyleTexture, OptionS, SetSize, PillowS, InventoryData, cartData);

      // console.log('======');
      // console.log(Item_No);
      // console.log(cartData);
      // console.log('hasInfo');
      // console.log(hasInfo);

      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);  //删除数组某一项
      }

      //每個商品的CartIndex從0開始編
      cartData.forEach((item,index) => {
        item.CartIndex = index
      });
    //}
    this.execSetStorageSync(cartData);
  }

  SetCartData(TmpData)
  {
    console.log('TmpData',TmpData);
    // var cartData = this.getCartDataFromLocal();
    // for(var i = 0;i < cartData.length;i++)
    // {
    //   cartData.splice(i, 1);
    // }
    //this.execSetStorageSync(cartData);
    this.execSetStorageSync(TmpData);
  }

  doCart(param, callback){
    var allParams = {
      url: 'CartList/SaveCartData',
      type: 'post',
      header:{
        "content-type": "application/json"
      },
      data:param,
      sCallback: function (data) {
        console.log(data);
        // that.execSetStorageSync(true);
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    console.log('allParams',allParams);
    this.request(allParams);
  }
}

export { Cart };