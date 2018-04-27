function insertBefore(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

String.prototype.lines = function() { return this.split(/\r*\n/); }
String.prototype.lineCount = function() { return this.lines().length; }

var loggingLevel = '-';

function log(info) {
  if (loggingLevel == 'log') {
    console.log(info);
  }
}

(function run() {
    console.log('** run() (Build 011)');

    if (typeof helperObject == 'undefined' || helperObject == null) {
        console.log('** helperObjectCode(): creating object.');
        helperObject = {};
    }
    else {
        console.log('** helperObjectCode(): helperObject already exists.');
    }

    //

    //
    // insertPlace object: {before: element} or {after: element}
    //
    helperObject.run = function(html, insertPlace) {
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

        dragElement(plugin);

        console.log('** Plugin added.');


        console.log('** Tuning the BTT site...');

        tuneBTT();

        console.log('** The BTT site successfully tuned.');
    }

    function tuneBTT() {
        var textareas = $('textarea');
        // 1.
        textareas.attr('rows', '4');

        // 2.
        // Autosize applied in another Tampermonkey script.

        // 3.
        textareas
            .removeAttr('readonly');

        // 4.
        $('#info').css('resize', 'both');

        // 5.
        var issNumInput = document.getElementsByName('issue_no')[0];
        if (issNumInput != null) {
            issNumInput.style.float = 'left';
            issNumInput.style.marginLeft = '30px';
            issNumInput.style.paddingRight = '3px';
            var focused = false;
            issNumInput.addEventListener('focus', function(){
                if (!focused) {
                    this.select();
                focused = true;
                }
            });
            issNumInput.addEventListener('blur', function(){
                focused = false;
            });

            var btn = issNumInput.previousSibling.previousSibling;
            btn.value = 'Open >>';
            btn.classList.add('task-open-btn');
            btn.style.marginRight = '10px';
            btn.style.height = '19px';
            btn.style.width = '80px';
        }

        // 6.
        var tables = document.getElementsByTagName('table');
        if (tables.length == 16) {
            tables[3].classList.add('table-striped');
        }
    }
})();
