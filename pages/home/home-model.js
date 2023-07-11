import {
  Base
} from '../../utils/base.js';

class Home extends Base {
  constructor() {
    super();
  }
  /*banner图片信息*/
  getFirstPage(fUsrID,callback) {
    var that = this;
    var param = {
      url: 'FirstPage/GetFirstPage',
      type:"POST",
      data:{fUsrID:fUsrID},
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    console.log('param',param);
    this.request(param);
  }
};

export {
  Home
};