 Page({
  data: {
    lat:0,
    long:0,
    ctl:[],
    prints:[]//这个时候就是动态获取这个大头针所在的地方基本data然后做标记
  },
  //生命周期函数--监听页面加载
  onLoad: function () {//页面在未渲染完成之前的一个生命周期的方法
    //得到当前页面对象this赋给一个变量
    var tt=this;//this就是page对象 包括其中的属性lat long
    wx.getLocation({  //获得位置而不是map
      success: function(res) {
        //成功返回 res的经纬度赋给新的变量保存
        var lt=res.latitude;
        var lg=res.longitude;
        //再在设置this中的相应属性进行赋值
        tt.setData({
            lat:lt,
            long:lg
        })
      

      },
    });
    //得到设备的大小然后将数据设置其中概念同上 函数查文档所得
    wx.getSystemInfo({
      success: function(res) {
        var usefulwidth=res.windowWidth;
        var usefulheight=res.windowHeight;
        tt.setData({
          ctl: [
            {//扫码按钮
              id: 1,
              iconPath: '/image/scancode.png',
              position:{
                width:32,
                height:32,
                left:usefulwidth/2-16,
                top:usefulheight-100
              },
              clickable: true//是否可点击
            }//水平轴是从左开始的让它居中除一半后 还得减去自身width的一半
            //height是从顶开始，usef那个值指最大有用长度，其实是无地显示东西的，
            //让它距离顶部多远，实则是让它距离底部多远，因为这个时候坐标在底部了max，
            //相当于在底部往上min走，所以离底部多少实际是物体底边距离底部高度，即
            //usefheight减去距离（物体上部距离底部）再加上本身高度
            ,
            {//保修按钮
              id: 2,
              iconPath: '/image/callfix.png',
              position: {
                width: 32,
                height: 32,
                left: usefulwidth / 3 - 16,
                top: usefulheight - 100
              },
              clickable:true//是否可点击
            },
            {//充值按钮
              id: 3,
              iconPath: '/image/recharge.png',
              position: {
                width: 32,
                height: 32,
                left: usefulwidth*2 / 3 - 16,
                top: usefulheight - 100
              },
              clickable: true//是否可点击
            },
            {//自定位按钮
              id: 4,
              iconPath: '/image/local.png',
              position: {
                width: 20,
                height: 20,
                left: usefulwidth / 10 - 10,
                top: usefulheight - 30
              },
              clickable: true//是否可点击
            },
          
            {//打头阵图标
              id: 5,
              iconPath: '/image/centerdot.png',
              position: {
                width: 40,
                height: 40,
                left: usefulwidth / 2 - 20,
                top: usefulheight/2-40 
              },//注意纵坐标那儿不是减一半高度 而是整个高度
              clickable: true//是否可点击
            },
            {//添加按钮
              id: 6,
              iconPath: '/image/add.svg',
              position: {
                width: 32,
                height: 32,
                left: usefulwidth  / 6 - 16,
                top: usefulheight - 100
              },
              clickable: true//是否可点击
            }
            ]
        })
      },
    })
    

  },
  //事件绑定函数 控件被点击由wxml中bindcontroltap属性声明 然后此处定义
  localtap:function(e){//将事件传入 随便一个字母都行e 因为event好记
    //console.log(e)  打印所触发的事件 发现事件由id区分不同 因此就去获取id
    var itemid=e.controlId;//获取当前对象的id赋给一个变量 具体方法查文档
    //console.log(itemid)//可以打印出来试试 然后跳出创建onready
//由于if太多所以直接用switch      //if(itemid==4){
                        //this.mapCtx.moveToLocation()//直接文档说明了的  记住了原来中心的位置
                       //}
    var  dd=this;//case 6中的要求要先得到当前对象  由于之前是局部生命 所以此处要再次
    switch(itemid){
      case 4:{//回到自定位按钮
        this.mapCtx.moveToLocation();
        break;
      };
      //below都是case6注解
        //在xm中声明这个属性 查文档可知为markers 添加新的标记
        //由于要知道当前大头针所在的位置 应该在这个绑定函数中声明当前对象把它赋给dd 即找到对象
        //获取已有的标记车辆
        // var bikes= dd.data.prints;//由于markers的自定义变量是data里的属性 so 这样就能直接获取  注释掉因为之后可以从数据库中获取
                                  //此时bikes是个数组
//添加新车 用堆栈来加入 
//bikes.push({//其中设置新车的属性
//iconPath:"/image/bikes.svg",
//width:30,
//height:30,
//longitude:dd.data.long,//就将动态获取的经纬度赋给新车 不能直接赋值long  如18行所示
//latitude:dd.data.lat//它是先把这个调出来赋给了一个新的变量 然后直接拿这个变量赋给当前
//});//到此就把属性设置完成了   还缺一部 就是起初markers的自定义属性prints里没有任何东西  我们要把现在添加新车后的数据返回给它  才能在图中显示出来 so在完成前要返回 在break前将这个东西返回回去 同ctl一样 用setdata返回
      //换成这个
      case 6: {//添加新room按钮
        this.mapCtx.getCenterLocation({//直接得到移动后的
          success: function (res) {//将其返回给对象
            
        //   bikes.push({//其中设置新车的属性
        //     iconPath: "/image/bikes.svg",
        //     width:20,
        //     height:20,
        //     longitude: res.longitude,
        //     latitude: res.latitude
        // });
        //   dd.setData({//这儿个功能实现了什么或设置了什么就返回什么
        //     prints: bikes
        //   });//重新赋值
    //查wx文档-发起请求 直接将这些添加的信息发送请求给springboot 直接存入其中  
            wx.request({
              url: 'http://localhost:8080/addbike',//的接口地址
              data: {
                longitude: res.longitude,
                latitude: res.latitude
              },
              method:'POST',
              // header: {
              //   'content-type': 'application/json' // 默认值
              // },
              success(res) {
                console.log(res.data) //然后返回spring进行设置
              }
            })
          }//然后进入第四章 点击扫码弹出注册页面  所以先给扫码case1绑定事件
        })
        break;
      };//此时发现只能在中心点那儿添加n次  查后台app那儿可知 移动后不能加  
      //缺少一个移动后的绑定事件 查文档  bindregionchage那个函数   又得在xm中声明
      case 1: {//点击扫瞄按钮
            //根据用户的状态，跳转到相应页面 但是如果把用户数据保存至page的data里只能这个页面能共享数据  其他页面不能  
            //所以点到 app.js里去设置为全局 然后用getApp去调globalApp方法获取其中设置的属性赋给新的标量

            var userstatus = getApp().globalData.status;/*一定要注意getapp那儿有括号呀！！！*/

            if(userstatus=="0"){//如果状态为零 跳转到注册页面(新增页面要单独去app.json声明 pages下自动生成相应页面文件夹)
              wx.navigateTo({//找到各自的文件夹（父） 如果为同级  然后再往上一级进入 ./两代 。。/三代
                url: '../register/register'//不用说具体哪个 自动匹配 其实先xml xss 再json 最后js
              })//然后进入wxui进行美化 github里weui下载 然后点开dist中style二选一 在这儿创建一个目录放入其中
              
            }
            break;//app.json是软件直接显示的页面 组件  一进来想直接进入注册 就把该声明放第一 有顺序的

      } 
    }                    
  },
  onReady:function(){//生命周期函数--监听页面初次渲染完成
    this.mapCtx = wx.createMapContext('mymap')
  },//创建上下文  传给当前对象的mapctx 保存之前的地址信息  传入原数据所在的id  实现上边switch的事件响应
  //添加新车的绑定函数
  anywhereadd:function(e){
                // console.log(e) 可以看到type不同  我们要的是之后的位置 所以下边可以从这儿入手
//var etype=e.type
                //console.log(etype)
//var hh=this
//if(etype=='end'){
//this.mapCtx.getCenterLocation({//同location那个 一样 120和152行它是分开声明和定义的 这儿是直接调用
//success: function (res) {//loca那个要先用onready声明 所以直接调this.mapctx就行
                                //   此处也要用onready声明同样的东西  因已声明所以直接用了
                                //跟12那儿不同  那儿是获取位置不是map//又要获取当前移动后的对象 将其信息重新赋值  所以还得得到对象
//hh.setData({
//long:res.longitude,
//lat:res.latitude//上述的赋值是 var了前边的属性名 定了类型 所以用等号 这儿可直接冒号
//});
//}
//});
    
//};
//}
}
 });
