/**
 */
import { Base } from '../../utils/base.js';
const app = getApp();

class Categoryfoot extends Base {
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
  getProductsByCategory(pBrand, pSection, pProductType, callback) {
    var param = {
      url: 'CateType/QueryGroupTypeFootList',
      data:{'pBrand':pBrand,'pSection':pSection,'pProductType':pProductType},
      type:'post',
      sCallback: function (data) {
        console.log('sCallback')
        console.log(data);

        data.Data.forEach(e => {
          e.pBrand = pBrand;
          e.pSection = pSection;
          e.pProductType = pProductType;
        });

        if(typeof (app.globalData.ProductTypeAndSubS) == "undefined")
        {
          var a = [];
          var b = [];
          var c = [];
          c[pProductType] = data.Data;
          b[pSection] = c;
          a[pBrand] = b;
          app.globalData.ProductTypeAndSubS = a;
        }
        else if(typeof (app.globalData.ProductTypeAndSubS[pBrand]) == "undefined")
        {
          var b = [];
          var c = [];
          c[pProductType] = data.Data;
          b[pSection] = c;
          app.globalData.ProductTypeAndSubS[pBrand] = b;
        }
        else if(typeof (app.globalData.ProductTypeAndSubS[pBrand][pSection]) == "undefined")
        {
          var c = [];
          c[pProductType] = data.Data;
          app.globalData.ProductTypeAndSubS[pBrand] = c;
        }
        else
        {
          app.globalData.ProductTypeAndSubS[pBrand][pSection][pProductType] = data.Data;
        }
        console.log(app.globalData.ProductTypeAndSubS);

        callback && callback(data);
      }
    };
    console.log(param);
    this.request(param);
  }
}

export { Categoryfoot };