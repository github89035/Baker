import {
  Base
} from '../../utils/base.js';

class InstallOrder extends Base {
  constructor() {
    super();
  }
  /*获取主题下的商品列表*/
  getInstallOrderList(param, callback) {
    var param = {
      url: 'OrdServerList/GetOrdSevtList',
      type: 'POST',
      data: param,
      sCallback: function(data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

  getInstallOrderInfoById(fOrdServerID, callback) {
    var that = this;
    var allParams = {
      url: 'OrdServerDesc/GetOrdServerDesc',
      type: 'post',
      data: {
        fOrdServerID: fOrdServerID
      },
      sCallback: function(data) {
        console.log('getInstallOrderInfoById',data);
        callback && callback(data);
      },
      eCallback: function() {}
    };
    console.log('allParams',allParams)
    this.request(allParams);
  }
  
  uploadPicData(params, callback){
    var that = this;
    var allParams = {
      url: 'OrdServer/OrdSevProcess',
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
  InstallOrder
};