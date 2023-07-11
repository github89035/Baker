import {
  Base
} from '../../utils/base.js';

class Productstypelist extends Base {
  constructor() {
    super();
  }
  /*获取主题下的商品列表*/
  getProductsTypeList(param, callback) {
    var allparam = {
      url: 'FgTypeFg/QueryTypeFgTypeList',
      type: 'POST',
      data: param,
      sCallback: function (data){
        console.log('data:', data)
        callback && callback(data);
      }
    };
    console.log('allparam:',allparam);
    this.request(allparam);
  }
}
export {
  Productstypelist
};