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
    
        var textArea = document.getElementById('info');

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://www.aval.ua/');
        xhr.onreadystatechange = function() { //Call a function when the state changes.
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
              // console.log('Start decoding...');
              // const contenttype = xhr.getResponseHeader("content-type");
              // const charset = 'windows-1251';
              // const dataView = new DataView(xhr.response);
              // const decoder = new TextDecoder(charset);
              // var decodedStr = decoder.decode(dataView);
              // //textArea.value = decoder.decode(dataView);
              // textArea.value = getCreationTime(decodedStr);
              // console.log('Yeho!');
              textArea.value = xhr.response;
            }
        }
        xhr.send();
    }

    helperObject.appendCss = function (css) {
        var cssElement = document.createElement('style');
        cssElement.innerText = css;
        document.head.appendChild(cssElement);
    }
})();
