angular.module('rsc.production.config', [])

    .constant("ENV", {
        api: {
            // account: 'http://60.205.146.196:18080/api/',//账号
            // pass: 'http://60.205.146.196:18081/api/',   //物流
            // credit: 'http://60.205.146.196:18084/api/', //信用
            // trade: 'http://60.205.146.196:18082/api/',  //交易
            // msg: 'http://60.205.146.196:18083/msg/',    //消息
            // log: 'http://60.205.146.196:18085/',        //日志
            // admin:'http://60.205.146.196:18086/api/'    // 运营后台


            account: 'http://www.rsc365.com:18080/api/',//账号
            pass: 'http://www.rsc365.com:18081/api/',   //物流
            credit: 'http://www.rsc365.com:18084/api/', //信用
            trade: 'http://www.rsc365.com:18082/api/',  //交易
            msg: 'http://www.rsc365.com:18083/api/',    //消息
            log: 'http://www.rsc365.com:18085/',        //日志
            admin: 'http://www.rsc365.com:18086/api/',    // 运营后台
            statist: 'http://www.rsc365.com:18088/api/', //统计
            contact: 'http://www.rsc365.com:18089/api/'    // 通讯录

        },
        debug: false,
        version: '1.0.0',
        storage: window.localStorage,
        // storage: window.sessionStorage,

        // scroll: true,
        serverUrl: 'www.rsc365.com',
        shareHost: 'www.rsc365.com:4000/html',
        serverPort: 80
    });
