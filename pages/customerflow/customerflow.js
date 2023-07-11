// pages/customerflow/customerflow.js
import {
  Customerflow
} from '../customerflow/customerflow-model.js';
import {
  Cart
} from '../cart/cart-model.js';
import {
  Screenshot
} from '../../utils/screenshot';
var screenshot = new Screenshot();
var customerflow = new Customerflow();
var cart = new Cart();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options1: ['總部', '台中', '台北', '新竹', '台南', '高雄'],
      selectedValue1:0,
      selectedText1: '請選擇門市',
      options2: ['沙發', '衣櫃', '床組', '化妝台', '書桌', '電視櫃'],
      selectedValue2: 0,
      selectedText2: '請選擇業務',
      selectedDate1:0 /*初始化选中日期  */,
      options3: ['業主', '設計師', '軟裝師', '建設公司', '其他'],
      selectedValue3: 0,
      selectedText3: '請選擇分類',
      selectedDate2:0 /*初始化选中日期  */,
   /*    fstore:null, */
    sex: [{
      text: '先生',
      value: 1
    }, {
      text: '女士',
      value: 0
    }],
    intent: [{
      text: '意向强烈',
      value: 'A'
    }, {
      text: '意向一般',
      value: 'B'
    }, {
      text: '随便看看',
      value: 'C'
    }, {
      text: '已成交',
      value: 'D'
    }],
    visittype: [{
      text: '家访',
      value: 1
    }, {
      text: '方案',
      value: 2
    }],
    category: [{
      text: '新客',
      value: 1
    }, {
      text: '老客',
      value: 2
    }],
    customerType: [{
      text: '消费者',
      value: 1
    }, {
      text: '设计师',
      value: 2
    }, {
      text: '工程师',
      value: 3
    }],
    source: [{
      text: '逛店',
      value: 1
    }, {
      text: '设计师介绍',
      value: 2
    }, {
      text: '网络广告商场广告',
      value: 3
    }, {
      text: '店面活动',
      value: 4
    }, {
      text: '小区推广',
      value: 5
    }, {
      text: '老客户',
      value: 6
    }
    ],
  },

   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('Customerflow');
    var that = this;
    var flag = options.from
    that.setData({
      from: flag
    })
    if (flag == 'add') {} else {
      var pCustomUID = options.pCustomUID.toString();
      customerflow.getCustomerFlowById(pCustomUID, (data) => {
        console.log(data.Data)
        that.setData({
          pCustomUID: pCustomUID,
          fPassenger: data.Data.pCustomName,
          fHomephone: data.Data.pCustomHomeNumber,
          fTelephone: data.Data.pCustomPhoneNumber,
          pCustomEmail: data.Data.pCustomEmail,
          fArea: data.Data.pCustomAddress,
          pCustomResidentialName: data.Data.pCustomResidentialName,
          fSexs: data.Data.pCustomSex,

          // fSerialNo: data.Data.fSerialNo,
          // fVisitDate: data.Data.fVisitDate,
          // fVisitTime: data.Data.fVisitTime,
          // fStayTime: data.Data.fStayTime,
          // fSexs: data.Data.fSexs,
          // fAge: data.Data.fAge,
          // fTelephone: data.Data.fTelephone,
          // fDescription: data.Data.fDescription,
          // fArea: data.Data.fArea,
          // fPassengerNo: data.Data.fPassengerNo,
          // fIntent: data.Data.fIntent,
          // fQuantity: data.Data.fQuantity,
          // fAmount: data.Data.fAmount,
          // fDiscount: data.Data.fDiscount,
          // fReceptionist: data.Data.fReceptionist,
          // fVisittype: data.Data.fVisittype,
          // fCategory: data.Data.fCategory,
          // fCustomerType: data.Data.fCustomerType,
          // fSource: data.Data.fSource,
          // fOrgID: data.Data.fOrgID
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
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      fVisitDate: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value,
      fVisitTime: e.detail.value
    })
  },
  pickerChange1: function (e) {
    const index = e.detail.value;
    const selectedOption = this.data.options1[index];
    this.setData({
      selectedValue1: index,
      selectedText1: selectedOption,
    });
  },
  pickerChange2: function (e) {
      const index = e.detail.value;
      const selectedOption = this.data.options2[index];
      this.setData({
        selectedValue2: index,
        selectedText2: selectedOption
      });
    },
    datePickerChange1: function (e) {
      const selectedDate1 = e.detail.value;
      this.setData({
        selectedDate1:selectedDate1
      });
      // 在此处可以执行其他操作，如打印选中的日期或调用其他方法
    },
    pickerChange3: function (e) {
      const index = e.detail.value;
      const selectedOption = this.data.options3[index];
      this.setData({
        selectedValue3: index,
        selectedText3: selectedOption
      });
    },
    datePickerChange2: function (e) {
      const selectedDate2 = e.detail.value;
      this.setData({
        selectedDate2:selectedDate2
      });
      // 在此处可以执行其他操作，如打印选中的日期或调用其他方法
    },

  customerFlowFormSubmit:function (e) {
    var that = this;
    var post_value = e.detail.value;
    var customerFlow = {}

    customerFlow.pUID = app.globalData.nUserID
    //customerFlow.pStoreID = app.globalData.fOrgID
    if (that.data.selectedValue1 ===0) {
      that.showTips('下單提示', '請選擇門市');
      return;
    }
    if (that.data.selectedValue2 === 0) {
      that.showTips('下單提示', '請選擇負責業務');
      return;
    }
    if (that.data.selectedDate1 ===0) {
      that.showTips('下單提示', '請選擇初次接洽日期');
      return;
    }
    if (that.data.selectedValue3 === 0) {
      that.showTips('下單提示', '請選擇客戶分類');
      return;
    }
    if (!post_value.fPassenger) {
      that.showTips('下單提示', '請填寫業主全名');
      return;
    }
    if (!post_value.fdesignercompany) {
      that.showTips('下單提示', '請填寫設計公司名');
      return;
    }
    if (!post_value.fcontactor) {
      that.showTips('下單提示', '請填寫專案聯絡人全名');
      return;
    }
  
/*     if (!post_value.fStore) {
      that.showTips('下單提示', '請選擇門市');
      return;
    }  */
    
  /*   if (!(post_value.fHomephone || post_value.fTelephone)) {
      that.showTips('下單提示', '請填寫家電號碼或手機號碼');
      return;
    }  */
    /* if (!post_value.pCustomEmail) {
      that.showTips('下單提示', '請填寫電子信箱');
      return;
    } 
    if (!post_value.fArea) {
      that.showTips('下單提示', '請填寫地址');
      return;
    } 
    if (!post_value.pCustomResidentialName) {
      that.showTips('下單提示', '請填寫大樓名稱');
      return;
    } 
    if (!post_value.fSexs) {
      that.showTips('下單提示', '請選擇稱呼');
      return;
    }  */

    customerFlow.pCustomName = post_value.fPassenger.toString()
    customerFlow.pCustomHomeNumber = post_value.fHomephone
    customerFlow.pCustomPhoneNumber = post_value.fTelephone
    customerFlow.pCustomEmail = post_value.pCustomEmail
    customerFlow.pCustomAddress = post_value.fArea
    customerFlow.pCustomResidentialName = post_value.pCustomResidentialName
    customerFlow.pCustomSex = post_value.fSexs

    // customerFlow.fSerialNo = post_value.fSerialNo
    // customerFlow.fVisitDate = post_value.fVisitDate
    // customerFlow.fVisitTime = post_value.fVisitTime
    // customerFlow.fStayTime = post_value.fStayTime
    // customerFlow.fAge = post_value.fAge
    // customerFlow.fDescription = post_value.fDescription
    // customerFlow.fPassengerNo = post_value.fPassengerNo
    // customerFlow.fIntent = post_value.fIntent
    // customerFlow.fQuantity = post_value.fQuantity
    // customerFlow.fAmount = post_value.fAmount
    // customerFlow.fDiscount = post_value.fDiscount
    // customerFlow.fReceptionist = post_value.fReceptionist
    // customerFlow.fVisittype = post_value.fVisittype
    // customerFlow.fCategory = post_value.fCategory
    // customerFlow.fCustomerType = post_value.fCustomerType
    // customerFlow.fSource = post_value.fSource

    if (post_value.from == 'add') {
      customerFlow.OperFlag = 'A'
      customerFlow.pCustomUID = '0'
      customerFlow.pStoreID = '1'
      customerflow.uploadPicData(customerFlow, (data) => {
        if (data.Code == 1000) {
          wx.navigateTo({
            url: '../success/success?type=4&operation=1',
          })
        } else {
          wx.showToast({
            title: '提交失敗',
            icon: 'none',
            image: '../../imgs/icon/delPic.png',
            duration: 2000
          })
        }
      })

    } else {
      customerFlow.OperFlag = 'U'
      customerFlow.pCustomUID = post_value.pCustomUID
      customerFlow.pStoreID = post_value.pStoreID
      customerflow.uploadPicData(customerFlow, (data) => {
        if (data.Code == 1000) {
          wx.navigateTo({
            url: '../success/success?type=4&operation=2',
          })
        } else {
          wx.showToast({
            title: '提交失敗',
            icon: 'none',
            image: '../../imgs/icon/delPic.png',
            duration: 2000
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  SaveCart: function () {
    var that = this;

    var cartData = cart.getCartDataFromLocal();
    console.log('cartData',cartData);
    
    var SortIndex = parseInt(cartData.length / 10);
    console.log('SortIndex',SortIndex);


    var params = {};
    params.pAccountUID = app.globalData.nUserID;
    params.pCustomUID = that.data.pCustomUID;
    params.nSort = 0; //暫時不用
    
    var tmpCartData = cartData,
    keys = ['Brand_Category','CartIndex','FinishName','FinishTexture','FinishTypeName','Item_No','Item_No_Prefix','Level','List_Price','OptionS','Product_Name','StyleNo','StyleNoName','StyleTexture','StyleTypeName','bDesign','bShip','counts','fImageUrl','pDesignPrice','pDesignSale','pSale','pShippingPrice','pShippingSale','selectStatus','SetSize','PillowS','InventoryData','InventoryFL','InventoryWood','InventoryLimit'];
    tmpCartData.forEach(x => {
      keys.forEach(y => {
        if(x[y] != null && x[y] != undefined)
        {
          x[y] = x[y].toString();
        }
        else
        {
          x[y] = '';
        }
      })
    });

    params.CartData = tmpCartData;

    customerflow.saveCartData(params, (data) => {
      console.log(data.Data)
    })
  },
  LoadCart: function () {
    var that = this;
    
    var params = {};
    params.pAccountUID = app.globalData.nUserID;
    params.pCustomUID = that.data.pCustomUID;

    customerflow.loadCartData(params, (data) => {
      console.log(data.Data)
      if(data.Data != null){
        cart.SetCartData(data.Data[0].CartData);
      }
    })
  },
  onPageScroll: function (e) {
    var that = this;
    var button = that.selectComponent('.fixed-button');
    var scrollY = e.scrollTop;
  
    // 判断是否滚动到一定位置，例如滚动到100px的位置时才显示按钮
    if (scrollY > 100) {
      // 设置按钮的样式，例如固定在页面底部
      button.setStyle({
        position: 'fixed',
        bottom: '20rpx',
        right: '20rpx',
        transform: 'none'
      });
    } else {
      // 恢复按钮原来的样式
      button.setStyle({
        position: 'static',
        transform: 'none'
      });
    }
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
})
