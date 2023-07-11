import {
  InstallOrder
} from 'installorder-model.js';
import {
  Screenshot
} from '../../utils/screenshot';
var screenshot = new Screenshot();
var installorder = new InstallOrder();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerList: {},
    buttonList: {},
    showpopup: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('installorder');
    var that = this;
    var flag = options.from
    if (flag == 'order') {} else {
      var fOrdServerID = options.fOrdServerID.toString();
      installorder.getInstallOrderInfoById(fOrdServerID, (data) => {
        console.log(data.Data)
        var ordServerData = data.Data;
        console.log('ordServerData.tordSevFgData', ordServerData.tordSevFgData);
        var arrTemp = ordServerData.tordSevFgData;
        let buttonList = that.data.buttonList || {}

        var fFgRemark  = [];

        for (var index in arrTemp){

          // index默认的类型是String
          var productIndex = Number(index) + 1;

          arrTemp[index].fServerImageUrlArr = arrTemp[index].fServerImageUrl.split(",");
          arrTemp[index].fServerImageUrlArr.pop();
          // 默认上传按钮不显示，添加图片后显示,下同
          buttonList['fServerImageUrl' + productIndex] = true;


          arrTemp[index].fCustOkImageUrlArr = arrTemp[index].fCustOkImageUrl.split(",");
          arrTemp[index].fCustOkImageUrlArr.pop();
          buttonList['fCustOkImageUrl' + productIndex] = true;

          arrTemp[index].fCustErrImageUrlArr = arrTemp[index].fCustErrImageUrl.split(",");
          arrTemp[index].fCustErrImageUrlArr.pop();

          buttonList['fCustErrImageUrl' + productIndex] = true;
          fFgRemark[index] = arrTemp[index].fFgRemark
        }

        console.log('fFgRemark=======',fFgRemark)

        that.setData({
          fOrdServerNo: ordServerData.fOrdServerNo,
          fCreateDate: ordServerData.fCreateDate,
          fActionCode: ordServerData.fActionCode,
          fBrandCode: ordServerData.fBrandCode,
          fBusMan: ordServerData.fBusMan,
          fCustomerSuggest: ordServerData.fCustomerSuggest,
          fDeliverNo: ordServerData.fDeliverNo,
          fDeliveryMethods: ordServerData.fDeliveryMethods,
          fForPerson: ordServerData.fForPerson,
          fForProduct: ordServerData.fForProduct,
          fIfInstaller: ordServerData.fIfInstaller,
          fInstallflag: ordServerData.fInstallflag,
          fItemCode: ordServerData.fItemCode,
          fOrdID: ordServerData.fOrdID,
          fOrdNo: ordServerData.fOrdNo,
          fOrdServerID: ordServerData.fOrdServerID,
          fOrgID: ordServerData.fOrgID,
          fPersonGroup: ordServerData.fPersonGroup,
          fPromiseDate: ordServerData.fPromiseDate,
          fReciveMan: ordServerData.fReciveMan,
          fResults: ordServerData.fResults,
          fServerAmount: ordServerData.fServerAmount,
          fServerNeed: ordServerData.fServerNeed,
          fShipAddress: ordServerData.fShipAddress,
          fShipArea: ordServerData.fShipArea,
          fShipRemark: ordServerData.fShipRemark,
          fShipmentDate: ordServerData.fShipmentDate,
          fSourceCode: ordServerData.fSourceCode,
          fStatusCode: ordServerData.fStatusCode,
          fUpFloor: ordServerData.fUpFloor,
          fVecheNo: ordServerData.fVecheNo,
          fWareCompany: ordServerData.fWareCompany,
          tordSevFgData: arrTemp,
          buttonList: buttonList,
          fFgRemarkArr:fFgRemark

        })
      })
    }
    //保存截屏
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1].route
    console.log(currentPage);
    wx.onUserCaptureScreen(function (res) {
      var pageData = JSON.stringify(that.data);
      console.log('pageData=====', pageData);
      screenshot.savescreenshot(app.globalData.fUsrID, currentPage, pageData, (data) => {
        console.log(data)
      })
    })
  },
  //修改描述的内容
  revisefFgRemarkArr: function (e) {
    var that= this;
    // 获取要修改的fFgRemark的下表

    // 1.修改对应下标的fFgRemark的值
    temp = that.data.fFgRemarkArr
    
    // 赋值给页面
    that.setData({
      fFgRemarkArr: temp
    })
  },
  //作用：点击添加图片的组件时，将要上传的图片的本地路径赋值给 uploadTempFilePaths
  addPicure: function (e) {
    var that = this;
    var productIndex = e.currentTarget.dataset.index //产品行号
    var upLoadType = e.currentTarget.dataset.type //处理的图片类型
    let buttonList = that.data.buttonList || {}
    if (e.detail.all.length > 0) {
      buttonList[upLoadType + productIndex] = false;
      that.setData({
        buttonList: buttonList
      })
    }
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePaths = e.detail.all
    console.log('tempFilePaths', tempFilePaths)
    that.setData({
      uploadTempFilePaths: tempFilePaths
    })
  },
  // imgPaths  要上传的图片的本地路径 currentIndx上传图片的数组下标  upLoadImgUrls用于记录上传成功的图片的URL  productIndex产品序号   temp安装服务单页面完整数据
  oneUpload: function (imgPaths, currentIndx, upLoadImgUrls, upLoadType, productIndex, temp) {
    var that = this
    let buttonList = that.data.buttonList || {}

    console.log('正在上传第' + (currentIndx + 1) + '张图片')
    wx.uploadFile({
      url: 'https://crm.ps-house.com:8060/Api/ImageLoad/UploadFileNew',
      filePath: imgPaths[currentIndx],
      name: 'file',
      success: function (res) {
        var result = res.data
        console.log('res====', result);
        result = JSON.parse(result);
        if (result.code == 1000) {
          console.log('index', currentIndx + 1);
          console.log('result.picturePath', result.picturePath);
          console.log('第' + (currentIndx + 1) + '张图片上传成功')
          // 判断是否还有需要上传的图片
          if (currentIndx + 1 < imgPaths.length) {
            upLoadImgUrls += result.picturePath + ',';
            if (upLoadType == 'fServerImageUrl') {
              temp[productIndex - 1].fServerImageUrlArr.push(result.picturePath)
            } else if (upLoadType == 'fCustOkImageUrl') {
              temp[productIndex - 1].fCustOkImageUrlArr.push(result.picturePath)
            } else if (upLoadType == 'fCustErrImageUrl') {
              temp[productIndex - 1].fCustErrImageUrlArr.push(result.picturePath)
            }
            that.oneUpload(imgPaths, currentIndx + 1, upLoadImgUrls, upLoadType, productIndex, temp)
          } else {
            // 上传最后一张图片，也保留一个逗号，方便下次上传图片时直接拼接
            upLoadImgUrls += result.picturePath + ',';
            console.log('---upLoadImgUrls---', upLoadImgUrls);
            if (upLoadType == 'fServerImageUrl') {
              temp[productIndex - 1].fServerImageUrlArr.push(result.picturePath)
              temp[productIndex - 1].fServerImageUrl = upLoadImgUrls;
            } else if (upLoadType == 'fCustOkImageUrl') {
              temp[productIndex - 1].fCustOkImageUrlArr.push(result.picturePath)
              temp[productIndex - 1].fCustOkImageUrl = upLoadImgUrls;
            } else if (upLoadType == 'fCustErrImageUrl') {
              temp[productIndex - 1].fCustErrImageUrlArr.push(result.picturePath)
              temp[productIndex - 1].fCustErrImageUrl = upLoadImgUrls;
            }
            that.setData({
              tordSevFgData: temp
            })
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
            buttonList[upLoadType + productIndex] = true;
            that.setData({
              buttonList: buttonList
            })
          }
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'none',
            image: '../../imgs/icon/delPic.png',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '上传失败',
          icon: 'none',
          image: '../../imgs/icon/delPic.png',
          duration: 2000
        })
      }
    })
  },


  //点击上传时执行
  upLoadPic: function (e) {
    let that = this;
    let upLoadType = e.currentTarget.dataset.type;
    let productIndex = e.currentTarget.dataset.index;

    //上传之前，可能本来有图片，需要记录下来
    let temp = that.data.tordSevFgData;
    let currentIndx = 0;

    //用于记录本次上传的图片的URL
    let upLoadImgUrls = '';
    let pickerList = that.data.pickerList || {}
    pickerList[upLoadType + productIndex] = true;
    that.setData({
      pickerList: pickerList
    })
    if (upLoadType == 'fServerImageUrl') {
      upLoadImgUrls = that.data.tordSevFgData[productIndex - 1].fServerImageUrl
    } else if (upLoadType == 'fCustOkImageUrl') {
      upLoadImgUrls = that.data.tordSevFgData[productIndex - 1].fCustOkImageUrl
    } else if (upLoadType == 'fCustErrImageUrl') {
      upLoadImgUrls = that.data.tordSevFgData[productIndex - 1].fCustErrImageUrl
    }

    // 上传单张的函数，递归
    that.oneUpload(that.data.uploadTempFilePaths, currentIndx, upLoadImgUrls, upLoadType, productIndex, temp);
  },


  // 提交表单所有的数据
  uploadPicData: function (e) {
    var that = this;
    var tordSevFg = [];
    console.log('that.data.tordSevFgData', that.data.tordSevFgData);



    // 以下for循环增加添加fFgRemark的代表
    for (let i = 0; i < that.data.tordSevFgData.length; i++) {
      tordSevFg.push({
        fOrdServerLineID: (i + 1).toString(),
        fsNo: (i + 1).toString(),
        fServerImageUrl: that.data.tordSevFgData[i].fServerImageUrl,
        fCustOkImageUrl: that.data.tordSevFgData[i].fCustOkImageUrl,
        fCustErrImageUrl: that.data.tordSevFgData[i].fCustErrImageUrl,
      });
    }
    console.log('JSON.stringify', tordSevFg);

    var params = {};
    params.OperFlag = 'U',
      params.fUsrID = app.globalData.fUsrID,
      params.fForProduct = '1',
      params.fForPerson = '1',
      params.fOrdServerID = that.data.fOrdServerID,
      params.tordSevFg = tordSevFg;
    params = JSON.stringify(params);
    console.log('JSON.stringifyparams', params);

    installorder.uploadPicData(params, (data) => {
      console.log(data);
      if (data.Code == 1000) {
        wx.navigateTo({
          url: '../success/success?type=3&operation=2&orderno=' + that.data.fOrdServerNo,
        })
      } else {
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          image: '../../imgs/icon/delPic.png',
          duration: 2000
        })
      }
    });
  },


  

  // 删除访问安装服务单时，遍历出来的图片的
  delPic: function (event) {
    var that = this;
    var type = event.currentTarget.dataset.type
    var picSrc = event.currentTarget.dataset.picsrc
    var index = event.currentTarget.dataset.index //产品行号
    var tordSevFg = [];
    wx.showModal({
      title: '提示',
      content: '您确定要删除这张图片吗？',
      success(res) {
        if (res.confirm) {

          // 将现有图片的信息（含行号等）存在tordSevFg数组中
          for (let i = 0; i < that.data.tordSevFgData.length; i++) {
            tordSevFg.push({
              fOrdServerLineID: (i + 1).toString(),
              fsNo: (i + 1).toString(),
              fServerImageUrl: that.data.tordSevFgData[i].fServerImageUrl,
              fCustOkImageUrl: that.data.tordSevFgData[i].fCustOkImageUrl,
              fCustErrImageUrl: that.data.tordSevFgData[i].fCustErrImageUrl,
            });
          }

          console.log('所有产品明细的信息tordSevFg', tordSevFg);

          // picTemp是一个字符串，用picTemp作为中间变量记录要修改的图片所属于哪个产品，哪种类型，并将该产品该类型的所有图片赋值给picTemp
          var picTemp = '';
          console.log(index - 1);
          if (type == 'fCustErrImageUrl') {
            // console.log('fCustErrImageUrl');
            picTemp = that.data.tordSevFgData[index - 1].fCustErrImageUrl
          } else if (type == 'fCustOkImageUrl') {
            // console.log('fCustOkImageUrl');
            picTemp = that.data.tordSevFgData[index - 1].fCustOkImageUrl
          } else if (type == 'fServerImageUrl') {
            // console.log('fServerImageUrl');
            picTemp = that.data.tordSevFgData[index - 1].fServerImageUrl
          }
          // console.log(picTemp)

          // picTemp字符串中含有该产品该类型的所有图片的URL，将其拆分为数组，并去掉最后一个空元素
          picTemp = picTemp.split(",");
          picTemp.pop();


          // picSrc记录了要删除的图片的URL，将其从picTemp数组中删除掉
          // console.log(picTemp)
          // console.log(picSrc)
          var arrIndex = picTemp.indexOf(picSrc);
          picTemp.splice(arrIndex, 1);
          // console.log(picTemp)
          // return;


          //修改数组，用于遍历输出到页面上
          var picTempArr = that.data.tordSevFgData
          console.log('picTempArr', picTempArr)
          if (type == 'fCustErrImageUrl') {
            picTempArr[index - 1].fCustErrImageUrlArr = picTemp
          } else if (type == 'fCustOkImageUrl') {
            picTempArr[index - 1].fCustOkImageUrlArr = picTemp
          } else if (type == 'fServerImageUrl') {
            picTempArr[index - 1].fServerImageUrlArr = picTemp
          }
          console.log('picTempArr', picTempArr)

          //有可能导致初始的图片值也赋值到修改后的结果上，导致修改失败
          that.setData({
            tordSevFgData: picTempArr
          })

          // 删除完成后，将picTemp数组重新转换成字符串
          if (picTemp.length < 1) {
            picTemp = '';
          } else {
            picTemp = picTemp.join(',');
            picTemp = picTemp + ',';
          }
          // 将字符串picTemp重新赋值给tordSevFg
          if (type == 'fCustErrImageUrl') {
            tordSevFg[index - 1].fCustErrImageUrl = picTemp;
            picTempArr[index - 1].fCustErrImageUrl = picTemp;
          } else if (type == 'fCustOkImageUrl') {
            tordSevFg[index - 1].fCustOkImageUrl = picTemp;
            picTempArr[index - 1].fCustOkImageUrl = picTemp;

          } else if (type == 'fServerImageUrl') {
            tordSevFg[index - 1].fServerImageUrl = picTemp;
            picTempArr[index - 1].fServerImageUrl = picTemp;
          }
          that.setData({
            tordSevFgData: picTempArr
          })
          console.log('修改后的tordSevFg', tordSevFg)
          // 拼接修改图片接口的的参数
          var params = {};
          params.OperFlag = 'U',
            params.fUsrID = app.globalData.fUsrID,
            params.fForProduct = '1',
            params.fForPerson = '1',
            params.fOrdServerID = that.data.fOrdServerID,
            params.tordSevFg = tordSevFg;
          params = JSON.stringify(params);
          installorder.uploadPicData(params, (data) => {
            console.log(data);
            if (data.Code == 1000) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })

            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  linremove: function (e) {
    var that = this;
    var productIndex = e.currentTarget.dataset.index //产品行号
    var upLoadType = e.currentTarget.dataset.type //处理的图片类型
    let buttonList = that.data.buttonList || {}
    if (e.detail.all.length == 0) {
      buttonList[upLoadType + productIndex] = true;
      that.setData({
        buttonList: buttonList
      })
    }
  },
  showPic: function (event) {
    console.log('showPic====');
    var picurl = event.currentTarget.dataset.picurl;
    this.setData({
      showpopup: true,
      picurl: picurl
    })
  },
})