
//
// specific JavaScript
//
 
/**** Debugging https://stackoverflow.com/questions/6604192/showing-console-errors-and-alerts-in-a-div-inside-the-page */
/*
if (typeof console  != "undefined") 
    if (typeof console.log != 'undefined')
        console.olog = console.log;
    else
        console.olog = function() {};

console.log = function(message) {
    console.olog(message);
    $('#debugDiv').append('<p>' + message + '</p>');
};
console.error = console.debug = console.info =  console.log
*/


/**************************************
 * hard-core code
 **************************************/

//
// helpers for validation
//

function isValidEmailOrPhone(emailOrPhone) {
  console.log("emailOrPhone="+emailOrPhone);
  return isValidEmail(emailOrPhone) || isValidPhone(emailOrPhone)
}

function isValidEmail(email) {
  const emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/;
  if (email.trim().match(emailRegex)) {
    return true;
  } else {
    return false;
  }
}

function isValidPhone(phone) {
  console.log("phone="+phone);
  const compactPhone = phone.replace(/\s|-|\(|\)/gi, "")
  console.log("compactPhone="+compactPhone);

  // check
  if (compactPhone.length<=6) {
    return false;
  }
  //const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
  const phoneRegex = /^[\+][0-9]{4,16}$/im
  if (compactPhone.match(phoneRegex)) {
    return true;
  } else {
    return false;
  }
}


//
// General helpers
//

