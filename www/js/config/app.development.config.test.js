angular.module('rsc.development.config.test', [])
    .constant("ENV", {
        api: {
            account: 'http://101.200.0.53:19080/api/',
            pass: 'http://101.200.0.53:19081/api/',
            credit: 'http://101.200.0.53:19084/api/',
            trade: 'http://101.200.0.53:19082/api/',       //交易
            msg: 'http://101.200.0.53:19083/api/',       //消息
            log: 'http://101.200.0.53:19085/',       //日志
            me: 'http://192.168.3.248:18082/',
            admin: 'http://101.200.0.53:19086/api/',
            statist: 'http://101.200.0.53:19088/api/', //统计
            newtrade: 'http://101.200.0.53:15082/api/',      //新交易
            contact: 'http://101.200.0.53:19089/api/', //通讯录
            map: 'http://101.200.0.53:19093/api/' //地图

        },
        debug: true,
        version: '1.0.0',
        // storage: window.localStorage,
        storage: window.sessionStorage,

        // scroll: true,
        serverUrl: 'www.rsc365.net',
        shareHost: 'www.rsc365.net:4999/html',
        serverPort: 5000
    });
