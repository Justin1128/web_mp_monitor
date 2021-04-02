import { ErrorLevelEnum, ErrorCategoryEnum } from "./base/baseConfig.js";


/**
 * 小程序内异常 监控上报系统
 */
class mpAnalytics {

    constructor() {
        this.url = '';
        this.wx = null;
        this.mixid = '';
        this.openid = '';
        this.app = ''

        // this.category = ErrorCategoryEnum.JS_ERROR;
    }
    /* 初始化 */
    init(options) {
        options = options || {};
        this.url = options.url;
        this.app = options.app || null;
        this.wx = options.wx;
        this.mixid = options.mixid;
        this.openid = options.openid;
        this.observer()
    }

    /* 拦截wx.request */
    observer() {
        let wx = this.wx;
        const originRequest = wx.request;
        let that = this;
        Object.defineProperty(wx, "request", {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function () {
                const config = arguments[0] || {};
                const url = config.url;
                // 上报接口直接发送请求，不拦截
                if (url.includes(that.url)) {
                    return originRequest.apply(this, arguments);
                }
                let obSuccess=config.success;
                let obFail=config.fail;
                console.log('config',config)
                config.success = res => {
                    obSuccess(res);
                    // 接口异常回调
                    console.log('data:', res.data)
                    if (res.data.code != 200) {
                        let txt = `url:${encodeURIComponent(config.url)}
                                  pageUrl:${encodeURIComponent(that.getPageUrl())}
                                  headers:${JSON.stringify(config.header)}
                                  日志信息:${JSON.stringify(res.data)}`;

                        let keyword = `[${encodeURIComponent(config.url)}]${res.data.msg}`
                        that.recordError({ data: txt, keyword, category: ErrorCategoryEnum.AJAX_ERROR });
                        console.log("上报异常数据啦!");
                    }
                };

                config.fail = err => {
                    obFail(err)
                    let txt = `url:${encodeURIComponent(config.url)} 
                    pageUrl:${encodeURIComponent(that.getPageUrl())}
                    headers:${JSON.stringify(config.header)}
                    日志信息:${JSON.stringify(err)}`;

                    that.recordError({ data: txt, keyword, category: ErrorCategoryEnum.AJAX_ERROR });
                    console.log("上报异常数据啦!");
                };

                return originRequest.apply(this, arguments);
            }
        });
    }

    /**
    * 记录错误信息
    * @param data{*} 错误信息
    * @param keyword {*} 错误关键字
    * @param category {*} 错误类型
    * @param extendsInfo{*} 扩展信息
    */
    recordError({ data, keyword = null, category = ErrorCategoryEnum.JS_ERROR, extendsInfo }) {
        if (this.wx == null) return
        if (category == ErrorCategoryEnum.JS_ERROR) {
            keyword = `[${encodeURIComponent(this.getPageUrl())}]${JSON.stringify(data).substring(0, 20)}`
        }
        this.wx.request({
            url: this.url,
            data: {
                v: Date.now(),
                app: this.app,
                keyword: keyword,
                e: "mp_error",
                category: category,
                logType: ErrorLevelEnum.ERROR,
                extendsInfo: {
                    openid: this.wx.getStorageSync("openid") || null,
                    ...extendsInfo
                },
                logInfo: data,
                deviceInfo: {
                    ...this.getSystemInfo()
                }
            },
            method: "GET",
            success: function (res) {
                console.log("上报成功", res);
            },
            fail: function (res) {
                console.log("上报失败", res);
            }
        });
    }

    /* 获取系统配置 */
    getSystemInfo() {
        let systemInfo = null;
        try {
            systemInfo = this.wx.getSystemInfoSync();
        } catch (e) {
            // Do something when catch error
        }
        return systemInfo
    }
    /* 获取页面url */
    getPageUrl() {
        let pageUrl = ''
        try {
            let pages = getCurrentPages() //获取加载的页面
            pageUrl = pages[pages.length - 1].route //获取当前页面的对象
        } catch (error) { }

        return pageUrl
    }

    /* 导出实例 */
    static getInstance() {
        if (!this.instance) {
            this.instance = new mpAnalytics();
        }
        return this.instance;
    }
}

export default mpAnalytics.getInstance();

