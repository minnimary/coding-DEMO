// pages/register/register.js
Page({

  /**
   * 页面的初始数据   当前页面的相关项
   */
  data: {
    countryCodes: ["86", "80", "84", "87","90"],//手机号的前缀  国家代码
    countryCodeIndex: 0,//默认为哪个代码 索引号就为几
    phoneNum: "",
    isShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  bindCountryCodeChange: function (e){//如果国家代码变了 就把索引号指向选择的那项
    //console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },

  inputPhoneNum: function (e) {//这个事件是由wxml里那个input后绑定的事件一致对应的
    console.log(e)
    
    if (e.detail.value.length==11){
      //js正则表达式判断手机号格式
      
    if (/^1[3456789]\d{9}$/.test(e.detail.value)){
        this.setData({//输入的手机号值传到手机号的变量中 即当前页面相关项中
          phoneNum: e.detail.value,
          isShow: false
        })
      }
      else{
        this.setData({//输入的手机号值传到手机号的变量中 即当前页面相关项中
          phoneNum: e.detail.value,
          isShow: true
        })
      }
    }
    else{
      this.setData({//输入的手机号值传到手机号的变量中 即当前页面相关项中
        phoneNum: e.detail.value,
        isShow: true
      })
    }
  },

  genVerifyCode: function () {//wxml里的bindtap一直对应的事件  获取验证码 按钮
    var index = this.data.countryCodeIndex;//获取国家代码索引号
    var countryCode = this.data.countryCodes[index];//根据索引号取值
    var phoneNum = this.data.phoneNum;//获取手机号
    console.log(phoneNum);
    console.log(countryCode);
    wx.request({
      // 小程序访问的网络请求协议必须是https，url里面不能有端口号
      url: "http://localhost:8080/user/genCode2",
      data: {//传递的参数
        'countryCode': countryCode,//这儿的赋值项均为var出来的变量 
        'phoneNum': phoneNum//而不是一开始定义的变量数组 phoneNum是var那儿的
      },
      method: 'GET',//发送请求的方式
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '验证码已发送',
          icon: 'success',
          duration: 2000
        })
        // console.log(res);
      }
    })
  },

  formSubmit: function (e) {
    var phoneNum = e.detail.value.phoneNum
    var verifyCode = e.detail.value.verifyCode

    // 发送手机号和验证码进行校验
    wx.request({
      url: "http://localhost:8080/user/verify",
      // 修改请求头类型
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        phoneNum: phoneNum,
        verifyCode: verifyCode
      },
      method: "POST",
      success: function (res) {
        // 如果校验成功，那么就将手机信息保存到mongo中
        if (res.data) {
          wx.request({
            // 微信小程序成产环境请求的协议必须是https，地址必须是域名，不能带端口号
            url: "http://localhost:8080/user/register",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            // data: e.detail.value,
            // method: 'POST',
            // success: function (res) {
            //   // 将手机号写入到手机的磁盘中
            //   wx.setStorageSync("phoneNum", phoneNum)
            //   // 将手机号保存到到内存
            //   var globalData = getApp().globalData
            //   globalData.phoneNum = phoneNum
            //   globalData.status = "deposit"
            //   // 手机信息保存到mongo后，然后跳转到交押金页面
            //   wx.navigateTo({
            //     url: '../deposit/deposit'
            //   })
            // }
            data: {
              phoneNum: phoneNum,
              regDate: new Date(),
              status: 1
            },


            success: function(res) {
              if (res.data) {
                // 将手机号保存到到内存
                var globalData = getApp().globalData;
                globalData.phoneNum = phoneNum;
                globalData.status = 1;

                // 将手机号写入到手机的磁盘中
                wx.setStorageSync("phoneNum", phoneNum);
                wx.setStorageSync("status", 1);

                // 跳转到充值页面
                wx.navigateTo({
                  url: '../deposit/deposit',
                })

              } else {
                wx.showModal({
                  title: '提示',
                  content: '服务端错误，请稍后再试',
                })
              }
            }
            
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '验证码有误，请重新输入！',
            showCancel: false
          })
        }
      }
    })
  }
})