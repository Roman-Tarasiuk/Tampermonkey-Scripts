// ==UserScript==
// @name         Document links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://docs.microsoft.com/*
// @grant        none
// ==/UserScript==

var pluginHtml =
`
<div class="helper">
    <span class="w">Id:</span>
    <input id="id" class="w" placeholder="A section Id or empty for document body">
    <div>
        <textarea id="info" class="w"></textarea>
    </div>
    <button onclick="window.helper.process()">Filtered urls</button>
    <button onclick="window.helper.statistic()">Urls count</button>
    <button onclick="window.helper.toggleStatistics()">Toggle</button>
    <button onclick="window.helper.saveToFile()">Save content...</button>
</div>
`;

var pluginCss =
`
:root {
  --stat-background-color: #09f;
}
.helper {
    height: 260px;
    background-color: #99ccff;
    padding: 5px;
}
.w {
    width: 100%;
}
.stat {
    display: var(--stat-display);
    background-color: var(--stat-background-color);
    color: white;
}
`;

function insertBefore(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function Helper() {

    // Configurations.

    // Main functionality.
    var that = this;

    var idEl = null;
    var displayStat = true;

    this.run = function(html, insertPlace) {
        console.log('** Adding plugin...');

        var plugin = document.createElement('div');
        plugin.id = 'plugindiv';
        plugin.innerHTML = html;

        if (insertPlace) {
            if (insertPlace.before) {
                insertBefore(plugin, insertPlace.before);
            }
            else if (insertPlace.after) {
                insertAfter(plugin, insertPlace.after);
            }
        }
        else {
            document.body.appendChild(plugin);
        }

        var vocabulary = localStorage.getItem('myVocabulary');
        if (vocabulary != null) {
            that.words = JSON.parse(vocabulary);
        }

        that.idEl = document.getElementById('id');

        console.log('** Plugin added. (' + new Date() + ')');
    };

    this.appendCss = function (css) {
        var cssElement = document.createElement('style');
        cssElement.innerText = css;
        document.head.appendChild(cssElement);
    };

    //

    function getUrls(html) {
        var result = [];

        var re = /<a(?:.|\n)*?href="(.*?)".*?>((?:.|\n)*?)<\/a>/g;

        var href;
        while ((href = re.exec(html)) != null) {
            result.push({
                anchor: href[2],
                url: href[1]
            });
        }

        return result;
    }

    this.process = function() {
        var targetEl = null;
        if (that.idEl.value == '') {
            targetEl = document.body;
        }
        else {
            targetEl = document.getElementById(that.idEl.value);
        }
        if (targetEl == null) {
            document.getElementById('info').value = 'Section with Id ' +
                that.idEl.value + ' does not exist.';
            return;
        }

        var result = '';
        var urls = getUrls(targetEl.innerHTML);

        for (var i = 0; i < urls.length; i++) {
            var fullAddress = true;
            // Filtering.
            if (urls[i].url.startsWith('#')) {
                continue;
            }
            if (urls[i].url.startsWith('/')) {
                fullAddress = false;
            }
            result += '>> ' +
                      urls[i].anchor + // Anchor text.
                      (!fullAddress ? '\t***\t' : '\t**\t') +
                      (!fullAddress ? document.location.origin : '') +
                      urls[i].url +
                      '\n';
        }

        document.getElementById('info').value = result;
    }

    this.statistic = function() {
        var targetEl = null;
        if (that.idEl.value == '') {
            targetEl = document.body;
        }
        else {
            targetEl = document.getElementById(that.idEl.value);
        }
        if (targetEl == null) {
            document.getElementById('info').value = 'Section with Id ' +
                that.idEl.value + ' does not exist.';
            return;
        }

        var urls = getUrls(targetEl.innerHTML);

        var rows = [];
        for (var i = 0; i < urls.length; i++) {
            if (urls[i].url == '' || urls[i].url.startsWith('#')) {
                continue;
            }

            rows.push(urls[i].url);
        }

        var stat = getStatistic(rows);

        var result = targetEl.innerHTML;
        for (i in stat) {
            let re = new RegExp('(<a(?:.|\n)*?href="' + i.replace(/\?/g, '\\?') + '".*?>)((?:.|\n)*?)(<\/a>)', 'g');
            result = result.replace(re, '$1$2<sup class="stat">' + stat[i] + '</sup>$3');
        }

        targetEl.innerHTML = result;
    };

    this.toggleStatistics = function() {
        var bodyStyles = document.body.style;
        //bodyStyles.setProperty('--stat-background-color', 'red');

        if (displayStat) {
            bodyStyles.setProperty('--stat-display', 'none');
            displayStat = false;
        }
        else {
            bodyStyles.setProperty('--stat-display', '');
            displayStat = true;
        }
    };

    function getStatistic(rows) {
        var result = {};

        for (var i = 0; i < rows.length; i++) {
            if (rows[i] in result) {
                result[rows[i]]++;
            }
            else {
                result[rows[i]] = 1;
            }
        }

        return result;
    }

    this.saveToFile = function() {
        var targetEl = null;
        if (that.idEl.value == '') {
            targetEl = document.body;
        }
        else {
            targetEl = document.getElementById(that.idEl.value);
        }
        if (targetEl == null) {
            document.getElementById('info').value = 'Section with Id ' +
                that.idEl.value + ' does not exist.';
            return;
        }

        download(targetEl.innerHTML, 'file.txt', 'text/plain');
    };

    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }
}

(function() {
    'use strict';

    var h = new Helper();
    h.run(pluginHtml);
    h.appendCss(pluginCss);

    window.helper = h;
    // Your code here...
})();