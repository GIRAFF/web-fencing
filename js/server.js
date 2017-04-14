var http = require("http"),
    url = require("url"); 

http.createServer(function(request, response) {
  //response.writeHead(200, {"Content-Type": "text/plain"});
  //response.write("THIS IS SERVER RESPONSE");
  var url_parsed = url.parse(request.url, true);
  
  if(url_parsed.pathname == "/game" && url_parsed.query.message) {
    response.end( url_parsed.query.message );
  } else {
     response.end(); 
     console.log( request.method, request.url);
  }
  
  
}).listen(27015);

console.log("Server started");