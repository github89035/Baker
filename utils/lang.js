let T = {
    locale: null,
    locales: {},
    langCode: ['zh-TW', 'zh-CN', 'en'],
    lastLangIndex: 0
}

T.registerLocale = function (locales) {
    T.locales = locales;
}

T.setLocale = function (code) {
    T.locale = code;
}

T.setLocaleByIndex = function(index) {
    T.lastLangIndex = index;
    T.setLocale(T.langCode[index]);

    //setNavigationBarTitle(index);
    setTabBarLang(index);
}

T.getLanguage = function() {
    //setNavigationBarTitle(T.lastLangIndex);
    return T.locales[T.locale];
}

T.CheckLanguage = function() {
    var langIndexTemp = wx.getStorageSync('langIndex')

    if(langIndexTemp=='')
    {
        wx.getSystemInfo({
            success: function(res) {
              return T.CheckSystemLanguage(res.language)
            }
          })
        return 0;
    }
    else
    {
        return langIndexTemp;
    }

}

T.CheckSystemLanguage= function(lang) {
    if(lang=='zh-TW')
    {
        return 0;
    }
    if(lang=='zh-CN')
    {
        return 1;
    }
    if(lang=='en-US')
    {
        return 2;
    }
}

function setNavigationBarTitle(index) {
    wx.setNavigationBarTitle({
        title: navigationBarTitles[index]
    })
}

  let navigationBarTitles = [
    'Baker TW',
    'Baker TW',
    'Baker TW',
  ];

  let tabBarLangs = [
    [
        '主頁',
        '分類',
        '購物車',
        '我的資訊'
    ],
    [
        '主页',
        '分类',
        '购物车',
        '我的资讯'
    ],
    [
        'HOME',
        'CLASSIFY',
        'CART',
        'OPTION'
    ]
  ];

function setTabBarLang(index) {
    let tabBarLang = tabBarLangs[index];

    tabBarLang.forEach((element, index) => {
        wx.setTabBarItem({
        'index': index,
        'text': element
        })
    })  
}

T.setNavigationBarTitle = function() {
    wx.setNavigationBarTitle({
        title: navigationBarTitles[T.lastLangIndex]
    })
}

export default T