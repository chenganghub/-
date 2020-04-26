let api = new(require('./utils/api'))();

App({
  
  onLaunch: function() {

    console.log('version', __wxConfig.envVersion)
    // 检测新版本
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(res => {
        // 请求完新版本信息的回调.
        res.hasUpdate && console.log('新版本提示');
      });
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          confirmColor: '#FE8F71',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              updateManager.applyUpdate(); // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            }
          }
        });
      });
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.showModal({
          confirmColor: '#FE8F71',
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
        });
      });
    } else {
      wx.showModal({
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        title: '提示',
        confirmColor: '#FE8F71',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      });
    }
    wx.login({
      success: res => {
        console.log(res,"215415")
        api.wxlogin(res.code, res => {
   
          if (res.data.issuccess === 1) {
            this.logininfo = res.data;
            this.token = res.data.Token;
            this.isNew = res.data.isNew;
            console.log(res.data)
            wx.setStorage({
              key: 'openid',
              data: res.data.openid
            });
            wx.setStorage({
              key: 'token',
              data: res.data.Token
            });
            wx.setStorage({
              key: 'def_address',
              data: res.data.dfaddress
            });
            wx.setStorage({
              key: 'user',
              data: res.data.user
            });
            wx.setStorage({
              key: 'postfee',
              data: res.data.postfee
            });
          } else {
            wx.showToast({
              icon: 'none',
              title: '登录失败'
            });
          }
        });
      }
    });
    const res = wx.getSystemInfoSync();
    if (res.model.includes('iPhone X') || res.model.includes('iPhoneX')) {
      this.globalData.isIphoneX = true;
    }
  },
  checkLogin() {
    const {
      nickname,
      avatarUrl,
      phone
    } =wx.getStorageSync('user')!=null&& wx.getStorageSync('user')
      if (!nickname || !avatarUrl || !phone) {
      return false
    }
    return true
  },
  globalData: {
    userInfo: null,
    isIphoneX: false
  }
});