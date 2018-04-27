// ==UserScript==
// @name         BTT2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.csltd.com.ua/*
// @grant        none
// @require      http://localhost:8080/js/jquery-1.12.4.min.js
// @require      http://localhost:8080/js/autosize.min.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('** BTT2...');

    var textareas = $('textarea');

    autosize(textareas);
    textareas.css('resize', 'vertical');
    textareas.css({'overflow': ''});

    console.log('** BTT2 complete');
    // Your code here...
})();
