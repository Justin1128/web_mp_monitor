import Send from "./send.js";

/**
 * 消息队列
 */
var TaskQueue = {

    queues: [],  //待处理消息列表

    /**
     * 添加消息
     * @param {*} reportUrl 上报url
     * @param {*} data 上报数据
     */
    add: function (reportUrl, reportType, data) {
        this.queues.push({ reportUrl, reportType, data });
    },

    /**
     * 统一上报
     */
    fire: function () {
        if (!this.queues || this.queues.length === 0) {
            return;
        }
        let item = this.queues[0];
        item.reportUrl && new Send(item.reportUrl, item.reportType).report(item.data);
        this.queues.splice(0, 1);
        this.fire(); //递归
    }
};

export default TaskQueue;