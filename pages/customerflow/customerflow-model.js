import {
  Base
} from '../../utils/base.js';

class Customerflow extends Base {
  constructor() {
    super();
  }
  /*获取列表*/
  getCustomerFlowList(param, callback) {
    var param = {
      url: 'CrmFlow/CrmFlowList',
      type: 'POST',
      data: param,
      sCallback: function(data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

  getCustomerFlowById(fCrmFlowID, callback) {
    var that = this;
    var allParams = {
      url: 'CrmFlow/CrmFlowDesc',
      type: 'post',
      data: {
        fCrmFlowID: fCrmFlowID
      },
      sCallback: function(data) {
        callback && callback(data);
      },
      eCallback: function() {}
    };
    this.request(allParams);
  }
  
  uploadPicData(params, callback){
    var that = this;
    var allParams = {
      url: 'CrmFlow/CrmFlowProcess',
      type: 'post',
      data: params,
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () { }
    };
    console.log(allParams);
    this.request(allParams);
  }

  saveCartData(params, callback){
    var that = this;
    var allParams = {
      url: 'CrmFlow/SaveCartData',
      type: 'post',
      data: params,
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () { }
    };
    console.log(allParams);
    this.request(allParams);
  }

  loadCartData(params, callback){
    var that = this;
    var allParams = {
      url: 'CrmFlow/LoadCartData',
      type: 'post',
      data: params,
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () { }
    };
    console.log(allParams);
    this.request(allParams);
  }
}
export {
  Customerflow
};