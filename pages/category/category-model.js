/**
 */
import { Base } from '../../utils/base.js';
const app = getApp();

class Category extends Base {
  constructor() {
    super();
  }

  /*获得所有分类*/
  getCategoryType() {
    var a = [];
    for (let i = 0; i < app.globalData.BrandGroupS.length; i++) {
      a.push({
              "pBrandName": app.globalData.BrandGroupS[i].pBrandName,
              "pBrand": app.globalData.BrandGroupS[i].pBrand,
      });
    }
      return a;
  }
  /*获得某种分类的组别及产品分类*/
  getProductsByCategory(pBrand, callback) {
    var param = {
      url: 'CateType/QueryGroupTypeHeadList',
      data:{'pBrand':pBrand},
      type:'post',
      sCallback: function (data) {
        console.log('sCallback')
        console.log(data);
        
        if(typeof (app.globalData.BrandSectionS) == "undefined")
        {
          var a = [];
          a[pBrand] = data.Data;
          app.globalData.BrandSectionS = a;
        }
        else
        {
          app.globalData.BrandSectionS[pBrand] = data.Data;
        }

        callback && callback(data);
      }
    };
    console.log(param);
    this.request(param);
  }
}

export { Category };