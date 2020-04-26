var test = 'qhclub.qianhefood.com:18081/' //测试环境
var prod = 'qhclub.qianhefood.com:18091/' //生产环境
var headurl = `https://${__wxConfig.envVersion === 'release' ? prod : test}`


var imgurl = `${headurl}imgs/`,
  audiourl = `${headurl}audio/`,
  staticimg = `${headurl}static/`
class api {

  getheadurl() {
    return headurl;
  }

  getstaticimg() {
    return staticimg;
  }
  getimgurl() {
    return imgurl;
  }
  getaudiourl() {
    return audiourl;
  }
  /**
   * 登录
   */
  wxlogin(code, success) {
    fstpostdata('login/wxlogin', {
      jscode: code
    }, res => success(res))
  }

  uploadimg(data, params) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0, //上传失败的个数
      pics = data.pics ? data.pics : [];
    wx.uploadFile({
      header: {
        'content-type': "application/x-www-form-urlencoded",
        token: getApp().logininfo.Token,
        userid: getApp().logininfo.userid
      },
      url: data.url,
      filePath: data.path[i],
      name: 'upload', //这里根据自己的实际情况改
      formData: null, //这里是上传图片时一起上传的数据
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        let result = JSON.parse(resp.data);
        pics.push(result.path);
        console.log(pics, "picssss")
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1 
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        i++; //这个图片执行完上传后，开始上传下一张            
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          params.success(pics);
        } else { //若图片还没有传完，则继续调用函数                
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          data.pics = pics;
          that.uploadimg(data, params);
        }
      }
    });
  }
  // 前端获取轮播图列表
  // Lbimgs/ft_getlist
  getBaanerList(succ) {
    postdata('Lbimgs/ft_getlist', {}, res => succ(res))
  }

  // 前端获取商品分类列表
  // Goodstype/ft_getlist
  getCommodityList(succ) {
    postdata('Goodstype/ft_getlist', {}, res => succ(res))
  }

  // 前端获取全部商品列表
  // Goods/ft_getall
  getAllCommodityGoods(data, succ) {
    postdata('Goods/ft_getall', data, res => succ(res))
  }
  // 前端获取团购商品列表
  // Teamactivity/ft_getlist
  getAllgroupGoods(data, succ) {
    postdata('Teamactivity/ft_getlist', data, res => succ(res))
  }
  // 前端获取团购商品详情
  // Teamactivity/ft_getlist
  getgroupGoodsDetail(id, succ) {
    postdata('Teamactivity/ft_getdetail', id, res => succ(res))
  }
  // 前端获取团购商品详情获取拼团列表
  // Teamactivity/ft_getlist
  getallgoodsactivities(data, succ) {
    postdata('Teamactivity/ft_getallgoodsactivities', data, res => succ(res))
  }


  // 前端根据分类获取商品列表
  // Goods / ft_getlistbycids
  getCommodityGoods(data, succ) {
    postdata('Goods/ft_getlistbycid', data, res => succ(res))
  }
    // 前端根据全部分类获取商品列表
  // Goods / ft_getlistbycids
  getCommodityGood(data, succ) {
    postdata('Goods/ft_getalllist', data, res => succ(res))
  }
  // 前端获取商品详情
  // Goods/ft_getdetail
  // id
  getGoodsDetail(id, succ) {
    postdata('Goods/ft_getdetail', {
      id
    }, res => succ(res))
  }
  //   前端获取收货地址列表
  //   Address/ft_getlist
  // userid
  getaddresslist(succ) {
    postdata('Address/ft_getlist', {}, res => succ(res))
  }
  // 前端添加/编辑收货地址
  // Address / ft_aoe
  // id  可选
  // userid
  // name
  // phone
  // province  省份
  // city   市
  // county 县 / 区
  // street  街道
  // isdefault 0 非默认 1 默认
  addAddress(data, succ) {
    postdata('Address/ft_aoe', data, res => succ(res))
  }
  //   前端获取地址详情
  //   Address/ft_getdetail
  // id
  getaddAddressDetail(id, succ) {
    postdata('Address/ft_getdetail', {
      id
    }, res => succ(res))
  }
  //   前端删除收货地址
  //   Address/ft_deladdress
  // id
  // userid
  deladdress(id, succ) {
    postdata('Address/ft_deladdress', {
      id
    }, res => succ(res))
  }
  //   前端取消/设为默认地址
  // Address / ft_setdefault
  // id
  setaddresscheck(id, succ) {
    postdata('Address/ft_setdefault', {
      id
    }, res => succ(res))
  }
  //   用户购物车添加商品
  //   Cart/ft_cartadd
  // userid
  // goodscount 商品数量
  // price  总价格
  // goodsnum  商品编号
  addshoppingCart(data, succ) {
    postdata('Cart/ft_cartadd', data, res => succ(res))
  }
  //   用户获取购物车列表
  //   Cart/ft_getcarts
  // userid
  // start
  // pagesize
  getCartlist(data, succ) {
    postdata('Cart/ft_getcarts', data, res => succ(res))
  }
  //   用户购物车删除商品
  //   Cart/ft_delcart
  // id
  // userid
  // start
  // pagesize
  delCartlist(data, succ) {
    postdata('Cart/ft_delcart', data, res => succ(res))
  }
  //   用户购物车删除商品
 
    deleteAll(data, succ) {
      postdata('Cart/batchdel', data, res => succ(res))
    }
  // 前端获取美食秀秀列表
  getshowlist(data,  succ)  {  
    postdata('Cateshow/ft_getlist',  data,  res  =>  succ(res))
  }
  // 前端获取美食秀秀关注列表
  getshowfocuslist(data,  succ)  {  
    postdata('Cateshow/ft_getlist',  data,  res  =>  succ(res))
  }

  // 前端发布美食秀秀
  addshows(data,  succ)  {  
    postdata('Cateshow/ft_add',  data,  res  =>  succ(res))
  }


  // 前端获取我的美食秀秀列表
  getmyshowlist(data,  succ)  {  
    postdata('Cateshow/ft_getmylist',  data,  res  =>  succ(res))
  }
  //前端获取美食秀秀详情
  getmyshowdetail(data,  succ)  {  
    postdata('Cateshow/ft_getdetail', data,  res  =>  succ(res))
  }
  // 前端美食点赞或取消
  // Cateshow/ft_favor
  // cateid 
  give_the_thumbs_up(cateid,  succ)  {  
    postdata('Cateshow/ft_favor', {
      cateid
    },  res  =>  succ(res))
  }
  // 前端美食关注或取消
  // Cateshow/ft_follow
  // cateuserid
  tofollow(cateuserid,  succ)  {  
    postdata('Cateshow/ft_follow', {
      cateuserid
    },  res  =>  succ(res))
  }
  //  前端美食秀秀添加评论
  addcontents(data,  succ)  { 
    postdata('Cateshow/ft_addcom', data,  res  =>  succ(res))
  }
  // 前端获取美食评论列表
  getcontentslist(data,  succ)  { 
    postdata('Cateshow/ft_getcomlist', data,  res  =>  succ(res))
  }

  // coupon/ft_getlistbypage
  // 获取优惠券列表
  // pagesize
  // start
  getCouponlist(data,  succ)  { 
    postdata('coupon/ft_getlistbypage', data,  res  =>  succ(res))
  }
  // ----------------------
  // users/getcoupon
  // 领取优惠券
  // cid
  receivecoupon(cid, succ)  {
    postdata('Users/getnewcoupon', {
      cid
    },  res  =>  succ(res))
  }
  // 获取新人弹窗信息
  getNewUserCoupon(succ) {
    postdata('NewCoupon/getNewCoupon', {}, res => succ(res))
  }
  // dishes/findbyid
  // 获取菜谱详情
  // id
  getdishesdetails(id, succ)  {
    postdata('dishes/findbyid', {
      id
    },  res  =>  succ(res))
  }

  // dishes/findbyid
  // 获取菜谱详情
  // id
  getrank(data, succ)  {
    postdata('dishes/getrank', data,  res  =>  succ(res))
  }
  // scoregoods/getall
  // （前端/后台）前端获取全部积分商品列表
  // pagesize
  // start
  getscoregoodslist(data,  succ)  { 
    postdata('scoregoods/ft_getall', data,  res  =>  succ(res))
  }
  // scoregoods/getdetail
  // （前端/后台）获取积分商品详情
  // id
  getscoregoodsdetails(id, succ)  {
    postdata('scoregoods/ft_getdetail', {
      id
    },  res  =>  succ(res))
  }

  // 后台举报评论
  // cateshow/report
  // id
  reportuser(id, succ)  {
    postdata('cateshow/report', {
      id
    },  res  =>  succ(res))
  }
  // users/getmine
  // 我的页面获取信息
  getmine(succ) {
    postdata('users/getmine', {}, res => succ(res))
  }
  // 用户是否能购买积分商品
  // scoregoods/canbuy
  // id
  canbuy(id, count, succ)  {
    postdata('scoregoods/canbuy', {
      id,
      count
    },  res  =>  succ(res))
  }

  // 用户是否能购买积分商品
  // scoregoods/canbuy
  // id
  payscore(number, succ)  {
    postdata('orders/payscore', {
      number
    },  res  =>  succ(res))
  }




  // collection/collect
  // 用户收藏/取消
  // goodsid
  // isscore T积分商品 F普通

  collectiongoods(data,  succ)  { 
    postdata('collection/collect', data,  res  =>  succ(res))
  }

  // collection/ft_getlist
  // 前端获取我的收藏
  // start
  // pagesize
  // isscore T积分商品 F普通

  getcollectionlist(data,  succ)  { 
    postdata('collection/ft_getlist', data,  res  =>  succ(res))
  }

  // cateshow/ft_getfolloworfanslist
  // start
  // pagesize
  // isfollow 0关注 1粉丝

  getfolloworfanslist(data,  succ)  { 
    postdata('cateshow/ft_getfolloworfanslist', data,  res  =>  succ(res))
  }

  // cateshow/ft_getfolloworfanscounts
  // 前端获取关注和粉丝数量
  getfolloworfanscounts( succ)  { 
    postdata('cateshow/ft_getfolloworfanscounts', {},  res  =>  succ(res))
  }

  // dishes/ft_gettwplist
  // 获取所有调味品
  gettwplist( succ)  { 
    postdata('dishes/ft_gettwplist', {},  res  =>  succ(res))
  }

  // labels/ft_getinterestinglist
  // 前端获取兴趣标签
  getinterestinglist(succ)  { 
    postdata('labels/ft_getinterestinglist', {},  res  =>  succ(res))
  }

  // card/getcard
  // 获取卡信息
  getcard(succ)  { 
    postdata('users/getcard', {},  res  =>  succ(res))
  }
  // users/setcard
  // 创建会员卡
  setcard(data, succ)  { 
    postdata('users/setcard', data,  res  =>  succ(res))
  }
  // users/editcardinfo
  // 修改会员信息
  editcardinfo(data, succ) { 
    postdata('users/editcardinfo', data,  res  =>  succ(res))
  }
  // 解析手机号
  // users/gete
  // edata
  // iv
  getphone(data, succ) { 
    postdata('users/gete', data,  res  =>  succ(res))
  }
  // users/share
  // 拉新操作
  // shareuid share带的参数id
  share(shareuid, path, succ) {   
    postdata('users/share', {
      shareuid,
      path
    },  res  =>  succ(res))
  }
  // users/getsharelist
  // 获取拉新列表
  // start
  // pagesize

  getsharelist(data, succ) {   
    postdata('users/getsharelist', data,  res  =>  succ(res))
  }

  // users/getuserscorelist
  // 获取积分记录列表
  // start
  // pagesize
  getuserscorelist(data, succ) {   
    postdata('users/getuserscorelist', data,  res  =>  succ(res))
  }
  // users/getgrowthlist
  // 获取成长值记录列表
  // start
  // pagesize
  getgrowthlist(data, succ) {   
    postdata('users/getgrowthlist', data,  res  =>  succ(res))
  }

  // 获取我的优惠券
  getmycouponlist(state, succ) {   
    postdata('coupon/ft_getmylist', {
      state
    },  res  =>  succ(res))
  }

  // 我的奖品
  getmyawardlist(data,  succ)  {  
    postdata('awards/ft_getmyawardlist',  data,  res  =>  succ(res))
  }


  // end王林洁

  // 刘宜婷
  // 抽奖活动
    
  awardsgetlist(data, succ) {      
    postdata('awards/ft_getlist', data,  res  =>  succ(res))    
  }
  // pagesize
  // start

  // 抽奖活动详情
  awardsfindbyid(succ) {      
    postdata('awards/findbyid', {},  res  =>  succ(res))    
  }
  // 获取是否有抽奖活动
  getawardinfo(succ) {
    postdata('awards/ft_getawardinfo', {}, res => succ(res))
  }
  // id

  // 获取抽奖的奖品
  awardsgetallg(id, succ) {      
    postdata('awards/bk_getall_g', {
      id
    },  res  =>  succ(res))    
  }
  awardschou(id, succ) {      
    postdata('awards/chou', {
      id
    },  res  =>  succ(res))    
  }
  // id
  //simon

  setCartcount(data, succ) {
    postdata('Cart/ft_setcount', data, res => succ(res))
  }

  addorder(data, succ) {
    postdata('orders/ft_createorder', data, res => succ(res))

  }
  //活动创建
  groupgoods(data, succ) {
    postdata('Teamactivity/ft_adddetail', data, res => succ(res))
  }
  //加入活动
  addmember(data, succ) {
    postdata('Teamactivity/ft_addmember', data, res => succ(res))
  }
  //我的订单
  memberOrder(data, succ) {
    postdata('Teamactivity/ft_getmyactivities', data, res => succ(res))
  }

  order_list(data, succ) {
    postdata('orders/ft_getlistbystate', data, res => succ(res))

  }

  updateUser(data, succ) {
    postdata('users/updateUser', data, res => succ(res))

  }

  getshowfocuslist(data, succ) {
    postdata('cateshow/ft_getmyfollowlist', data, res => succ(res))
  }

  getshowfocuspeoplelist(data, succ) {
    postdata('cateshow/ft_getfolloworfanslist', data, res => succ(res))
  }

  getshowfocuspeoplecounts(succ) {
    postdata('cateshow/ft_getfolloworfanscounts', {}, res => succ(res))
  }
  getnews(data, succ) {
    postdata('cateshow/ft_getnews', data, res => succ(res))
  }

  addscoreorder(data, succ) {
    postdata('orders/ft_createsorder', data, res => succ(res))
  }
  delmycateshow(data, succ) {
    postdata('cateshow/ft_delmycateshow', data, res => succ(res))
  }



  /**
   * 2020-01-09
   * 
   */
  usergetrank(data, succ) {
    postdata('dishes/usergetrank', data, res => succ(res))
  }

  getavailablecoupon(data, succ) {
    postdata('users/getavailablecoupon', data, res => succ(res))
  }

  cancelorder(number, succ) {
    postdata('Orders/cancel', {
      number
    }, res => succ(res))
  }

  confirmOrder(number, succ) {
    postdata('Orders/confirmreceipt', {
      number
    }, res => succ(res))
  }

  testpay(number, issucc, succ) {
    postdata('orders/testpay', {
      number,
      succ: issucc
    }, res => succ(res))
  }


  getorderdetail(ordernum, succ) {
    postdata('orders/ft_findbynum', {
      ordernum
    }, res => succ(res))
  }   //实验室
    
  getlablist(data, succ) {    
    postdata('dishes/ft_getlist',  data,  res  =>  succ(res))  
  }

  //抽奖管理
    
  getawardslist(data, succ) {    
    postdata('awards/ft_getlist',  data,  res  =>  succ(res))  
  }
  //用户领奖到口袋
  getawardsintopocket(id, succ) {
    postdata('awards/ft_getmyawardintopocket', {
      id
    },  res  =>  succ(res))
  }

  getswipers(succ) {
    postdata('lbimgs/获取轮播图', {},  res  =>  succ(res))
  }

  setlabels(data, succ) {
    postdata('users/setlabels', data,  res  =>  succ(res))
  }

  refund(data, succ) {
    postdata('orders/refund', data,  res  =>  succ(res))
  }

  applyrefund(data, succ) {
    postdata('/Orders/applyrefund', data, res => succ(res))
  }


  //藏书阁
  getBookList(data, succ) {
    postdata('book/getBook', data, res => succ(res))
  }

  //秘籍详情
  getBookDetail(id, succ) {
    postdata('dishes/findbyid', {
      id
    }, res => succ(res))
  }

  //获取秘籍
  getBook(data, succ) {
    postdata('book/addBook', data, res => succ(res))
  }

  // 签到
  sign(userId, succ) {
    postdata('SignIn/addSignIn', {
      userId
    }, res => succ(res))
  }

  // 查询签到
  getSign(data, succ) {
    postdata('SignIn/getSignIn', data, res => succ(res))
  }

  // 通过id获取用户的等级
  getMemberEquitys(data, succ) {
    postdata('Grade/getUserGrade', data, res => succ(res))
  }

  // 获取所有等级和权益
  getAllLevelsAndEquitys(succ) {
    postdata('Grade/getMemberGrade', {}, res => {
      succ(res)
    })
  }

  // 查询会员的任务
  getMemberDuty(data, succ) {
    postdata('users/getMemberTask', data, res => {
      succ(res)
    })
  }

  // 美味秀秀更新用户信息
  modifyUser(data, succ) {
    postdata('users/modifyUser', data, res => succ(res))
  }

  // 绑定电话
  bindPhone(data, succ) {
    postdata('login/bindPhone', data, res => succ(res))
  }

  // 获取收藏列表
  getCollections(data, succ) {
    postdata('Collection/ft_getlist', data, res => succ(res))
  }

  //收藏
  postCollection(data, succ) {
    postdata('Collection/collect', data, res => succ(res))
  }

  // 批量删除收藏
  delCollect(data, succ) {
    postdata('Collection/batchcollect', data, res => succ(res))
  }

  // 获取抽奖初始化信息
  getAwardsInfo(succ) {
    postdata('awards/getAwardsInfo', {}, res => succ(res))
  }

  // 获取会员规则
  getMemberRules(succ) {
    postdata('MemberRule/getTextArea', {}, res => succ(res))
  }

  freepay(ordernumber, succ) {
    postdata('Orders/freepay', ordernumber, res => succ(res))
  }

  prepay(data, succ, fail) {
    data['openid'] = wx.getStorageSync('openid')
    postdata('orders/pay', data, res => {
      if (res.data.issuccess === 1) {
        var data = JSON.parse(res.data.res);
        var orderid = data.orderid;
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonce_str,
          package: data.package,
          paySign: data.paySign,
          signType: 'MD5',
          success: res => {
            console.log(res, 'succ')
            if (res.errMsg.indexOf('ok') > -1) {
              succ && succ({
                succ: 1,
                orderid
              })
            }
          },
          fail: res => {
            //支付取消
            succ && succ({
              succ: -1
            })
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.msg,
        })
      }
    })
  }
}

function postdata(urlparms, data, success, fail) {

  wx.request({
    url: headurl + urlparms,
    method: "POST",
    data: data,
    header: {
      'content-type': "application/x-www-form-urlencoded",
      token: getApp().logininfo.Token,
      userid: getApp().logininfo.userid
    },
    success: res => success(res),
    fail: res => fail && fail(res)
  })
}

function getdata(urlparms, data, success, fail) {

  wx.request({
    url: headurl + urlparms,
    data: data,
    header: {
      'content-type': "application/x-www-form-urlencoded",
      'userId': getApp().userinfo.userId,
    },
    success: res => success(res),
    fail: res => fail && fail(res)
  })
}

function fstpostdata(urlparms, data, success, fail) {
  wx.request({
    url: headurl + urlparms,
    method: "POST",
    data: data,
    header: {
      'content-type': "application/x-www-form-urlencoded",
    },
    success: res => success(res),
    fail: res => fail && fail(res),
    complete: res => {}
  })
}



module.exports = api