var Cookies = require('js-cookie')
var uuidv4 = require('uuid/v4');
var qs = require('qs');

// const HOST = 'http://localhost:3000/static/images/px.gif?';
let HOST='';
const SESSION_KEY = '_ma_sid';
const COOKIE_UID_KEY = '_ma_uid';

const defaultConfig = {
  mode:'development'
}

class Analytics {
  //构造器
  constructor() {
    this._fp = {
      sid: genSessionID(),
      uid: genCookieUUID()
    };
    this.isInit=false;
  }

  init(pid, cpid , option) {
    this._fp.pid = pid
    this._fp.cpid = cpid
    this._fp.gid = option.gid
    this._fp = Object.assign({}, this._fp, getDeviceInfo())
    console.log(this._fp,'--init')
    this.config = Object.assign({}, defaultConfig, option)
    if(this.config.mode=='production'){
      HOST='xxx.gif?'
    }else{
      HOST='xxx.gif?'
    }
    this.isInit=true;
  }

  trackPageView(pageviewParams){
    let p = getPageInfo()
    p.e = 'pageview'
    pageviewParams.title ? p.pt = pageviewParams.title : null
    pageviewParams.location ? p.pl = pageviewParams.location : null
    pageviewParams.path ? p.pp = pageviewParams.path : null
    pageviewParams.sales ? p.sales = pageviewParams.sales : null
    pageviewParams.userId?this._fp.uuid = pageviewParams.userId : null
    console.log(pageviewParams, '--M45')
    this._send(p)
  }

  trackEvent(eventId, eventParams){
    let p={
      e: eventId,
    };
    p=Object.assign({},p,eventParams);
    this._send(p)
  }

  /**
   * 当用户登录之后调用 setUserId API ，设置登录用户 ID 
   * @param {*} userId 
   */
  login(userId){
    this._fp.uuid = userId
  }

  /**
   * 增量更新
   * @param {*} customerVariables 
   */
  setProfile(customerVariables){
    // this._fp.upro = Object.assign({}, this.profile, customerVariables)
    this._fp.upro =JSON.stringify(customerVariables);
  }

  logout(){
    this._fp.uuid = null
    this._fp.upro = null
  }

  _send(params){
    console.log(params)
    let p = Object.assign({}, this._fp, params)
  
    fetch(HOST + qs.stringify(p), {
      method: 'GET'
    }).then(r => {
  
    })
  }

  //静态方法: 获取实例(单例)
  static getInstance() {
    if(!this.instance) {
      this.instance = new Analytics();
    }
    return this.instance;
  }
}

function genCookieUUID() {
  let uid = Cookies.get(COOKIE_UID_KEY); 
  if(!uid){
    uid = uuidv4();
    console.debug(uid)
    Cookies.set(COOKIE_UID_KEY, uid, {})
  }
  return uid
}


function genSessionID() {
  let sid = uuidv4();
  console.debug(sid)
  sessionStorage.setItem(SESSION_KEY, sid)
  return sid
}

/** 页面信息 */
function getPageInfo(){
  let params = {}
  if(document) {
    params.dm = document.domain || '';
    params.pl = document.URL || ''; 
    params.pt = document.title || ''; 
    params.pr = document.referrer || ''; 
    params.pp = GetUrlRelativePath()
  }
  return params
}

/**
 * 设备信息
 */
function getDeviceInfo() {
  let deviceInfo = {}
  if(document){
    deviceInfo.cs = document.characterSet
    deviceInfo.tp = 'web'
  }
  if(window && window.screen){
    deviceInfo.sc = window.screen.width + 'x' + window.screen.height
    deviceInfo.cd = window.screen.colorDepth || 0
  }
  //navigator对象数据
  if(navigator) {
    deviceInfo.ln = navigator.language || ''
    deviceInfo.ce = navigator.cookieEnabled
    deviceInfo.os = getOS()
    deviceInfo.b = Browse()
  }   
  return deviceInfo;
}

/**
 * 操作系统
 */
function getOS() {
  var sUserAgent = navigator.userAgent;
  var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
  var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
  if (isMac) return "Mac";
  var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
  if (isUnix) return "Unix";
  var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
  if (isLinux) return "Linux";
  if (isWin) {
      var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
      if (isWin2K) return "Win2000";
      var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
      if (isWinXP) return "WinXP";
      var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
      if (isWin2003) return "Win2003";
      var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
      if (isWinVista) return "WinVista";
      var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
      if (isWin7) return "Win7";
      var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
      if (isWin10) return "Win10";
  }
  return "other";
}

/**获得浏览器***/
function Browse () {
    var browser = {};
    var userAgent = navigator.userAgent.toLowerCase();
    var s;
    (s = userAgent.match(/msie ([\d.]+)/)) ? browser.ie = s[1] : (s = userAgent.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] : (s = userAgent.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] : (s = userAgent.match(/opera.([\d.]+)/)) ? browser.opera = s[1] : (s = userAgent.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
    var version = "";
    if (browser.ie) {
        version = 'IE ' + browser.ie;
    }
    else {
        if (browser.firefox) {
            version = 'firefox ' + browser.firefox;
        }
        else {
            if (browser.chrome) {
                version = 'chrome ' + browser.chrome;
            }
            else {
                if (browser.opera) {
                    version = 'opera ' + browser.opera;
                }
                else {
                    if (browser.safari) {
                        version = 'safari ' + browser.safari;
                    }
                    else {
                        version = '未知浏览器';
                    }
                }
            }
        }
    }
    return version;
}


function GetUrlRelativePath(){
　　var url = document.location.toString();
　　var arrUrl = url.split("//");

　　var start = arrUrl[1].indexOf("/");
　　var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

　　if(relUrl.indexOf("?") != -1){
　　　　relUrl = relUrl.split("?")[0];
　　}
　　return relUrl;
}

var MAnalytics = Analytics.getInstance();
// var MAnalytics2 = Analytics.getInstance();
// var MAnalytics = new Analytics();
// var MAnalytics2 = new Analytics();
// console.log(MAnalytics === MAnalytics2)
module.exports = MAnalytics;