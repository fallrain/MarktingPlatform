(function(){
  /**
   * 所有类的基类，提供继承机制
   */
  var initializing = false, fnTest = /xyz/.test(function(){
    xyz;
  }) ? /\b_super\b/ : /.*/;
  this.Class = function(){
  };

  Class.extend = function(prop){
    var _super = this.prototype;

    initializing = true;
    var prototype = new this();
    initializing = false;

    for(var name in prop){
      prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn){
        return function(){
          var tmp = this._super;

          this._super = _super[name];

          var ret = fn.apply(this, arguments);
          this._super = tmp;

          return ret;
        };
      })(name, prop[name]) : prop[name];
    }

    function Class(){
      if(!initializing && this.init)
        this.init.apply(this, arguments);
    }

    Class.prototype = prototype;

    Class.prototype.constructor = Class;

    Class.extend = arguments.callee;

    return Class;
  };
})();

+function(){
  var beforeSendFn = function(ajaxRequest){
    ajaxRequest.setRequestHeader("Accept", "application/json");
  };
  var completeFn = function(){
  };
  var successFn = function(json){
    if(typeof json === 'string'){
      try{
        json = eval("(" + json + ")");
      }catch(e){
      }
    }
    this.callBack(json);
  };
  var errorFn = function(x, t, e){
    var data = {
      success: false
    };
    if(t == "timeout"){
      data.message = "请求超时";
    }else if(x.status == 404){
      data.message = "404:您访问的资源不存在";
    }else{
      data.message = "未知异常！源：" + (x && x.responseText) + "； 错误类型：" + t + "；异常：" + e;
    }
    this.callBack(data);
  };
  var numToStr = function(num){
    if(num < 10){
      num = "0" + num;
    }else{
      num = "" + num;
    }
    return num;
  };
  var parseDate = function(date){
    var obj = {
      year: date.getFullYear(),
      month: numToStr(date.getMonth() + 1),
      date: numToStr(date.getDate()),
      hours: numToStr(date.getHours()),
      minutes: numToStr(date.getMinutes()),
      seconds: numToStr(date.getSeconds())
    };
    return obj;
  };
  window.Common = {
    get: function(str, domain){
      domain = domain || window.document;
      return domain.getElementById(str);
    },
    sendFormData: function(url, callBack, data, options){
      var loader = layer.load(2, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
      });
      options = options || {};
      $.ajax($.extend({
        url: url,
        type: 'post',
        async: true,
        data: data,
        beforeSend: beforeSendFn,
        complete: function(){
          layer.close(loader);
          completeFn();
        },
        success: successFn,
        error: function(){
          layer.close(loader);
          errorFn();
        },
        callBack: callBack
      }, options));
    },
    sendData: function(url){
      return $.ajax({
        url: url,
        type: 'get',
        async: false,
        beforeSend: beforeSendFn
      }).responseText;
    },
    notify: function(msg, timeout){
      // to-do
    },
    comfirm: function(msg){
      // to-do
    },
    readAjaxDate: function(ajaxDate){
      ajaxDate = ajaxDate && ajaxDate.time || ajaxDate;
      return ajaxDate && new Date(ajaxDate);
    },
    formatDate: function(date, pattern){
      if(!date)
        return "";
      if(!(date instanceof Date))
        date = this.readAjaxDate(date);
      var obj = parseDate(date);
      var res = pattern || "yyyy-MM-dd";
      res = Fns.replaceAll(res, "yyyy", obj.year);
      res = Fns.replaceAll(res, "MM", obj.month);
      res = Fns.replaceAll(res, "dd", obj.date);
      res = Fns.replaceAll(res, "HH", obj.hours);
      res = Fns.replaceAll(res, "mm", obj.minutes);
      res = Fns.replaceAll(res, "ss", obj.seconds);
      return res;
    },
    encode: function(encodeStr){
      return encodeURIComponent(encodeStr);
    },
    decode: function(decodeStr){
      return decodeURIComponent(decodeStr);
    },
    GetElCoordinate: function(e){
      var t = e.offsetTop;
      var l = e.offsetLeft;
      var w = e.offsetWidth;
      var h = e.offsetHeight;
      while(e = e.offsetParent){
        t += e.offsetTop;
        l += e.offsetLeft;
      }
      return {
        top: t,
        left: l,
        width: w,
        height: h,
        bottom: t + h,
        right: l + w
      };
    }
  };
}();
// 获得浏览器类型 版本号
(function(){
  Common.getBrowserInfo = function(){
    var Sys = {};
    var brower = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;

    (s = ua.match(/msie ([\d.]+)/)) ?
      Sys.ie = s[1] : (s = ua.match(/firefox\/([\d.]+)/)) ?
      Sys.firefox = s[1] : (s = ua.match(/chrome\/([\d.]+)/)) ?
      Sys.chrome = s[1] : (s = ua.match(/opera.([\d.]+)/)) ?
      Sys.opera = s[1] : (s = ua.match(/version\/([\d.]+).*safari/)) ?
      Sys.safari = s[1] : 0;

    if(Sys.ie){
      brower = {
        type: 'IE',
        version: Sys.ie
      };
    }else if(Sys.firefox){
      brower = {
        type: 'Firefox',
        version: Sys.firefox
      };
    }else if(Sys.chrome){
      brower = {
        type: 'Chrome',
        version: Sys.chrome
      };
    }else if(Sys.opera){
      brower = {
        type: 'Opera',
        version: Sys.opera
      };
    }else if(Sys.safari){
      brower = {
        type: 'Safari',
        version: Sys.safari
      };
    }
    return brower;
  };
})();
// 金额
(function(){
  Common.moneyFormat = function(num){
    num = Math.round(num * 100) / 100;
    var re = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
    var res = (num + "").replace(re, "$1,");
    var i = res.indexOf("."), len = res.length;
    if(i < 0){
      res += ".";
      i = len;
      len++;
    }
    ;
    while(i > res.length - 3){
      res += "0";
    }
    return res;
  };
})();