/** Cookie functions based on https://stackoverflow.com/a/24103596 or https://www.quirksmode.org/js/cookies.html */
function setCookie(name,value) {
    var expires = "";
    expireDays = 10*365; // in Safari cookies maybe are deleted after just 1 day
    if (expireDays) {
        var date = new Date();
        date.setTime(date.getTime() + (expireDays*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

/**
  * Get the URL parameters
  * source: https://css-tricks.com/snippets/javascript/get-url-variables/
  * @param  {String} url The URL
  * @return {Object}     The URL parameters
  *
var getParams = function (url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};
var urlParams = getParams(window.location.href);
var urlParamUtmSource = urlParams['utm_source'];
var urlParamUtmMedium = urlParams['utm_medium'];
var dimensionValueR = urlParams['r'];
*/


//
// helpers for Google Analytics
//

// call this before Google Analytics Tracking code
function prepareAnalyticsDimensionValues(defaultR) {
    /**
      * Extract custom tracking param r from URL
      * and optionally set the same value as utm_medium in format r-123
      */
    var urlObj = new URL(window.location.href);
    var urlParamUtmSource = urlObj.searchParams.get("utm_source");
    var urlParamUtmMedium = urlObj.searchParams.get("utm_medium");
    var dimensionValueR = urlObj.searchParams.get("r");
    if (!dimensionValueR && defaultR) {
      dimensionValueR = defaultR
    }
    window.referrerShort = document.referrer;
    if (dimensionValueR) {
      window.dimensionValueR = 'r-'+dimensionValueR;
      if (!urlParamUtmSource && !urlParamUtmMedium) {
        // append these parameters to URL
        //console.log("window.referrerShort=", window.referrerShort);
        if (!window.referrerShort) {
          window.referrerShort = "no-referrer";
        } else {
          window.referrerShort = window.referrerShort.replace("https://", "").replace("http://", "");
        }
        console.log("window.referrerShort=", window.referrerShort);
        //this would cause reloading the page:
        //window.location.href += 
        // "&utm_medium=r-"+dimensionValueR+"&utm_source="+encodeURIComponent(referrerShort);
      }
    }

    /**
     * internalUser tracking
     */
    function getCookieValue(a) {
       var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
      return b ? b.pop() : '';
    }
    var internalUserLabel = getCookieValue('internalUserLabel');
    if (internalUserLabel) {
      window.dimensionValueInternalUser = 'true';
      window.dimensionValueInternalUserLabel = internalUserLabel;
    }
}

// call this after Google Analytics Tracking code
function updateExternalLinks() {
    /**
    * Function that captures a click on an outbound link in Analytics.
    * This function takes a valid URL string as an argument, and uses that URL string
    * as the event label. Setting the transport method to 'beacon' lets the hit be sent
    * using 'navigator.sendBeacon' in browser that support it.
    */
    var captureOutboundClick = function(url, target) {
      urlNice = url.replace(/^https:\/\/|^http:\/\//i, '');
      console.log("captureOutboundClick with urlNice=", urlNice, ", target=", target);
       ga('send', 'event', 'outbound', 'click', urlNice, {
         'transport': 'beacon',
         'hitCallback': function(){ if (!target) {document.location = url;} }
       });
    }
    var ownUrlStart = (location.protocol+"//"+location.host+"/").toLowerCase();
    var a = Array.from(document.getElementsByTagName('a'));

    for(i = 0; i < a.length; i++){
      var url = a[i].href;
      //console.log("update a href=", url);
        if (!url.toLowerCase().startsWith(ownUrlStart) && 
            (url.startsWith("http://") || url.startsWith("https://"))) {
          //a[i].onclick = function(){
          //  captureOutboundClick(this.href, this.target);
          //}
          if (!a[i].onclick) {
            // the tag has no onclick attribute
            console.log("Add captureOutboundClick() to a href=", url);
            a[i].onclick = function(){
              captureOutboundClick(this.href, this.target);
            }
          } else {
            // the tag has already an onclick attribute
            // FOR NOW: just keep it unchanged
            console.log("Add captureOutboundClick() to a href=", url, " - SKIPPED because onclick already set");
          }
        }
    }
}

function logUserAction(label) {
  ga('send', 'event', 'modal', 'click', label);
}

function logEvent(event) {
  var url = "https://abql5sgd50.execute-api.eu-west-1.amazonaws.com/prod/api/v1/log";

  // action
  console.log("log");
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log(xhr.responseText);
    }
  };
  var dataStr = JSON.stringify(event);
  xhr.send(dataStr);
}

function allAnalytics(googleAnalyticsId, defaultR) {
    // call this before Google Analytics Tracking code
    prepareAnalyticsDimensionValues(defaultR);
    
    // GA tracking
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', googleAnalyticsId, 'auto');
    //ga('send', 'pageview');
    console.log("ga url=", window.location.href, ", dimensionValueR=", window.dimensionValueR);
    if (window.dimensionValueR) {
      // custom dimension "r" - scope "Hit"
      ga('set', 'dimension1', window.dimensionValueR);
      // medium+source must be send together, otherwise non of both will be recognized
      ga('set', 'campaignMedium', window.dimensionValueR);
      ga('set', 'campaignSource', window.referrerShort);
    }
    if (window.dimensionValueInternalUser) {
      // custom dimension "internalUser" - scope "User"
      ga('set', 'dimension2', window.dimensionValueInternalUser);
    }
    if (window.dimensionValueInternalUserLabel) {
      // custom dimension "internalUserLabel" - scope "User"
      ga('set', 'dimension3', window.dimensionValueInternalUserLabel);
    }
    ga('send', 'pageview');
    /*
    ga('send', 'pageview', {
      'dimension1':  window.dimensionValueR,
      'campaignMedium': window.dimensionValueR,
      'campaignSource': referrerShort
    });
    */
    
    // alternative logging
    const event = {'event': 'pageview', 'url': window.location.href};
    if (window.dimensionValueR) {
      // custom dimension "r"
      event['r'] = window.dimensionValueR;
      event['campaignMedium'] = window.dimensionValueR;
      event['campaignSource'] = window.referrerShort;
    }
    if (window.dimensionValueInternalUser) {
      event['internalUser'] = window.dimensionValueInternalUser;
    }
    if (window.dimensionValueInternalUserLabel) {
      event['internalUserLabel'] = window.dimensionValueInternalUserLabel;
    }
    logEvent(event);
    
    // call this after Google Analytics Tracking code
    updateExternalLinks();        
}


//
// helper functions for sending emailOrPhone signup via AJAX request(s)
//
function sendSignupFormViaAjax(formId, emailOrPhone, secondPostToUrl, success, error) {
  // pre-check
  console.log("sendSignupFormViaAjax emailOrPhone("+formId+")=", emailOrPhone);
  if (!isValidEmailOrPhone(emailOrPhone)) {
    // invalid
    console.warn("Invalid emailOrPhone", emailOrPhone);
    error();
    return;
  } 

  // preparation
  const myHost = window.location.host;
  const myPageUrl = window.location.pathname + window.location.search;

  // action 1: send to AWS
  sendSignupFormViaAjaxMain(myHost, myPageUrl, formId, emailOrPhone /*, success, error*/);

  // action 2: send to form URL (e.g. formspree.io)
  sendSignupFormViaAjax2(myHost, myPageUrl, formId, emailOrPhone, secondPostToUrl, success, error);
}

// helper function for sending emailOrPhone signup via AJAX request to AWS
function sendSignupFormViaAjaxMain(myHost, myPageUrl, formId, emailOrPhone /*, success, error*/) {
  var postUrl = "https://abql5sgd50.execute-api.eu-west-1.amazonaws.com/prod/api/v1/signup";

  logUserAction("sendSignup-"+formId);

  // action
  console.log("sendSignupFormViaAjaxMain: emailOrPhone("+formId+")", emailOrPhone);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", postUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log(xhr.responseText);
    }
  };
  var dataStr = JSON.stringify({"host": myHost, "formUrl": myPageUrl, "formId": formId, "emailOrPhone": emailOrPhone});
  console.log(dataStr);
  xhr.send(dataStr);
  console.log("sendSignupFormViaAjaxMain: almost done");
}


// helper function for sending emailOrPhone signup via AJAX request to form URL (e.g. formspree.io)
function sendSignupFormViaAjax2(myHost, myPageUrl, formId, emailOrPhone, secondPostToUrl, success, error) {
    console.log("sendSignupFormViaAjax2: emailOrPhone("+formId+")", emailOrPhone);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", secondPostToUrl);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      success(xhr.response, xhr.responseType);
    } else {
      error(xhr.status, xhr.response, xhr.responseType);
    }
  };
  const data = new FormData();
  data.append("emailOrPhone", emailOrPhone);
  data.append("pageurl", myPageUrl);
  data.append("formId", formId);
  xhr.send(data);
  console.log("sendSignupFormViaAjax2: almost done");
}


