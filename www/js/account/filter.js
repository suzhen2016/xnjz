angular.module('rsc.common.account.filters', [])
    .filter('rolefilter', function () {
        var truck_types = {
            TRADE_ADMIN: '超级管理员',
            TRADE_PURCHASE: '管理员',
            TRADE_USER: '普通用户'
        };
        return function (type) {
            return truck_types[type];
        }
    })
    .filter('Degree', function () {
        var truck_types = {
            0: '小学',
            1: '中学',
            2: '中职',
            3: '高职',
            4: '大专',
            5: '本科',
            6: '硕士研究生',
            7: '博士研究生',
        };
        return function (type) {
            return truck_types[type];
        }
    })
    .filter('workTime', function () {
        var truck_types = {
            0: '1-3年',
            1: '3-5年',
            2: '5-10年',
            3: '10年以上'
        };
        return function (type) {
            return truck_types[type];
        }
    })

    .filter('startArr', function () {
        return function (num) {
            var arr = [];
            console.log(num)
            if (!num) {
                num = 0;
            }
            var numArr = num.toString().split('.');

            for (var i = 0; i < numArr[0]; i++) {

                arr.push({ class: 'ion-ios-star' })

            }
            if (numArr[1]) {
                arr.push({ class: 'ion-ios-star-half' });
                for (var i = 0; i < 5 - numArr[0] - 1; i++) {
                    arr.push({ class: 'ion-ios-star-outline' })
                }
            } else {
                for (var i = 0; i < 5 - numArr[0]; i++) {
                    arr.push({ class: 'ion-ios-star-outline' })
                }
            }
            return arr;
        }
    })

    .filter('orderName', function () {
        var objName = {
            56: '贵州特产',
            57: '清洁用品'
        }
        return function (type) {
            return objName[type]
        }
    })
    .filter('menuName', function () {
        var menu = {
            cleaner: '保洁员',
            duenna: "保姆",
            nutritionist: "营养师",
            nursery: '育婴师',
            prolactor: '催乳师',
            careworker: '护工',
            ewclean: '外墙清洗',
            pipeulock: '管道疏通与开锁服务',
            gzGoods:'贵州特产',
            qjGoods:'清洁用品'

        }
        return function(type){
            return menu[type]
        }
    })
    .filter('menuTieleId', function () {
        var menu = {
            cleaner: {id:10,route:'tab.menuHomeMore'},
            duenna: {id:11,route:'tab.menuHomeMore'},
            nutritionist: {id:12,route:'tab.menuHomeMore'},
            nursery: {id:13,route:'tab.menuHomeMore'},
            prolactor: {id:14,route:'tab.menuHomeMore'},
            careworker: {id:15,route:'tab.menuHomeMore'},
            ewclean: {id:16,route:'tab.menuHomeMore'},
            pipeulock: {id:17,route:'tab.menuHomeMore'},
            gzGoods:{id:56,route:'tab.menuShoppingMore'},
            qjGoods:{id:57,route:'tab.menuShoppingMore'}

        }
        return function(type){
            return menu[type]
        }
    })
    .filter('educationMenu', function () {
        var education = {
            1:'网络',
            0:'面授'
        }
        return function(type){
            return education[type]
        }
    })
    .filter('orderstatus', function () {
        var status = {
            1:'待付款',
            2:'已取消',
            3:'进行中',
            4:'已完成'
        }
        return function(type){
            return status[type]
        }
    })
    .filter('dynamicTime', function ($filter) {
        return function (time) {
            if (time) {
                return $filter('date')(new Date(time), 'yyyy.MM.dd HH:mm');
            } else {
                return '';
            }
        }
    })