(function(){
  Common.detectOS = function(){
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if(isMac)
      return "Macintosh";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if(isUnix)
      return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if(isLinux)
      return "Linux";
    if(isWin){
      var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
      if(isWin2K)
        return "Windows 2000";
      var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
      if(isWinXP)
        return "Windows XP";
      var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
      if(isWin2003)
        return "Windows 2003";
      var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
      if(isWinVista)
        return "Windows Vista";
      var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
      if(isWin7)
        return "Windows 7";
      var isWin8 = sUserAgent.indexOf("Windows NT 6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1;
      if(isWin8)
        return "Windows 8";
    }
    return "other";
  };
})();

(function(){
  // AJAX跨域请求
  Common.getJSON = function(url, data, fun, error, preUrl){
    // var perUrlTemp = preUrl || Common.servicePath;
    // var urlTemp = perUrlTemp + url;
    var urlTemp = url;

    $.ajax({
      type: "get",
      crossDomain: true,
      url: urlTemp,
      data: data,
      dataType: "jsonp",
      jsonp: "callback",
      success: fun,
      error: function(x, t, e){
        var data = {
          result: 'error'
        };
        if(t == "timeout"){
          data.errorInfo = "请求超时";
        }else if(x.status == 404){
          data.errorInfo = "404:您访问的资源不存在";
        }else{
          data.errorInfo = "未知异常！源：" + (x && x.responseText) + "； 错误类型：" + t + "；异常：" + e;
        }
      }
    });
  };
})();

var DefaultPage = Class.extend({
  index: 0,
  ids: new Array(),
  addId: function(id){
    this.ids[this.index] = id;
    this.index++;
  },
  trigger: function(){
    if(0 == this.index){
      return;
    }
    $('#' + this.ids[0]).trigger('click');
  }
});
// 模拟浏览器前进后退按钮
var pathArr = [], navArr = [], curHash = 0, nextHash = 0;
(function(){
  Common.loadPage = function(path, para, element){
    pathArr[nextHash] = {
      path: path,
      para: para
    };
    if(element){
      pathArr[nextHash].elementID = element.id;
    }else if(pathArr[nextHash - 1] != undefined){
      // elementID的值为上一个页面的elementID
      pathArr[nextHash].elementID = pathArr[nextHash - 1].elementID;
    }
    location.hash = "#" + nextHash++;
    /*
     * if(curHash == 0 && nextHash > 0){ Common.loadPage4History(path, para); }
     */
  };
  Common.loadPage4History = function(path, para){
    /*
     * $("#loadingPage_bg").height($(top.window.document).height()).width($(top.window.document).width());
     * $('#loading').show(); window.setTimeout(function(){
     * $("#frame").load(path,para,function(){ $('#loading').hide(); }) },100);
     */
    $("#frame").load(path, para)
  };
  Common.loadMenuPage = function(path, para, element){
    navArr[nextHash] = {
      path: path,
      para: para
    };
    if(element){
      navArr[nextHash].elementID = element.id
    }
    para ? $("#sub-menu").load(path) : $("#sub-menu").load(path, para);
  };
  Common.getHash = function(){
    var h = location.hash;
    if(!h){
      return '';
    }else{
      return location.hash;
    }
  };
  Common.changeHashCallBack = function(){
    if(!pathArr.length)
      return;
    var hash = Common.getHash();
    var isPre = false;
    if(curHash != 0){
      isPre = curHash.replace('#', '') > hash.replace('#', '');
    }
    if(curHash != hash){
      curHash = hash;
      var index = curHash.replace('#', '');
      var pathObj = pathArr[index];
      if(index != ""){
        Common.setMenu(isPre, index);
        Common.loadPage4History(pathObj.path, pathObj.para);
      }
    }
  };
  Common.changeMoneyToChinese = function(money){
    var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); // 汉字的数字
    var cnIntRadice = new Array("", "拾", "佰", "仟"); // 基本单位
    var cnIntUnits = new Array("", "万", "亿", "兆"); // 对应整数部分扩展单位
    var cnDecUnits = new Array("角", "分", "毫", "厘"); // 对应小数部分单位
    var cnInteger = "整"; // 整数金额时后面跟的字符
    var cnIntLast = "元"; // 整型完以后的单位
    var maxNum = 999999999999999.9999; // 最大处理的数字

    var IntegerNum; // 金额整数部分
    var DecimalNum; // 金额小数部分
    var ChineseStr = ""; // 输出的中文金额字符串
    var parts; // 分离金额后用的数组，预定义

    if(money == ""){
      return "";
    }

    money = parseFloat(money);
    if(money >= maxNum){
      $.alert('超出最大处理数字');
      return "";
    }
    if(money == 0){
      ChineseStr = cnNums[0] + cnIntLast + cnInteger;
      // document.getElementById("show").value=ChineseStr;
      return ChineseStr;
    }
    money = money.toString(); // 转换为字符串
    if(money.indexOf(".") == -1){
      IntegerNum = money;
      DecimalNum = '';
    }else{
      parts = money.split(".");
      IntegerNum = parts[0];
      DecimalNum = parts[1].substr(0, 4);
    }
    if(parseInt(IntegerNum, 10) > 0){// 获取整型部分转换
      zeroCount = 0;
      IntLen = IntegerNum.length;
      for(i = 0; i < IntLen; i++){
        n = IntegerNum.substr(i, 1);
        p = IntLen - i - 1;
        q = p / 4;
        m = p % 4;
        if(n == "0"){
          zeroCount++;
        }else{
          if(zeroCount > 0){
            ChineseStr += cnNums[0];
          }
          zeroCount = 0; // 归零
          ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if(m == 0 && zeroCount < 4){
          ChineseStr += cnIntUnits[q];
        }
      }
      ChineseStr += cnIntLast;
      // 整型部分处理完毕
    }
    if(DecimalNum != ''){// 小数部分
      decLen = DecimalNum.length;
      for(i = 0; i < decLen; i++){
        n = DecimalNum.substr(i, 1);
        if(n != '0'){
          ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if(ChineseStr == ''){
      ChineseStr += cnNums[0] + cnIntLast + cnInteger;
    }else if(DecimalNum == ''){
      ChineseStr += cnInteger;
    }
    return ChineseStr;
  }
})();
var toString = {}.toString;// 释放到window对象中
(function(){
  var toString = {}.toString;// IE下不支持直接调用toString.call,重新定义只是为了避免从window对象中遍历
  /* 判断对象类型 */
  // undefined
  Common.isUndefined = function(value){
    return typeof value === 'undefined';
  };
  // 非undefined
  Common.isDefined = function(value){
    return typeof value !== 'undefined';
  };
  // 对象
  Common.isObject = function(value){
    return value !== null && typeof value === 'object';
  };
  // 字符串
  Common.isString = function(value){
    return typeof value === 'string';
  }
  // 数字
  Common.isNumber = function(value){
    return typeof value === 'number';
  };
  // 日期
  Common.isDate = function(value){
    return toString.call(value) === '[object Date]';
  };
  // 数组
  Common.isArray = function(value){
    return Array.isArray(value);
  };
  // 函数
  Common.isFunction = function(value){
    return typeof value === 'function';
  };
  // 正则对象
  Common.isRegExp = function(value){
    return toString.call(value) === '[object RegExp]';
  };
  // window
  Common.isWindow = function(obj){
    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
  };
  // 文件
  Common.isFile = function(obj){
    return toString.call(obj) === '[object File]';
  };
  // BLOB
  Common.isBlob = function(obj){
    return toString.call(obj) === '[object Blob]';
  };
  // 布尔类型
  Common.isBoolean = function(value){
    return typeof value === 'boolean';
  };
  // js或者jQuery对象
  Common.isElement = function(node){
    return !!(node && (node.nodeName || (node.prop && node.attr && node.find)));
  };
  //网页禁止选中，主要用于去掉复制
  Common.setNoCopy = function(node){
    var dom = node || "body";
    $(dom)[0].onselectstart = $(dom)[0].oncontextmenu = function(){
      return false;
    };
    Common.getBrowserInfo().type == "Firefox" && $(dom).addClass("moz-no-select");
  }
})();
