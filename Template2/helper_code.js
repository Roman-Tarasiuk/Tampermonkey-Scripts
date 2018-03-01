//
// The function adds properties to the helperObject.
//
(function helperObjectCode() {
    console.log('** helperObjectCode() (Build 011)');

    if (typeof helperObject == 'undefined' || helperObject == null) {
        console.log('** helperObjectCode(): creating object.');
        helperObject = {};
    }
    else {
        console.log('** helperObjectCode(): helperObject already exists.');
    }

    //

    helperObject.process = function() {
        console.log('** In helperObject.process()');

        var that = this;
        var textArea = document.getElementById('info');
        textArea.value = 'Loading...';

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www...');
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function() { //Call a function when the state changes.
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                var decodedStr = '';
                console.log('** Start decoding...');
                const contenttype = xhr.getResponseHeader('content-type');
                const charset = 'windows-1251';
                const dataView = new DataView(xhr.response);
                const decoder = new TextDecoder(charset);
                var decodedStr = decoder.decode(dataView);
                try {
                    var result = that.getCreationTime(decodedStr);
                    if (result != null) {
                        textArea.value = result;
                    }
                    else {
                        textArea.value = decodedStr;
                        console.log('** No data');
                    }
                    console.log('Yahoo!');
                }
                catch (exc) {
                    console.log('** Cannot decode. Error:');
                    console.log(exc);
                    textArea.value = decodedStr;
                }
            }
        }
        //var issNumInput = document.getElementsByName('issue_no')[0];
        var issNumInput = document.getElementById('taskId');
        var taskId = issNumInput.value;
        xhr.send('issue_no=' + taskId + '&iss_per_page=0&h_link=issue_no&h_action=');
    }

    helperObject.appendCss = function (css) {
        var cssElement = document.createElement('style');
        cssElement.innerText = css;
        document.head.appendChild(cssElement);
    }

    helperObject.getCreationTime = function (str) {
        log('** getCreationTime()');
        var re = /<TEXTAREA class=\"textarea.*?100(?:.|\r\n)*?<\/TEXTAREA>.*\r\n.*\r\n.*\r\n.*\r\n.*\r\n.*/g;
        var reCreation = /<br>(.*)<br>\r\n.*?<br>(.*)/g;
        var result = null;

        var resultTmp = re.exec(str);
        log(resultTmp);
        if (resultTmp != null) {
          var tmp1 = reCreation.exec(resultTmp[0]);
          log(tmp1);
          result = 'Last edition:\t' + tmp1[1] + '\t' + tmp1[2] + '\n';
          log(result);
        }

        log('while');
        var tmp2;
        while ((tmp2 = re.exec(str)) != null) {
          resultTmp = tmp2;
        }
        log('while passed.');

        log(resultTmp);
        if (resultTmp != null) {
          reCreation.lastIndex = 0;
          resultTmp = reCreation.exec(resultTmp[0]);
          log(resultTmp);
          result += '    Creation:\t' + resultTmp[1] + '\t' + resultTmp[2] + '\n';
        }

        log('** getCreationTime() finished');

        // result += str;

        return result;
    }
})();
