/**
 * Created by Lesxw on 2016/7/12 0012.
 * Template.js
 * 组件的相关操作，读取，使用等
 */
(function(window,$){
    var componentList = [
        {
            name:'headImage',
            logo:'https://raw.githubusercontent.com/TC-Flight-Int-Web/mengmeng/master/components/headImage/20160725144256.png',
            title:'图片',
            desc:'顶部图片，无js，纯显示'
        },
        {
            name:'listSource',
            logo:'https://raw.githubusercontent.com/TC-Flight-Int-Web/mengmeng/master/components/listSource/20160725144136.png',
            title:'数据列表',
            desc:'显示数据列表'
        },
        {
            name:'footActivityInfo',
            logo:'https://raw.githubusercontent.com/TC-Flight-Int-Web/mengmeng/master/components/footActivityInfo/20160725144218.png',
            title:'活动详情',
            desc:'底部活动详情及说明,底图加文字'
        }
    ];

    var componentCache = {};
    var selectComponent = {};

    var ComponentUtil = function(){};

    ComponentUtil.prototype = {
        /**
         * 获取模块内容
         * @param componentName
         * @param callback
         */
        getTemplateContent: function(componentName,callback){
            var that = this;

            if(componentCache[componentName]){
                callback(componentCache[componentName])
            }else{
                selectComponent = {};
                Promise.all(
                    [that.getScript(componentName),
                    that.getHtml(componentName),
                    that.getStyle(componentName)]
                ).then(function(){
                    componentCache[componentName] = selectComponent;
                    callback(componentCache[componentName]);
                });
            }
        },

        getScript: function(componentName){
            return new Promise((resolve,reject)=>{
                $.get("./components/" + componentName + "/index.js",
                    function(data){
                        selectComponent.script = data;
                        resolve();
                    }
                );
            });

        },

        getHtml: function(componentName){
            return new Promise((resolve,reject)=>{
                $.get("./components/" + componentName + "/index.html",
                    function(data){
                        selectComponent.html = data;
                        resolve();
                    }
                );
            });
        },

        getStyle: function(componentName){
            return new Promise((resolve,reject)=>{
                $.get("./components/" + componentName + "/index.less",
                    function(data){
                        selectComponent.style = data;
                        resolve();
                    }
                );
            });
        },

        listTemplate: function(callback){
            callback(componentList);
        }
    };



    window.ComponentUtil = new ComponentUtil();
})(window,$);