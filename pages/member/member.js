// pages/member/member.js
var that = this,
  api = new (require('../../utils/api.js'))(),
  app = getApp(),
  util = new (require('../../utils/util.js'))(),
  headimg = api.getimgurl(),
  headurl = api.getheadurl(),
  md5 = require('../../utils/md5.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    phone: '',
    headurl,
    // code:'',
    smiao: 60,
    miao: 60,
    send_state: !0,
    membertype: 1,
    gender: '',
    calendar: 0,
    born: '',
    pwd: '',
    name: '',
    taglist: [],
    idlist: [],
    code: '',
    cardinfo: '',
    region: ['', '', ''],
    familyarr: ['1', '2', '3', '4', '5', '6', '7及以上'],
    appraisalarr: [
      '吃货泰斗，拒绝动手',
      '烹饪菜鸡，解决温饱',
      '厨艺小成，玩转家常',
      '我是厨神，技压全村'
    ],
    userImg: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let enddate = util.formatDate(new Date())
    this.setData({
      enddate
    })
    let { taglist, cardinfo, code } = that.data
    api.getinterestinglist(res => {
      try {
        wx.hideLoading()
        console.log(res)
        if (res.data.issuccess == 1) {
          let { info } = res.data
          let region = ['', '', '']
          if (info.province) {
            region[0] = info.province
            region[1] = info.city
            region[2] = info.district
          }
          res.data.list.forEach((x, i) => {
            let item = {
              name: x.name,
              issel: false,
              id: x.id
            }
            if (info.interestview) {
              info.interestview.split(',').forEach(y => {
                if (y == x.id) item.issel = true
              })
            }
            taglist.push(item)
          })
          that.setData({
            taglist,
            info,
            avatarUrl: info.avatarUrl,
            userImg: [info.avatarUrl],
            nickname: info.nickname || '',
            realname: info.realname || '',
            gender: info.gender,
            born: info.birthday ? info.birthday.replace('T', '') : '',
            showborn: info.birthday != null,
            region,
            appraisalindex: info.self_appraisal >= 0 ? info.self_appraisal : -1,
            showappraisal: info.self_appraisal > 0,
            showregion: region[0] != '',
            familyindex: info.familycount == -1 ? -1 : info.familycount,
            showfamily: info.familycount > 0
          })
        }
      } catch (e) {
        console.log(e)
      }
    })
  },
  input(e) {
    that.setData({
      [e.currentTarget.dataset.prop]: e.detail.value
    })
  },
  bindregionChange(e) {
    console.log(e, 'bindregionChange')
    that.setData({
      showregion: !0,
      region: e.detail.value
    })
  },
  bindfamilyChange(e) {
    console.log(e, 'bindfamilyChange')
    that.setData({
      showfamily: !0,
      familyindex: e.detail.value
    })
  },
  bindappraisalChange(e) {
    console.log(e, 'bindappraisalChange')
    that.setData({
      showappraisal: !0,
      appraisalindex: e.detail.value
    })
  },
  gendertap(e) {
    let { code } = e.currentTarget.dataset
    that.setData({
      gender: code
    })
  },

  // 保存
  save() {
    let {
        userImg,
        realname,
        nickname,
        born,
        region,
        gender,
        familyindex,
        appraisalindex,
        taglist,
        appraisalarr
      } = this.data,
      err = ''
    if (realname == '') err = '姓名不能为空'
    if (nickname == '') err = '昵称不能为空'
    if (born == '') err = '请选择出生日期'
    if (familyindex == -1) err = '请选择家庭人数'
    if (appraisalindex == -1) err = '请评价厨艺'
    if (gender == '') gender = 'M'
    if (region[0] == '') err = '请选择地区'
    if (err != '') {
      wx.showModal({
        title: '提示',
        content: err,
        confirmColor: '#FE8F71',
        showCancel: !1
      })
      return
    }
    let interestview = []
    taglist.forEach(x => {
      if (x.issel) interestview.push(x.id)
    })

    api.uploadimg(
      {
        url: `${headurl}upload/wx_upload`, //这里是你图片上传的接口
        path: userImg //这里是选取的图片的地址数组
      },
      {
        success: resp => {
          api.updateUser(
            {
              nickname,
              realname,
              birthday: born,
              gender,
              interestview: interestview.join(','),
              self_appraisal: appraisalindex,
              city: region[1],
              province: region[0],
              district: region[2],
              avatar: resp[0] ? headimg + resp[0] : that.data.avatarUrl,
              familycount: familyindex
            },
            res => {
              if (res.data.issuccess == 1) {
                wx.showModal({
                  title: '提示',
                  confirmColor: '#FE8F71',
                  content: '保存成功'
                })
                let user = wx.getStorageSync('user')
                wx.setStorageSync('user', { ...user, ...res.data.data })
                wx.navigateBack({})
              }
            }
          )
        }
      }
    )
  },

  // 上传头像
  uploadImg() {
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],

      itemColor: '#f7982a',

      success: res => {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            this.chooseWxImageShop('album') //从相册中选择
          } else if (res.tapIndex == 1) {
            this.chooseWxImageShop('camera') //手机拍照
          }
        }
      }
    })
  },

  // 选择照片
  chooseWxImageShop(type) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],

      sourceType: [type],

      success: res => {
        const userImg = res.tempFilePaths
        console.log(userImg)
        this.setData({
          userImg
        })
      }
    })
  },

  card() {
    let {
      cardinfo,
      gender,
      born,
      idlist,
      code,
      calendar,
      name,
      phone,
      pwd
    } = that.data
    console.log(pwd, 'pppwwwddd')

    // ,{name,phone,pwd}=that.data.target
    if (cardinfo == null) {
      if (phone.length != 11) {
        wx.showModal({
          title: '提示',
          content: '请输入11位手机号码',
          showCancel: !1
        })
        return
      }
      if (name == '') {
        wx.showModal({
          title: '提示',
          confirmColor: '#FE8F71',
          content: '请输入姓名',
          showCancel: !1
        })
        return
      }
      if (pwd.length != 6) {
        wx.showModal({
          title: '提示',
          confirmColor: '#FE8F71',
          content: '请输入6位数密码',
          showCancel: !1
        })
        return
      }
      if (born == '') {
        wx.showModal({
          title: '提示',
          confirmColor: '#FE8F71',
          content: '请选择出生日期',
          showCancel: !1
        })
        return
      }
      // let gender = sex == 1 ? 'M' : 'W';
      let birth = born + (calendar == 0 ? 'S' : 'T')
      console.log(birth, 'birth')
      pwd = md5.b64Md5(code + pwd)
      console.log(pwd, 'pwd')
      let interestlabels = String(idlist)
      let data = {
        phone,
        gender,
        name,
        interestlabels,
        birth,
        pwd
      }
      api.setcard(data, res => {
        if (res.data.issuccess == 1) {
          wx.showModal({
            title: '提示',
            content: '成功注册会员卡',
            confirmColor: '#FE8F71',
            showCancel: !1
            // success: function (res) {
            //   if (res.confirm) {
            //     wx.switchTab({
            //       url: '../mine/mine',
            //     })
            //   }
            // }
          })
        }
      })
    } else {
      if (phone.length != 11) {
        wx.showModal({
          title: '提示',
          content: '请输入11位手机号码',
          confirmColor: '#FE8F71',
          showCancel: !1
        })
        return
      }
      if (name == '') {
        wx.showModal({
          title: '提示',
          content: '请输入姓名',
          confirmColor: '#FE8F71',
          showCancel: !1
        })
        return
      }
      if (born == '') {
        wx.showModal({
          title: '提示',
          content: '请选择出生日期',
          confirmColor: '#FE8F71',
          showCancel: !1
        })
        return
      }
      // let gender = sex == 1 ? 'M' : 'W';
      let birth = born + (calendar == 0 ? 'S' : 'T')
      let interestlabels = String(idlist)
      let data = {
        phone,
        gender,
        name,
        interestlabels,
        birth
      }
      api.editcardinfo(data, res => {
        if (res.data.issuccess == 1) {
          wx.showModal({
            title: '提示',
            content: '修改会员信息成功',
            confirmColor: '#FE8F71',
            showCancel: !1,
            success: function(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../mine/mine'
                })
              }
            }
          })
        }
      })
    }
  },

  selecttags(e) {
    // console.log(e,'eee')
    let { id } = e.currentTarget.dataset,
      { taglist, idlist } = that.data
    // console.log(id,'idddd')
    taglist.forEach((x, i) => {
      if (id == x.id) {
        if (x.issel == true) {
          x.issel = false
          idlist.forEach((y, j) => {
            if (y == id) {
              idlist.splice(j, 1)
            }
          })
        } else {
          ;(x.issel = true), idlist.push(id)
        }
      } else {
        return
      }
    })
    that.setData({
      taglist,
      idlist
    })
    // console.log(idlist,'idlistidlistidlist')
  },
  tomain() {
    wx.switchTab({
      url: '../main/main'
    })
  },
  toaddmember() {
    wx.navigateTo({
      url: '../addmember/addmember'
    })
  },
  // 获取手机号
  getPhoneNumber(e) {
    console.log(e, 'eeeee')
    api.getphone(
      {
        iv: e.detail.iv,
        edata: e.detail.encryptedData
      },
      res => {
        if (res.data.issuccess == 1) {
          let phone = JSON.parse(res.data.data).phoneNumber
          that.setData({
            phone
          })
        }
      }
    )
  },
  // chosesex(e) {
  //   console.log(e);
  //   let {
  //     sex
  //   } = e.target.dataset;
  //   this.setData({
  //     sex
  //   });
  // },
  chosedate(e) {
    console.log(e)
    let { calendar } = e.target.dataset
    console.log(calendar, 'calendar')
    this.setData({
      calendar
    })
  },
  chosemember(e) {
    let { membertype } = e.target.dataset
    this.setData({
      membertype,
      calendar: 0,
      born: '',
      pwd: '',
      name: '',
      miao: 0,
      phone: '',
      // code: '',
      no: ''
    })
  },
  inputtap(e) {
    let { code, b64 } = that.data
    let { prop } = e.currentTarget.dataset
    that.setData({
      [prop]: e.detail.value
    })
  },
  sendSMS() {
    let { phone, smiao } = this.data
    if (phone.length != 11) {
      wx.showModal({
        title: '提示',
        content: '请输入11位手机号码',
        confirmColor: '#FE8F71',
        showCancel: !1
      })
      return
    }
    that.setData({
      send_state: false,
      miao: smiao
    })
    that.settime(smiao)
    api.sendSMS(phone, res => {
      if (res.data.isscuccess == 1) {
        console.log(res.data)
      } else {
        console.log(res)
      }
    })
  },
  settime(smiao) {
    let { miao } = this.data
    if (smiao == 0) {
      // console.log('stop')
      that.setData({
        smiao: miao,
        send_state: true
      })
    } else {
      setTimeout(() => {
        smiao--
        that.setData({
          smiao
        })
        that.settime(smiao)
      }, 1000)
    }
  },
  bindDateChange(e) {
    let born = e.detail.value
    this.setData({
      born,
      showborn: !0
    })
  },
  // bindcard(){
  //   let { phone, born, sex, name, calendar, membertype, pwd, no ,idlist } = this.data, openid = wx.getStorageSync('openid');//code,
  //   if(!openid){
  //     wx.showModal({
  //       title: '提示',
  //       content: '请先登录',
  //       showCancel:!1,
  //     })
  //   }
  //   if (phone.length != 11) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '请输入11位手机号码',
  //       showCancel: !1,
  //     })
  //     return;
  //   }
  //   // if (code.length != 4) {
  //   //   wx.showModal({
  //   //     title: '提示',
  //   //     content: '请输入4位有效验证码',
  //   //     showCancel: !1,
  //   //   })
  //   //   return;
  //   // }
  //   if(membertype==1){
  //     console.log(pwd.length,pwd);
  //     if(pwd.length!=6){
  //       wx.showModal({
  //         title: '提示',
  //         content: '请输入6位密码',
  //         showCancel: !1,
  //       })
  //       return;
  //     }
  //     if (name=="") {
  //       wx.showModal({
  //         title: '提示',
  //         content: '请输入姓名',
  //         showCancel: !1,
  //       })
  //       return;
  //     }
  //     if (born=="") {
  //       wx.showModal({
  //         title: '提示',
  //         content: '请选择日期',
  //         showCancel: !1,
  //       })
  //       return;
  //     }

  //     let timestamp = Date.parse(born),
  //     date = new Date(born);
  //     let data = util.todate(date);
  //     let gender = sex == 1 ? '男' : '女';

  //     data.phone = phone;
  //     // data.code = code;
  //     data.openid = openid;
  //     data.pwd = pwd;
  //     data.name =name;
  //     data.gender = gender;
  //     data.calendar = calendar;
  //     data.lables=String(idlist)
  //     console.log(data);
  //     api.addCard( data , res => {
  //       if (res.data.issuccess == 1) {
  //         wx.showModal({
  //           title: '提示',
  //           content: '成功绑定会员卡',
  //           showCancel: !1,
  //           success: function (res) {
  //             if (res.confirm) {
  //               wx.switchTab({
  //                 url: '../mine/mine',
  //               })
  //             }
  //           }
  //         })
  //         var info = {};
  //         var userinfo = wx.getStorageSync("userinfo");
  //         wx.setStorageSync("card", res.data.card);

  //       } else {
  //         wx.showModal({
  //           title: '提示',
  //           content: '输入验证码不对',
  //           showCancel: !1,
  //         })
  //       }
  //     });

  //   }else{
  //     if (no == "") {
  //       wx.showModal({
  //         title: '提示',
  //         content: '请输入会员卡号',
  //         showCancel: !1,
  //       })
  //       return;
  //     }
  //     let data = { phone, no, openid };//code,
  //     api.bindCard(data,res=>{
  //       if(res.data.issuccess==1){
  //         wx.showModal({
  //           title: '提示',
  //           content: '成功绑定会员卡',
  //           showCancel: !1,
  //           success: function (res) {
  //             if (res.confirm) {
  //               wx.switchTab({
  //                 url: '../mine/mine',
  //               })
  //             }
  //           }
  //         })
  //       }else{
  //         wx.showModal({
  //           title: '提示',
  //           content: '绑定失败',
  //         })
  //       }
  //     });
  //   }
  // },
  // del(e) {
  //   let { code } = e.currentTarget.dataset, prop = code == 0 ? 'phone' : 'code';
  //   this.setData({ [prop]: '' })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