//
// Helpers for modal dialogs and validation
//
var lastEmailOrMobileValidationOK = false;
  
// JavaScript for disabling form submissions if there are invalid fields
function addEmailOrPhoneValidateAndSubmit2FormInModalDialog(
  currentModalDialogId, currentFormId, emailOrPhoneFieldId, formContextFieldName,
  nextModalDialogId, nextUrl, nextUrlTarget
  ) {
  try {
    console.log("addEmailOrPhoneValidateAndSubmit2FormInModalDialog for "+currentModalDialogId+", "+currentFormId+", "+emailOrPhoneFieldId);
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    //const forms = document.getElementsByClassName('needs-validation');
    const forms = [document.getElementById(currentFormId)]
    console.log("forms="+forms)
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      console.log("form (before add listener)="+form)
      console.log("add listener for form="+JSON.stringify(form));
      form.addEventListener('submit', function(event) {
        // validate on submit
        console.log("submit event="+event)
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          lastEmailOrMobileValidationOK = false;
        } else {
          lastEmailOrMobileValidationOK = true;
        }
        form.classList.add('was-validated');
        console.log("validate="+lastEmailOrMobileValidationOK);

        if (lastEmailOrMobileValidationOK) {
          // go to next modal dialog
          $('#'+currentModalDialogId).modal('hide');
        }
      }, false);
    });

    $('#'+currentFormId).on('submit', function(e) {
        e.preventDefault();
        console.log("submit last="+lastEmailOrMobileValidationOK+", e="+e);
      });

    $('#'+currentModalDialogId).on('show.bs.modal', function (e) {
      lastEmailOrMobileValidationOK = false;
    })
    $('#'+currentModalDialogId).on('hidden.bs.modal', function (e) {
      if (lastEmailOrMobileValidationOK == true) {
        const emailOrPhone = document.getElementById(emailOrPhoneFieldId).value;
        var formId = currentFormId;
        // values from radio button(s) (optional)
        if (formContextFieldName) {
            //var formContext = document.getElementById(formContextFieldId).value;
            var radios = Array.from(document.getElementsByName(formContextFieldName));
            var formContext = null;
            for (var i = 0, length = radios.length; i < length; i++) {
              if (radios[i].checked) {
                // do whatever you want with the checked radio
                formContext = radios[i].value;

                // only one radio can be logically checked, don't check the rest
                break;
              }
            }
            if (formContext) {
              formId = currentFormId+"#"+formContext
            }
        }

        // send
        sendEmailOrFromFromModalDialog(formId, emailOrPhone);
        lastEmailOrMobileValidationOK = false;

        if (nextModalDialogId) {
          $('#'+nextModalDialogId).modal('show')
          //window.alert("#startZoomSimpleModal - hidden.bs.modal # valid")
        } else if (nextUrl) {
          window.open(nextUrl, "_self"/*, nextUrlTarget*/);
        }
      }
    })

    // add custom validator for email/phone
    const field = document.getElementById(emailOrPhoneFieldId);
    field.addEventListener('change', function(event) {
      console.log("Change event="+JSON.stringify(event));
      
      if (isValidEmailOrPhone(field.value)) {
        // valid
        field.setCustomValidity("");
      } else {
        // invalid
        field.setCustomValidity("err");
      }
    }, false);
    
  } catch (exc) {
    console.err("addEmailOrPhoneValidateAndSubmit2FormInModalDialog:" +exc+ " " + JSON.stringify(exc));
    //alert("addEmailOrPhoneValidateAndSubmit2FormInModalDialog:" +exc+ " " + JSON.stringify(exc));
  }
}

