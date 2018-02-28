// ==UserScript==
// @name         Aval
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.aval.ua/
// @resource     bootstrap http://localhost:8080/bootstrap.min.css
// @require      http://localhost:8080/Memrise/helper_code.js
// @require      http://localhost:8080/Memrise/run.js
// @require      http://localhost:8080/Memrise/draggable.js
// @resource     html http://localhost:8080/Memrise/plugin.html
// @resource     css2 http://localhost:8080/Memrise/style.css
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';

    var pluginHtml = GM_getResourceText('html');
    var insertBefore = document.getElementById('root_container');

    //helperObject.run(pluginHtml, {after: insertBefore});
    helperObject.run(pluginHtml);

    var bootstrap = GM_getResourceText('bootstrap');
    var css2 = GM_getResourceText('css2');
    helperObject.appendCss(bootstrap);
    helperObject.appendCss(css2);


    // Your code here...
})();
