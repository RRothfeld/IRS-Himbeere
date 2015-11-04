/**
 * app.js
 * 
 * IRS-Himbeere Application
 * 
 * based on:
 * @author Michael Vartan
 * @version 1.0.0 
 */

var express = require('express');
var app = express();
var sys = require('util');
var fs = require('fs');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;

/**
 * Dictionary of devices and their buttons
 * @type {Object}
 */
var devices = {};
/**
 * Generates function to get devices' buttons from irsend command
 * @param  {String} deviceName name of device
 * @return {Function}            exec callback
 */ 
var getCommandsForDevice = function(deviceName) {
  /**
   * Get Device's Button from irsend command
   * @param  {String} error  Error from running command
   * @param  {String} stdout std out
   * @param  {String} stderr std err
   * @return {None}        
   */
  return function(error, stdout, stderr) {
    var lines = stderr.split("\n");
    for(var lineIndex in lines) {
      var line = lines[lineIndex];
      var parts = line.split(" ");
      if(parts.length>2) {
        var keyName = parts[2];
        devices[deviceName].push(keyName);
        console.log(deviceName + " found key: "+keyName);
      }
    }
  }
};

// Define static HTML files
app.use(express.static(__dirname + '/html'));

// Enable JSON-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Define GET request for /send/deviceName/buttonName
app.get('/send/:device/:key', function(req, res) {
  var deviceName = req.params.device;
  var key = req.params.key.toUpperCase();

  // Make sure that the user has requested a valid device 
  if(!devices.hasOwnProperty(deviceName)) {
    res.send("invalid device");
    return;
  }

  // Make sure that the user has requested a valid key/button
  var device = devices[deviceName];
  var deviceKeyFound = false;
  for(var i = 0; i < device.length; i++) {
    if(device[i] === key) {
      deviceKeyFound = true; 
      break;
    }
  }
  if(!deviceKeyFound) {
    res.send("invalid key number: "+key);
    return;
  }

  // send command to irsend
  var command = "/usr/bin/irsend SEND_ONCE "+deviceName+" "+key;
  exec(command, function(error, stdout, stderr){
    if(error)
      return console.log(error);
    else   
      res.send("Successfully sent command");
  });
});

// Define POST request for /save
app.post('/save', function (req, res) {
  fs.writeFile("html/favs.txt", req.body.text, function(err) {
    if(err) {
      return console.log(err);
    } else {
      res.send("Successfully saved changes.");
    }
  });
});

// Listen on port 3000
app.listen('3000');