function sendEmailOrFromFromModalDialog(formId, emailOrPhone) {
  const secondPostToUrl = "https://formspree.io/f/maypnydl" // formspree for dance123.de

  // Success and Error functions for after the form is submitted
  function success() {
    console.log("success") ;
  }
  function error() {
    console.log("error");
  }

  // send
  sendSignupFormViaAjax(formId, emailOrPhone, secondPostToUrl, success, error);
}


//
// Render count down for events and dynamic register/join/start buttons
//

/*
 * Render ZoomMeeting button(s)
 */
function updateZoomMeetingButton(eventTsBeginUtc, eventStartEarlierSeconds, eventTsEndUtc) {
  try {
    // render unce
    renderZoomMeetingButton(eventTsBeginUtc, eventStartEarlierSeconds, eventTsEndUtc);

    // update in a seconds
    setTimeout(function(){ updateZoomMeetingButton(eventTsBeginUtc, eventStartEarlierSeconds, eventTsEndUtc)}, 1*1000);
  } catch (exc) {
    console.err("updateZoomMeetingButton:" +exc+" "+JSON.stringify(exc));
    //alert("updateZoomMeetingButton:" +exc+" "+JSON.stringify(exc));
  }
}

function renderZoomMeetingButton(eventTsBeginUtc, eventStartEarlierSeconds, eventTsEndUtc) {
  //console.log("eventTsBeginUtc="+eventTsBeginUtc);
  var beginTsMillis = Date.parse(eventTsBeginUtc);
  //console.log("eventTsEndUtc="+eventTsEndUtc);
  var endTsMillis = Date.parse(eventTsEndUtc);
  console.log("beginTsMillis="+beginTsMillis+", endTsMillis="+endTsMillis);
  var now = new Date();
  var secsUntilBegin = Math.round((beginTsMillis-now.getTime()) / 1000);
  console.log("secsUntilBegin="+secsUntilBegin);

  //return renderBeforeParty(secsUntilBegin)+"<br>"+renderDuringParty(url)+"<br>"+renderAfterParty();

  if (secsUntilBegin>eventStartEarlierSeconds) {
      // waiting
      return renderBeforeParty(secsUntilBegin)
  } else if (now.getTime()<endTsMillis) {
      // join possible
      return renderDuringParty();
  } else {
      // over
      return renderAfterParty();
  }
}


