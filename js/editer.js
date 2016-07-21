/**
 * Created by Lesxw on 2016/7/13 0013.
 */
(function(){
    var Editer = function(){
        this.htmlField = null;
        this.cssField = null;
        this.jsField = null;
    };

    Editer.prototype = {
        init: function(){
            this.htmlField = ace.edit("html");
            this.htmlField.setOptions({
                useWorker: false,
                theme: "ace/theme/monokai",
                displayIndentGuides: true,
                mode: "ace/mode/html",
                tabSize: 2,
                useSoftTabs: true,
                showPrintMargin: false,
                enableEmmet: true
            });

            this.cssField = ace.edit("css");
            this.cssField.setOptions({
                theme: "ace/theme/monokai",
                displayIndentGuides: true,
                mode: "ace/mode/css",
                tabSize: 2,
                useSoftTabs: true,
                showPrintMargin: false,
                enableEmmet: true
            });

            this.jsField = ace.edit("js");
            this.jsField.setOptions({
                theme: "ace/theme/monokai",
                displayIndentGuides: true,
                mode: "ace/mode/javascript",
                tabSize: 2,
                useSoftTabs: true,
                showPrintMargin: false
            });
        },

        setValue: function(code){
            this.htmlField.setValue(code.html);
            this.cssField.setValue(code.css);
            this.jsField.setValue(code.js);
        },

        getValue:function(){
            return {
                html:this.htmlField.getValue(),
                css:this.cssField.getValue(),
                js:this.jsField.getValue()
            }
        }

    };

    window.Editer = new Editer()
})()