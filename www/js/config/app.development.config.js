angular.module('rsc.development.config', [])
    .constant("ENV", {
        api: {
            xnHome:'http://zgxnjz.cn/index.php/Home/'
        },
       
        encode: false, // false 不加密
        debug: true,
        version: '1.1.2',
        storage: window.sessionStorage,
        local: window.localStorage,
        // storage: window.localStorage,
        scroll: false,
        imgUrl:'http://www.zgxnjz.cn'

    });
