import {
  Base
} from '../utils/base.js';
class ProductModel extends Base {
  
  search(fUsrID, fValue,ShowPage,callback) {
    var param = {
      url: 'WxFgQuery/FgQueryList',
      type: 'post',
      data: {
        fUsrID: fUsrID,
        fValue: fValue,
        ShowPage: ShowPage
      },
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
}

export {
  ProductModel
}