// pages/aftersales/aftersales.js
import {
  AfterSales
} from 'aftersales-model.js';
import {
  Screenshot
} from '../../utils/screenshot';
var screenshot = new Screenshot();
var aftersales = new AfterSales();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fCustImageUrls: '',
    returnTypeItem: [{
        text: '上门取货',
        value: 1
      },
      {
        text: '拆装',
        value: 2
      },
      {
        text: '两者都有',
        value: 3
      }
    ],
    returnCateItem: [{
        text: '销售退货',
        value: 1
      },
      {
        text: '换货',
        value: 2
      }
    ],
    buttonList: {},
    imageWidth: 0,
    imageHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 加载页面的展示数据
  onLoad: function (options) {
    var that = this;
    var flag = options.from
    if (flag == 'order') {
      that.setData({
        from: flag,
        fOrdID: options.fOrdID,
        orderNo: options.orderNo,
        customerName: options.customerName,
        mobile: options.mobile,
        fFgNo: options.fFgNo,
        fFgName: options.fFgName,
        fImageUrl: options.fImageUrl,
        fReturnQty: options.fQuantity,
        fSalunitprice: options.fSalunitprice,
        fSupplysourse: options.fSupplysourse,
        fReturnAmount: options.fQuantity * options.fSalunitprice,
        fFormindex: options.fFormindex,
        fFgID: options.fFgID
      })
    } else {
      console.log('=========list============')
      var fOrdReturnID = options.fOrdReturnID
      aftersales.getAfterSalesOrderDetial(fOrdReturnID, (data) => {
        console.log('=========list============')
        console.log(data.Data);
        var ordReturnData = data.Data;

        var arrTemp = ordReturnData.tordRetFgData[0].fCustImageUrls.split(",");
        arrTemp.pop();

        that.setData({
          detialfCustImageUrls: arrTemp
        })
        that.setData({
          from: flag,
          fOrdReturnID: ordReturnData.fOrdReturnID,
          fCreateDate: ordReturnData.fCreateDate,
          fOrdReturnNo: ordReturnData.fOrdReturnNo,
          customerName: ordReturnData.fCustomername,
          fContacttel: ordReturnData.fContacttel,
          fDamages: ordReturnData.fDamages,
          fOrdID: ordReturnData.fOrdID,
          orderNo: ordReturnData.fOrdNo,
          fPayAmount: ordReturnData.fPayAmount,
          fReturnAmount: ordReturnData.fReturnAmount,
          fReturnCate: ordReturnData.fReturnCate,
          fReturnMsg: ordReturnData.fReturnMsg,
          fReturnType: ordReturnData.fReturnType,
          fcFlag: ordReturnData.fcFlag,
          fFgID: ordReturnData.tordRetFgData[0].fFgID,
          fFgName: ordReturnData.tordRetFgData[0].fFgName,
          fFgNo: ordReturnData.tordRetFgData[0].fFgNo,
          fFormindex: ordReturnData.tordRetFgData[0].fFormindex,
          fImageUrl: ordReturnData.tordRetFgData[0].fImageUrl,
          fOrdID: ordReturnData.tordRetFgData[0].fOrdID,
          fReciveQty: ordReturnData.tordRetFgData[0].fReciveQty,
          fReturnQty: ordReturnData.tordRetFgData[0].fReturnQty,
          fSalunitprice: ordReturnData.tordRetFgData[0].fFgID,
          fsNo: ordReturnData.tordRetFgData[0].fsNo,
          fOrdReturnLineID: ordReturnData.tordRetFgData[0].fOrdReturnLineID,
          fCustImageUrls: ordReturnData.tordRetFgData[0].fCustImageUrls
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
  afterSalesOrderFormSubmit: function (e) {
    var that = this;
    var post_value = e.detail.value;
    console.log('post_value', post_value)
    let submitType = e.detail.target.dataset.type;
    if (!post_value.fDamages) {
      this.showTips('提示', '请填写违约金');
      return;
    } else if (!post_value.fPayAmount) {
      this.showTips('提示', '请填写应付金额');
      return;
    } else if (!post_value.fReturnType) {
      this.showTips('提示', '请填写退货方式');
      return;
    } else if (!post_value.fReturnCate) {
      this.showTips('提示', '请填写退货类别');
      return;
    } else if (!post_value.fReturnMsg) {
      this.showTips('提示', '请填写退货原因');
      return;
    }

    var afterSalesOrderData = {}
    afterSalesOrderData.fUsrID = app.globalData.fUsrID
    afterSalesOrderData.fOrdID = post_value.fOrdID
    afterSalesOrderData.fReturnAmount = post_value.fReturnAmount
    afterSalesOrderData.fDamages = post_value.fDamages //违约金
    afterSalesOrderData.fPayAmount = post_value.fPayAmount
    afterSalesOrderData.fReturnMsg = post_value.fReturnMsg
    afterSalesOrderData.fReturnType = post_value.fReturnType
    afterSalesOrderData.fReturnCate = post_value.fReturnCate

    var firstProduct = {}
    firstProduct.fsNo = '1' //序号
    firstProduct.fOrdID = that.data.fOrdID
    firstProduct.fFormindex = that.data.fFormindex //行号
    firstProduct.fReturnQty = that.data.fReturnQty
    firstProduct.fFgID = that.data.fFgID
    firstProduct.fSalunitprice = that.data.fSalunitprice,
      firstProduct.fCustImageUrls = post_value.fCustImageUrls


    if (submitType == 'add') {
      afterSalesOrderData.OperFlag = 'A'
      firstProduct.fOrdReturnLineID = '0' //退货明细表行号ID
      // console.log('afterSalesOrderData', afterSalesOrderData);
    } else if (submitType == 'revise') {
      afterSalesOrderData.OperFlag = 'U'
      afterSalesOrderData.fOrdReturnID = post_value.fOrdReturnID
      firstProduct.fOrdReturnLineID = that.data.fOrdReturnLineID
      console.log('reviseeee')
    }

    var orderdetial = [];
    orderdetial.push(firstProduct);
    afterSalesOrderData.tordRetFg = orderdetial
    afterSalesOrderData = JSON.stringify(afterSalesOrderData);
    console.log('afterSalesOrderData===', afterSalesOrderData)

    aftersales.addAfterSalesOrder(afterSalesOrderData, (data) => {
      console.log(data);
      if (data.Code == 1000) {
        if (submitType == 'add') {
          wx.navigateTo({
            url: '../success/success?type=2&operation=1&orderno=' + data.Data.fOrdReturnNo,
          })
        } else if (submitType == 'revise') {
          wx.navigateTo({
            url: '../success/success?type=2&operation=2&orderno=' + that.data.fOrdReturnNo,
          })
        }

      } else {
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          image: '../../imgs/icon/delPic.png',
          duration: 2000
        })
      }
    })
    // return;
  },
  addPicure: function (e) {
    var that = this;
    console.log(e)
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

  //上传图片
  upLoadPic: function () {
    let that = this;
    let fCustImageUrls = '';
    // console.log('tempPicUrlValue',tempPicUrl);
    // console.log("===typeof:"+typeof(tempPicUrl));
    for (let i = 0; i < that.data.uploadTempFilePaths.length; i++) {
      console.log('for===', i);
      wx.uploadFile({
        url: 'https://crm.ps-house.com:8060/Api/ImageLoad/UploadFileNew', //
        filePath: that.data.uploadTempFilePaths[i],
        name: 'file',
        success(res) {
          console.log('res====', res);
          var result = res.data
          console.log('result====', result)
          result = JSON.parse(result);
          console.log('console/i', i);
          if (i == (that.data.uploadTempFilePaths.length - 1)) {
            console.log('====', i);
            fCustImageUrls += result.picturePath + ',';
            console.log('fCustImageUrls=====', fCustImageUrls);
            that.setData({
              fCustImageUrls: fCustImageUrls
            })
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            console.log('====', i);
            fCustImageUrls += result.picturePath + ',';
            console.log(fCustImageUrls);
            that.setData({
              fCustImageUrls: fCustImageUrls
            })
          }
        }
      })
    }
  },
  // 删除访问安装服务单时，遍历出来的图片的
  delPic: function (event) {
    var that = this;
    var picSrc = event.currentTarget.dataset.picsrc
    // var type = event.currentTarget.dataset.type
    // var index = event.currentTarget.dataset.index //产品行号
    // 修改   fCustImageUrls
    var tordSevFg = [];
    wx.showModal({
      title: '提示',
      content: '您确定要删除这张图片吗？',
      success(res) {
        if (res.confirm) {
          console.log(that.data.tordSevFgData);

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
  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    });
  },
  showPic: function (event) {
    var picurl = event.currentTarget.dataset.picurl;
    this.setData({
      showpopup: true,
      picurl: picurl
    })
  },
  imageLoad: function (e) {
    //获取图片的原始宽度和高度
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    console.log('originalWidth', originalWidth);
    console.log('originalHeight', originalHeight);
    this.setData({
      imageWidth: originalWidth / 2,
      imageHeight: originalHeight / 2
    });
  }
})