function clickVisibleButton(buttonCssClass) {
  console.log("clickVisibleButton("+buttonCssClass+") started");

  // select the currently visible button
  var buttons = document.getElementsByClassName(buttonCssClass);
  for (var button of buttons) {
    if (button.style && button.style.display && button.style.display=="block") {
      // this button is visible - click it now
      console.log("clickVisibleButton("+buttonCssClass+") - clicks button now");
      button.click(); 
      return;
    }
  }
  console.log("clickVisibleButton("+zoomMeetingButtonClass+") finished without click (no proper button found)");
}

function clickZoomMeetingButton(zoomMeetingButtonClass) {
  console.log("clickZoomMeetingButton("+zoomMeetingButtonClass+") started");

  var defaultZoomMeetingButtonClass = "zoom-meeting-button";
  if (!zoomMeetingButtonClass) {
    zoomMeetingButtonClass = defaultZoomMeetingButtonClass;
  }
  
  clickVisibleButton(zoomMeetingButtonClass);
}
function startTimerForClickZoomMeetingButtonBasedOnAutostartParam(zoomMeetingButtonClass) {
    var urlObj = new URL(window.location.href);
    var urlParamAutostart = urlObj.searchParams.get("autostart");
    if (urlParamAutostart) {
      console.log("Set timer for clickZoomMeetingButton("+zoomMeetingButtonClass+") with autostart="+urlParamAutostart);
      window.setTimeout(function() {clickZoomMeetingButton(zoomMeetingButtonClass)}, urlParamAutostart*1000);
    } else {
      console.log("Param autostart not set - no timerfor for clickZoomMeetingButton() started");
    }
}

function renderDuringParty() {
  // show suitable elements
  setDisplayToAllOfClass("before-party",                     "none"); 
  setDisplayToAllOfClass("before-party-supported-browser",   "none"); 
  setDisplayToAllOfClass("before-party-unsupported-browser", "none"); 
  setDisplayToAllOfClass("during-party",                     "block");
  if (isSupportedBrowser) {
      setDisplayToAllOfClass("during-party-supported-browser",   "block");
      setDisplayToAllOfClass("during-party-unsupported-browser", "none");
  } else {
      setDisplayToAllOfClass("during-party-supported-browser",   "none");
      setDisplayToAllOfClass("during-party-unsupported-browser", "block");
  }
  setDisplayToAllOfClass("after-party",                      "none");
  setDisplayToAllOfClass("after-party-supported-browser",    "none");
  setDisplayToAllOfClass("after-party-unsupported-browser",  "none");
}

function setDisplayToAllOfClass(cssClass, displayValue) {
  const elements = document.getElementsByClassName(cssClass);
  for (var element of Array.from(elements)) {
    element.style.display = displayValue;
  }
}


function renderBeforeParty(secs) {
  document.getElementById("party-countdown").innerHTML = countDownsString(secs);

  // show suitable button
  //alert("isSupportedBrowser: "+isSupportedBrowser);
  setDisplayToAllOfClass("before-party",                     "block"); 
  if (isSupportedBrowser) {
      setDisplayToAllOfClass("before-party-supported",           "block"); 
      setDisplayToAllOfClass("before-party-unsupported-browser", "none"); 
  } else {
      setDisplayToAllOfClass("before-party-supported",           "none"); 
      setDisplayToAllOfClass("before-party-unsupported-browser", "block"); 
  }
  setDisplayToAllOfClass("during-party",                     "none");
  setDisplayToAllOfClass("during-party-supported-browser",   "none");
  setDisplayToAllOfClass("during-party-unsupported-browser", "none");
  setDisplayToAllOfClass("after-party",                      "none");
  setDisplayToAllOfClass("after-party-supported-browser",    "none");
  setDisplayToAllOfClass("after-party-unsupported-browser",  "none");
}
function countDownsString(secs) {
  // calculate
  var days = Math.floor(secs / (24*60*60));
  var secsWithoutDays = secs - ((24*60*60)*days);
  var hrs = Math.floor(secsWithoutDays / (60*60));
  var secsWithoutHrs = secsWithoutDays - ((60*60)*hrs);
  var mins =  Math.floor(secsWithoutHrs / 60);
  var secsWithoutMins = secsWithoutHrs - (60*mins);

  // convert to strings
  var hrsS = twoDigits(hrs);
  var minsS = twoDigits(mins);
  var secsS = twoDigits(secsWithoutMins);

  // render
  //return days+' days '+hrsS+' hrs '+minsS+' mins '+secsS+' secs';
  return days+'d '+hrsS+'h '+minsS+'m '+secsS+'s';
}
function twoDigits(n) {
  if (n>=0 && n<10) {
      return "0"+n;
  } else {
      return ""+n;
  }
}

