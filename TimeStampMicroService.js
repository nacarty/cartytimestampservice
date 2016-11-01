/*  NODE JS
This program takes accepts a request that has path: http://whatever.com/api/unixtime?iso=2016-10-20T17:39:56.821Z'
and returns either unix time (such as 32452662722) or a formatted time object such as {hour:15, minute:58, second:51}.
The argument from the command line is: [node httpjsonserver.js 8081] where 8081 is the port number.
*/

var URL = require('url');
var HTTP = require('http');
var fileSystem = require('fs');

var SERVER = HTTP.createServer(connectionListener);

SERVER.listen(8080);
 
 function connectionListener(request, response){
     
    var urlObject = URL.parse(request.url, false);  //See https://nodejs.org/api/url.html for info on 'url'
    
    var timeStr = urlObject.pathname.split('%20').join(' ').split('/').join(' '); 
    
    console.log('The Time provided',timeStr);
    
    var theDate, dateObj ={} ;
    
    
    
    if ( isNaN(Number(timeStr)) ) //That is, time is supplied in the form: 'March 25, 2016'
         theDate = new Date(timeStr);
     
    else                         //That is, time is supplied as a unix number string: '34562727272'
         theDate = new Date(Number(timeStr));
         
    if (theDate == 'Invalid Date')
    {
              var contents = 'NO FILE FOUND!';
              dateObj = {unix:null, natural:null};
              response.writeHead(200, {'Content-Type':'text/html'});
              fileSystem.readFile('index.html', function(e, data) {
                                          
                                           if (e) return response.send(500)
                                           try {
                                             contents = data.toString();
                                             
                                           } catch (e) {
                                             response.send(500)
                                           }
                                           
                                           console.log(contents);
                                           response.end(contents);
                                           
                                         })
              
    }
    
    else
    {
        dateObj = {unix: theDate.getTime(),  natural: formattedDate(theDate)};
              //Note: theDate.getTime() == theDate.valueOf() == Date.parse(theDate)
              
        response.writeHead(200, {'Content-Type':'application/json'});
        response.end(JSON.stringify(dateObj));
        console.log(JSON.stringify(dateObj));
    }
    
} 
 
 function formattedDate(D){
  
     return theDay(D.getDay()) +' '+ theMonth(D.getMonth()) +' '+ D.getDate() + ', '+ D.getFullYear();
 
    /*  Instead of using JSON.stringify() in the calling function, we could have manually coded the object into a string like as follows:
    
       return '{"hour":'+date.getHours()+ ',"minute": '+date.getMinutes()+',"second": '+date.getSeconds()+'}';
    
    */
 }
 
 function theDay(num){
  
  switch (num){
    case 0: return 'Sunday';
    case 1: return 'Monday';
    case 2: return 'Tuesday';
    case 3: return 'Wednesday';
    case 4: return 'Thursday';
    case 5: return 'Friday';
    case 6: return 'Saturday';
  }
 }
 
 function theMonth(num){
  
  switch (num){
    case 0: return 'January';
    case 1: return 'February';
    case 2: return 'March';
    case 3: return 'April';
    case 4: return 'May';
    case 5: return 'June';
    case 6: return 'July';
    case 7: return 'August';
    case 8: return 'September';
    case 9: return 'October';
    case 10: return 'November';
    case 11: return 'December';
 
  }
}
