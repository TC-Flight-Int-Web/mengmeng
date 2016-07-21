/**
 * Created by Lesxw on 2016/7/12 0012.
 */
$(function(){

    bindEvent();
    $('#simulator').sortable();

    var activityContainer = {
        currentEditId: 0,
        componentList:[],
    };

    function  bindEvent() {
        $('.btn_save', parent.document).on('click',function(){
            if(activityContainer.currentEditId == 0)return;

            var code = top.Editer.getValue();
            resetComponetCode(activityContainer.currentEditId,code);
            initComponent(activityContainer.currentEditId);

            top.Editer.setValue({html:'',js:'',css:''});
            activityContainer.currentEditId = 0;
        });

        $("#download",parent.document).on('click',function(){
            function destroyClickedElement(event) {
                document.body.removeChild(event.target);
            }

            var $download = document.createElement("a");

            var textToWrite = buildOutput();
            var textFileAsBlob = new Blob([textToWrite], {type: "text/plain"});

            $download.download = "index.html";

            $download.href = window.webkitURL.createObjectURL(textFileAsBlob);

            $download.onclick = destroyClickedElement;
            $download.style.display = "none";
            document.body.appendChild($download);
            $download.click();
        });

        $('#simulator').on('click',".temp-container",function(ev){
            if($(this).hasClass('active')){
                return;
            }

            $('.temp-container.active').removeClass('active');
            $(this).addClass('active');
        });

        $('#simulator').on('click',".edit",function(ev){
            var tmplId =$(this).data('id');
            activityContainer.currentEditId = tmplId;

            var html = $('#h-' + tmplId).find('.temp-body').html();
            var js = $('#js-' + tmplId).html();
            var css =  $("#s-" + tmplId).html();

            top.Editer.setValue({html,js,css});
        });

        $('#simulator').on('click',".del",function(ev){
            var tmplId =$(this).data('id');

            $('#h-' + tmplId).remove();
            $('#js-' + tmplId).remove();
            $("#s-" + tmplId).remove();

            activityContainer.componentList.splice(activityContainer.componentList.indexOf(tmplId),1);
            top.Editer.setValue({html:'',js:'',css:''});
            activityContainer.currentEditId = 0;
        });

        $("#simulator").on('dragover', function (ev) {
            console.log(`dragover`);
            ev.preventDefault();
        });

        $("#simulator").on('drop', function (ev) {
            var that = this;
            if (top.selectItemId == "") {
                return;
            }

            ComponentUtil.getTemplateContent(top.selectItemId,function(obj){
                top.selectItemId = "";

                var tmplId = Math.random().toString().substr(2);

                if(!activityContainer.tmpls){
                    activityContainer.tmpls = {};
                }
                //render
                activityContainer.tmpls[tmplId] = obj;

                //html
                var html = getModuleContainer(tmplId,activityContainer.tmpls[tmplId].html);
                //script
                includeScript(tmplId,activityContainer.tmpls[tmplId].script);
                //style
                includeStyle(tmplId,activityContainer.tmpls[tmplId].style);

                var el = ev.target;
                var ctx = $(that).get(0);
                do {
                    if ($(el).hasClass('temp-container')) {
                        if (el.nextElementSibling) {
                            el.parentNode.insertBefore($(html).get(0), el.nextElementSibling);
                            break;
                        } else {
                            ctx.appendChild($(html).get(0));
                        }
                    } else if (el == ctx) {
                        ctx.appendChild($(html).get(0));
                    }
                } while (el !== ctx && (el = el.parentNode))
                activityContainer.componentList.push(tmplId);
                initComponent(tmplId);
            });
        });
    }

    function initComponent(tmplId){
        setTimeout(function(){
            if(window["obj" + tmplId] && window["obj" + tmplId].init){
                window["obj" + tmplId].init();
            }
        },100)
    }

    function getModuleContainer(tmplId,html){
        var tmp = $(template('tmpl',{tmplId}));
        tmp.find('.temp-body').append(html.replace(/__component__/g,tmplId));
        return tmp;
    }

    function includeScript(tmplId,content){
        var script = document.createElement("script");
        script.id = "js-" + tmplId;
        script.innerHTML = content.replace(/__component__/g,tmplId);

        document.head.appendChild(script);
    }

    function includeStyle(tmplId,content){
        less.render(content.replace(/__component__/g,tmplId),function(e,data){
            var style = document.createElement("style");
            style.id = "s-" + tmplId;
            style.innerHTML = data.css;

            document.head.appendChild(style);
        })
    }

    function resetComponetCode(tmplId,code){
        delete window["obj"+tmplId];
        $('#js-' + tmplId).remove();
        includeScript(tmplId,code.js);

        $('#h-' + activityContainer.currentEditId).find('.temp-body').html(code.html);
        $("#s-" + activityContainer.currentEditId).html(code.css);
    }

    function buildOutput() {

        var content = {
            html: getAllSelectHtml(),
            style: getAllSelectStyle(),
            js: getAllSelectScript()
        };

        var html = '';
        html += '<!DOCTYPE html>\n';
        html += '<html lang="en">\n';
        html += '<head>\n';
        html += '<meta charset="UTF-8">\n';
        html += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">\n';

        html += '<style type="text/css">\n';

        html += '@charset "utf-8";html{color:#000;width:100%;height:100%;background:#fff;overflow-x: hidden;overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}html,body{font-family:sans-serif}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}input,select,textarea{font-size:100%}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}abbr,acronym{border:0;font-variant:normal}del{text-decoration:line-through}address,caption,cite,code,dfn,em,th,var{font-style:normal;font-weight:500}ol,ul{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}q:before,q:after{content:""}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}a:hover{text-decoration:underline}ins,a{text-decoration:none}';
        html += content.style;
        html += '\n</style>\n';


        html += '</head>\n';
        html += '<body>\n';
        html += content.html;

        html += '</body>\n';

        html += '<script src="http://js.40017.cn/cn/min/??/cn/if/zhuanti/common/jquery-1.11.3.min.js"></script>\n';

        html += '\n<script>\n';
        html += content.js;
        html += '\n</script>\n';

        html += '</html>';

        return html;
    }

    function getAllSelectStyle(){
        var style = "";
        for(var i =0;i<activityContainer.componentList.length;i++){
            var css =  $("#s-" + activityContainer.componentList[i]).html();
            style += css;
        }

        return style;
    }

    function getAllSelectScript(){
        var script = "";
        for(var i =0;i<activityContainer.componentList.length;i++){
            var js =  $("#js-" + activityContainer.componentList[i]).html();
            script += js;
        }

        return script;
    }

    function getAllSelectHtml(){
        var content = "";
        var htmlList = $('.temp-body');
        for(var i =0;i<htmlList.length;i++){
            var html =$(htmlList[i]).html();
            content += html;
        }
        return content;
    }

});