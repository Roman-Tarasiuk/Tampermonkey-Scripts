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
    <input id="id" class="w">
    <div>
        <textarea id="info" class="w"></textarea>
    </div>
    <button onclick="window.helper.process()">Filtered urls</button>
</div>
`;

var pluginCss =
`
.helper {
    height: 260px;
    background-color: #99ccff;
    padding: 5px;
}
.w {
    width: 100%;
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

    this.process = function() {
        var target = document.getElementById(that.idEl.value);

        var re = /<a.*?href="(.*?)".*?>(.+?)<\/a>/g;

        var result = '';

        var href;
        while ((href = re.exec(target.innerHTML)) != null) {
            var fullAddress = true;
            // Filtering.
            if (href[1].startsWith('#')) {
                continue;
            }
            if (href[1].startsWith('/')) {
                fullAddress = false;
            }
            result += '>> ' +
                      href[2] + // Anchor text.
                      (!fullAddress ? '\t***\t' : '\t**\t') +
                      (!fullAddress ? document.location.origin : '') +
                      href[1] +
                      '\n';
        }

        document.getElementById('info').value = result;
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