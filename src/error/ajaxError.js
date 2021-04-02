import BaseAnalytics from "../base/baseAnalytics.js";
import { ErrorCategoryEnum, AjaxLibEnum, ErrorLevelEnum } from "../base/baseConfig.js";

/**
 * ajax error异常
 */
class AjaxError {
    constructor(params) {
        this.params = params;
    }
    /**
     * 处理错误
     * @param type {*} ajax库类型
     * @param error{*} 错误信息
     */
    handleError(type, err) {
        console.log(type, '1777777777777777', AjaxLibEnum.AXIOS)
        switch (type) {
            case AjaxLibEnum.AXIOS:
                new AxiosError(this.params).handleError(err);
                break;
            default:
                new XHRError(this.params).handleError();
                break;
        }
    }
}

export default AjaxError;

/**
 * Axios类库 错误信息处理
 */
class AxiosError extends BaseAnalytics {

    constructor(params) {
        super(params);
    }

    handleError(error) {
        console.log('axios--------------------')
        if (error && error.config && error.config.url) {
            this.url = error.config.url;
        }
        this.level = ErrorLevelEnum.WARN;
        this.category = ErrorCategoryEnum.AJAX_ERROR;
        this.keyword = error.config.msg;
        this.msg = JSON.stringify(error);
        this.recordError();
    }
}

/**
 * 获取HTTP错误信息
 */
class XHRError extends BaseAnalytics {
    constructor(params) {
        super(params);
    }

    /**
     * 获取错误信息
     */
    handleError() {
        console.log('XHRError--------------------')

        if (!window.XMLHttpRequest) {
            return;
        }
        let xhrSend = XMLHttpRequest.prototype.send;
        let _handleEvent = (event) => {
            try {
                // console.log('bugggggggggg', event)
                if (event && event.currentTarget && event.currentTarget.status !== 200) {
                    this.level = ErrorLevelEnum.WARN;
                    this.category = ErrorCategoryEnum.AJAX_ERROR;
                    this.keyword = event.target.response.msg || '无';
                    this.msg = event.target.response;
                    this.url = event.target.responseURL;
                    this.errorObj = {
                        status: event.target.status,
                        statusText: event.target.statusText
                    };
                    this.recordError();
                } else if (event && event.currentTarget && this.checkResponseError(event.currentTarget.response)) {
                    console.log('异常接口---------------')
                    this.level = ErrorLevelEnum.ERROR;
                    this.category = ErrorCategoryEnum.AJAX_ERROR;
                    this.keyword = JSON.parse(event.target.response).msg;
                    this.msg = event.target.response;
                    this.url = event.target.responseURL;

                    let response = JSON.parse(event.currentTarget.response)
                    this.errorObj = {
                        status: response.code,
                        statusText: response.data
                    };
                    this.recordError();
                }
            } catch (error) {
                console.log(error);
            }
        };
        XMLHttpRequest.prototype.send = function () {
            if (this.addEventListener) {
                this.addEventListener('error', _handleEvent);
                this.addEventListener('load', _handleEvent);
                this.addEventListener('abort', _handleEvent);
            } else {
                let tempStateChange = this.onreadystatechange;
                this.onreadystatechange = function (event) {
                    tempStateChange.apply(this, arguments);
                    if (this.readyState === 4) {
                        _handleEvent(event);
                    }
                }
            }
            return xhrSend.apply(this, arguments);
        }
    }

    /**
     * 是否返回错误信息 忽略100 200 300
     */
    checkResponseError(e) {
        e = JSON.parse(e);
        return e.code != 100 && e.code != 200 && e.code != 300 && e.code != -1
    }

}