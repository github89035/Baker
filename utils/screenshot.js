import { Base } from 'base.js';
class Screenshot extends Base {
  
  constructor() {
    super();
  }

  savescreenshot(fUsrID,fFormName,fDesc, callback) {
    // var time = new Date().Format("yyyy-MM-dd HH:mm:ss"); 
    var now = new Date();
             var year = now.getFullYear(); //得到年份
             var month = now.getMonth();//得到月份
             var date = now.getDate();//得到日期
             var hour = now.getHours();//得到小时
             var minu = now.getMinutes();//得到分钟
             var sec = now.getSeconds();//得到秒
    var allparams = {
      url: 'WxAction/ActionProcess',
      type: 'POST',
      data: {
        fUsrID:fUsrID,
        fAction:'screenshot',
        fCDate:year+'-'+month+'-'+date+' '+hour+':'+minu+':'+sec,
        fFormName:fFormName,
        fDesc:fDesc
      },
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    console.log(allparams);
    this.request(allparams);
  }
}
export { Screenshot }