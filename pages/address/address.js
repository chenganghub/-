// pages/asset/address/address.js
var that,
  api = new (require('../../utils/api.js'))();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    hidecheck: !1,
    fromcart: !1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    this.getaddresslist(options.id);
    if (options.a) {
      this.setData({ hidecheck: !0 });
    }
    if (options.o) {
      this.setData({ ordernumber: options.o, addreid: options.addreid });
    }
    if (options.c) {
      console.log(options);
      this.setData({ fromcart: !0, addreid: options.addreid });
    }
    if (options.sc) {
      this.setData({ sconfirm: !0, addreid: options.addreid });
    }
  },
  getaddresslist(choseid) {
    // if(choseid>0){
    api.getaddresslist(res => {
      if (res.data.issuccess == 1) {
        that.formatlist(res.data.list, choseid);
      }
    });
    // }
  },
  choseaddress(e) {
    let { item } = e.currentTarget.dataset,
      page = getCurrentPages();
    page = page[page.length - 2];
    page.setData({ needgetaddress: !0, address: item, noaddress: !1 }, () => {
      wx.navigateBack();
    });
  },
  formatlist(list, choseid) {
    let hascheck = !1,
      checkindex = 0,
      page = getCurrentPages();
    if (list.length > 0) {
      list.forEach((x, i) => {
        if (x.id == choseid) {
          checkindex = i;
          hascheck = !0;
          list[i]['check'] = 1;
        } else {
          list[i]['check'] = 0;
        }
      });

      if (!hascheck) {
        list[0]['check'] = 1;
        checkindex = 0;
      }
    }
    // page[page.length - 2].setData({ needgetaddress: !0, address: list[checkindex] });
    this.setData({ list, checkindex });
  },
  edit(e) {
    let { index } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../addressadd/addressadd?i=' + index
    });
  },
  deladdress(e) {
    let { id, index } = e.currentTarget.dataset,
      { list } = this.data,
      that = this,
      openid = wx.getStorageSync('openid');
    wx.showModal({
      title: '删除地址',
      content: '确认删除吗？',
      confirmColor: '#FE8F71',
      success: function(res) {
        if (res.confirm) {
          api.deladdress(id, res => {
            if (res.data.issuccess == 1) {
              console.log('成功删除');
              list.splice(index, 1);
              if (list.length > 0) {
                that.setData({ list });
              } else {
                that.setData({ list: [] });
              }
            }
          });
        }
      }
    });
  },
  updateaddress(e) {
    // var { addressid, index } = e.currentTarget.dataset, { ordernumber, list, addreid,fromcart ,sconfirm} = this.data;
    // let pages = getCurrentPages(), page = pages[pages.length - 2];
    // page.setData({ address: list[index], addressid: list[index].id, needgetaddress:!0});
    // if(fromcart||sconfirm){wx.navigateBack();return;}
    // if (addreid == addressid) { wx.navigateBack();return;}
    // api.changeaddress(addressid,ordernumber,res=>{
    //   if(res.data.issuccess==1){
    //     console.log("成功更新");
    //     wx.navigateBack();
    //   }else{
    //     console.log("sdfsdfdsf");
    //   }
    // });
  },
  chose(e) {
    let { index } = e.currentTarget.dataset,
      { list, checkindex } = this.data;
    if (list.length < 2) return;
    if (checkindex == index) return;
    list.map((x, i) => {
      list[i]['check'] = i == index ? 1 : 0;
    });

    // let page = getCurrentPages();
    // page[page.length-2].setData({needgetaddress:!0,address:list[index]});

    this.setData({ list, checkindex: index });
  },

  toadd() {
    wx.navigateTo({
      url: '../addressadd/addressadd'
    });
  },
  // Https.send(NetConfig.domains.sdkUrl + '/' + HttpConst.LOGIN_FOR_HANDLE, { "data": { "bound": true, "mergeAward": true, "returnProfile": true } }, function (data) {
  //   if (data.error.code == '000') {

  //   }
  // }.bind(this), 'POST', true)
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.needgetaddress) {
      this.getaddresslist();
    }
  },

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
