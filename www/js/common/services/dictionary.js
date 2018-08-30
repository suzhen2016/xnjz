angular.module('rsc.commmon.services.dicitionary', [])
    
    /**
     * 计算小数计算时不丢失精度
     */
    .factory("xnMath",function(){
        return {
            add:function(x,y){
                var baseNum, baseNum1, baseNum2;
                try {
                    baseNum1 = x.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = y.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                return (x * baseNum + y * baseNum) / baseNum;
            },
            subtract:function(x,y){
                var baseNum, baseNum1, baseNum2;
                var precision;// 精度
                try {
                    baseNum1 = x.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = y.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
                return Number(((x * baseNum - y * baseNum) / baseNum).toFixed(precision));
            },
            ride:function(x,y){
                var baseNum = 0;
                try {
                    baseNum += x.toString().split(".")[1].length;
                } catch (e) {
                }
                try {
                    baseNum += y.toString().split(".")[1].length;
                } catch (e) {
                }
                return Number(x.toString().replace(".", "")) * Number(y.toString().replace(".", "")) / Math.pow(10, baseNum);
            },
            divide:function(x,y){
                var baseNum1 = 0, baseNum2 = 0;
                var baseNum3, baseNum4;
                try {
                    baseNum1 = x.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = y.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                with (Math) {
                    baseNum3 = Number(x.toString().replace(".", ""));
                    baseNum4 = Number(y.toString().replace(".", ""));
                    return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
                }
            }
        }    
        
    })
    /**
     * 服务缓存数据
     */
    .factory("xnData",function(){
        var data = '',
            dataObj = {};
            //dataObj = ''
        return {
            set:function(obj,type){
                if(type){
                    dataObj[type] = obj;
                }else{
                    this.data = obj;
                }
                
            },
            get:function(type){
                if(type){
                    
                    return dataObj[type];
                }else{
                    return this.data;
                }
                
            },
            remove:function(type){
                if(type){
                    dataObj[type] = '';
                }else{
                    this.data = '';
                }
            }
        }
    })