import { Theme } from 'theme-model.js';
var theme = new Theme(); //实例化 首页 对象
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.data.name = options.name;
    //设置专题名称
    this._loadData();
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.name,
    })
  },
  /*加载所有数据*/
  _loadData: function () {
    var that = this;
    // 获得主题产品信息
    theme.getProductsData(this.data.id,(data) => {
      that.setData({
        themeInfo: data,
      });
    });
  },

  onProductsItemTap: function (event) {
    var id = theme.getDataSet(event, 'id')
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },
})