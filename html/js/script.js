/* Global variables */
var thomson = "Thomson_DCI1500GK";
var yamaha = "Yamaha_RAX23_WV50020";
var active = 0; // Active favorite
var favTXT; // External favorites list
var lines = []; // Internal favorites list

/* General Scripts */
$(".remote-screen a").click(function(event) {
  //var $this = $(this);
  document.body.style.opacity = "0.5";

  $.ajax({
    url: $(this).attr("href"),
  }).done(function(data) {
    document.body.style.opacity="1";
  });   
  event.preventDefault();
  return true;
});
   
function sendKey(remote_name, key_name) {
  document.body.style.opacity = "0.5";
  $.ajax({
    url: "/send/"+remote_name+"/"+key_name,   
  }).done(function(data) {
    document.body.style.opacity="1";
  }); 
}

/* Top Navigation */
$(".nav-btn").click(function(event) {
  document.body.style.opacity = "0.5";
  $(".remote-screen").hide();

  var code = $(this).attr('id');
  $("#"+code+"-content").show();

  document.body.style.opacity = "1";
});

/* Yamaha Multi-Buttons */
$("#"+yamaha+"-KEY_POWER-5x").click(function() {
  for (var i = 5; i > 0; i--) {
    sendKey(yamaha,"KEY_POWER");
  };
});

$("#"+yamaha+"-KEY_POWER-5x-mini").click(function() {
  for (var i = 5; i > 0; i--) {
    sendKey(yamaha,"KEY_POWER");
  };
});

$("#"+yamaha+"-KEY_VOLUMEUP-5x").click(function() {
  for (var i = 5; i > 0; i--) {
    sendKey(yamaha,"KEY_VOLUMEUP");
  };
});

$("#"+yamaha+"-KEY_VOLUMEDOWN-5x").click(function() {
  for (var i = 5; i > 0; i--) {
    sendKey(yamaha,"KEY_VOLUMEDOWN");
  };
});

/* Favorites List & Buttons */
$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "favs.txt",
    dataType: "text",
    success: function(data) {
      favTXT = data;
      processData(favTXT);
    }
  });
});

function processData(allText) {
  // Setup variables
  var allTextLines = allText.split(/\r\n|\n/);

  // Read fav file content (skip first line with headers)
  for (var i=0; i<allTextLines.length; i++) {
    if (allTextLines[i]!="" && allTextLines[i][0]!="#") { // Ignore comments and emtpy
      var data = allTextLines[i].split(',');
      lines.push(data);
    }
  }

  // Check Bootstrap state
  var size = findBootstrapEnvironment();

  // Populate favriable-list container
  for (var i=0; i<lines.length; i++) {
    // Highlight first button
    var btnType = "btn-primary";
    if (i!=0) btnType = "btn-default";

    // Create HTML code for fav button
    var buttonHTML = "<a class=\"btn col-xs-5 col-md-3 "
      +"btn-lg btn-huge btn-fav "+btnType
      +"\" id=\"fav"+i
      +"\" href=\"#\">";
    // Add image if URL existent
    if (lines[i].length == 3) {
      buttonHTML = buttonHTML.concat("<img src=\""
      +lines[i][2] // URL to Picture
      +"\" class=\"fav-pic hidden-xs\" alt=\"Update URL\">");
    };
    buttonHTML = buttonHTML.concat(lines[i][0] // Channel Name
      +"</a>");

    // Append a button for favorite
    $("#favorites-list").append(buttonHTML);

    // Append spacer on every second button if Bootstrap is xsmall    
    if(!(size=="xs" && i%2!=0)) $("#favorites-list").append("<div class=\"col-xs-1\"></div>");
  };

  // Populate placeholder text for editing favorites
  $("#fav-list-edit").append(favTXT);

  // Activate favorite buttons
  $(".btn-fav").click(function() {
    var id = $(this).attr('id');
    var str = id.substr(id.length-1); // List Number

    changeFavorite(str);
  });
}

// React to favorite saved changes
$("#save-button").click(function(){
  $.ajax({
    type: "post",
    url: "/save",
    data: {"text":$("textarea#fav-list-edit").val()},
    success: function(){
      // Reload and show favorites
      location.reload(true);
      $(".remote-screen").hide();
      $("#favorites-content").show();
    },
    error: function(){
      alert("ERROR: Could not save changes.");
    }
  });
});

// Favorites buttons logic and next function
$("#NEXT_FAVORITE").click(function() {
  changeFavorite(active+1);
});

$("#LAST_FAVORITE").click(function() {
  changeFavorite(active-1);
});

/* Change active favorite button and send digits */
function changeFavorite(listNumber) {
  // Ensure active remains integer
  var num = parseInt(listNumber);
  
  // Continuously run through favs
  if (num < 0) num = lines.length - 1;
  if (num == lines.length) num = 0;

  // Change buttons and active
  $("#fav"+active).removeClass("btn-primary").addClass("btn-default");
  active = num;
  $("#fav"+active).removeClass("btn-default").addClass("btn-primary");
  
  // Send each digit of active
  var channelNumber = String(lines[active][1]);
  i = 0;
  function sendDigit() {
    sendKey(thomson,"KEY_"+channelNumber[i]);
    setTimeout(function() { i++; if (i < channelNumber.length) {sendDigit();} else {i=0} }, 50); // 50ms
  };
  sendDigit();
}

/* Help function to detect bootstrap change */
function findBootstrapEnvironment() {
  var envs = ["xs", "sm", "md", "lg"],    
      doc = window.document,
      temp = doc.createElement("div");

  doc.body.appendChild(temp);

  for (var i = envs.length - 1; i >= 0; i--) {
      var env = envs[i];

      temp.className = "hidden-" + env;

      if (temp.offsetParent === null) {
          doc.body.removeChild(temp);
          return env;
      }
  }
  return "";
}