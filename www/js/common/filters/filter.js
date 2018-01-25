/**
 * Created by ID on 17/6/2.
 * Author:suzhen
 * email:suzhen@stark.tm
 */
angular.module('rsc.common.filters', [])

    .filter('xntime', function ($filter) {
        return function (time) {
            if (time) {
                return $filter('date')(new Date(time), 'yyyy年MM月dd日');
            } else {
                return '';
            }
        }
    })

    
    .filter('statustime', function ($filter) {
        return function (time) {
            if (time) {
                return $filter('date')(new Date(time), 'yyyy/MM/dd');
            } else {
                return '';
            }
        }
    })
    //短信模板
    .filter('smsTemplate', function ($filter) {
        return function (array, type) {
            switch (type) {
                case 'trafficDemand':
                    // return array[0] + "在日升昌平台发布一个物流需求，从" + array[1] + "至" + array[2] + "运送" + array[3] + array[4] + "吨，快来日升昌平台<a href='" + array[5] + "抢单<a/>吧。";
                    return array[0] + "现有" + array[3] + array[4] + "吨从" + array[1] + "至" + array[2] + "需要运输，快来抢单！"
                case 'tradeDemand':
                    // return array[0] + "企业在日升昌平台采购" + array[1] + "吨，邀请您前来报价。快快<a href='" + array[2] + "'>点击查看吧<a/>。";
                    return array[0] + "采购" + array[1] + array[2] + "吨，快来抢单！"

                case 'register':
                    // return array[0] + "邀请您注册日升昌平台，成为他的合作伙伴。<a href='" + array[1] + "'>点击注册<a/>。";

                    return array[0] + "邀请您成为他的合作伙伴，快来注册。";
                case 'tradePlan':
                    // return array[0] + "企业已创建物流计划。<a href='" + array[1] + "'>点击注册<a/>。";
                    return array[0] + "已发布" + array[1] + "月份," + array[2] + "吨物流运输计划，邀请您成为认证物流企业！快来抢单！";
                case 'trade_askprice':
                    // return array[0] + "企业已创建物流计划。<a href='" + array[1] + "'>点击注册<a/>。";
                    return array[0] + "计划采购" + array[1] + "，快来抢单吧！"

                default:
                    return '';
            }
        }
    })

    // 计算时间差
    .filter('dateInterval', function () {
        return function (time, flag) {
            var oldtime = new Date(time);
            var now = new Date();
            var tm = oldtime - now;
            var dd = parseInt(tm / 1000 / 60 / 60 / 24, 10);
            var hh = parseInt(tm / 1000 / 60 / 60 % 24, 10);
            var mm = parseInt(tm / 1000 / 60 % 60, 10);
            var ss = parseInt(tm / 1000 % 60, 10);
            var dhms = dd + '天' + hh + '小时' + mm + '分' + ss + '秒';
            if (flag == 'hs') {
                return now > oldtime ? 0 : dhms
            } else {
                return now > oldtime ? 0 : dd
            }

        }
    })
    // 格式化金额
    .filter('fmoney', function () {
        return function (s, type) {
            if (s !== undefined) {
                // 订单中的金额不进行取舍
                if (s / 100000000 > 1 && type == 'order') {
                    s = (s / 100000000).toFixed(2);
                    w = '亿';
                } else if (s / 10000 > 1 && type == 'order') {
                    s = (s / 10000).toFixed(2);
                    w = '万';
                } else {
                    s = s;
                    w = '';
                }
                //
                if (type == 'noComma') {
                    if (s == 0) return 0;
                    return s >= Math.ceil(s) ? s : s.toFixed(2);
                }
                // 吨数保留3位
                if (type == 'ton') {
                    if (s == 0) return 0;
                    return s >= Math.ceil(s) ? s : String(s).split('.')[1].length > 2 ? s.toFixed(3) : s;
                }
                var sign = s < 0 ? '-' : '';
                s = s < 0 ? Math.abs(s) : s;
                s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
                var l = s.split(".")[0].split("").reverse(),
                    r = s.split(".")[1];
                t = "";
                for (i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
                }
                //dun 这个应用哪里了
                if (type == 'dun') {
                    return sign + t.split("").reverse().join("") + w;
                }
                return r > 0 ? sign + t.split("").reverse().join("") + "." + r + w : sign + t.split("").reverse().join("") + w;
            }
        }
    })
    // 返回向上取整的数字
    .filter('numCeil', function () {
        return function (e) {
            if (e) {
                return Math.ceil(e / 10)
            } else {
                return 0
            }
        }
    })
    // 取绝对值
    .filter('mathabs', function () {
        return function (e) {
            return Math.abs(e).toFixed(2)
        }
    })
    // 数字转大写
    .filter('upDigit', function () {
        return function (n) {
            if (n) {
                var fraction = ['角', '分'];
                var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
                var unit = [
                    ['元', '万', '亿', '万亿'],
                    ['', '拾', '佰', '仟']
                ];
                var head = n < 0 ? '欠' : '';
                n = Math.abs(n);
                var s = '';
                for (var i = 0; i < fraction.length; i++) {
                    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
                }
                s = s || '整';
                n = Math.floor(n);

                for (var i = 0; i < unit[0].length && n > 0; i++) {
                    var p = '';
                    for (var j = 0; j < unit[1].length && n > 0; j++) {
                        p = digit[n % 10] + unit[1][j] + p;
                        n = Math.floor(n / 10);
                    }
                    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
                }
                return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
            }
        }
    })
    // 数字转大写并且以万元为单位
    .filter('upDigitDit', function () {
        return function (n) {
            n = n * 10000;
            if (n) {
                var fraction = ['角', '分'];
                var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
                var unit = [
                    ['元', '万', '亿', '万亿'],
                    ['', '拾', '佰', '仟']
                ];
                var head = n < 0 ? '欠' : '';
                n = Math.abs(n);
                var s = '';
                for (var i = 0; i < fraction.length; i++) {
                    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
                }
                s = s || '整';
                n = Math.floor(n);

                for (var i = 0; i < unit[0].length && n > 0; i++) {
                    var p = '';
                    for (var j = 0; j < unit[1].length && n > 0; j++) {
                        p = digit[n % 10] + unit[1][j] + p;
                        n = Math.floor(n / 10);
                    }
                    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
                }
                return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
            }
        }
    })
    // 返回距今时长
    .filter('formvalidity', function () {
        return function (time) {
            var now = new Date();
            var oldtime = new Date(time);
            // var temp = Math.floor((oldtime-now)/1000/24/60/60)
            var temp = Math.ceil((oldtime - now) / 1000 / 24 / 60 / 60);
            if (temp > 180) {
                return 180;
            }
            if ((oldtime - now) < 0) {
                var _tmp = Math.ceil((now - oldtime) / 1000 / 24 / 60 / 60);
                return '已逾期' + _tmp;
            } else if ((oldtime - now) < 86400000) {
                return '1';
            } else {
                return temp;
            }
        }
    })
    //产品参数排序;
    .filter('sortProduceAtt', function () {
        return function (att) {
            var data = [];
            var a = ['fareliang', 'shuifen', 'huifafen', 'quanliufen', 'huifen', 'gudingtan', 'rezhi', 'nianjiezhishu',
                'Si', 'Mn', 'S', 'P', 'caizhi', 'guige', 'CaO', 'R2O', 'shaoshiliang', 'bibiaomianji', 'hanshuiliang'
            ];
            for (var i = 0; i < a.length; i++) {
                if (att[a[i]]) {
                    data.push(att[a[i]]);
                }
            }
            return data;
        };
    })

    .filter('xnDateTime', function ($filter) {
        return function (time) {
            if (time) {
                return $filter('date')(new Date(time), 'yyyy.MM.dd HH:mm');
            } else {
                return '';
            }
        }
    })

    .filter('xnDateOrderTime', function ($filter) {
        return function (time) {
            if (time) {
                return $filter('date')(new Date(time), 'yyyy-MM-dd');
            } else {
                return '';
            }
        }
    })
    // 数组转字符串
    .filter('categoryArr', function () {
        return function (value) {
            if (value) {
                return value.join(',')
            }
        }
    })

    /**
     * 名称过长省略显示，缩写
     */
    .filter('abridgeStr', function () {
        return function (value) {
            if (value) {
                return value.length > 4 ? value.slice(0, 4) + "..." : value
            } else {
                return ''
            }
        }
    })
    /**
     * 过滤手机通讯录中的手机号码
     */
    .filter("contactsFormat", function ($log, commonString, $filter) {
        return function (result) {
            var arrays = [];
            angular.forEach(result, function (item) {
                if (item.phoneNumbers && (item.displayName || item.name.formatted)) {
                    $log.debug('phone info', JSON.stringify(item));
                    var name = "未知";
                    if (item.displayName || item.name.formatted) {
                        if (item.displayName) {
                            name = item.displayName;
                        } else if (item.name) {
                            name = item.name.formatted;
                        }
                        angular.forEach(item.phoneNumbers, function (phone) {
                            if (phone.value) {
                                var reg = new RegExp(commonString.phoneReg);
                                //处理手机号中存储的字符串
                                var phoneValue = $filter('formatPhone')(phone.value);
                                //校验手机号是否符合规则
                                var res = reg.test(phoneValue);

                                // $log.debug('phone check', res);

                                // if (phone.type == 'mobile' && res) {
                                //如果在手机中存储在 手机标签中且手机号码符合规则
                                if (res) {
                                    //不符合正则验证的 跳过
                                    // $log.debug(phone.value, $filter('formatPhone')(phone.value))
                                    var data = {
                                        phone: phoneValue,
                                        name: !item.displayName ? item.name.formatted : item.displayName,
                                        isSelects: false
                                    };
                                    arrays.push(data);
                                }
                            }
                        })
                    }

                }

            })

            return arrays;
        }

    })
    /**
     * 过滤地址长度
     */
    .filter('rscLimit', function () {
        return function (input, len) {
            var myAddress = '';
            if (input.length > len) {
                myAddress = input.slice(input, len) + '...';
            } else {
                myAddress = input;
            }
            return myAddress;
        }
    })

