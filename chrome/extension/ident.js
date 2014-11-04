'use strict';

var googlePlusUserLoader = (function() {
  var btnSignin;
  var btnSend;

  var START_STATE=1;
  var STATE_ACQUIRING_AUTHTOKEN=2;
  var STATE_AUTHTOKEN_ACQUIRED=3;

  var state = START_STATE;

  function disableButton(button) { button.setAttribute('disabled', 'disabled'); }
  function enableButton(button) { button.removeAttribute('disabled'); }

  function changeState(newState) {
    state = newState;

    switch(state) {
      case START_STATE:
        console.log('START_STATE');
        enableButton(btnSignin);
        break;
      case STATE_ACQUIRING_AUTHTOKEN:
        console.log('acquiring token..');
        disableButton(btnSignin);
        break;
      case STATE_AUTHTOKEN_ACQUIRED:
        console.log('STATE_AUTHTOKEN_ACQUIRED');
        disableButton(btnSignin);
        break;
    }
  }

  function iSignIn() {
    console.log('iSignIn..');
    changeState(STATE_ACQUIRING_AUTHTOKEN);
    chrome.identity.getAuthToken({'interactive' : true }, function(token) {
      if(chrome.runtime.lastError) {
        console.log('last error.. %s', chrome.runtime.lastError);
        changeState(START_STATE);
      } else {
        console.log('token acquired: %s , see chrome://identity-internals for details', token);
        changeState(STATE_AUTHTOKEN_ACQUIRED);
      }
    });
  }

  function iSent() {
    console.log('button clicked..');
    chrome.tabs.getSelected(null,function(tab) {
      console.log('linked clicked: %s', tab.url);
      var tabLink = tab.url;
      var postdata = "link="+tab.url;
      console.log(postdata);


      req = new XMLHttpRequest();
      req.open('POST', "http://monkey-nodejs-71725.usw1.nitrousbox.com:8080/api/news/", true);
      req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      req.responseType = 'blob';
      req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 200) {
          console.log('processN, readyState: %s/nstatus: %s', req.readyState, req.status);
          var reader = new FileReader();
          reader.addEventListener("loadend", function() {
             // reader.result contains the contents of blob as a typed array
             console.log(reader.result);
          });
          reader.readAsText(req.response);
        }
      };
      req.send(postdata);
    });
  }

  return {
    onload: function() {
      btnSignin = document.querySelector('#login');
      btnSignin.addEventListener('click', iSignIn);

      btnSend = document.querySelector('#button');
      btnSend.addEventListener('click', iSent);
    }
  };
})();

window.onload = googlePlusUserLoader.onload;
