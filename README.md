# 小工蚁分析模块

dist
    analytics.js  h5用户行为手机
    monitor.js    h5异常和性能工具
    mpAnalytics.js    小程序异常收集


 window.Manalytics = require("mayi-analytics")
   //异常监控
   window.Monitor=require("/dist/mayi.monitor.js").default
   Monitor.init();
    // 性能监控
    // Monitor.monitorPerformance({
    //     pageId:"/index",  //页面唯一标示
    //     url:"xxx.gif"  //信息采集上报地址
    // })