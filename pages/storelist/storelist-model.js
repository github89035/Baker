/**
 * Created by jimmy on 17/2/26.
 */
import {
  Base
} from '../../utils/base.js';
const app = getApp();
class StoreList extends Base {
  constructor() {
    super();
  }
  /*获得所有分类*/
  getBrandList() {
    var param = {
      url: 'Org/GetOrgList',
    };
    return this.new_request(param).then(res => {
      console.log(res.Data)
      return res.Data
    })
  }
  /*获得某种分类的商品*/
  getStoreByCity(fCateNo, fCity){
    var param = {
      url: 'OrgImage/GetOrgImageList',
      data: {
        fCateNo: fCateNo,
        fCity: fCity
      },
      type: 'post',
    };
    return this.new_request(param).then(res => {
      console.log(res)
      return res
    })
  }

}

export {
  StoreList
};