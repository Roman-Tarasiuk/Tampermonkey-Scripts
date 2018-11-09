// ==UserScript==
// @name         Zaxid.Net Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://zaxid.net/*
// @grant        none
//
// After getting results, use the next string for parsing:
//     <span class="type">.*\n.*\n *<span class="date">(.*?)</span><span class="time">(.*?)</span>\n.*?<a href="(.*?)">\n(.*)\n.*\n.*\n((?:.|\n)*?)\n*</div>
//         match[1] + ' ' + match[2] + '\t' + match[3] + '\t' + match[4] + '\t' + match[5].replace(/\n/g, ' ') + '\n'
//
// ==/UserScript==

(function() {
    'use strict';

    var pluginCss =
`
.helper {
    height: 260px;
    background-color: #99ccff;
    padding: 5px;
}

.w {
    width: calc(100% - 10px);
}
`;

    var pluginHtml =
`
<div class="helper">
    <label for="dateFrom">From:</label>
    <input type="text" id="dateFrom" placeholder="2018-01-01" value="2018-01-01">
    <label for="dateTo">To:</label>
    <input type="text" id="dateTo" placeholder="2018-01-31" value="2018-01-31">
    <br>
    <label for="searchFor">Search for:</label>
    <input type="text" id="searchFor" value="автобус">
    <button onclick="window.helper.process()">Process</button>
    <br>
    <textarea id="results" style="resize: both; width: 60%; height: 120px;"></textarea>
</div>
`;

    function insertBefore(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function Helper() {

        // Configurations.
        var stopSearchStr = "нічого не знайдено";

        // Main functionality.
        var that = this;

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

            console.log('** Plugin added. (' + new Date() + ')');
        };

        this.appendCss = function (css) {
            var cssElement = document.createElement('style');
            cssElement.innerText = css;
            document.head.appendChild(cssElement);
        };

        this.process = function() {
            console.log("Hello World!");
            var dateFromEl = document.getElementById('dateFrom');
            var dateToEl = document.getElementById('dateTo');
            var searchForEl = document.getElementById('searchFor');
            var resultsEl = document.getElementById('results');

            var dateFrom = dateFromEl.value;
            var dateTo = dateToEl.value;
            var searchFor = searchForEl.value;

            if (dateFrom == '' || dateTo == '' || searchFor == '') {
                resultsEl.value = 'Fill the date and search strings and try again.';
            }
            else {
                resultsEl.value = '** Search started...';

                var runningInterval;
                var continueRequests = true;
                var processing = false;
                var startRow = 0;
                var xhttp = new XMLHttpRequest();

                runningInterval = setInterval(function() {
                    if (!continueRequests) {
                        clearInterval(runningInterval);
                        resultsEl.value += '\n** Search done.';
                        return;
                    }

                    if (processing) {
                        return;
                    }

                    processing = true;

                    var URI = 'https://zaxid.net/search/search.do?searchValue=' + searchFor
                              + '&dateOrder=true&exact=false'
                              + '&from=' + dateFrom
                              + '&to=' + dateTo
                              + '&lvl1MenuId=0&lvl2MenuId=0'
                              + '&startRow=' + startRow;

                    xhttp.onreadystatechange = function() {
                        try {
                            if (this.readyState == 4 && this.status == 200) {
                                var result = that.parseResults(this.responseText);
                                if (result == stopSearchStr) {
                                    continueRequests = false;
                                }
                                else {
                                    resultsEl.value += '\n' + result;
                                    startRow += 10;
                                    processing = false;
                                }
                            }
                        }
                        catch (error) {
                            resultsEl.value += '\nProcessed with error (check your arguments string):\n' + error;
                        }
                    };
                    xhttp.open('GET', URI, true);
                    xhttp.setRequestHeader('Content-type', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
                    xhttp.send();
                }, 500);
            }
        };

        this.parseResults = function(resultStr) {
            var result = '';

            var searchCountRe = /<div class="search_count_wrap">((.|\n)*?)<\/div>/g;
            var tmp = searchCountRe.exec(resultStr);
            if (tmp[1] == stopSearchStr) {
                result = tmp[1];
                return result;
            }

            var resultRe = /<ul class="list search_list">(.|\n)*?<\/ul>/g;
            tmp = resultRe.exec(resultStr);
            if (tmp != null) {
                result += tmp[0];
            }

            return result;
        };
    }

    var h = new Helper();
    h.run(pluginHtml);
    h.appendCss(pluginCss);

    window.helper = h;
    // Your code here...
})();