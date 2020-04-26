class util {
  formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
  };

  /**
   * 转换时间
   */
  myTime(date) {
    var arr = date.split('T');
    var d = arr[0];
    var darr = d.split('-');
    var t = arr[1];
    var tarr = t.split('.000');
    var marr = tarr[0].split(':');
    var dd =
      parseInt(darr[0]) +
      '-' +
      parseInt(darr[1]) +
      '-' +
      parseInt(darr[2]) +
      ' ' +
      parseInt(marr[0]) +
      ':' +
      parseInt(marr[1]) +
      ':' +
      parseInt(marr[2]);
    return dd;
  }

  //   countdowndata(go_time){
  //         var now_time=new Date();
  //         var alltime =go_time -now_time.getTime ();  //总的时间（毫秒）
  //        var haoscend =alltime%1000;  //毫秒
  //         //console.log(haoscend);
  //         var scend = parseInt ((alltime/1000)%60  ) ;  //秒
  //         //console.log(scend);
  //         var minute =parseInt((alltime/1000/60)%60  ) ;  //  分钟
  //        // console.log(minute);
  //         var hour =parseInt((alltime/1000/60/60)%24 ) ;   //小时
  //        // console.log(hour);
  //         var day=parseInt((alltime/1000/60/60/24)%30);   //天数
  //        // console.log(day);
  //         var month=parseInt((alltime/1000/60/60/24/30)%12); //月
  //        // console.log(month);
  //         // var btime=document.getElementById("block");
  //         // var time1=document.getElementById("shi_jian");
  //         let countdowndata =month+"月"+day+"天"+hour+"时"+minute +"分"+scend +"秒"+(haoscend<10 ?"00"+haoscend :haoscend <100?"0"+haoscend :haoscend );
  //       return countdowndata;
  // }
  // timeFormat(param){//小于10的格式化函数
  //   return param < 10 ? '0' + param : param;
  //   }
  // countdowndata(endTimeList){
  //     let newTime = new Date().getTime();
  //     let countDownArr = [];
  //     // 对结束时间进行处理渲染到页面
  //     endTimeList.forEach(x => {
  //     let endTime = new Date(x).getTime();
  //     let obj = null;
  //     // 如果活动未结束，对时间进行处理
  //     if (endTime - newTime > 0){
  //     let time = (endTime - newTime) / 1000;
  //     // 获取天、时、分、秒
  //     let day = parseInt(time / (60 * 60 * 24));
  //     let hou = parseInt(time % (60 * 60 * 24) / 3600);
  //     let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
  //     let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
  //     obj = {
  //     day: this.timeFormat(day),
  //     hou: this.timeFormat(hou),
  //     min: this.timeFormat(min),
  //     sec: this.timeFormat(sec)
  //     }
  //     }else{//活动已结束，全部设置为'00'
  //     obj = {
  //     day: '00',
  //     hou: '00',
  //     min: '00',
  //     sec: '00'
  //     }
  //     }
  //     countDownArr.push(obj);
  //     })
  //     return countDownArr;
  // }

  formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return (
      [year, month, day]
      .map(x => {
        x = x.toString();
        return x[1] ? x : '0' + x;
      })
      .join('-') +
      ' ' + [hour, minute, second]
      .map(x => {
        x = x.toString();
        return x[1] ? x : '0' + x;
      })
      .join(':')
    );
  };

  formatTimenosecend = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return (
      [year, month, day]
      .map(x => {
        x = x.toString();
        return x[1] ? x : '0' + x;
      })
      .join('-') +
      ' ' + [hour, minute]
      .map(x => {
        x = x.toString();
        return x[1] ? x : '0' + x;
      })
      .join(':')
    );
  };

  formatDate = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return [year, month, day]
      .map(x => {
        x = x.toString();
        return x[1] ? x : '0' + x;
      })
      .join('-');
  };
  todate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return y + '年' + m + '月' + d + '日';
  }
  //今年的不显示年份
  toCurrentDate(date) {
    var y = date.getFullYear();
    var currentDate = new Date().getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (y !== currentDate) {
      return y + '年' + m + '月' + d + '日';
    }
    return m + '月' + d + '日';
  }
  toDate(number) {
    var n = number;
    console.log(number, 'number');
    var date = new Date(parseInt(n) * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    // minute = minute < 10 ? ('0' + minute) : minute;
    // second = second < 10 ? ('0' + second) : second;
    return y + '年' + m + '月' + d + '日';
  }

  //当前日期加减天数
  mathChangeDate(date, method, days) {
    //method:'+' || '-'
    //ios不解析带'-'的日期格式，要转成'/'，不然Nan，切记
    // var dateVal = date.replace(/-/g, '/');
    var timestamp = Date.parse(date);
    if (method == '+') {
      timestamp = timestamp / 1000 + 24 * 60 * 60 * days;
    } else if (method == '-') {
      timestamp = timestamp / 1000 - 24 * 60 * 60 * days;
    }
    return timestamp;
  }

  // 处理ios显示时间相差八小时问题
  toTime(strTime) {
    console.log(strTime,"strTime")
    if (!strTime) {
      return '';
    }
    var myDate = new Date(strTime + '+0800');
    if (myDate == 'Invalid Date') {
      strTime = strTime.replace(/T/g, ' '); //去掉T
      strTime = strTime.replace(/-/g, '/');
      strTime = strTime.replace(/\.\d+/, ' '); //去掉毫秒
      myDate = new Date(strTime + '+0800');
    }
    return myDate;
  }


  decodeurl(str) {
    var s = '';
    if (str.length == 0) return '';
    s = str.replace(/&amp;/g, '&');
    s = s.replace(/&lt;/g, '<');
    s = s.replace(/&gt;/g, '>');
    s = s.replace(/&nbsp;/g, ' ');
    s = s.replace(/&#39;/g, "'");
    s = s.replace(/&quot;/g, '"');
    return s;
  }

  nocancelmodal(content, title, confirm, cancel) {
    wx.showModal({
      title: title || '提示',
      content,
      confirmColor: '#FE8F71',
      showCancel: !1,
      success: res => {
        if (res.confirm) confirm && confirm();
        if (res.cancel) cancel && cancel();
      }
    });
  }
  modal(content, title, confirm, cancel) {
    wx.showModal({
      title,
      content,
      confirmColor: '#FE8F71',
      succ: res => {
        if (res.confirm) confirm && confirm();
        if (res.cancel) cancel && cancel();
      }
    });
  }

  setwatcher(data, watch) {
    console.log(data,watch,2222222)
    Object.keys(watch).forEach(x => {
      console.log(x,"x")
      this.observer(data, x, watch[x]);
    });
  }

  observer(obj, key, watchFun) {
    var val = obj[key]; // 给该属性设默认值

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        val = value;
        watchFun(value, val); // 赋值(set)时，调用对应函数
      },
      get: function() {
        return val;
      }
    });
  }



   timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  }
  /** 
   * @param    key（data名称） endTimeList （结束时间数据} that    页面this
   * @returns 返回倒计时数组 
   * 
   */
   countDown(key, endTimeList, that,) {//倒计时函数
    /**
     * key 是setData 的属性名字
     * endTimeList 是结束时间列表
     */
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let countDownArr = [];
    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {

      let endTime = new Date(this.timeFormatting(o)).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        //区分设置天数 时间格式
        if(this.timeFormat(day)=='00'){
          obj = this.timeFormat(hou)+':'+this.timeFormat(min)+':'+this.timeFormat(sec)
        }else{
          obj=this.timeFormat(day)+' 天'
        }
        
        
      } else {//活动已结束，全部设置为'00'
        obj = "00:00:00"
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    that.setData({ [key]: countDownArr });
    // 函数内调用自身，，重复使用setTimeout 就每隔一秒调用一次了
    that.data.toTime=  setTimeout(() => { this.countDown(key, endTimeList, that) }, 1000);
  
  }
  timeFormatting(time){
    time = time.replace(/T/g, ' '); //去掉T
    time = time.replace(/-/g, '/');
    time = time.replace(/\.\d+/, ' '); //去掉毫秒
    return time
  }
}

module.exports = util;