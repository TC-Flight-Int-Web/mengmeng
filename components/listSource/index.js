(function () {
    var obj = {
        dataSource: [
            {
                bccode: "HGH",
                accode: "SFO",
                bcname: "杭州",
                acname: "旧金山",
                price: "7010",
                bcdate: "2016-07-15",
                acdate: "2016-07-30",
                gotime: "2016.07.15",
                backtime: "2016.07.20"
            },
            {
                bccode: "HKG",
                accode: "SFO",
                bcname: "香港",
                acname: "旧金山",
                price: "7838",
                bcdate: "2016-07-15",
                acdate: "2016-07-20",
                gotime: "2016.07.15",
                backtime: "2016.07.20"
            },
            {
                bccode: "CTU",
                accode: "SFO",
                bcname: "成都",
                acname: "旧金山",
                price: "7600",
                bcdate: "2016-07-15",
                acdate: "2016-07-28",
                gotime: "2016.07.15",
                backtime: "2016.07.20"
            },
            {
                bccode: "PEK",
                accode: "SFO",
                bcname: "北京",
                acname: "旧金山",
                price: "7010",
                bcdate: "2016-07-15",
                acdate: "2016-07-25",
                gotime: "2016.07.15",
                backtime: "2016.07.20"
            },
        ],
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        format: function (date, fmt) {
            fmt = fmt || "yyyy-MM-dd";
            var o = {
                "M+": date.getMonth() + 1,               //月份
                "d+": date.getDate(),                    //日
                "h+": date.getHours(),                   //小时
                "m+": date.getMinutes(),                 //分
                "s+": date.getSeconds(),                 //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds()             //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        book1Url: function (data) {
            if (data.bcdate.substr(0, 4) == "1900") {
                var myDate = new Date();
                var amyDate = new Date();
                myDate.setDate(myDate.getDate() + 7);
                amyDate.setDate(amyDate.getDate() + 12);
                data.bcdate = this.format(myDate);
                data.acdate = this.format(amyDate);
            } else {
                var nowdate = this.format(new Date());
                var intdate = data.bcdate.substr(0, 10);
                var arrintdate = data.acdate.substr(0, 10);
                if (intdate < nowdate) {
                    var myNowDate = new Date();
                    myNowDate.setDate(myNowDate.getDate() + 7);
                    var addSevenFlydate = this.format(myNowDate);
                    data.bcdate = addSevenFlydate;
                } else if (arrintdate < nowdate) {
                    var myNowDate = new Date();
                    myNowDate.setDate(myNowDate.getDate() + 12);
                    var addSevenFlydate = this.format(myNowDate);
                    data.acdate = addSevenFlydate;
                }
            }

            var pageType = this.getQueryString("pageType");
            var jumpUrl = "";
            if (pageType == "app") {
                jumpUrl = data.bccode + "/"
                        + data.accode + "/"
                        + data.bcdate + "/"
                        + data.acdate
                        + "?bcName=" + data.bcname
                        + "&acName=" + data.acname;
            } else {
                jumpUrl = data.bccode + "_" + data.accode + ".html?showpaytitle=1&openid=&beginCity=" + data.bcname
                        + "&arrCity=" + data.acname
                        + "&arrivaltime=" + data.acdate
                        + "&FlyOffTime=" + data.bcdate
                        + "&refid=142751159";
            }

            $.ajax({
                url: "http://www.ly.com/iflight/flightinterajax.aspx?action=SEARCHURL&_dAjax=callback&" + jumpUrl,
                dataType: "jsonp",
                success: function (data) {
                    if (data && data.state == 100) {
                        if (pageType == "app") {
                            location.href = "http://shouji.17u.cn/internal/h5/file/20/main.html?#/book1/" + jumpUrl + "&wvc5=1";
                        }
                        else {
                            location.href = "http://wx.17u.cn/iflight/" + jumpUrl;
                        }
                    }
                },
                error: function () {
                }
            });
        },
        touchHandler:function(){
            this.book1Url($(event.currentTarget).data());
        },

        init: function () {
            var str = template('tmpl-list-source', {list: this.dataSource});
            $('.list-source').html(str);
        }
    };

    window.obj__component__ = obj;
})();