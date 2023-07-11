import {
  Base
} from '../../utils/base.js';

class Order extends Base {
  constructor() {
    super();
    this._storageKeyName = 'newOrder';
  }
  /*下订单*/
  doOrder(param, callback){
    var that = this;
    var allParams = {
      url: 'OrderProcess/OrderProcess_Staff',
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

  /*
  * 拉起微信支付
  * params:
  * norderNumber - {int} 订单id
  * return：
  * callback - {obj} 回调方法 ，返回参数 可能值 0:商品缺货等原因导致订单不能支付;  1: 支付失败或者支付取消； 2:支付成功；
  * */
  execPay(orderNumber, callback) {
    var allParams = {
      url: 'pay/pre_order',
      type: 'post',
      data: { id: orderNumber },
      sCallback: function (data) {
        var timeStamp = data.timeStamp;
        if (timeStamp) { //可以支付
          wx.requestPayment({
            'timeStamp': timeStamp.toString(),
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            success: function () {
              callback && callback(2);
            },
            fail: function () {
              callback && callback(1);
            }
          });
        } else {
          callback && callback(0);
        }
      }
    };
    this.request(allParams);
  }

  /*获得所有订单,pageIndex 从1开始*/
  getOrders(param, callback) {
    var that = this;
    var allParams = {
      url: 'OrderList/GetOrderList',
      type: 'POST',
      data: param,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    console.log(allParams);
    this.request(allParams);
  }

  /*获得订单的具体内容*/
  getOrderInfoById(fOrdID, callback) {
    var that = this;
    var allParams = {
      url: 'OrderDesc/GetOrdDesc',
      type:'post',
      data:{fOrdID:fOrdID},
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    console.log(allParams);
    this.request(allParams);
  }
 
  // 收款记录
  doGathering(param, callback){
    var that = this;
    var allParams = {
      url: 'GenGather/GenPayGather',
      type: 'post',
      data:param,
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    // console.log('doGathering===',allParams);
    this.request(allParams);
  }

// 订单审核/取消/关闭 操作
  orderReview(param, callback){
    var that = this;
    var allParams = {
      url: 'OrderProcess/OrderStatu',
      type:'post',
      data:param,
      sCallback: function (data) {
        callback && callback(data);
      },
      eCallback: function () {
      }
    };
    console.log(allParams);
    this.request(allParams);
  }
  
  /*本地缓存 保存／更新*/
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
  };

  /*是否有新的订单*/
  hasNewOrder() {
    var flag = wx.getStorageSync(this._storageKeyName);
    return flag == true;
  }

}

export { Order };