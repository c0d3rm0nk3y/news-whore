'use strict';

var googlePlusUserLoader = (function() {
  var btnSignin;
  
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
  
  return {
    onload: function() {
      btnSignin = document.querySelector('#login');
      btnSignin.addEventListener('click', iSignIn);
    }
  };
})();

window.onload = googlePlusUserLoader.onload;
