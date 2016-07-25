(function(){
    var obj = {
        dataSource:[
            "http://wx.40017.cn/touch/weixin/iflight/img/zhuanti/2016/nanhang/wifi/banner1_01.jpg",
            "http://wx.40017.cn/touch/weixin/iflight/img/zhuanti/2016/nanhang/wifi/banner2_02.jpg"
        ],
        init:function(){
            var str = template('tmpl-image-list', {list: this.dataSource});
            $('.c-head-image-box').html(str);
        }
    };

    window.obj__component__ = obj;
})();