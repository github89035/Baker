import {
  Base
} from '../../utils/base.js';

class Case extends Base {
  constructor() {
    super();
  }
  /*获取主题下的商品列表*/
  getCaseList(callback) {
    var param = {
      url: 'DesignCase/GetDCList',
      type: 'POST',
      data: {
        ShowPage: '1',
      },
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

  getCaseDetial(fDesignCaseID,callback) {
    var param = {
      url: 'DesignCaseLine/GetDCLineList',
      type: 'POST',
      data: {fDesignCaseID:fDesignCaseID},
      sCallback: function (data) {
        callback && callback(data);
        console.log(data)
      }
    };
    console.log('param')
    console.log(param)
    this.request(param);
  }
}
export {
  Case
};