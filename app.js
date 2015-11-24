/**
 * app.js
 * 
 * IR Remote Web Service
 * 
 * based on:
 * @author Michael Vartan
 * @version 1.0.0 
 */

var express = require('express');
var app = express();
var sys = require('sys');
var exec = require('child_process').exec;
var bodyParser = require('body-parser');
var fs = require('fs');

// Define static HTML files
app.use(express.static(__dirname + '/html'));

// Define GET request for /send/deviceName/buttonName
app.get('/send/:device/:key', function(req, res) {
  var deviceName = req.params.device;
  var key = req.params.key.toUpperCase();

  // send command to irsend
  var command = "irsend SEND_ONCE "+deviceName+" "+key;
  exec(command, function(error, stdout, stderr){
    if(error)
      res.send("Error sending command");
    else   
      res.send("Successfully sent command");
  });
});

// Enable JSON-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Define POST request for /save
app.post('/save', function (req, res) {
  var successTV = false;
  var successRadio = false;

  // Write TV favs
  fs.writeFile(__dirname+"/html/favs.txt", req.body.tv, function(err) {
    if(err)
      return console.log(err);
    else
      successTV = true;
  });

  // Write Radio favs
  fs.writeFile(__dirname+"/html/favs-radio.txt", req.body.rad, function(err) {
    if(err)
      return console.log(err);
    else
      successRadio = true;
  });

  // Sent successfull message
  if (successTV && successRadio)
    res.status(200).send("Successfully saved favorites");
});

// Listen on port 3000
app.listen('3000');