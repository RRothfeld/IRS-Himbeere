/* General Scripts */
$(".remote-screen a").click(function(event) {    
 var $this = $(this);    
 document.body.style.opacity = "0.5";    
   
 $.ajax({    
   url: $(this).attr("href"),    
 }).done(function(data) {    
   document.body.style.opacity="1"   
 });   
 event.preventDefault()    
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
   
var sendKey = function(remote_name, key_name) {    
    document.body.style.opacity = "0.5";   
 $.ajax({    
   url: "/send/"+remote_name+"/"+key_name,   
 }).done(function(data) {    
   console.log(data);    
   document.body.style.opacity="1"   
 });     
}

/* Specific Buttons */
