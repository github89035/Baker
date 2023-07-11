import {
  Base
} from '../../utils/base.js';

class Product extends Base {
  constructor() {
    super();
  }
  /*获取主题下的商品列表*/
  getDetialInfo(Item_No, Item_No_Prefix, StyleNum, ItemName, FinishTexture, Finish2Texture, StyleTexture, Options, SetSize, PillowS, pSectionType, callback) {
    var param = {
      url: 'FgDesc/FgDescShow',
      type: 'POST',
      data: {
        Item_No: Item_No,
        Item_No_Prefix: Item_No_Prefix,
        ItemName: ItemName,
        StyleNum: StyleNum,
        FinishTexture: FinishTexture,
        Finish2Texture: Finish2Texture,
        StyleTexture: StyleTexture,
        Options: Options,
        fSetSize: SetSize,
        PillowS: PillowS,
        pSectionType: pSectionType,
      },
      sCallback: function (data) {
        console.log('data:', data)
        callback && callback(data);
      }
    };
    this.request(param);
  }
}
export {
  Product
};