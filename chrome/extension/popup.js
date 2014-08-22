var req;
var articles;
var url = 'http://monkey-nodejs-71725.usw1.nitrousbox.com:8080/api/todaysnews?view=title&count=3';

window.onload = function() {
  document.getElementById('button').onclick = function() {
    chrome.tabs.getSelected(null,function(tab) {
      var tabLink = tab.url;
      console.log('linked clicked: %s', tab.url);
      req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = processN;
      req.send();
    });
    
  }
}

function processN() {
  console.log('processN../n%s', req.responseText);
  var res = JSON.parse(req.responseText);
  articles = res.concat(articles);
  
}
