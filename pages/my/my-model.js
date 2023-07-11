/**
 * 
 */
import { Base } from '../../utils/base.js'

class My extends Base {
  constructor() {
    super();
  }

  //得到用户信息
  getUserInfo(cb){
    var that = this;
    // wx.getUserInfo({
    //   success: function (res) {
    //     console.log('===getUserInfo_Success===',res)
    //   },
    //   fail: function (res) {
    //     console.log('===getUserInfo_Fail===',res)
    //     typeof cb == "function" && cb({
    //       avatarUrl: '../../imgs/icon/user@default.png',
    //       nickName: 'mini'
    //     });
    //   }
    // });
    typeof cb == "function" && cb({
      avatarUrl: '../../imgs/icon/user@default.png',
      nickName: 'mini'
    });
  }

  /*更新用户信息到服务器*/
  _updateUserInfo(res) {
    var nickName = res.nickName;
    delete res.avatarUrl;  //将昵称去除
    delete res.nickName;  //将昵称去除
    var allParams = {
      url: 'user/wx_info',
      data: { nickname: nickName, extend: JSON.stringify(res) },
      type: 'post',
      sCallback: function (data) {
      }
    };
    this.request(allParams);
  }
}
export { My }