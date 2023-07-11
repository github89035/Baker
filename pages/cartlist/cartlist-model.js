import {
    Base
  } from '../../utils/base.js';

const app = getApp();
class CartList extends Base {
  constructor() {
    super();
  }
  /*获取該用戶的購物車資料*/
  getCartListInfo(callback) {
    var param = {
      url: 'CartList/GetCartList',
      type: 'POST',
      data: {
        pUID: app.globalData.nUserID
      },
      sCallback: function (data) {
        console.log('data:', data)
        callback && callback(data);
      }
    };
    this.request(param);
  }

  /*获取該用戶的購物車資料*/
  deleteCartListInfo(param, callback) {
    var allParams = {
      url: 'CartList/DeleteCartData',
      type: 'POST',
      data:param,
      sCallback: function (data) {
        console.log('data:', data)
        callback && callback(data);
      }
    };
    this.request(allParams);
  }
}
export {
  CartList
};