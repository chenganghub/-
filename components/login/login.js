const app = getApp()
const api = new(require('../../utils/api.js'))()
Component({
  options: {
    addGlobalClass: true,
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      const {
        nickname,
        avatarUrl,
        phone
      } =  wx.getStorageSync('user')!=null&&wx.getStorageSync('user')
      console.log(  nickname,
        avatarUrl,
        phone,"1111")
      if (!nickname && !avatarUrl) {
        this.setData({
          showInfoBtn: true
        })
      } else if (!phone) {
        this.setData({
          showPhoneBtn: true
        })
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    disabledMask: Boolean  //是否禁用遮罩层关闭弹窗功能
  },

  /**
   * 组件的初始数据
   */
  data: {
    showInfoBtn: false,
    showPhoneBtn: false
  },
ready(){
  

},
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取用户信息
     */
    _onGotUserInfo(e) {
    
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        // this.triggerEvent("closeModal")
      } else {
        this._subUserData(e)
      }
    },
    /**
     * 提交用户信息
     */
    _subUserData(e) {
      console.log(e,5555)
      wx.showLoading({
        title: '保存中',
      })
      let {
        nickName,
        avatarUrl
      } = e.detail.userInfo;
  
      api.modifyUser({
        openid: wx.getStorageSync("openid"),
        nickname: nickName,
        avatarUrl
      },
      res => {
        if (res.data.issuccess == 1) {
          let user = wx.getStorageSync('user')
          wx.setStorageSync('user', {
            ...user,
            ...e.detail.userInfo,
            nickname: nickName
          })
          const info = {
            ...app.logininfo,
            ...e.detail.userInfo,
            nickname: nickName
          }
          app.globalData.logininfo = info
          this.triggerEvent("closeModal")
          this.setData({
            showPhoneBtn: true,
            showInfoBtn: false
          }, () => {
          console.log(this.data.showPhoneBtn,"showPhoneBtn")
            this.triggerEvent("openModal")
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          })
        }
        wx.hideLoading()
      })
    },
    /**
     * 获取手机号接口
     */
    _getPhoneNumber(e) {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        api.bindPhone({
          userId: wx.getStorageSync('user').id,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }, res => {
          if (res.data.issuccess === 1) {
            let user = wx.getStorageSync("user");
            wx.setStorageSync('user', {
              ...user,
              phone: res.data.data
            });
            this.triggerEvent("closeModal")
            this.triggerEvent("afterLogin")
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
            })
          }
        })
      }
    },
    /**
     * 关闭弹窗
     */
    _closeModal() {
      if (!this.data.disabledMask){
        this.triggerEvent("closeModal")
      }
    }
  }
})