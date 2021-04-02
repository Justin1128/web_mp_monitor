import pagePerformance from "./performance.js";
import DeviceInfo from "../device/index.js";
import Send from "../base/send.js";
import utils from "../base/utils.js";
let Cookies = require('js-cookie')

class MonitorPerformance {

    constructor() {
        this.isPage = true; //是否上报页面性能数据
        this.isResource = true; //是否上报页面资源数据
        this.outTime = 50;
        this.config = {
            resourceList: [], //资源列表
            performance: {}, //页面性能列表
        };

        // spa应用页面切换
        // window.addEventListener('historystatechanged',(e)=>{
        //     console.log(e,'eeeeeeeeeeeeee18')
        // })
    }

    /**
     * 记录页面信息
     * @param {*} params  {url ：上报地址}
     */
    record({ url, app }) {
        setTimeout(() => {
            if (this.isPage) {
                let stateCheck = setInterval(() => {
                    let timing = pagePerformance.getTiming();
                    if (timing !== 'loading') {
                        // 页面onload后 获取性能数据和资源加载信息
                        clearInterval(stateCheck);
                        this.config.performance = JSON.stringify(pagePerformance.getTiming());

                        if (this.isResource) {
                            this.config.resourceList = pagePerformance.getEntries();
                        }
                        console.log("report data 1=", Cookies.get('myUserId'));

                        let result = {
                            type: 'page-load',
                            pbid: this.randomString(),
                            uuid: Cookies.get('myUserId') || -1,
                            app: 'mobile',
                            url: window.location.href,
                            pageId: window.location.pathname,
                            mixId: utils.getQuery('mixid'),
                            gid: Cookies.get('_groupId') || -1,
                            // resourceList: JSON.stringify(this.config.resourceList),
                            deviceInfo: this.getDeviceInfo(),
                            data: this.config.performance,
                        };
                        console.log("report data =", result);
                        //发送监控数据
                        new Send(url).report(result);
                        this.clearPerformance();
                    }
                }, 500);
            }
        }, this.outTime);
    }
    /**
     * check是否获取性能数据
     */
    getPerformanceInfo() {

    }
    /**
     * 获取设备信息
     */
    getDeviceInfo() {
        try {
            let deviceInfo = DeviceInfo.getDeviceInfo();
            return JSON.stringify(deviceInfo);
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    randomString(len = 10) {
        len = len || 10;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd + new Date().getTime();
    }

    clearPerformance() {
        if (window.performance && window.performance.clearResourceTimings) {
            performance.clearResourceTimings();
            this.config.performance = {};
            this.config.resourceList = '';
        }
    }

}

export default MonitorPerformance;