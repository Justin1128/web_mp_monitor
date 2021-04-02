/**
 * 页面监控
 */
const pagePerformance = {

    getTiming() {
        try {
            if (!window.performance || !window.performance.timing) {
                console.log('你的浏览器不支持 performance 操作');
                return '你的浏览器不支持 performance 操作';
            }
            let t = window.performance.timing;
            if (!t.loadEventEnd) {
                return 'loading';
            }
            let times = {};
            // DNS解析时间
            times.dnst = t.domainLookupEnd - t.domainLookupStart || 0
            //TCP建立时间
            times.tcpt = t.connectEnd - t.connectStart || 0
            // 白屏时间  
            times.wit = t.responseStart - t.navigationStart || 0
            //dom渲染完成时间
            times.domt = t.domContentLoadedEventEnd - t.navigationStart || 0
            //页面onload时间
            times.lodt = t.loadEventEnd - t.navigationStart || 0
            // 页面准备时间 
            times.radt = t.fetchStart - t.navigationStart || 0
            // 页面重定向时间
            times.rdit = t.redirectEnd - t.redirectStart || 0
            // unload时间
            times.uodt = t.unloadEventEnd - t.unloadEventStart || 0
            //request请求耗时
            times.reqt = t.responseEnd - t.requestStart || 0
            //页面解析dom耗时
            times.andt = t.domComplete - t.domInteractive || 0
            //首次可交互
            times.tti= t.domInteractive - t.fetchStart || 0
            // 小程序
            return times;

        } catch (e) {
            console.log(e)
        }
    },

    getEntries() {
        if (!window.performance || !window.performance.getEntries) {
            console.log("该浏览器不支持performance.getEntries方法");
            return '该浏览器不支持performance.getEntries方法';
        }
        let entryTimesList = [];
        let entryList = window.performance.getEntries();
        if (!entryList || entryList.length == 0) {
            return entryTimesList;
        }
        entryList.forEach((item, index) => {
            let templeObj = {};
            let usefulType = ['script', 'css', 'fetch', 'xmlhttprequest', 'link', 'img']; //'navigation'
            if (usefulType.indexOf(item.initiatorType) > -1) {
                //请求资源路径
                templeObj.name = item.name;
                //发起资源类型
                templeObj.initiatorType = item.initiatorType;
                // 资源大小
                // item.decodedBodySize && (templeObj.size=item.decodedBodySize)
                templeObj.size=item.transferSize;
                //http协议版本
                templeObj.nextHopProtocol = item.nextHopProtocol;
                //dns查询耗时
                templeObj.dnsTime = item.domainLookupEnd - item.domainLookupStart;
                //tcp链接耗时
                templeObj.tcpTime = item.connectEnd - item.connectStart;
                //请求时间
                templeObj.reqTime = item.responseEnd - item.responseStart;
                // 耗时
                templeObj.duration = item.duration;
                //重定向时间
                templeObj.redirectTime = item.redirectEnd - item.redirectStart;
                
                entryTimesList.push(JSON.stringify(templeObj));
            }
        });
        return entryTimesList;
    },

};

export default pagePerformance;