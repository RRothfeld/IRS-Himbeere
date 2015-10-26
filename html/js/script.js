/* General Scripts */
$(".remote-screen a").click(function(event) {    
 var $this = $(this);
 document.body.style.opacity = "0.5";

 $.ajax({
   url: $(this).attr("href"),    
 }).done(function(data) {    
   document.body.style.opacity="1";
 });   
 event.preventDefault();
 return true;
});
   
/**    
 * Converts :hover CSS to :active CSS on mobile devices.   
 * Otherwise, when tapping a button on a mobile device, the button stays in    
 * the :hover state until the button is pressed.     
 *   
 * Inspired by: https://gist.github.com/rcmachado/7303143    
 * @author  Michael Vartan <michael@mvartan.com>   
 * @version 1.0    
 * @date    2014-12-20   
 */    
function hoverTouchUnstick() {   
  // Check if the device supports touch events   
  if('ontouchstart' in document.documentElement) {   
    // Loop through each stylesheet    
    for(var sheetIndex = document.styleSheets.length - 1; sheetIndex >= 0; sheetIndex--) {   
      var sheet = document.styleSheets[sheetIndex];    
      // Verify if cssRules exists in sheet    
      if(sheet.cssRules) {   
        // Loop through each rule in sheet   
        for(var ruleIndex = sheet.cssRules.length - 1; ruleIndex >= 0; ruleIndex--) {    
          var rule = sheet.cssRules[ruleIndex];    
          // Verify rule has selector text   
          if(rule.selectorText) {    
            // Replace hover psuedo-class with active psuedo-class   
            rule.selectorText = rule.selectorText.replace(":hover", ":active");    
          }    
        }    
      }    
    }    
  }    
}    
hoverTouchUnstick();
   
function sendKey(remote_name, key_name) {    
    document.body.style.opacity = "0.5";
 $.ajax({    
   url: "/send/"+remote_name+"/"+key_name,   
 }).done(function(data) {
   document.body.style.opacity="1"   
 });     
}

/* Top Navigation */
$(".nav-btn").click(function(event) {
  document.body.style.opacity = "0.5";
  $(".remote-screen").hide();

  var code = $(this).attr('id');
  if(code == "an-aus") $("#an-aus-content").show();
  if(code == "favoriten") $("#favoriten-content").show();
  if(code == "fernsehen") $("#fernsehen-content").show();
  if(code == "alle-befehle") $("#alle-befehle-content").show();

  document.body.style.opacity = "1";
});

/* Specific Buttons */
$("#Yamaha_RAX23_WV50020-KEY_POWER-5x").click(function() {
  for (var i = 5; i > 0; i--) {
    sendKey("Yamaha_RAX23_WV50020","KEY_POWER");
  };
});

$("#Yamaha_RAX23_WV50020-KEY_POWER-5x-mini").click(function() {
  for (var i = 5; i > 0; i--) {
    sendKey("Yamaha_RAX23_WV50020","KEY_POWER");
  };
});

$("#Yamaha_RAX23_WV50020-KEY_VOLUMEUP-5x").click(function() {
  for (var i = 5; i > 0; i--) {
    sendKey("Yamaha_RAX23_WV50020","KEY_VOLUMEUP");
  };
});

$("#Yamaha_RAX23_WV50020-KEY_VOLUMEDOWN-5x").click(function() {
  for (var i = 5; i > 0; i--) {
    sendKey("Yamaha_RAX23_WV50020","KEY_VOLUMEDOWN");
  };
});

$("#NEXT_FAVORITE").click(function() {
  // TODO
});

$("#LAST_FAVORITE").click(function() {
  // TODO
});