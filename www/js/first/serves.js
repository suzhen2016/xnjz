angular.module('xn.first.service', [])
    .factory('FirstService', ['$q', 'Restangular', '$window', 'Storage', 'AccountRestAngular', 'XnRestAngular','AccountRestAngularNoToken',
        function ($q, Restangular, $window, Storage, AccountRestAngular, XnRestAngular,AccountRestAngularNoToken) {
           
            return {
                getHomeMenuById: function () {
                    var all = XnRestAngular.allUrl('/Index/homeservice');
                    return all.post();
                },
                getHomeWorkMore: function (id) {
                    var all = XnRestAngular.allUrl('/Index/getEmployeeList');
                    return all.post({cat_id:id});
                },
                getHomeRecruitment:function(){
                    var all = XnRestAngular.allUrl('/Hire/getHireList');
                    return all.post();
                },
                getHomeRecruitmentDetails:function(id){
                    var all = XnRestAngular.allUrl('/Hire/getHireDetail?'+'hire_id='+id);
                    return all.get('');
                },
                getHomeBigcustomer:function(id){
                    var all = XnRestAngular.allUrl('/Bigcustomer/getCustomerList');
                    return all.post();
                },
                getFirstPerTenGoodsList:function(page){
                    var all = XnRestAngular.allUrl('/Index/RecommetPerTenGoodsList');
                    return all.post({page_index:page})
                },
                // 家政人员个人的详情
                getPersonDetails:function(id){
                    var all = XnRestAngular.allUrl('/Index/getOneEmployeeDetail');
                    return all.post({yuangong_id:id});
                },
                // 家政人员个人的评论
                getPersonNews:function(data){
                    var all = XnRestAngular.allUrl('/Comment/getCmtList');
                    return all.post(data);
                },
                //购物商场
                getShopOrder:function(){
                    var all = XnRestAngular.allUrl('/Goods/shopSixRecord');
                    return all.post();
                },
                //购物商场图标
                getShopIcon:function(){
                    var all = XnRestAngular.allUrl('/Goods/getCat');
                    return all.post();
                },
                //购物商场更多商品
                getShopMoreList:function(data){
                    var all = XnRestAngular.allUrl('/Goods/getPerSixGoodsList');
                    return all.post(data);
                },
                //商品详情
                getShopDetailsHeader:function(id){
                    var all = XnRestAngular.allUrl('/Goods/getDetailGoodsInfo?'+'goods_id='+id);
                    return all.get('');
                },
                //商品详情的属性
                 getShopDetailsAtt:function(id){
                    var all = XnRestAngular.allUrl('/Goods/getGoodsAttrName?'+'goods_id='+id);
                    return all.get('');
                },
                //根据商品的属性获得具体的商品
                 getShopDetailsByAtt:function(id,name){
                    var all = XnRestAngular.allUrl('/Goods/findGoodsByAttrName?'+'goods_id='+id+'&goods_name='+name);
                    return all.get('');
                },
                //加入购物车
                 shoppCar:function(str){
                    var all = XnRestAngular.allUrl('/Shop/addShopCart?'+str);
                    return all.get('');
                },
                //购物车详情
                getCarDetails:function(){
                    var all = XnRestAngular.allUrl('/Shop/getCartInfo');
                    return all.get('');
                },
                //购物车操作加减
                changeCarNum:function(str){
                    var all = XnRestAngular.allUrl('/Shop/gdorepChangeNumber?'+str);
                    return all.get('');
                },
                //删除购物车
                delCarOrder:function(arr){
                    var all = XnRestAngular.allUrl('/Shop/delGdOrEmCart');
                    return all.post({shop_ids:arr});
                },
                //培训条数接口
                getTrainLine:function(){
                    var all = XnRestAngular.allUrl('/Training/getTrainList');
                    return all.post();
                },
                //培训详情
                getTrainDetails:function(id){
                    var all = XnRestAngular.allUrl('/Training/getTrainDetail?train_id='+id);
                    return all.get('');
                },
                //企业动态
                getCondition:function(){
                    var all = XnRestAngular.allUrl('/Dynamic/getBynamicCat');
                    return all.post();
                },
                //企业动态指定分类列表
                getConditionMenu:function(id){
                    var all = XnRestAngular.allUrl('/Dynamic/getDynamicByCatId?'+'cat_id='+id);
                    return all.get('');
                },
                //企业动态全部分类的接口
                getConditionAll:function(){
                    var all = XnRestAngular.allUrl('/Dynamic/getAllDynamicList');
                    return all.post();
                },
                //企业动态详情
                getConditionDetails:function(id){
                    var all = XnRestAngular.allUrl('/Dynamic/getPassageDetailContent?'+'dyn_id='+id);
                    return all.get('');
                },
                //添加地址
                addAddress:function(data){
                     var all = XnRestAngular.allUrl('/Consigne/createAddress');
                    return all.post(data);
                },
                //获取地址列表
                getAddressList:function(){
                     var all = XnRestAngular.allUrl('/Consigne/getAddressList');
                    return all.get('');
                },
                //设置默认地址
                setDefultAddress:function(id){
                      var all = XnRestAngular.allUrl('/Consigne/setDefultAddress?cgn_id='+id);
                    return all.get('');   
                },
                //删除地址
                deleAddress:function(id){
                     var all = XnRestAngular.allUrl('/Consigne/delAddress?cgn_id='+id);
                    return all.get(''); 
                },
                //编辑修改地址Consigne/getAddressList
                editAddress:function(data){
                      var all = XnRestAngular.allUrl('/Consigne/updateAddress');
                    return all.post(data);   
                },
                //提交订单
                pickOrder:function(data){
                      var all = XnRestAngular.allUrl('/Order/generateOrder');
                    return all.post(data);   
                },
                //获得所有的订单Order/
                getOrderAll:function(obj){
                    var all = XnRestAngular.allUrl('/Order/getAllOrderList');
                    return all.post(obj); 
                },
                //根据订单的状态来查询订单的列表
                getOrderByStatus:function(obj){
                    var all = XnRestAngular.allUrl('/Order/getOrderListByStatus');
                    return all.post(obj); 
                },
                //订单详情Order/getODInfoById
                getOrderDetails:function(id){
                    var all = XnRestAngular.allUrl('/Order/getODInfoById?order_id='+id); 
                    return all.get(''); 
                },
                //订单删除Order/delOrder
                deleOreder:function(arr){
                    var all = XnRestAngular.allUrl('/Order/delOrder');
                    return all.post({order_ids:arr}); 
                },
                //取消订单
                cancelOrder:function(arr){
                    var all = XnRestAngular.allUrl('/Order/cancelOrderBycustomer');
                    return all.post({order_ids:arr}); 
                },
                //确定订单完成  Order/confirmOder
                confirmOrder:function(id){
                    var all = XnRestAngular.allUrl('/Order/confirmOrder?order_id='+id); 
                    return all.get(''); 
                },
                //客户自己信息修改 User/userInfoStable
                changeUserInfo:function(obj){
                    var all = XnRestAngular.allUrl('/User/userInfoStable');
                    return all.post(obj); 
                },
                //添加评论接口
                addAppraise:function(obj){
                    var all = XnRestAngular.allUrl('/Comment/addCmt');
                    return all.post(obj); 
                },
                 // 修改手机号的接口
                //订单支付成功的回调
                clientNotifyUrl:function(order_numbers){
                    var all = XnRestAngular.allUrl('/Order/clientNotifyUrl');
                    return all.post({order_numbers:order_numbers}); 
                },
                //获取反馈列表
                getfeedbacklist:function(page){
                    var all = XnRestAngular.allUrl('/Backinfo/getSelfBinfo');
                    return all.post({page:page}); 
                },
                //设置反馈
                setfeedback:function(data){
                    var all = XnRestAngular.allUrl('/Backinfo/setCustomerBack');
                    return all.post(data); 
                },
                //获得支付签名串接口
                getAlipayString:function(obj){
                    var all = XnRestAngular.allUrl('/Order/AliPaySign');
                    return all.post(obj); 
                },
                //获得支付签名串接口Home/WXpay/getPrePayOrder
                getweixinPayString:function(obj){
                    var all = XnRestAngular.allUrl('/WXpay/getPrePayOrder');
                    return all.post(obj); 
                },
                //版本更新接口
                getVistion:function(obj){
                    var all = XnRestAngular.allUrl('/Version/CheckAppIsLatestVersion');
                    return all.post(obj); 
                }
            }
        }
    ])