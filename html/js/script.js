/* Global variables */
var thomson = "Thomson_DCI1500GK";
var yamaha = "Yamaha_RAX23_WV50020";
var samsung = "Samsung_00084Q";
var pages = [];
var postText = "-content";

// TV varibales
var activeTV = 0; // Active favorite
var favTV; // External favorites list
var linesTV = []; // Internal favorites list

// Radio varibales
var activeRadio = 0; // Active favorite
var favRadio; // External favorites list
var linesRadio = []; // Internal favorites list

// Check Bootstrap state
var size = findBootstrapEnvironment();

/* General Scripts */
$('.remote-screen').each(function() {
  var id = this.id;
  pages.push(id.substr(0,id.length-postText.length));
});

$(".remote-screen a").click(function(event) {
  $.ajax({
    url: $(this).attr("href"),
  });
  event.preventDefault();
  return true;
});
   
function sendKey(remote_name, key_name) {
  $.ajax({
    url: "/send/"+remote_name+"/"+key_name,   
  }); 
}

/* Top Navigation */
$(".nav-btn").click(function(event) {
  $(".remote-screen").hide();
  var code = $(this).attr('id');
  $("#"+code+"-content").show();
});

/* Multi-Buttons */
$("#"+yamaha+"-KEY_VOLUMEUP-8x").click(function() {
  for (var i = 8; i > 0; i--) {
    sendKey(yamaha,"KEY_VOLUMEUP");
  };
});

$("#"+yamaha+"-KEY_VOLUMEDOWN-8x").click(function() {
  for (var i = 8; i > 0; i--) {
    sendKey(yamaha,"KEY_VOLUMEDOWN");
  };
});

$("#ALLDEVICES-KEY_POWER").click(function() {
  sendKey(thomson,"KEY_POWER");
  setTimeout(function(){sendKey(samsung,"KEY_POWER");}, 4000);
  setTimeout(function(){sendKey(yamaha,"KEY_POWER");}, 8000);
});

/* Favorites List & Buttons */
$(document).ready(function() {
  // Get TV favs
  $.ajax({
    type: "GET",
    url: "favs.txt",
    dataType: "text",
    success: function(data) {
      favTV = data;
      processData(favTV,true);
    }
  });

  // Get Radio favs
  $.ajax({
    type: "GET",
    url: "favs-radio.txt",
    dataType: "text",
    success: function(data) {
      favRadio = data;
      processData(favRadio,false);
    }
  });
});

function processData(data,tv) {
  // Setup variables
  var allTextLines = data.split(/\r\n|\n/);
  var lines = [];

  // Read fav file content (skip first line with headers)
  for (var i=0; i<allTextLines.length; i++) {
    if (allTextLines[i]!="" && allTextLines[i][0]!="#") { // Ignore comments and emtpy
      var data = allTextLines[i].split(',');
      lines.push(data);
    }
  }

  if(tv)
    linesTV = lines;
  else
    linesRadio = lines;

  // Populate favriable-list container
  for (var i=0; i<lines.length; i++) {
    // Highlight first TV button
    var btnType = "btn-default";
    if (i==0 && tv) btnType = "btn-primary";

    // Create HTML code for fav button
    var code;
    if (tv)
      code = "TV";
    else
      code = "RA";

    var buttonHTML = "<a class=\"btn col-xs-5 col-md-3 "
      +"btn-lg btn-huge btn-fav "+btnType+" "+code
      +"\" id=\""+code+i
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
    var appendTo;
    if (tv) 
      appendTo = "#favorites-list";
    else
      appendTo = "#favorites-list-radio";
    $(appendTo).append(buttonHTML);

    // Append spacer on every second button if Bootstrap is xsmall    
    if(!(size=="xs" && i%2!=0))
      $(appendTo).append("<div class=\"col-xs-1\"></div>");
  };

  // Populate placeholder text for editing favorites
  if (tv)
    $("#fav-list-edit").append(favTV);
  else
    $("#fav-list-radio-edit").append(favRadio);

  // Activate favorite buttons
  $("."+code).click(function() {
    var id = $(this).attr('id');
    var tv = true;
    if (id.substr(0,2) != "TV")
      tv = false;
    changeFavorite(id.substr(2),tv);
  });
}

// React to favorite saved changes
$("#save-button").click(function(){
  $.ajax({
    type: "post",
    url: "/save",
    data: {
      "tv":$("textarea#fav-list-edit").val(),
      "rad":$("textarea#fav-list-radio-edit").val(),
    },
    success: function(){
      // Reload and show favorites
      location.reload(true);
    },
    error: function(){
      alert("ERROR: Could not save changes.");
    }
  });
});

// Favorites buttons logic and next function
$("#NEXT_FAVORITE").click(function() {
  changeFavorite(activeTV+1,true);
});

$("#LAST_FAVORITE").click(function() {
  changeFavorite(activeTV-1,true);
});

/* Change active favorite button and send digits */
function changeFavorite(listNumber,tv) {
  // Define mode
  var lines, fav, active;
  if (tv) {
    lines = linesTV;
    fav = "TV";
    active = activeTV;
  }
  else {
    lines = linesRadio;
    fav = "RA";
    active = activeRadio;
  }

  // Ensure active remains integer
  var num = parseInt(listNumber);
  
  // Continuously run through favs
  if (num < 0) num = lines.length - 1;
  if (num == lines.length) num = 0;

  // Change buttons and active
  $("#"+fav+active).removeClass("btn-primary").addClass("btn-default");
  active = num;
  $("#"+fav+active).removeClass("btn-default").addClass("btn-primary");
  
  // Send each digit of active
  var channelNumber = String(lines[active][1]);
  i = 0;
  function sendDigit() {
    sendKey(thomson,"KEY_"+channelNumber[i]);
    setTimeout(function() {
      i++;
      if (i < channelNumber.length)
        sendDigit(); // recursive
      else
        i=0;
    }, 200); // 200ms wait between digits
  };
  sendDigit();

  if (tv)
    activeTV = active;
  else
    activeRadio = active;
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

/* Enable swipe actions */
$("body").on("swiperight", function() {
  var activePage = findActivePage();
  var newPage = activePage + 1;
  if (newPage < pages.length)
    showNewPage(newPage);
});

$("body").on("swipeleft", function() {
  var activePage = findActivePage();
  var newPage = activePage - 1;
  if (newPage > -1)
    showNewPage(newPage);
});

function findActivePage() {
  var code;
  $(".remote-screen").each(function() {
    if ($(this).is(":visible"))
      code = $(this).attr('id');
  });
  code = code.substr(0,code.length-postText.length);
  return pages.indexOf(code);
};

function showNewPage(i) {
  $(".remote-screen").hide();
  $("#"+pages[i]+"-content").show();
};