//app.js
import {
  Config
} from '../../utils/config.js';
const md5 = require('../../utils/md5.js');
const app = getApp();

Page({
  data: {
    username: '',
    password: ''
  },

  onLoad: function () {
    if (app.globalData.wxwxCode) {}
  },
  onShow: function () {
    wx.hideHomeButton({
      success: function () {
        console.log('success')
      },
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        console.log('complete')
      }
    })
  },
  // 获取输入账号 
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
    // console.log('username:' + this.data.username);
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      //password: md5.hexMD5('lacquer' + md5.hexMD5(e.detail.value) + 'craft')
      password: e.detail.value
    })
    // console.log('password:' + this.data.password);
  },

  // 登录 
  login: function () {
    var that = this;
    if (that.data.username.length == 0 || that.data.password.length == 0) {
      wx.showToast({
        title: '用戶名和密碼不能為空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.login({
        success(res) {
          if (res.code) {
            console.log('that.globalData.openid',app.globalData.openid)
            console.log('that.data.username',that.data.username)
            console.log('that.data.password',that.data.password)

            wx.request({
              url: Config.restUrl + 'UsrInfo/CheckUsrInfo',
              method: 'POST',
              data: {
                fOpenID: app.globalData.openid,
                fUsrNo: that.data.username,
                fPassWord: that.data.password,
              },
              success(res) {
                console.log('resres======', res);
                // if code = 1000 
                if (res.data.Code == 1000){
                  console.log('===== Wait Login... =====')
                  var gbd = res.data.Data[0];

                  app.globalData.nUserID = gbd.nUserID.toString();
                  app.globalData.pUserAccount = gbd.pUserAccount;
                  app.globalData.pUserName = gbd.pUserName;
                  app.globalData.FunctionAuth = Number(gbd.FunctionAuth);
                  app.globalData.StoreAuth = Number(gbd.StoreAuth);
                  app.globalData.BrandGroupS = gbd.BrandGroupS;//品牌数组
                  app.globalData.appversion = Config.AppVer;
                  app.globalData.StoreInfoS = gbd.StoreInfoS;
                  app.globalData.SelectStoreID = gbd.pSelectStore;

                  // that.globalData.fUsrID = gbd.fUsrID;
                  // app.globalData.nUserID = gbd.fUsrID.toString();
                  // app.globalData.fUsrNo = gbd.fUsrNo;
                  // app.globalData.fUsrName = gbd.fUsrName;
                  // app.globalData.openid = gbd.openid;
                  // app.globalData.session_key = gbd.session_key;
                  // app.globalData.fZYFlag = gbd.fZYFlag;
                  // app.globalData.tfgBrandGroup = gbd.tfgBrandGroup;
                  // app.globalData.tusrOrg = gbd.tusrOrg;
                  // app.globalData.tusrRole = gbd.tusrRole[0]
                  wx.showToast({
                    title: '登入成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                      // console.log('haha');
                      setTimeout(function () {
                        //要延时执行的代码
                        wx.switchTab({
                          url: '../home/home'
                        })
                      }, 500)
                    }
                  })
                } else {
                  wx.showToast({
                    title: '密碼錯誤',
                    icon: 'none',
                    image: '../../imgs/icon/delPic.png',
                    duration: 2000
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '請檢查網路狀況',
              icon: 'error',
              duration: 2000
            })
          }
        }
      })
    }
  }
})