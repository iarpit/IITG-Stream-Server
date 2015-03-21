var fs = require('fs');
var regexp=require('node-regexp');
var re = regexp().end('.mp4').toRegExp(),re1=regexp().end('.flv').toRegExp(),re2=regexp().end('.mkv').toRegExp(),re3=regexp().end('.ogg').toRegExp(),re5=regexp().end('.dctmp').toRegExp();
var express=require('express');
var bodyParser     =         require("body-parser");
var app=express();
var map={},map1={},map3={};
var http = require('http'),fs = require('fs'),util = require('util');
var util  = require('util'),
    spawn = require('child_process').spawn;
    var co=0;
    var has_conn=0;
    var search_req=0;
    var map={};
    var cur_mov_str;
 var http=require('http');
 fs.writeFile("listofips", "", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
app.use(bodyParser.urlencoded({ extended: false }));
var spawn = require('child_process').spawn;
var prc = spawn('python',  ['polling.py']);

//noinspection JSUnresolvedFunction
prc.stdout.setEncoding('utf8');
prc.stderr.setEncoding('utf8');
prc.stdout.on('data', function (data) {
    var str = data.toString()
    var lines = str.split(/(\r?\n)/g);
    console.log(lines.join(""));
});

prc.stderr.on('data', function (data) {
    var str = data.toString()
    var lines = str.split(/(\r?\n)/g);
    console.log(lines.join(""));
});

prc.on('close', function (code) {
    console.log('process exit code ' + code);
});
app.get('/login', function (req, res) {
	var str='<html><body><h1>Enter Your Server IP!</h1><input type="TEXT" id="search" size="40"><button type="button" id="submit">Submit</button> </body>\n';
	var js='<script>$(document).ready(function(){$("#submit").click(function(){var sea=$("#search").val();$.post("http://10.11.11.35:3001/authenticate",{search: sea}, function(data){console.log(data);if(data=="done"){window.location="http://10.11.11.35:3001/allfiles"}else{window.location="http://10.11.11.35:3001/fuck_off"}});});})</script>\n';
	var incl='<script src="http://10.11.11.35:3001/readjquery"></script></html>\n';
	res.send(str+incl+js);
	res.send('ok');

});

app.post('/authenticate',function(req,response){
	var ip=req.connection.remoteAddress;
  fs.appendFile("log", ip+'\n', function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
	if(ip!=req.body.search)
	{
		response.send('fuck');
	}
  else{
  	var options = {
    		host: "",
   		port: 80,
   		path: 'http://'+ip+':3000/',
    		headers: {}
  	};
  	http.get('http://'+ip+':3000/', function(res) {
   		 console.log("Got response: " + res.statusCode);
   		 res.on("data", function(chunk) {
   		 	if(chunk=='ok')
   		 	{
   		 		if(ip in map)
   		 		{
   			 		response.send('done');
   				}
   				else
   				{
   					map[ip]=1;
   					fs.appendFile('listofips',ip+'\n', function (err) {

  					});
   				}
   		 	}
   		 	else
   		 	{
   		 		response.send('fuck')
   		 	}
    		});
  	}).on('error', function(e) {
   		 console.log("Got error: " + e.message);
  	});
  }
});

app.get('/fuck_off', function (req, res) {
 	res.send('Start Your Server First');
});
app.get('/allfiles', function (req, res) {
	var data=fs.readFileSync('allfiles.html','utf8');
 	res.send(data);
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