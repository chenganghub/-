// pages/releasecomment/releasecomment.js
var that,
  api = new (require('../../utils/api.js'))(),
  app = getApp(),
  headimg = api.getimgurl(),
  util = new (require('../../utils/util.js'))();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    contents: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    console.log(options, 'optiions');
    that.setData({ id: options.id });
  },
  input(e) {
    console.log(e, 'eeeeeee');

    let { contents } = that.data;
    contents = e.detail.value;
    that.setData({
      contents
    });
  },
  addcontents() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let { contents, id } = that.data;
    if (contents == '') {
      wx.showModal({
        showCancel: !1,
        title: '提示',
        confirmColor: '#FE8F71',
        content: '请输入内容'
      });
      return;
    } else {
      // api.addcontents({cateid:id,contents},res=>{
      //   if(res.data.issuccess==1){
      //     console.log("提交成功");
      //     that.getcontentslist()
      //     wx.showModal({
      //       showCancel:!1,
      //       title: '提示',
      //       content: '发布成功',
      //     })
      //   }else if(res.data.msg = "wrong 包含敏感内容"){
      //     wx.showToast({
      //       title: '您输入的评论包含敏感内容，请重新输入',
      //       icon: 'none'
      //     })
      //   }
      // });
      that.contents();
      wx.hideLoading();
    }
  },
  contents() {
    let { contents, id } = that.data;
    api.addcontents({ cateid: id, contents }, res => {
      if (res.data.issuccess == 1) {
        console.log('提交成功');
        // that.getcontentslist()
        wx.showModal({
          showCancel: !1,
          title: '提示',
          content: '发布成功',
          confirmColor: '#FE8F71',
          success: function(res) {
            if (res.confirm) {
              let page = getCurrentPages();
              page = page[page.length - 2];
              page.setData({ needcommentfresh: !0 }, () => {
                wx.navigateBack({});
              });
              // wx.navigateTo({
              //   url: '../showDetails/showDetails?id='+id,
              // })
            }
          }
        });
      } else if ((res.data.msg = 'wrong 包含敏感内容')) {
        wx.showToast({
          title: '您输入的评论包含敏感内容，请重新输入',
          icon: 'none'
        });
      }
    });
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
});
