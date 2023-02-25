
//////////////////////
// JavaScript - loaded at the end of the HTML page loading
//////////////////////

  /** Some docs:

      Exclude some visitors from (old) Google Analytics stats
        Based on: https://brianclifton.com/blog/2019/11/07/filter-internal-staff-from-google-analytics/ (Alternative 2: Visitor Labelling)

      Guide (old) to Google Analytics dimensions:
        https://www.optimizesmart.com/complete-guide-to-dimensions-and-metrics-in-google-analytics/

      JavaScript: parse URL parameters:
        https://stackoverflow.com/questions/58991043/overwrite-utm-parameter

      JavaScript: get and set Cookies:
        https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript

      JavaScript: fast get Cookies:
        https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
  */




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
  // extra tab handling helpers
  // (avoid opening too many tabs, and close sub-tabs of parent tabs)
  //
  const extraTabName  = "extraTabName";
  const extraSubTabName = "extraSubTabName";
  var extraTab;
  var extraSubTab;
  
  function loadExtraTab(url) {
    console.log("loadExtraTab url="+url);
    extraTab = window.open(url, extraTabName);
  }
  function loadExtraSubTab(url) {
    console.log("loadExtraSubTab url="+url);
    extraSubTab = window.open(url, extraSubTabName);
  }
  
  function unloadExtraTab() {
      if (extraTab) {
          console.log("unloadExtraTab: close1");
          extraTab.close();
          console.log("unloadExtraTab close2");
      } else {
          console.log("unloadExtraTab: nothing to do");
      }
      if (extraSubTab) {
          console.log("unloadExtraSubTab: close1");
          extraSubTab.close();
          console.log("unloadExtraSubTab close2");
      } else {
          console.log("unloadExtraSubTab: nothing to do");
      }
  };
  /*
  window.addEventListener("load", function(){
  });
  */
  window.addEventListener("unload" /*"beforeunload"*/, function(){
    console.log("unload 1");
    unloadExtraTab();
    console.log("unload 2");
  });



  //
  // HTML page/DOM helper functions
  //

  /** Click a visible button */
  function clickVisibleLinkOrButton(linkOrButtonCssClass) {
    console.log("clickVisibleLinkOrButton("+linkOrButtonCssClass+") started");

    // select the currently visible link/button
    var buttons = document.getElementsByClassName(linkOrButtonCssClass);
    for (var button of buttons) {
      if (isElementVisible(button)) {
        // this lin/button is visible - click it now
        console.log("clickVisibleLinkOrButton("+linkOrButtonCssClass+") - clicks link/button now");
        button.click(); 
        return;
      }
    }
    console.log("clickVisibleLinkOrButton("+linkOrButtonCssClass+") finished without click (no proper link/button found)");
  }

  /**
   * Scoll to an anchor on the current page.
   * 
   * Doesn't work (getElementById()) with a-tag, but with div tag as anchor
   * 
   * In genereal, it's not very reliable.
   * 
   */
   function scrollToAnchor(anchorId, doSmoothScroll) {
    var anchorElement=document.getElementById(anchorId);
    if (anchorElement) {
      console.log("scrollToAnchor: scrollIntoView now with anchorId="+anchorId+", doSmoothScroll="+doSmoothScroll);
      try {
        var behavior = doSmoothScroll ? "smooth" : "auto";
        anchorElement.scrollIntoView({
          behavior: behavior,
          block: "start",
          inline: "nearest"
        });
      } catch (exc) {
        console.log("scrollToAnchor fallback 1: scrollIntoView now with anchorId="+anchorId);
        try {
          anchorElement.scrollIntoView(/*alignToTop=*/true);
        } catch (exc) {
          console.log("scrollToAnchor fallback 2: location.hash=#"+anchorId);
          try {
            location.hash = "#"+anchorId;
          } catch (exc) {
            console.error("scrollToAnchor:" +exc+ " " + JSON.stringify(exc));
          }
        }
      }
    } else {
      console.log("scrollToAnchor: anchor element not found with ID: "+anchorElement);
    }
  }



  //
  // Cookie helpers
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
    * 
    * this also works with old browsers (compared to URL.searchParams):
    *   var urlParams = getParams(window.location.href);
    *   var urlParamUtmSource = urlParams['utm_source'];
    * 
    * this would be the modern variant: 
    *   var urlObj = new URL(window.location.href);
    *   var urlParamUtmSource = urlObj.searchParams.get("utm_source");
    * 
    * @param  {String} url The URL
    * @return {Object}     The URL parameters
    */
  //var getParams = function (url) {
  function getParams(url) {
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
  /*
  var urlParams = getParams(window.location.href);
  var urlParamUtmSource = urlParams['utm_source'];
  var urlParamUtmMedium = urlParams['utm_medium'];
  var dimensionValueR = urlParams['r'];
  */



  //
  // helpers for Google Analytics + more
  //

  // call this before Google Analytics Tracking code
  function prepareAnalyticsDimensionValues(defaultR) {
      /**
        * Extract custom tracking param r from URL
        * and optionally set the same value as utm_medium in format r-123
        */
      // this also works with old browsers (compared to URL.searchParams):
      var urlParams = getParams(window.location.href);
      var urlParamUtmSource = urlParams['utm_source'];
      var urlParamUtmSource = urlParams["utm_source"];
      var urlParamUtmMedium = urlParams["utm_medium"];
      var dimensionValueR = urlParams["r"];
      //var urlObj = new URL(window.location.href);
      //var urlParamUtmSource = urlObj.searchParams.get("utm_source");
      //var urlParamUtmMedium = urlObj.searchParams.get("utm_medium");
      //var dimensionValueR = urlObj.searchParams.get("r");
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

  // call this after Google Analytics Tracking code - to track user clicks to external links
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
        /* OLD:
        ga('send', 'event', 'outbound', 'click', urlNice, {
          'transport': 'beacon',
          'hitCallback': function(){ if (!target) {document.location = url;} }
        });
        */
        gtag('event', 'click', {
          'event_category': 'outbound',
          'event_label': urlNice,
          'transport_type': 'beacon',
          'event_callback': function(){ if (!target) {document.location = url;} }
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
    /* OLD:
    ga('send', 'event', 'modal', 'click', label);
    */
    gtag('event','click', {
      'event_category': "click",
      'event_label': label
    });
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
    
    /* load Global site tag (gtag.js) - Google Analytics
    var newScript = document.createElement("script");
    newScript.type = "text/javascript";
    newScript.setAttribute("async", "true");
    newScript.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id="+googleAnalyticsId);
    document.documentElement.lastChild.appendChild(newScript);
    */
    /*
    // configure gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (){dataLayer.push(arguments);}
    gtag('js', new Date());
    */
    // build parameters
    const additionalConfigInfo4Gtag = {};
    const event4own = {'event': 'pageview', 'url': window.location.href};
    if (window.dimensionValueR) {
      // custom dimension "r"
      additionalConfigInfo4Gtag['campaign'] = {
        source: window.referrerShort,   // utm_source
        medium: window.dimensionValueR, // utm medium
        r: window.dimensionValueR
      } 
      event4own['campaignSource'] = window.referrerShort;
      event4own['campaignMedium'] = window.dimensionValueR;
      event4own['r'] = window.dimensionValueR;
    }
    if (window.dimensionValueInternalUser) {
      additionalConfigInfo4Gtag['internalUser'] = window.dimensionValueInternalUser;
      event4own['internalUser'] = window.dimensionValueInternalUser;
    }
    if (window.dimensionValueInternalUserLabel) {
      additionalConfigInfo4Gtag['internalUserLabel'] = window.dimensionValueInternalUserLabel;
      event4own['internalUserLabel'] = window.dimensionValueInternalUserLabel;
    }
    // finalize gtag configuration for (automatically generated) page view event
    gtag('config', googleAnalyticsId, additionalConfigInfo4Gtag);
    // own logging (in addition to gtag)
    /*
    logEvent(event4own);
    */
    
    // call this after Google Analytics Tracking code
    updateExternalLinks();        
  }
  if (typeof google_analytics_id !== 'undefined') {
    allAnalytics(google_analytics_id, default_r);
  }



  //
  // helper functions for sending emailOrPhone signup via AJAX request(s)
  //
  // For danops and pardir.
  // The "mainPostUrl" is always the same and therefore not part of the parameter list.
  //
  function sendSignupFormViaAjax(formId, formData/*:Object*/, emailOrPhone, secondPostToUrl, success, error) {
    // pre-check
    console.log("sendSignupFormViaAjax formId="+formId+", emailOrPhone="+emailOrPhone+", formData="+JSON.stringify(formData));
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
    sendSignupFormViaAjaxMainPost(myHost, myPageUrl, formId, formData, emailOrPhone /*, success, error*/);

    // action 2: send to form URL (e.g. formspree.io)
    /*
    sendSignupFormViaAjaxSecondPost(myHost, myPageUrl, formId, formData, emailOrPhone, secondPostToUrl, success, error);
    */
  }

  // helper function for sending emailOrPhone signup via AJAX request to AWS
  function sendSignupFormViaAjaxMainPost(myHost, myPageUrl, formId, formData/*:Object*/, emailOrPhone /*, success, error*/) {
    var mainPostUrl = "https://abql5sgd50.execute-api.eu-west-1.amazonaws.com/prod/api/v1/signup";

    logUserAction("sendSignup-"+formId);

    // action
    console.log("sendSignupFormViaAjaxMainPost: emailOrPhone("+formId+")", emailOrPhone);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", mainPostUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          console.log(xhr.responseText);
      }
    };
    var dataStr = JSON.stringify({"host": myHost, "formUrl": myPageUrl, "formId": formId, "formData": formData, "emailOrPhone": emailOrPhone});
    console.log(dataStr);
    xhr.send(dataStr);
    console.log("sendSignupFormViaAjaxMainPost: almost done");
  }

  // helper function for sending emailOrPhone signup via AJAX request to form URL (e.g. formspree.io)
  function sendSignupFormViaAjaxSecondPost(myHost, myPageUrl, formId, formData/*:Object*/, emailOrPhone, secondPostToUrl, success, error) {
      console.log("sendSignupFormViaAjaxSecondPost: emailOrPhone("+formId+")", emailOrPhone);
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
    //data.append("formData", formData);
    xhr.send(data);
    console.log("sendSignupFormViaAjaxSecondPost: almost done");
  }




  /* yall.js (Yet Another Lazy Loader): https://github.com/malchata/yall.js
    Included here - downloaded from:
    https://raw.githubusercontent.com/malchata/yall.js/main/dist/yall.min.js */
  var yall=function(){"use strict";return function(e){var n=(e=e||{}).lazyClass||"lazy",t=e.lazyBackgroundClass||"lazy-bg",o="idleLoadTimeout"in e?e.idleLoadTimeout:200,i=e.observeChanges||!1,r=e.events||{},a=e.noPolyfill||!1,s=window,c="requestIdleCallback",u="IntersectionObserver",l=u in s&&u+"Entry"in s,d=/baidu|(?:google|bing|yandex|duckduck)bot/i.test(navigator.userAgent),v=["srcset","src","poster"],f=[],queryDOM=function(e,o){return f.slice.call((o||document).querySelectorAll(e||"img."+n+",video."+n+",iframe."+n+",."+t))},yallLoad=function(n){var o=n.parentNode;"PICTURE"==o.nodeName&&yallApplyFn(queryDOM("source",o),yallFlipDataAttrs),"VIDEO"==n.nodeName&&yallApplyFn(queryDOM("source",n),yallFlipDataAttrs),yallFlipDataAttrs(n);var i=n.classList;i.contains(t)&&(i.remove(t),i.add(e.lazyBackgroundLoaded||"lazy-bg-loaded"))},yallBindEvents=function(e){for(var n in r)e.addEventListener(n,r[n].listener||r[n],r[n].options||void 0)},yallFlipDataAttrs=function(e){for(var t in v)if(v[t]in e.dataset){e.setAttribute(v[t],e.dataset[v[t]]);var o=e.parentNode;"SOURCE"===e.nodeName&&o.autoplay&&(o.load(),/Trident/.test(navigator.userAgent)&&o.play(),o.classList.remove(n)),e.classList.remove(n)}},yallApplyFn=function(e,n){for(var t=0;t<e.length;t++)s[u]&&n instanceof s[u]?n.observe(e[t]):n(e[t])},b=queryDOM();if(yallApplyFn(b,yallBindEvents),l&&!d){var g=new s[u]((function(e){yallApplyFn(e,(function(e){if(e.isIntersecting||e.intersectionRatio){var n=e.target;c in s&&o?s[c]((function(){yallLoad(n)}),{timeout:o}):yallLoad(n),g.unobserve(n),(b=b.filter((function(e){return e!=n}))).length||i||g.disconnect()}}))}),{rootMargin:("threshold"in e?e.threshold:200)+"px 0%"});yallApplyFn(b,g),i&&yallApplyFn(queryDOM(e.observeRootSelector||"body"),(function(n){new MutationObserver((function(){yallApplyFn(queryDOM(),(function(e){b.indexOf(e)<0&&(b.push(e),yallBindEvents(e),l&&!d?g.observe(e):(a||d)&&yallApplyFn(b,yallLoad))}))})).observe(n,e.mutationObserverOptions||{childList:!0,subtree:!0})}))}else(a||d)&&yallApplyFn(b,yallLoad)}}();
  // init yall.js
  document.addEventListener("DOMContentLoaded", yall);

// END: JavaScript - loaded at the end of the HTML page loading
