// pages/asset/address/address.js
var that,
  api = new(require('../../utils/api.js'));
function replaceraw(content) {
  return content.replace('rgb(', 'rgb').replace(new RegExp('rgb', 'g'), "rgb(");
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: '请选择现居住城市',
    username: '',
    street: '',
    phone: '',
    ischeck: !1,
    isdefault: 0,
    city: "请选择现居住城市",
    province: "",//省份
    city:'',// 市
    county:"",// 县 / 区
    id:0,
    isdefault:0,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    let { id, username} = that.data
    console.log(options, 'options')
    id=options.id
    this.setData({ options, id})
    console.log(options,'optionsoptions')
    if (id){
      let { username, list} = that.data
      api.getaddAddressDetail(id,res=>{
        if (res.data.issuccess == 1){
          list  = res.data.data
          console.log(list,'list')
        }
        that.setData(list)
      })
    }
  },
  bindinput(e) {
    let {
      code
    } = e.currentTarget.dataset, {
        value
      } = e.detail,
      prop = code == 0 ? 'username' : code == 1 ? 'phone' : 'street';
    this.setData({
      [prop]: value
    })
  },
  // pickchange(e) {
  //   let region = e.detail.value;
  //   this.setData({
  //     region,
  //   })
  // },
  bindRegionChange(e) {
    console.log(e, 'ee')
    let region = e.detail.value
    console.log(region, 'rrr')
    that.setData({
      region
    })
  },
  save() {
    let { username, street, phone, options, region, id, isdefault}=that.data,err=''
    if (region == '请选择现居住城市') err ='请选择工作时间'
    if (phone.length<0) err = "请输入电话号码"
    if (street.length<0) err ='请输入街道'
    if (username<0) err='请输入姓名'
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: 'none',
        duration: 1500
      })
      return
    }
    let item = { userid: options.userid, name: username, phone, province: region[0], city: region[1], county: region[2], id, isdefault, street}
    api.addAddress(item,res=>{
      if (res.data.issuccess == 1){
        wx.showToast({
          title: "保存成功",
          icon: 'none',
          duration: 1000,
          success(res) {
            setTimeout(() => {
              wx.switchTab({
                url: '../receivingAddress/receivingAddress',
              })
            }, 1000)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})