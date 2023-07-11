/**
 */
import { Base } from '../../utils/base.js';
const app = getApp();

class Categorybody extends Base {
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
  getProductsByCategory(pBrand,pSection, callback) {
    var param = {
      url: 'CateType/QueryGroupTypeBodyList',
      data:{'pBrand':pBrand,'pSection':pSection},
      type:'post',
      sCallback: function (data) {
        console.log('sCallback')
        console.log(data);

        data.Data.forEach(e => {
          e.pBrand = pBrand;
          e.pSection = pSection;
        });

        if(typeof (app.globalData.SectionProductTypeS) == "undefined")
        {
          var a = [];
          var b = [];
          b[pSection] = data.Data;
          a[pBrand] = b;
          app.globalData.SectionProductTypeS = a;
        }
        else if(typeof (app.globalData.SectionProductTypeS[pBrand]) == "undefined")
        {
          var b = [];
          b[pSection] = data.Data;
          app.globalData.SectionProductTypeS[pBrand] = b;
        }
        else
        {
          app.globalData.SectionProductTypeS[pBrand][pSection] = data.Data;
        }

        callback && callback(data);
      }
    };
    console.log(param);
    this.request(param);
  }
}

export { Categorybody };