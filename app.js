var fs = require('fs');
var regexp = require('node-regexp');
var express = require('express');
var bodyParser = require("body-parser");
var http = require('http');
var request = require('request');
var util = require('util');
var spawn = require('child_process').spawn;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
var re = regexp().end('.mp4').toRegExp();
// var re1=regexp().end('.flv').toRegExp(),re2=regexp().end('.mkv').toRegExp(),re3=regexp().end('.ogg').toRegExp(),re5=regexp().end('.dctmp').toRegExp();


var map={},map1={},map3={};
var co=0;
var has_conn=0;
var search_req=0;
var map={};
var cur_mov_str;

fs.writeFile("listofips", "", function(err) {
  if(err) {
    return console.log(err);
  }

  console.log("The file was saved!");
}); 

function zeroFill(i) {
  return (i < 10 ? '0' : '') + i;
}

function now () {
  var d = new Date();
  return d.getFullYear() + '-' + zeroFill(d.getMonth() + 1) + '-'
          + zeroFill(d.getDate()) + ' '+ zeroFill(d.getHours()) 
          + ':'+ zeroFill(d.getMinutes());
}

var prc = spawn('python',  ['polling.py']);

//noinspection JSUnresolvedFunction
prc.stdout.setEncoding('utf8');
prc.stderr.setEncoding('utf8');
prc.stdout.on('data', function (data) {
  var str = data.toString();
  var lines = str.split(/(\r?\n)/g);
  //console.log(lines.join(""));
});

prc.stderr.on('data', function (data) {
  var str = data.toString();
  var lines = str.split(/(\r?\n)/g);
  // console.log(lines.join(""));
});

prc.on('close', function (code) {
  //console.log('process exit code ' + code);
});

app.get('/login', function (req, response) {
  var ip=req.connection.remoteAddress;
  console.log(ip);
  fs.appendFile("log", 'Login Request:'+ip+' '+now()+'\n', function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  }); 
  http.get('http://'+ip+':3000/', function(res) {
       console.log("Got response: " + res.statusCode);
       res.on("data", function(chunk) {
        if(chunk=='ok')
        {
          if(ip in map)
          {
          }
          else
          {
            map[ip]=1;
            fs.appendFile('listofips',ip+'\n', function (err) {

            });
          }
          response.send('<html><meta http-equiv="refresh" content="0; url=http://10.11.11.35:3001/search"></html>');
        }
        else
        {
          response.send('<html><meta http-equiv="refresh" content="0; url=http://10.11.11.35:3001/error?ip='+ip+'"></html>');
        }
        });
    }).on('error', function(e) {
       console.log("Got error: " + e.message);
       response.send('<html><meta http-equiv="refresh" content="0; url=http://10.11.11.35:3001/error?ip='+ip+'"></html>');
    });
});


app.get('/error', function (req, res) {
 	html='<html><p>Start Your Server First</p>';
  html+='<p>Your IP is '+req.query.ip+'</p>';
  html+='<p>If it is 202.* then perhaps you are not bypassing proxy</p></html>';
  res.send(html);

});

app.get('/search', function (req, response) {
   var ip=req.connection.remoteAddress;
  fs.appendFile("log", 'Search Request:'+ip+' '+now()+'\n', function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  }); 
  http.get('http://'+ip+':3000/', function(res) {
       console.log("Got response: " + res.statusCode);
       res.on("data", function(chunk) {
        if(chunk=='ok')
        {
          var str='<html><body><h1>Search!</h1><input type="TEXT" id="search" size="40"><button type="button" id="submit">Submit</button> <button onclick="parent.location=\'http://10.11.11.35:3001/allfiles\'">All-files</button></body><table id="table"></table>\n';
          var js='<script>$(document).ready(function(){$("#submit").click(function(){var sea=$("#search").val();$.post("http://10.11.11.35:3001/search",{search: sea}, function(data){$("#table").html(data)});});})</script>\n';
          var incl='<script src="http://10.11.11.35:3001/readjquery"></script></html>\n';
          response.send(str+incl+js);
        }
        else
        {
          response.send('<html><meta http-equiv="refresh" content="0; url=http://10.11.11.35:3001/error?ip='+ip+'"></html>');
        }
        });
    }).on('error', function(e) {
       console.log("Got error: " + e.message);
       response.send('<html><meta http-equiv="refresh" content="0; url=http://10.11.11.35:3001/error?ip='+ip+'"></html>');
    });
});

app.post('/search', function (req, res) {
  console.log(req.body.search);
    var data=fs.readFileSync('allfiles','utf8');
    data=data.split('\n');
    var prev='',prev_in=0,ip_index=-1,html='';
    for(var i=0;i<data.length-1;i++)
    {
      console.log(temp);
      var temp=data[i];
      temp=temp.split(' ');
      var request=req.body.search.toLowerCase();
      if(temp[0]!=prev)
      {
        ip_index+=1;
        prev=temp[0];
        prev_in=0;
      }
      else
      {
        prev_in+=1;
      }
      var tem=temp[1].toLowerCase();
      if(tem.indexOf(request) > -1) {
        var ids=ip_index*10000+prev_in;
        html+='<tr><td><button onclick="parent.location=\'http://'+temp[0]+':3000/downloads/'+prev_in+'\'" method="link" size=40>'+temp[1]+'</button></td></tr>'; 
      } 
    }
    res.send(html);
});

app.get('/allfiles', function (req, response) {
  var ip=req.connection.remoteAddress;
  fs.appendFile("log", 'All-Files Request:'+ip+' '+now()+'\n', function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  }); 
   http.get('http://'+ip+':3000/', function(res) {
       console.log("Got response: " + res.statusCode);
       res.on("data", function(chunk) {
        if(chunk=='ok')
        {
           var data=fs.readFileSync('allfiles.html','utf8');
           response.send(data);
        }
        else
        {
          response.send('<html><meta http-equiv="refresh" content="0; url=http://10.11.11.35:3001/error?ip='+ip+'"></html>');
        }
        });
    }).on('error', function(e) {
       console.log("Got error: " + e.message);
       response.send('<html><meta http-equiv="refresh" content="0; url=http://10.11.11.35:3001/error?ip='+ip+'"></html>');
    });
});


app.get('/readjquery',function(req,res){
	fs.readFile('jquery.min.js', 'utf8', function (err,data) {
  		if (err) {
    			 console.log(err);
  		}
  		res.send(data);
	});
});
app.listen(3001);