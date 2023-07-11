
import { Base } from 'base.js';
import { Config } from 'config.js';

class Address extends Base {
  constructor() {
    super();
  }

  /*获得我自己的收货地址*/
  getAddress(callback) {
    var that = this;
    var param = {
      url: 'address',
      sCallback: function (res) {
        if (res) {
          res.totalDetail = that.setAddressInfo(res);
          callback && callback(res);
        }
      }
    };
    this.request(param);
  }
  /*保存地址*/
  _setUpAddress(res, callback) {
    var formData = {
      OperFlag:'A',// A  新增
      fCustomerid:'0', //客户ID
      fContactor:res.fContactor,//客户联系人
      fContacttel:res.fContacttel,//联系人电话
      fContactmobile:res.fContactmobile,//联系人手机
      fCustomername:res.fCustomername,
      fReceiptor: res.fReceiptor,//客户指定收货人
      fReceiptormobile:res.fReceiptormobile,//客户指定收货人手机
      fProvince:res.fProvince,//省
      fCity:res.fCity,//市
      fDistrict:res.fDistrict,//区
      fVillage:res.fVillage,//鎮
      fAddress:res.fAddress,//详细地址
      fCusarea:res.fCusarea,//
      fCustomertype:res.fCustomertype,//
      fSexs:res.fSexs,//性别
      fSourcetype:res.fSourcetype,//
      fDevelooper:res.fDevelooper,//开发人员
      fStartdate : res.fStartdate,
      fEnddate : res.fEnddate,
      fCustomerlevel:res.fCustomerlevel,//客户等级
      fOrgID:res.fOrgID,//门店ID
      fUsrID:res.fUsrID,//用户ID
    };
    return formData;
  }

  /*更新保存地址*/
  submitAddress(data, callback) {
    data = this._setUpAddress(data);
    var param = {
      url: 'CustProcess/CustProcess',
      type: 'post',
      data: data,
      sCallback: function (res){
        callback && callback(res);
      }, eCallback(res) {
        // callback && callback(false, res);
      }
    };
    this.request(param);
  }

  /*是否为直辖市*/
  isCenterCity(name) {
    var centerCitys = ['北京市', '天津市', '上海市', '重庆市'],
      flag = centerCitys.indexOf(name) >= 0;
    return flag;
  }

  /*
  *根据省市县信息组装地址信息
  * provinceName , province 前者为 微信选择控件返回结果，后者为查询地址时，自己服务器后台返回结果
  */
  setAddressInfo(res) {
    var province = res.provinceName || res.province,
      city = res.cityName || res.city,
      country = res.countyName || res.country,
      detail = res.detailInfo || res.detail;
    var totalDetail = city + country + detail;

    console.log(res);

    //直辖市，取出省部分
    if (!this.isCenterCity(province)) {
      totalDetail = province + totalDetail;
    };
    return totalDetail;
  }
}

export { Address }