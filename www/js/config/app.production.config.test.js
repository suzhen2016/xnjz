
angular.module('rsc.production.config.test', [])
    .constant("ENV", {
        api: {
            account: 'http://101.200.0.53:18080/api/',
            pass: 'http://101.200.0.53:18081/api/',
            credit: 'http://101.200.0.53:18084/api/',
            trade: 'http://101.200.0.53:18082/api/',       //交易
            msg: 'http://101.200.0.53:18083/api/',       //消息
            log: 'http://101.200.0.53:18085/',       //日志
            admin: 'http://101.200.0.53:18086/api/',
            statist: 'http://101.200.0.53:18088/api/', //统计
            contact: 'http://101.200.0.53:18089/api/'//通讯录

        },
        debug: true,
        version: '1.0.0',
        // storage: window.localStorage,
        storage: window.sessionStorage,

        // scroll: true,
        serverUrl: 'www.rsc365.net',
        shareHost: 'www.rsc365.net:4000/html',
        serverPort: 3000
    });