function renderAfterParty() {
  // show suitable button
  setDisplayToAllOfClass("before-party",                     "none"); 
  setDisplayToAllOfClass("before-party-supported",           "none"); 
  setDisplayToAllOfClass("before-party-unsupported-browser", "none"); 
  setDisplayToAllOfClass("during-party",                     "none");
  setDisplayToAllOfClass("during-party-supported-browser",   "none");
  setDisplayToAllOfClass("during-party-unsupported-browser", "none");
  setDisplayToAllOfClass("after-party",                      "block");
  if (isSupportedBrowser) {
      setDisplayToAllOfClass("after-party-supported-browser",   "block"); 
      setDisplayToAllOfClass("after-party-unsupported-browser", "none"); 
  } else {
      setDisplayToAllOfClass("after-party-supported-browser",   "none"); 
      setDisplayToAllOfClass("after-party-unsupported-browser", "block"); 
  }
}


//
// helper for browser (version) detection (https://www.digitalminds.io/blog/detecting-outdated-browsers-in-vanilla-javascript)
//


// USED HERE: old browser detection (2019): https://www.digitalminds.io/blog/detecting-outdated-browsers-in-vanilla-javascript
// NOT USED HERE: super old browser detection (non-"HTML5" browsers/2013) : https://github.com/mediafreakch/legacy-browser-detection

 /**
  * BrowserDetector
  *
  * This util checks the current browser name and version and offers a
  * convinient API to test for specific versions or browsers and whether
  * the current visitor uses a supported browser or not.
  */
/*export default*/ class BrowserDetector {
    constructor() {
        this.browser = {};
        this.unsupportedBrowsers = {
            Chrome: 70,
            Firefox: 60,
            IE: 10,
            Edge: 15,
            Opera: 50,
            Safari: 12
        };

        this._detectBrowser();
    }

  /**
  * Detects the current browser and its version number.
  *
  * @returns {Object} An object with keys for browser `name` and `version`.
  */
  _detectBrowser() {
    this.browser = (function() {
        var ua = navigator.userAgent,
            tem,
            M =
                ua.match(
                    /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
                ) || [];

        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return { name: "IE", version: tem[1] || "" };
        }

        if (M[1] === "Chrome") {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) {
                return { name: tem[1].replace("OPR", "Opera"), version: tem[2] };
            }
        }

        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];

        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1]);
        }

        return { name: M[0], version: M[1] };
    })();
  }


  /**
  * Checks if the current browser is supported by
  *
  * @returns {Boolean}
  */
  isSupported() {
    if (this.unsupportedBrowsers.hasOwnProperty(this.browser.name)) {
        if (+this.browser.version > this.unsupportedBrowsers[this.browser.name]) {
            return true;
        }
    }

    return false;
  }

  isSafariBrowser() {
    return (this.browser.name.toLowerCase().includes("safari"))
  }
}

// isSupportedBrowser: is it a new browser that supports all required JavaScript?
var isSupportedBrowser = (new BrowserDetector).isSupported();
console.log("isSupportedBrowser="+isSupportedBrowser);
// for debuggung
var urlObj = new URL(window.location.href);
var supportedParam = urlObj.searchParams.get("supported");
if (supportedParam) {
  isSupportedBrowser = (supportedParam=="1");
}

var isSafariBrowser = (new BrowserDetector).isSafariBrowser();
console.log("isSafariBrowser="+isSafariBrowser);

//
// helpers for staff handling
//
