import { AjaxError, ConsoleError, JsError, PromiseError, ResourceError, VueError } from './error/index.js';
import { hackState } from './base/hack.js'
import MonitorPerformance from "./performance/index.js";
import { AjaxLibEnum } from "./base/baseConfig.js";
class Analytics {
    constructor() {
        this.devtools = false;//是否开启拦截
        // 默认处理的异常
        this.jsError = true;
        this.promiseError = true;
        this.resourceError = true;
        this.ajaxError = true;
        this.consoleError = false; //console.error默认不处理
        this.vueError = false;
    }
    /* 初始化 */
    init(options) {
        options = options || {};
        this.devtools = options.devtools || this.devtools;
        if (this.devtools) return
        this.jsError = options.jsError || this.jsError;
        this.promiseError = options.promiseError || this.promiseError;
        this.resourceError = options.resourceError || this.resourceError;
        this.ajaxError = options.ajaxError || this.ajaxError;
        this.consoleError = options.consoleError || this.consoleError;
        this.vueError = options.vueError || this.vueError;

        let reportUrl = options.url;//上报错误地址
        let reportApp = options.app;//上报应用
        let roportType = options.roportType;//上报类型
        let extendsInfo = options.extendsInfo || {};  //扩展信息
        let param = { reportUrl, roportType, reportApp, extendsInfo };
        if (this.jsError) {
            new JsError(param).handleError();
        }
        if (this.promiseError) {
            new PromiseError(param).handleError();
        }
        if (this.resourceError) {
            new ResourceError(param).handleError();
        }
        if (this.ajaxError) {
            new AjaxError(param).handleError(AjaxLibEnum.DEFAULT);
        }
        if (this.consoleError) {
            new ConsoleError(param).handleError();
        }
        if (this.vueError && options.vue) {
            new VueError(param).handleError(options.vue);
        }

        this.monitorPerformance(options)
    }

    /**
     * 监听页面性能
     * @param {*} options {pageId：页面标示,url：上报地址}
     */
    monitorPerformance(options) {
        // hackState();//spa应用注册事件
        options = options || {};
        // tip:性能使用额外的域名
        let url = options.secondUrl;
        let app = options.app;

        new MonitorPerformance().record({
            url, app
        });
    }

    /* 导出实例 */
    static getInstance() {
        if (!this.instance) {
            this.instance = new Analytics();
        }
        return this.instance;
    }

}

export default Analytics.getInstance()