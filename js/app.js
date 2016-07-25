/**
 * Created by Lesxw on 2016/7/12 0012.
 */
$(function () {
    var activityContainer = {
        currentEditId: 0,
        componentList: [],
        pageConfig: {
            title: '',
            metaKeywords: '',
            metaDesc: ''
        },
        shareConfig: {
            title: '',
            desc: '',
            url: '',
            image: ''
        }
    };

    bindEvent();
    loadCachePage();

    function bindEvent() {
        $('#simulator').sortable({
            placeholder: "ui-state-highlight",
            stop: function () {
                cachePage();
            }
        });

        $('.shareConfigBtn', parent.document).on('click', function () {
            if ($('.shareConfig', parent.document).hasClass('hide')) {
                $('#shareTitle', parent.document).val(activityContainer.shareConfig.title);
                $('#shareDesc', parent.document).val(activityContainer.shareConfig.desc);
                $('#shareUrl', parent.document).val(activityContainer.shareConfig.url);
                $('#shareImage', parent.document).val(activityContainer.shareConfig.image);

                $('.shareConfig', parent.document).removeClass('hide');
            }
        });

        $('.saveShareConfig', parent.document).on('click', function () {
            activityContainer.shareConfig.title = $('#shareTitle', parent.document).val();
            activityContainer.shareConfig.desc = $('#shareDesc', parent.document).val();
            activityContainer.shareConfig.url = $('#shareUrl', parent.document).val();
            activityContainer.shareConfig.image = $('#shareImage', parent.document).val();

            $('.shareConfig', parent.document).addClass('hide');
            cachePage();
        });

        $('.cancelShareConfig', parent.document).on('click', function () {
            $('.shareConfig', parent.document).addClass('hide');
        });

        $('.editTitleBtn', parent.document).on('click', function () {
            if ($('.editMeta', parent.document).hasClass('hide')) {
                $('#pageTitle', parent.document).val(activityContainer.pageConfig.title);
                $('#metaKeywords', parent.document).val(activityContainer.pageConfig.metaKeywords);
                $('#metaDesc', parent.document).val(activityContainer.pageConfig.metaDesc);

                $('.editMeta', parent.document).removeClass('hide');
            }
        });

        $('.saveEditMeta', parent.document).on('click', function () {
            activityContainer.pageConfig.title = $('#pageTitle', parent.document).val();
            activityContainer.pageConfig.metaKeywords = $('#metaKeywords', parent.document).val();
            activityContainer.pageConfig.metaDesc = $('#metaDesc', parent.document).val();

            $('.editMeta', parent.document).addClass('hide');
            cachePage();
        });

        $('.cancelEditMeta', parent.document).on('click', function () {
            $('.editMeta', parent.document).addClass('hide');
        });

        $('.btn_clear', parent.document).on('click', function () {
            top.Editer.setValue({html: '', script: '', style: ''});
            activityContainer.currentEditId = 0;
        });

        $('.btn_save', parent.document).on('click', function () {
            if (activityContainer.currentEditId == 0)return;

            var code = top.Editer.getValue();
            resetComponetCode(activityContainer.currentEditId, code);
            initComponent(activityContainer.currentEditId);

            top.Editer.setValue({html: '', script: '', style: ''});
            activityContainer.currentEditId = 0;

            cachePage();
        });

        $('#clearCacheBtn', parent.document).on('click', function () {
            localStorage['activityContainer'] = '';
            location.reload();
        });

        $("#downloadBtn", parent.document).on('click', function () {
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

        $('#simulator').on('click', ".temp-container", function (ev) {
            if ($(this).hasClass('active')) {
                return;
            }

            $('.temp-container.active').removeClass('active');
            $(this).addClass('active');
        });

        $('#simulator').on('click', ".edit", function (ev) {
            var tmplId = $(this).data('id');
            activityContainer.currentEditId = tmplId;

            top.Editer.setValue(getComponentCode(tmplId).converted);
        });

        $('#simulator').on('click', ".del", function (ev) {
            var tmplId = $(this).data('id');

            $('#h-' + tmplId).remove();
            $('#js-' + tmplId).remove();
            $("#s-" + tmplId).remove();

            activityContainer.componentList.splice(activityContainer.componentList.indexOf(tmplId), 1);
            cachePage();

            top.Editer.setValue({html: '', style: '', script: ''});
            activityContainer.currentEditId = 0;
        });

        $("#simulator").on('dragover', function (ev) {
            ev.preventDefault();
        });

        $("#simulator").on('drop', function (ev) {
            var that = this;
            if (top.selectItemId == "") {
                return;
            }

            ComponentUtil.getTemplateContent(top.selectItemId, function (obj) {
                top.selectItemId = "";

                var tmplId = Math.random().toString().substr(2);

                setComponentCode(tmplId, obj, true);
                var html = getModuleContainer(tmplId, obj.html);
                includeScript(tmplId, obj.script);
                includeStyle(tmplId, obj.style);

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
                } while (el !== ctx && (el = el.parentNode));
                activityContainer.componentList.push(tmplId);
                initComponent(tmplId);

                cachePage();
            });
        });
    }

    function cachePage() {
        var tempIds = [];
        $('.temp-container').each(function () {
            var id = $(this).attr('id').replace('h-', '');
            tempIds.push(id);
        });
        activityContainer.componentList = tempIds;

        localStorage['activityContainer'] = JSON.stringify(activityContainer);
    }

    function loadCachePage() {
        if (localStorage['activityContainer']) {
            activityContainer = JSON.parse(localStorage['activityContainer']);
            for (var i = 0; i < activityContainer.componentList.length; i++) {
                var tmplId = activityContainer.componentList[i];
                var obj = activityContainer.tmpls[tmplId].converted;

                var html = getModuleContainer(tmplId, obj.html);
                $('#simulator').append(html.get(0));
                includeScript(tmplId, obj.script);
                includeStyle(tmplId, obj.style);
                initComponent(tmplId);
            }
        }
    }

    function initComponent(tmplId) {
        setTimeout(function () {
            if (window["obj" + tmplId] && window["obj" + tmplId].init) {
                window["obj" + tmplId].init();
            }
        }, 100)
    }

    function getModuleContainer(tmplId, html) {
        var tmp = $(template('tmpl', {tmplId}));
        var content = html.replace(/__component__/g, tmplId);
        tmp.find('.temp-body').append(content);
        activityContainer.tmpls[tmplId].converted.html = content;

        return tmp;
    }

    function includeScript(tmplId, content) {
        var script = document.createElement("script");
        script.id = "js-" + tmplId;
        script.innerHTML = content.replace(/__component__/g, tmplId);
        activityContainer.tmpls[tmplId].converted.script = script.innerHTML;
        document.head.appendChild(script);
    }

    function includeStyle(tmplId, content) {
        less.render(content.replace(/__component__/g, tmplId), function (e, data) {
            var style = document.createElement("style");
            style.id = "s-" + tmplId;
            style.innerHTML = data.css;
            activityContainer.tmpls[tmplId].converted.style = style.innerHTML;
            document.head.appendChild(style);
        })
    }

    function resetComponetCode(tmplId, code) {
        updateComponentCode(tmplId, code);
        location.reload();
    }

    function buildOutput() {

        var content = {
            title: activityContainer.pageConfig.title,
            keywords: activityContainer.pageConfig.metaKeywords,
            desc: activityContainer.pageConfig.metaDesc,
            share: activityContainer.shareConfig,
            html: getAllSelectHtml(),
            style: getAllSelectStyle(),
            js: getAllSelectScript()
        };

        var html = '';
        html += '<!DOCTYPE html>\n';
        html += '<html lang="en">\n';
        html += '<head>\n';
        /* title */
        html += '<title>' + content.title + '</title>\n';
        /* keywords */
        html += '<meta name="description" content="' + content.keywords + '"/>\n';
        /* desc */
        html += '<meta name="keywords" content="' + content.desc + '"/>\n';

        /* meta */
        html += '<meta http-equiv="content-type" content="text/html;charset=UTF-8" />\n';
        html += '<meta name="apple-mobile-web-app-capable" content="yes" />\n';
        html += '<meta content="telephone=no" name="format-detection" />\n';
        html += '<meta name="apple-mobile-web-app-status-bar-style" content="black" />\n';
        html += '<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />\n';

        /* style */
        html += '<style type="text/css">\n';
        html += '@charset "utf-8";html{color:#000;width:100%;height:100%;background:#fff;overflow-x: hidden;overflow-y:scroll;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}html *{outline:0;-webkit-text-size-adjust:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}html,body{font-family:sans-serif}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{margin:0;padding:0}input,select,textarea{font-size:100%}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}abbr,acronym{border:0;font-variant:normal}del{text-decoration:line-through}address,caption,cite,code,dfn,em,th,var{font-style:normal;font-weight:500}ol,ul{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:500}q:before,q:after{content:""}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}a:hover{text-decoration:underline}ins,a{text-decoration:none}';
        html += content.style;
        html += '\n</style>\n';
        html += '</head>\n';

        /* content */
        html += '<body>\n';
        html += content.html;

        /* 分享 */
        if (content.share.title && content.share.url && content.share.image) {
            html += '<div id="wxShare" style="display:none;">\n';
            html += '<input type="hidden" name="tcshareurl" value="' + content.share.url + '" />\n';
            html += '<input type="hidden" name="tcshareimg" value="' + content.share.image + '" />\n';
            html += '<input type="hidden" name="tcsharetext" value="' + content.share.title + '" />\n';
            html += '<input type="hidden" name="tcDesc" value="' + content.share.desc + '" />\n';
            html += '</div>\n';
            html += '<script type="text/javascript" src="http://wx.40017.cn/touch/weixin/iflight/js/airplane/wxshare3.0.0.1.js?v=2016020205"></script>\n';
        }

        html += '</body>\n';

        html += '<script src="http://js.40017.cn/cn/min/??/cn/if/zhuanti/common/jquery-1.11.3.min.js"></script>\n';

        /* 统计 */
        html += '<script type="text/javascript">\n';
        html += 'var _tcq = _tcq || [];\n';
        html += 'var _timediff = -1;\n';
        html += 'if (typeof _tcopentime != "undefined") {\n';
        html += '    _timediff = new Date().getTime() - _tcopentime;\n';
        html += '}\n';
        html += '_tcq.push(["_serialid", "" ? "" : 0]);\n';
        html += '_tcq.push(["_vrcode", "10003-2012-0"]);\n';
        html += '_tcq.push(["_refId", ""]);\n';
        html += '_tcq.push(["_userId", ""]);\n';
        html += '_tcq.push(["_openTime", _timediff]);\n';
        html += '_tcq.push(["_trackPageview", ""]);\n';
        html += '</script>\n';
        html += '<script defer="" type="text/javascript" src="http://vstlog.17usoft.com/vst.ashx" charset="utf-8"></script>\n';
        html += '\n<script>\n';
        html += content.js;
        html += '\n</script>\n';

        html += '</html>';

        return html;
    }

    function getAllSelectStyle() {
        var style = "";
        for (var i = 0; i < activityContainer.componentList.length; i++) {
            var css = $("#s-" + activityContainer.componentList[i]).html();
            style += css;
        }

        return style;
    }

    function getAllSelectScript() {
        var script = "";
        for (var i = 0; i < activityContainer.componentList.length; i++) {
            var js = $("#js-" + activityContainer.componentList[i]).html();
            script += js;
        }

        return script;
    }

    function getAllSelectHtml() {
        var content = "";
        var htmlList = $('.temp-body');
        for (var i = 0; i < htmlList.length; i++) {
            var html = $(htmlList[i]).html();
            content += html;
        }
        return content;
    }

    function setComponentCode(tmplId, code, cache) {
        if (!activityContainer.tmpls) {
            activityContainer.tmpls = {};
        }

        activityContainer.tmpls[tmplId] = {
            orgin: code,
            converted: {}
        };
    }

    function updateComponentCode(tmplId, code, cache) {
        activityContainer.tmpls[tmplId].converted = code;
    }

    function getComponentCode(tmplId) {
        return activityContainer.tmpls[tmplId]
    }

});