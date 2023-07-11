import {
  Order
} from '../order/order-model.js';
import {
  Cart
} from '../cart/cart-model.js';
import {
  Customerflow
} from '../customerflow/customerflow-model.js';
import {
  Address
} from '../../utils/address.js';
import {
  Screenshot
} from '../../utils/screenshot';


const app = getApp();
var order = new Order();
var cart = new Cart();
var customerflow = new Customerflow();
var address = new Address();
var screenshot = new Screenshot();

Page({
  data: {
    fromCartFlag: true,
    showQRCode: false,
    addressInfo: null,
    entrance: '',
    revise: true,
    fCustomerid: '',
    fInvoiceflag: '',
    fDeliverymethods: '',
    fElevatorFlag: '',
    fCarFlag: '',
    fInstallflag: '',
    items1: [{
      text: '是',
      value: 'Y'
    },
    {
      text: '否',
      value: 'N'
    }
    ],
    items2: [{
      text: '送货',
      value: 1
    },
    {
      text: '自提',
      value: 0
    }
    ],
    payway: [{
      text: '微信',
      value: 1
    },
    {
      text: '支付宝',
      value: 2
    }, {
      text: '刷卡',
      value: 3
    },
    {
      text: '转账',
      value: 4
    },
    {
      text: '现金',
      value: 5
    }
    ],
    payitem: [{
      text: '货款',
      value: 1
    },
    {
      text: '定金',
      value: 2
    },
    {
      text: '运杂费',
      value: 3
    },
    {
      text: '搬楼费',
      value: 4
    },
    {
      text: '安装费',
      value: 5
    },
    {
      text: '销折',
      value: 6
    },
    {
      text: '销退',
      value: 7
    },
    {
      text: '转单收款',
      value: 8
    },
    {
      text: '转单退款',
      value: 9
    },
    {
      text: '佣金付款',
      value: 10
    },
    {
      text: '多收退款',
      value: 11
    }
    ],
    orderhead: '',
    orderno: '',
    saleamount: "",
    discount: 1,
    discountAmount: 0,
    roleNo: 0,
    loadingHidden: true,
    language: app.globalData.language,
    langIndex: app.globalData.langIndex,
    //orderinfo: app.globalData.OrderInfoS[langIndex],

    /* Custom */
    CustomUID: '',
    orderArr: [],//change CustomList
    CustomList: [],
    bCustomBox: false,
    CustomIndex: 0, //选择的下拉列表下标
    Customhadselect: false,
    CustomShow: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    Custom_selectData: [{
        text: '客戶ID',
        value: 0
      },
      {
        text: '客戶姓名',
        value: 1
      },
      {
        text: '電話',
        value: 2
      },
      {
        text: '電子信箱',
        value: 3
      }
    ],

    /* sales */
    sales: [],
    finalDisPrice: 0,
    salediscount: 1,
    saleCode: [],
    Order_FullPrice_Sale: ''
  },

  /*
   * 订单数据来源包括两个：
   * 1.购物车下单
   * 2.旧的订单
   * */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.language.lang_order_Title,
    })

    var flag = options.from == 'cart',
      that = this;
    this.data.fromCartFlag = flag;
    this.data.account = options.account;
    //来自于购物车
    if (flag) {
      console.log('cart.getCartDataFromLocal(true)',cart.getCartDataFromLocal(true));
      this.setData({
        productsArr: cart.getCartDataFromLocal(true),
        account: options.account,
        saleamount: options.account,
        revise: (options.from == 'order'),
        orderStatus: 0
      });

      console.log('productsArr',this.data.productsArr);
      // return;
      /*显示收获地址*/
      // address.getAddress((res) => {
      //   that._bindAddressInfo(res);
      // });
    }else{ //旧订单
      this.data.OrderID = options.OrderID;

      var disabled = options.source == 'view' ? true : false
      this.setData({
        disabled: disabled
      })
    }

    // 截屏逻辑
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1].route
    console.log(currentPage);
    wx.onUserCaptureScreen(function (res) {
      var pageData = JSON.stringify(that.data);
      console.log('pageData=====', pageData);
      screenshot.savescreenshot(app.globalData.nUserID, currentPage, pageData, (data) => {
        console.log(data)
      })
    })
  },

  onShow: function () {
    this.setData({
        language: app.globalData.language,
        langIndex: app.globalData.langIndex,
        //orderinfo: app.globalData.OrderInfoS[langIndex],
      });
      wx.setNavigationBarTitle({
        title: this.data.language.lang_order_Title,
      })

    //获取以前的订单信息（单个）
    if (this.data.OrderID) {
      var that = this;
      //下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中
      var OrderID = this.data.OrderID;
      order.getOrderInfoById(OrderID, (data) => {
        console.log('getOrderInfoById')

        console.log(data)
        console.log(data.Data)
        var addressInfo = {
          name: data.Data.fCustomername,
          mobile: data.Data.fContacttel,
        };

        that.setData({
          entrance: 'list',
          OrderID: data.Data[0].OrderID,
          CreateDate: data.Data[0].CreateDate,
          // CustomUID: data.Data[0].CustomUID,
          CustomAddress: data.Data[0].CustomAddress,
          CustomEmail: data.Data[0].CustomEmail,
          CustomName: data.Data[0].CustomName,
          CustomPhone: data.Data[0].CustomPhone,
          DeliveryDate: data.Data[0].DeliveryDate,
          StoreAuth: data.Data[0].StoreAuth,
          Order_Code_Sale: data.Data[0].Order_Code_Sale,
          FullList_Price: data.Data[0].FullList_Price,
          OfferDate: data.Data[0].OfferDate,
          OrderID: data.Data[0].OrderID,
          Order_Type: data.Data[0].Order_Type,
          productsArr: data.Data[0].m_OrderItemS,

          account: data.Data[0].FullList_Price,
          saleamount: data.Data[0].FullSaleList_Price,
        });
        console.log('===productsArr===', that.data.productsArr);
        // 快照地址
        var addressInfo = data.snap_address;
        that._bindAddressInfo(addressInfo);
      });
    }

    //折扣
    this.setData({ 
       sales:app.globalData.sales
    })

    if(this.data.sales != []){
      this.saleDiscount()
    }
  },

  /*修改或者添加地址信息*/
  editAddress: function () {
    wx.getSetting({
      success(res) {
        // console.log('getSetting');
        console.log(res.authSetting);
        if (!res.authSetting['scope.address']) {
          wx.openSetting({
            success(res) {
              console.log('openSetting')
              console.log(res.authSetting)
            }
          })
        }
      }
    });
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log('===res===');
        console.log(res);
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
        };
        that._bindAddressInfo(addressInfo); //将addressInfo复制给本页面的addressInfo
        //保存地址
        var addressData = {};
        addressData.OperFlag = 'A'; // A  新增
        addressData.fCustomerid = '0'; //客户ID
        addressData.fContactor = res.userName; //客户联系人
        addressData.fCustomername = res.userName;
        addressData.fContacttel = res.telNumber; //联系人电话
        addressData.fContactmobile = res.telNumber; //联系人手机
        addressData.fReceiptor = res.userName; //客户指定收货人
        addressData.fReceiptormobile = res.telNumber; //客户指定收货人手机
        addressData.fProvince = res.provinceName; //省
        addressData.fCity = res.cityName; //市
        addressData.fDistrict = res.countyName; //区
        addressData.fVillage = res.countyName; //鎮
        addressData.fAddress = res.detailInfo; //详细地址
        addressData.fCusarea = res.cityName; //
        addressData.fCustomertype = '1'; //
        addressData.fSexs = '1'; //性别
        addressData.fSourcetype = '5'; //
        addressData.fDevelooper = app.globalData.fUsrNo; //开发人员
        addressData.fStartdate = null;
        addressData.fEnddate = null;
        addressData.fCustomerlevel = '1'; //客户等级
        addressData.fOrgID = app.globalData.fOrgID; //门店ID
        addressData.fUsrID = app.globalData.nUserID; //用户ID
        addressData.pUserAccount = app.globalData.pUserAccount;
        address.submitAddress(addressData, (data) => {
          if (data.Code == 1000) {
            that.setData({
              fCustomerid: data.Data.fCustomerid
            })
          } else {
            that.showTips('操作提示', '地址信息更新失败！');

          }
        });
      }
    })
  },

  /*绑定地址信息*/
  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

  /*下单和付款*/
  pay: function () {
    if (!this.data.addressInfo) {
      this.showTips('下单提示', '请填写您的收货地址');
      return;
    }
    if (this.data.orderStatus == 0) {
      this._firstTimePay();
    } else {
      this._oneMoresTimePay();
    }
  },

  /*第一次支付*/
  _firstTimePay: function (orderInfo) {
    console.log('=====orderInfo====');
    // orderInfo = JSON.stringify(orderInfo);
    console.log(orderInfo);

    var that = this;
    order = new Order();
    //支付分两步，第一步是生成订单号，然后根据订单号支付
    // orderinfo.push({torderFgData:orderdetial})

    order.doOrder(orderInfo, (data) => {
      //订单生成成功

      if (data.Code == 1000) { //订单插入成功
        var orderid = data.Data.fOrdID;
        var operation = data.Data.operation;
        console.log(data.Data);
        that.deleteProducts();
          // 显示下单成功页面
          wx.navigateTo({
            url: '../success/success?type=1&operation=1&orderid=' + orderid,
          })
        //}
        //更新订单状态
        // var id = data.order_id;
        // that.data.id = id;
        // that.data.fromCartFlag = false;
        //开始支付，传入订单ID
        // that._execPay(id);
      } else {
        that._orderFail(data); // 下单失败
      }
    });
  },
  
  /*
   * 提示窗口
   * params:
   * title - {string}标题
   * content - {string}内容
   * flag - {bool}是否跳转到 "我的页面"
   */
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

  /*
   *下单失败
   * params:
   * data - {obj} 订单结果信息
   * */
  _orderFail: function (data) {
    var nameArr = [],
      name = '',
      str = '',
      pArr = data.pStatusArray;
    for (let i = 0; i < pArr.length; i++) {
      if (!pArr[i].haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if (nameArr.length > 2) {
      str += ' 等';
    }
    str += ' 缺貨';
    wx.showModal({
      title: '下單失敗',
      content: str,
      showCancel: false,
      success: function (res) {

      }
    });
  },

  /* 再次次支付*/
  _oneMoresTimePay: function () {
    this._execPay(this.data.id);
  },

  /*
   *开始支付
   * params:
   * id - {int}订单id
   */
  _execPay: function (id) {
    if (!order.onPay) {
      this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽', true); //屏蔽支付，提示
      this.deleteProducts(); //将已经下单的商品从购物车删除
      return;
    }
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode != 0) {
        that.deleteProducts(); //将已经下单的商品从购物车删除   当状态为0时，表示

        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
        });
      }
    });
  },
  //将已经下单的商品从购物车删除
  deleteProducts: function () {
    var arr = this.data.productsArr;
    for (let i = 0; i < arr.length; i++) {
      cart.delete(arr[i].Item_No_Prefix, arr[i].Product_Name, arr[i].StyleNo, arr[i].FinishTexture, arr[i].Finish2Texture, arr[i].StyleTexture, arr[i].OptionS, arr[i].SetSize, arr[i].PillowS, arr[i].InventoryData);
    }
  },

  // 计算折扣
  countDiscount: function (event) {
    var that = this;
    var saleamount = event.detail.value; //获取成交金额
    //计算折扣
    var discount = saleamount / that.data.account;
    discount.toFixed(2);
    // console.log(discount);
    // 计算优惠金额
    var discountAmount = that.data.account - saleamount

    that.setData({
      discount: discount,
      discountAmount: discountAmount,
      saleamount: saleamount
    })
  },
  //订单提交&修改
  orderFormSubmit(e) {

    let submitType = e.detail.target.dataset.type;
    var that = this;
    var post_value = e.detail.value;

    console.log('===post_value===', post_value);
    if (!post_value.customname) {
      that.showTips('下單提示', '請填寫客户名稱');
      return;
    } 
    if (!post_value.customphone) {
      that.showTips('下單提示', '請填寫您的電話');
      return;
    } 
    if (!post_value.customemail) {
      that.showTips('下單提示', '請填寫您的信箱');
      return;
    } 
    if (!post_value.offerdate) {
      that.showTips('下單提示', '請填寫報價日期');
      return;
    } 
    if (!post_value.customaddress) {
      that.showTips('下單提示', '請填寫您的案場地址');
      return;
    } 
    // if (!post_value.deliverydate) {
    //   that.showTips('下單提示', '請填寫預計交貨日期');
    //   return;
    // }
    var orderInfo = {};
    var orderdetial = [];
    var procuctInfo = that.data.productsArr;

    if (submitType == 'add') { //新增订单逻辑
      orderInfo.OrderID = '0';
      console.log('procuctInfo',procuctInfo);

      //将productsArr信息加入至orderdetial数组中
      for (let i = 0; i < procuctInfo.length; i++) {
        orderdetial.push({
          fFormindex: (i + 1).toString(),
          fLinetype: '1',

          counts: procuctInfo[i].counts.toString(),

          Item_No: procuctInfo[i].Item_No.toString(),
          Item_No_Prefix: procuctInfo[i].Item_No_Prefix.toString(),
          Brand_Category: procuctInfo[i].Brand_Category.toString(),
          bBespoke: procuctInfo[i].pSectionType == 'Bespoke' ? 'true' : 'false',
          Product_Name: procuctInfo[i].Product_Name.toString(),
          fImageUrl: procuctInfo[i].fImageUrl.toString(),

          FinishTexture: procuctInfo[i].FinishTexture.toString(),
          Finish2Texture: procuctInfo[i].Finish2Texture.toString(),

          Level: procuctInfo[i].Level.toString(),
          StyleNo: procuctInfo[i].StyleNo.toString(),
          StyleTexture: procuctInfo[i].StyleTexture.toString(),

          Options: procuctInfo[i].OptionS.toString(),

          List_Price: procuctInfo[i].List_Price.toString(),
          pShippingPrice: procuctInfo[i].pShippingPrice.toString(),
          pDesignPrice: procuctInfo[i].pDesignPrice.toString(),
          pSale: procuctInfo[i].pSale.toString(),
          pShippingSale: procuctInfo[i].pShippingSale.toString(),
          pDesignSale: procuctInfo[i].pDesignSale.toString(),
          bShip: procuctInfo[i].bShip.toString(),
          bDesign: procuctInfo[i].bDesign.toString(),
          PillowS: procuctInfo[i].PillowS.toString(),
          SetSize: procuctInfo[i].SetSize.toString(),
          InventoryData: procuctInfo[i].InventoryData.toString(),
          
          fullprice: ((Number(procuctInfo[i].List_Price) + (procuctInfo[i].bShip?Number(procuctInfo[i].pShippingPrice):0) + (procuctInfo[i].bDesign?Number(procuctInfo[i].pDesignPrice):0)) * Number(procuctInfo[i].counts)).toString(),
        });
      }

      // 根据品牌将orderdetial进行排序
      console.log('orderdetial--order', orderdetial);


    } else if (submitType == 'revise') { //修改订单逻辑
      orderInfo.OrderID = that.data.OrderID;

      for (var index in that.data.productsArr) {
        console.log('======', that.data.productsArr)
        orderdetial.push({
          fFormindex: that.data.productsArr[index].fFormindex,
          fLinetype: that.data.productsArr[index].fLinetype,

          counts: that.data.productsArr[index].counts,
          
          SerialNum: that.data.productsArr[index].SerialNum,

          OrderItemType: that.data.productsArr[index].OrderItemType,

          Item_No: that.data.productsArr[index].Item_No,
          Item_No_Prefix: that.data.productsArr[index].Item_No_Prefix,
          Brand_Category: that.data.productsArr[index].Brand_Category,
          Product_Name: that.data.productsArr[index].Product_Name,
          fImageUrl: that.data.productsArr[index].fImageUrl,
          
          FinishTexture: that.data.productsArr[index].FinishTexture,
          Finish2Texture: that.data.productsArr[index].Finish2Texture,

          Level: that.data.productsArr[index].Level,
          StyleNo: that.data.productsArr[index].StyleNo,
          StyleTexture: that.data.productsArr[index].StyleTexture,

          Options: that.data.productsArr[index].OptionS,

          List_Price: that.data.productsArr[index].List_Price,
          pShippingPrice: that.data.productsArr[index].pShippingPrice,
          pDesignPrice: that.data.productsArr[index].pDesignPrice,
          pSale: that.data.productsArr[index].pSale,
          pShippingSale: that.data.productsArr[index].pShippingSale,
          pDesignSale: that.data.productsArr[index].pDesignSale,
          bShip: that.data.productsArr[index].bShip,
          bDesign: that.data.productsArr[index].bDesign,
          PillowS: that.data.productsArr[index].PillowS,
          SetSize: that.data.productsArr[index].SetSize,
          InventoryData: that.data.productsArr[index].InventoryData,

          FinishTypeName: that.data.productsArr[index].FinishTypeName,
          FinishName: that.data.productsArr[index].FinishName,
          StyleTypeName: that.data.productsArr[index].StyleTypeName,
          StyleNoName: that.data.productsArr[index].StyleNoName,

          fullprice: ((Number(that.data.productsArr[index].List_Price)+ (that.data.productsArr[index].bShip?Number(that.data.productsArr[index].pShippingPrice):0) + (that.data.productsArr[index].bDesign?Number(that.data.productsArr[index].pDesignPrice):0)) * Number(that.data.productsArr[index].counts)).toString(),
        })
      }
    }
    
      orderInfo.fUsrID = app.globalData.nUserID,
      orderInfo.pUserAccount = app.globalData.pUserAccount,
      orderInfo.customname = post_value.customname,
      orderInfo.customphone = post_value.customphone,
      orderInfo.customemail = post_value.customemail,
      orderInfo.offerdate = post_value.offerdate,
      orderInfo.customaddress = post_value.customaddress,
      orderInfo.deliverydate = post_value.deliverydate,
      orderInfo.storeID = app.globalData.SelectStoreID,

      orderInfo.CustomUID = that.data.CustomUID

      if(that.data.sales.length > 0){
        that.data.sales.forEach((item)=>{
          if(item.check) that.data.saleCode.push(item.num)
        })
      }

      orderInfo.Order_Code_Sale = that.data.saleCode.join()
      orderInfo.Order_FullPrice_Sale = that.data.Order_FullPrice_Sale

      orderInfo.ItemData = '123'
    console.log('orderInfo---head');
    console.log(orderInfo);

    //订单明细资料
    // var orderdetial = [];
    // var procuctInfo = this.data.productsArr;

    // console.log('orderdetial', this.data.productsArr);

    //数组转JSON字符串
    orderInfo.ItemData = orderdetial;
    console.log('orderInfo-----all', orderInfo);

    orderInfo = JSON.stringify(orderInfo);

    if (submitType == 'add') { //新增订单逻辑
      console.log('===add===', orderInfo);

      this._firstTimePay(orderInfo);

    } else if (submitType == 'revise') {  //修改订单逻辑

      that.setData({
        loadingHidden: false
      });

      console.log('===revise===', orderInfo);
      order.doOrder(orderInfo, (data) => {
        console.log(data);

        that.setData({
          loadingHidden: true
        });

        if (data.Code == 1000) {
          wx.navigateTo({
            url: '../success/success?type=1&operation=2&orderid=' + data.Data.fOrdID,
          })
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            image: '../../imgs/icon/delPic.png',
            duration: 2000
          })
        }
      })
    }
    app.globalData.sales = ''
  },



  updateOrderSubmit: function (e) {
    console.log('---updateOrderSubmit--');
    var that = this;
    var post_value = e.detail.value;

    var orderinfo = {};
    orderinfo.OperFlag = 'U';
    orderinfo.OrderID = post_value.OrderID;

    orderinfo.fUsrID = app.globalData.nUserID,
    orderinfo.pUserAccount = app.globalData.pUserAccount,
    orderinfo.fOrgID = app.globalData.fOrgID,
    orderinfo.fCustomerid = post_value.fCustomerid;
    orderinfo.fDeliverymethods = post_value.fDeliverymethods;
    orderinfo.fPerenddate = post_value.fPerenddate;

    //这个地方还要处理一下
    orderinfo.fInstallflag = 'Y';
    orderinfo.fInvoiceflag = 'Y';
    orderinfo.fElevatorFlag = 'Y';
    orderinfo.fCarFlag = 'Y';

    orderinfo.fFloornum = post_value.fFloornum;
    orderinfo.fFreight = post_value.fFreight;
    orderinfo.fSaleamount = post_value.fSaleamount;
    orderinfo.fRetailtotal = that.data.fRetailtotal;
    orderinfo.fFavorablemoney = that.data.fFavorablemoney;
    orderinfo.fDiscountcause = post_value.fDiscountcause;
    orderinfo.fDoorSize = post_value.fDoorSize;
    orderinfo.fElevatorSize = post_value.fElevatorSize;
    orderinfo.fCustomerremark = post_value.fCustomerremark;
    orderinfo.fShippingremark = post_value.fShippingremark;
    orderinfo.fOrdercate = that.data.fOrdercate;
    var productsInfo = [];
    for (var index in that.data.productsArr) {
      console.log('======', index)
      productsInfo.push({
        fFormindex: that.data.productsArr[index].fFormindex,
        fLinetype: that.data.productsArr[index].fLinetype,
        fQuantity: that.data.productsArr[index].fQuantity,
        fFgID: that.data.productsArr[index].fFgID,
        fPriceListID: that.data.productsArr[index].fPriceListID,
        fPriunitprice: that.data.productsArr[index].fPriunitprice,
        fullprice: that.data.productsArr[index].fullprice.toString(),
        fDisPriceListID: that.data.productsArr[index].fDisPriceListID,
        fDisPriunitprice: that.data.productsArr[index].fDisPriunitprice,
        fDisPritotprice: that.data.productsArr[index].fDisPriceListID,
        fPridiscount: that.data.productsArr[index].fDisPriceListID,
        fSupplysourse: that.data.productsArr[index].fDisPriceListID
      })
    }
    orderinfo.ItemData = productsInfo;
    orderinfo = JSON.stringify(orderinfo);
    console.log('orderinfo', orderinfo);
    order.doOrder(orderinfo, (data) => {
      console.log(data);
    })
  },






  // 显示收款记录对话框
  showPopup: function () {
    var that = this;
    that.setData({
      showPopup: true
    })
  },
  // 生成收款记录
  GatherFormSubmit: function (e) {
    var that = this;
    var gather = {};
    if (!e.detail.value.payway) {
      this.showTips('收款提示', '请填写支付方式');
      return;
    } else if (!e.detail.value.payitem) {
      this.showTips('收款提示', '请填写费用形态');
      return;
    } else if (!e.detail.value.moneyamount) {
      this.showTips('收款提示', '请填写收款金额');
      return;
    } else if (!e.detail.value.serialNumber && e.detail.value.payway != '1' && e.detail.value.payway != '2' && e.detail.value.payway != '5') {
      this.showTips('收款提示', '请填写收款流水号');
      return;
    }
    gather.OperFlag = 'A';
    gather.fUsrID = '0';
    gather.pUserAccount = '0';
    gather.fGatherID = '0';
    gather.fAmount = e.detail.value.moneyamount;
    gather.fCostType = e.detail.value.payitem;
    gather.fPayFlag = e.detail.value.payway;
    gather.fBanksNo = e.detail.value.serialNumber;
    gather.fOrdNo = that.data.orderno;
    // console.log('gather');
    // console.log(gather);
    order = new Order();
    order.doGathering(gather, (data) => {
      // 其他收款方式，插入收款记录成功，隐藏收款记录的对话框即可
      // 微信，支付宝的收款
      var that = this;
      console.log('doGathering', data);
      if (data.Code && data.Code == 1001) {
        console.log('doGathering');
        console.log(data);
        wx.showToast({
          title: '收款单已成功生成',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          showPopup: false
        })
      } else {
        console.log('base64', base64);
        const base64 = data;
        that.setData({
          QrCodeUrl: base64,
          showQRCode: true,
          showPopup: false,
          fAmount: e.detail.value.moneyamount,
          fOrdNo: that.data.orderno,
          OrderID: that.data.OrderID,
        });
      }
    })
  },
  bindDateChange: function (e) {
    console.log(e)
    this.setData({
      date: e.detail.value
    })
  },
  onofferdate: function (e) {
    this.setData({
      OfferDate: e.detail.value
    })
  },
  ondeliverydate: function (e) {
    this.setData({
      DeliveryDate: e.detail.value
    })
  },
  goToReturnOrder: function (event) {
    var OrderID = event.currentTarget.dataset.OrderID,
      orderNo = event.currentTarget.dataset.orderno,
      customerName = event.currentTarget.dataset.customername,
      mobile = event.currentTarget.dataset.mobile,
      fFgName = event.currentTarget.dataset.ffgname,
      fFgNo = event.currentTarget.dataset.ffgno,
      fImageUrl = event.currentTarget.dataset.fimageurl,
      fQuantity = event.currentTarget.dataset.fquantity,
      fSalunitprice = event.currentTarget.dataset.fsalunitprice,
      fSupplysourse = event.currentTarget.dataset.fsupplysourse,
      fFgID = event.currentTarget.dataset.ffgid,
      fFormindex = event.currentTarget.dataset.fformindex
    wx.navigateTo({
      url: '../aftersales/aftersales?from=order' + '&orderNo=' + orderNo + '&OrderID=' + OrderID + '&customerName=' + customerName + '&fFgNo=' + fFgNo + '&fFgName=' + fFgName + '&mobile=' + mobile + '&fImageUrl=' + fImageUrl + '&fQuantity=' + fQuantity + '&fSalunitprice=' + fSalunitprice + '&fSupplysourse=' + fSupplysourse + '&fFormindex=' + fFormindex + '&fFgID=' + fFgID,
    })
  },

  goToOrderList: function (event) {
    var OrderID = event.currentTarget.dataset.OrderID
    wx.navigateTo({
      url: '../order/order?OrderID=' + OrderID,
    })
  },
  goToHomePage: function () {
    wx.switchTab({
      url: '../home/home',
    })
  },
  goToCart: function () {
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  cancle: function (event) {
    var fFormindex = event.currentTarget.dataset.fformindex;
    var that = this;
    var productTempArr = that.data.productsArr;

    productTempArr[fFormindex].OrderItemType = "0";
    // for (var index in productTempArr) {
    //   if (fFormindex == productTempArr[index].fFormindex) {
    //     productTempArr[index].OrderItemType = "FALSE";
    //   }
    // }
    that.setData({
      productsArr: productTempArr,
      revise: true,
    })

  },
  reviseorderhead: function () {
    this.setData({
      revise: true
    })
  },
  
  /* Custom */
  OpenCustomList: function () {
    var that = this;

    var tmpbool = true
    if(that.data.bCustomBox) tmpbool = false;
    
    this.setData({
      bCustomBox: tmpbool,
    })
  },
  ClearCustomObj: function () {
    var that = this;
    that.setData({
      CustomUID: '',
      CustomName: '',
      CustomPhone: '',
      CustomEmail: '',
      CustomAddress: '',
    });

    that.OpenCustomList();
  },
  GetCustomList: function (searchType, keyword) {
    var that = this;
    var param = {};
    param.pUID = app.globalData.nUserID;
    param.pAccount = app.globalData.pUserAccount;

    if (searchType == undefined) {
      searchType = '';
    }
    if (keyword == undefined) {
      keyword = '';
    }

    param.pSearchType = searchType.toString();
    param.pSearchText = keyword;
    
    console.log('===param===', param);
    customerflow.getCustomerFlowList(param, (data) => {
      var customlist = data.Data;
      console.log('orderlist',customlist);

      if (customlist.length > 0) {
        that.setData({
          CustomList: customlist,
        })
      } else {
        that.setData({
          CustomList: [],
        })
      }
    });
  },
  selectTap() {
    this.setData({
      CustomShow: !this.data.CustomShow
    });
  },
  optionTap(e) {
    let CustomIndex = e.currentTarget.dataset.index;
    this.setData({
      CustomIndex: CustomIndex,
      CustomShow: !this.data.CustomShow,
      Customhadselect: true,
      CustomSearchType: CustomIndex
    });
  },
  getInput: function (event) {
    console.log('getInput', event.detail.value)
    this.setData({
      CustomKeyword: event.detail.value
    })
  },
  searchOrder: function (event) {
    let CustomKeyword = event.currentTarget.dataset.keyword; //获取点击的下拉列表的下标
    let CustomSearchType = event.currentTarget.dataset.searchtype;
    console.log('keyword', CustomKeyword);
    console.log('searchType', CustomSearchType);
    console.log('searchOrder');
    this.setData({
      CustomList: []
    })
    this.GetCustomList(CustomSearchType, CustomKeyword);
    this.setData({
      CustomKeyword: CustomKeyword,
      CustomSearchType: CustomSearchType,
    })
  },
  SetOrderCustom: function (event) {
    console.log('event', event);

    var that = this;
    var CustomListIndex = event.currentTarget.dataset.index;
    var CustomObj = that.data.CustomList[CustomListIndex];
    console.log('CustomObj', CustomObj);

    var CustomPhone = '';
    if(CustomObj.pCustomPhoneNumber != '' && CustomObj.pCustomPhoneNumber != undefined && CustomObj.pCustomPhoneNumber != null)
    {
      CustomPhone = CustomObj.pCustomPhoneNumber;
    }
    else 
    {
      CustomPhone = CustomObj.pCustomHomeNumber;
    }
    
    that.setData({
      CustomUID: CustomObj.pCustomUID,
      CustomName: CustomObj.pCustomName,
      CustomPhone: CustomPhone,
      CustomEmail: CustomObj.pCustomEmail,
      CustomAddress: CustomObj.pCustomAddress,
    });

    this.OpenCustomList();
  },
  sale(){
    wx.navigateTo({
      url: '/pages/sale/sale',
    })
  },
  saleDiscount(){
    var that = this
    var discount = 1
    var sum = 0 //會員扣點
    var finalDisPrice = 0

    that.data.sales.forEach((item)=>{
      if(item.check == true){
        if(item.type == 1){
          discount *= (1 - item.percent / 100)
        }
        else if(item.type == 2){
          sum = parseInt(sum) + item.price
          if(item.name == '會員扣點'){
            that.setData({
              Order_FullPrice_Sale: item.price
            })
          }
        }
      }
    })

    that.data.productsArr.forEach((item)=>{
      //總共折扣多少(只有%系列的)
      finalDisPrice = finalDisPrice + (item.List_Price - Math.round(item.List_Price * discount)) * item.counts
      //設定每個在購物車的商品的pSale
      that.setData({
        ['productsArr['+item.CartIndex+'].pSale'] : item.List_Price - Math.round(item.List_Price * discount)
      })
    })

    that.setData({
      finalDisPrice: finalDisPrice + parseInt(sum),
      salediscount: discount
    })
  }
})