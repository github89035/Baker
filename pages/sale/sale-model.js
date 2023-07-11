import {
    Base
  } from '../../utils/base.js';
  
  class Sale extends Base {
    constructor() {
      super();
    }
    /*获取主题下的商品列表*/
    getSaleInfo(callback) {
      var param = {
        url: 'SaleList/GetSaleList',
        type: 'GET',
        data: {},
        sCallback: function (data) {
          console.log('data:', data)
          callback && callback(data);
        }
      };
      this.request(param);
    }
  }
  export {
    Sale
  };