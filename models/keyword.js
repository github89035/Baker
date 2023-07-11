class KeywordModel {
  key = 'q'
  maxLength = 10
  getHistory() {
    const words = wx.getStorageSync(this.key)
    if (!words) {
      return [];
    }
    return words;

  }
  addToHistory(keyword) {
    console.log('----keyword---',keyword);
    keyword = keyword.trim();
    if(keyword==''){
      return;
    }
    let words = this.getHistory()
    const has = words.includes(keyword);

    if (!has) {
      const length = words.length
      if (length >= this.maxLength) {
        words.pop()
      }
      words.unshift(keyword);
      wx.setStorageSync(this.key, words)
    }

  }
  AllDelete(){
    wx.clearStorageSync(this.key);
  }
}
export {KeywordModel}