// ==UserScript==
// @name         BTT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.csltd.com.ua/*
// @resource     bootstrap  http://localhost:8080/css/bootstrap.min.css
// @resource     glph_eot   http://localhost:8080/fonts/glyphicons-halflings-regular.eot
// @resource     glph_woff2 http://localhost:8080/fonts/glyphicons-halflings-regular.woff2
// @resource     glph_woff  http://localhost:8080/fonts/glyphicons-halflings-regular.woff
// @resource     glph_ttf   http://localhost:8080/fonts/glyphicons-halflings-regular.ttf
// @resource     glph_svg   http://localhost:8080/fonts/glyphicons-halflings-regular.svg
// @require      http://localhost:8080/js/jquery-1.12.4.min.js
// @require      http://localhost:8080/js/bootstrap.min.js
// @require      http://localhost:8080/js/autosize.min.js
// @require      http://localhost:8080/BTT/helper_code.js
// @require      http://localhost:8080/BTT/run.js
// @require      http://localhost:8080/BTT/draggable.js
// @resource     html http://localhost:8080/BTT/plugin.html
// @resource     css2 http://localhost:8080/BTT/style.css
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// ==/UserScript==

/*!
    Autosize 4.0.0
    license: MIT
    http://www.jacklmoore.com/autosize
    https://github.com/jackmoore/autosize
*/

(function() {
    'use strict';

    var pluginHtml = GM_getResourceText('html');
    var insertBefore = document.getElementById('root_container');

    //helperObject.run(pluginHtml, {after: insertBefore});
    helperObject.run(pluginHtml);

    var bootstrap = GM_getResourceText('bootstrap');
    bootstrap = bootstrap.replace('../fonts/glyphicons-halflings-regular.eot', GM_getResourceURL('glph_eot'));
    bootstrap = bootstrap.replace('../fonts/glyphicons-halflings-regular.woff2', GM_getResourceURL('glph_woff2'));
    bootstrap = bootstrap.replace('../fonts/glyphicons-halflings-regular.woff', GM_getResourceURL('glph_woff'));
    bootstrap = bootstrap.replace('../fonts/glyphicons-halflings-regular.ttf', GM_getResourceURL('glph_ttf'));
    bootstrap = bootstrap.replace('../fonts/glyphicons-halflings-regular.svg', GM_getResourceURL('glph_svg'));
    helperObject.appendCss(bootstrap);

    var css2 = GM_getResourceText('css2');
    helperObject.appendCss(css2);

    autosize($('textarea'));
    $('textarea')
      .attr('rows', '4')
      .removeAttr('readonly')
      .css('resize', 'vertical');

    if (document.title == "Изменение заявки") {
        var q = document.getElementById('Table3');
        var taskId = q.children[0].children[0].children[1].innerText;
        var prefix = "B2.AVAL-";
        if (taskId.startsWith(prefix)) {
            taskId = taskId.substring(prefix.length);
        }
        document.title = taskId + ' - ' + document.title;
    }

    // Your code here...
})();