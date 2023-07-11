import {
  Base
} from '../../utils/base.js';

class AfterSales extends Base {
  constructor() {
    super();
  }
  /*新增、修改退货单*/
  addAfterSalesOrder(data, callback) {
    var param = {
      url: 'OrdReturnProcess/OrdRetProcess',
      data: data,
      type: 'post',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    console.log('param',param);
    this.request(param);
  }
  getAfterSalesOrderList(param,callback) {
    var allparams = {
      url: 'OrdReturnList/GetOrdRetList',
      data: param,
      type: 'post',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(allparams);
  }
  getAfterSalesOrderDetial(fOrdReturnID, callback) {
    var allparams = {
      url: 'OrdReturnDesc/GetOrdDesc',
      data: {fOrdReturnID:fOrdReturnID},
      type: 'post',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    console.log(allparams);
    this.request(allparams);
  }

}
export {
  AfterSales
};