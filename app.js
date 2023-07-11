//app.js
import {
  Config
} from 'utils/config.js';
import locales from './utils/locales'
import T from './utils/lang'

T.registerLocale(locales);
T.setLocaleByIndex(T.CheckLanguage());
wx.T = T;

App({
  onLaunch: function() {
    var that = this;
    wx.hideTabBar({
    })
    var langIndexTmp = wx.getStorageSync('langIndex');
    if(langIndexTmp=='') {
      wx.getSystemInfo({
        success: function(res) {
          console.log(res.language) //zh_TW,zh_CN
        }
      })
    }
    else
    { 
      that.globalData.langIndex = langIndexTmp
    }
    this.setLanguage();

    this.toLogin()
    // var token = new Token();
    // token.verify();
  },
  toLogin: function(){
    var that = this;
    // var info = wx.getAccountInfoSync();
    var appversion = "0";
    console.log("版本号")
    console.log("config_appver",Config.AppVer);
    appversion=Config.AppVer;
    console.log('appversion',appversion)
    
    return new Promise((resolve,reject)=>{
      if(that.globalData.nUserID){
        resolve()
      }else{
        wx.login({
          success(res) {
            if (res.code) {
              //console.log('res.code',res.code)

              // 发送登陆请求
              wx.request({
                url: Config.restUrl + 'UsrLogin/QueryUsrInfo',
                method: 'POST',
                data: {
                  json_code: res.code,
                  version: appversion,
                },
                header: {
                  'content-type': 'application/json'
                },
                success(res) {
                  //console.log('res',res);
                  
                  if(res.data.Msg == 1003)
                  {
                    wx.showModal({
                      showCancel: false,
                      content: that.globalData.language.common_newversion,
                      success (res) {
                        wx.navigateBack({
                          delta: 0
                        })
                      },
                    })
                  }

                  if (res.data.Code == 1001) {// 如果该用户的微信没有绑定账号密码，调到登陆页面绑定账号密码
                    that.globalData.openid = res.data.Data.openid;
                    wx.redirectTo({
                      url: '../signIn/signIn'
                    })
                  } else {// 如果该用户的微信绑定了账号密码，获取该账号的信息
                    //console.log('=======apps.js====', res.data);

                    //console.log('=======apps.js', res.data.Data[0]);
                    var gbd = res.data.Data[0];
                    that.globalData.nUserID = gbd.nUserID.toString();
                    that.globalData.pUserAccount = gbd.pUserAccount;
                    that.globalData.pUserName = gbd.pUserName;
                    that.globalData.openid = gbd.openid;
                    that.globalData.session_key = gbd.session_key;
                    that.globalData.FunctionAuth = Number(gbd.FunctionAuth);
                    that.globalData.StoreAuth = Number(gbd.StoreAuth);
                    that.globalData.BrandGroupS = gbd.BrandGroupS;//品牌数组
                    //that.globalData.OrderInfo = gdb.OrderInfoS;//訂單說明文
                    that.globalData.appversion = appversion;
                    that.globalData.StoreInfoS = gbd.StoreInfoS;
                    that.globalData.SelectStoreID = gbd.pSelectStore;
                   resolve()
                  }
                },

              })
            } else {
              console.log('登入失敗！' + res.errMsg)
              reject()
            }
          }
        })
      }
    })
  },
  onShow: function() {
  },
  setLanguage() {
    var that = this;
    that.globalData.language= wx.T.getLanguage();
    wx.T.setNavigationBarTitle();
  },
  //全局变量
  globalData: {
    language: '',
    languages: ['繁體中文', '简体中文'],
    langIndex: 0,
    sales: '',
    cartIndex: -1
  }
})