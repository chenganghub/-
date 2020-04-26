// pages/asset/address/address.js
var that,
  api = new (require('../../utils/api.js'))()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: ['', '', ''],
    username: '',
    info: '',
    phone: '',
    // ischeck: !1,
    isdefault: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (options.i) {
      let page = getCurrentPages()
      page = page[page.length - 2]
      let {
          name,
          street,
          phone,
          province,
          county,
          city,
          isdefault,
          id
        } = page.data.list[options.i],
        region = [province, city, county]

      if (isdefault == 1) {
        this.setData({ isdefault: 0 })
      }
      this.setData({
        username: name,
        info: street,
        phone,
        region,
        showregion: !0,
        edit: options.i,
        id,
        isdefault
      })
    }
  },
  getown() {
    wx.chooseAddress({
      success: res => {
        console.log(res, 'res')
        this.setData({
          username: res.userName,
          phone: res.telNumber,
          info: res.detailInfo,
          showregion: !0,
          region: [res.provinceName, res.cityName, res.countyName]
        })
      }
    })
  },

  inputtap(e) {
    let { code } = e.currentTarget.dataset,
      { value } = e.detail,
      prop = code == 0 ? 'username' : code == 1 ? 'phone' : 'info'
    this.setData({ [prop]: value })
  },
  del(e) {
    let { code } = e.currentTarget.dataset,
      prop = code == 0 ? 'username' : code == 1 ? 'phone' : 'info'
    this.setData({ [prop]: '' })
  },
  pickchange(e) {
    let region = e.detail.value
    this.setData({ region, showregion: !0 })
  },
  addressaoe(data, succ) {
    api.addAddress(data, res => {
      if (res.data.issuccess == 1) {
        console.log('编辑添加地址成功')
        succ && succ()
      }
    })
  },
  switchaddress(e) {
    let { id, region, info, phone, username, edit } = this.data,
      openid = wx.getStorageSync('openid'),
      data = { id, openid },
      defauaddress = {
        province: region[0],
        city: region[1],
        countyName: region[2],
        openid,
        info,
        phone,
        id,
        name: username
      },
      isdefault = e.detail.value ? 0 : 1
    this.setData({ isdefault })
    if (!edit) {
      console.log('switch', isdefault)
      return
    }
    let page = getCurrentPages()
    page = page[page.length - 2]
    if (e.detail.value) {
      api.setaddresscheck(id, res => {
        if (res.data.issuccess == 1) {
          wx.setStorageSync('def_address', defauaddress)
          wx.showToast({
            title: '设置成功'
          })
        } else {
          console.log('125454')
        }
      })
    } else {
      // data = { openid, remove: 1 }
      api.setaddresscheck(id, res => {
        if (res.data.issuccess == 1) {
          wx.removeStorageSync('def_address')
          wx.showToast({
            title: '取消成功'
          })
        } else {
          console.log('125454')
        }
      })
    }
    page.setData({ needgetaddress: !0 })
  },
  save() {
    var {
        showregion,
        region,
        username,
        phone,
        info,
        isdefault,
        id,
        edit
      } = this.data,
      err = '',
      openid = wx.getStorageSync('openid'),
      defauaddress = {
        province: region[0],
        city: region[1],
        countyName: region[2],
        openid,
        info,
        phone,
        id,
        name: username
      }
    // console.log("check",ischeck);
    // return;
    if (isdefault) {
      wx.setStorage({
        key: 'def_address',
        data: defauaddress
      })
    }
    if (info.length == 0) err = '联系地址'
    if (!showregion) err = '地区'
    if (phone.length != 11) err = '电话号码'
    if (username.length == 0) err = '收货人'
    if (err.length > 0) {
      wx.showModal({
        title: '提示',
        confirmColor: '#FE8F71',
        content: err + '填写有误',
        showCancel: !1
      })
      return
    }
    let item = {
        name: username,
        province: region[0],
        city: region[1],
        county: region[2],
        street: info,
        phone,
        openid,
        isdefault
      },
      addresslist = wx.getStorageSync('def_address') || [],
      page = getCurrentPages()
    if (edit) {
      item['id'] = id
    } else {
      // isdefault = isdefault?'1':'0';
      let check = isdefault ? 1 : 0
      item['isdefault'] = check
    }
    this.addressaoe(item, () => {
      page = page[page.length - 2]
      page.setData({ needgetaddress: !0 })
      wx.navigateBack()
    })
  },
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
