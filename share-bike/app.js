//app.js
App({
  onLaunch: function () {
   
  },
  globalData: {//该页面则是存储的是json数据  全局共享的
    userInfo: null,
    //在此设置初始状态 再在index.js中去抓取这个全局数据
    status:0
  }
})