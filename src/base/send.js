/**
 * 数据持久化
 */
class Send {

    constructor(url, type) {
        this.url = url;
        this.type = type || 'img';
    }

    /**
     * 上报信息 （默认方式）
     */
    report(data) {
        if (!this.checkUrl(this.url)) {
            console.log("上报信息url地址格式不正确,url=", this.url);
            return;
        }
        console.log("上报地址：" + this.url, "上报类型：" + this.type);
        if (this.type == 'img') {
            this.reportByImg(data);
        } else if (this.type == 'fetch') {
            this.sendFetch(data);
        } else if (this.type == 'beacon') {
            this.sendBeacon(data)
        }
    }

    /**
     * 发送消息ajax formdata
     */
    sendFetch(data) {
        try {
            fetch(this.url, {
                method: 'POST',
                headers:{
                    // 'type':2
                },
                body:  JSON.stringify(data)
            }).then(r => {

            })
        } catch (error) {

        }
        // ajax
        // try {
        //     var xhr = new XMLHttpRequest();
        //     xhr.open("POST", this.url, true);
        //     //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //     xhr.setRequestHeader("Content-Type", "application/json");
        //     xhr.send(JSON.stringify(data));
        // } catch (error) {
        //     console.log(error);
        // }
    }
    /**
     * 发送消息sendBeacon formdata
     */
    sendBeacon(data) {
        if (navigator.sendBeacon) {
            navigator.sendBeacon(this.url, this.formdataParams(data))
        } else {
            this.sendFetch(data)
        }
    }
    /**
     * 通过img方式上报信息
     */
    reportByImg(data) {
        if (!this.checkUrl(this.url)) {
            console.log("上报信息url地址格式不正确,url=", this.url);
            return;
        }
        try {
            var img = new Image();
            img.src = this.url + '?v=' + new Date().getTime() + '&' + this.formatParams(data);
        } catch (error) {
            console.log('send', error);
        }
    }
    /*
     *格式化formdata
     */
    formdataParams(data) {
        let formdata = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formdata.append(key, data[key]);
            }
        }
        return formdata
    }

    /*
     *格式化参数
     */
    formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        return arr.join("&");
    }

    /**
     * 检测URL
     */
    checkUrl(url) {
        if (!url) {
            return false;
        }
        var urlRule = /^[hH][tT][tT][pP]([sS]?):\/\//;
        return urlRule.test(url);
    }

}
export default Send;