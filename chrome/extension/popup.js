var req;
var articles;
var url = 'http://monkey-nodejs-71725.usw1.nitrousbox.com:8080/api/todaysnews?view=title&count=3';

window.onload = function() {
  document.getElementById('button').onclick = function() {
    chrome.tabs.getSelected(null,function(tab) {
      var tabLink = tab.url;
      var postdata = "link="+tab.url;
      console.log(postdata);
      //console.log('linked clicked: %s', tab.url);
      
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
}

function processN() {
  console.log('processN, readyState: %s/nstatus: %s/nresponse: %s', req.readyState, req.status, req.response);
  
}

// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://supersweetdomainbutnotcspfriendly.com/image.png', true);
// xhr.responseType = 'blob';
// xhr.onload = function(e) {
//   var img = document.createElement('img');
//   img.src = window.URL.createObjectURL(this.response);
//   document.body.appendChild(img);
// };

// xhr.send();


// var http = new XMLHttpRequest();
// var postdata= "foo=bar&baz=hey"; //Probably need the escape method for values here, like you did

// http.open("POST", "http://yourdomain.com", true);

// //Send the proper header information along with the request
// http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// http.setRequestHeader("Content-length", postdata.length);

// http.onreadystatechange = function() {//Call a function when the state changes.
//   if(http.readyState == 4 && http.status == 200) {
//       alert(http.responseText);
//   }
// }
// http.send(postdata);