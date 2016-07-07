
        /*
         *  Client Side Redirection Javascript
         *
         *  This function will perform client-side redirection of a mobile user.
         *
         *  There are couple of options that may have to be tweaked
         *  - The regExUA variable can be altered to accomodate different devices
         *  - The use of the m. domain as the redirection location.
         *
         *  This script does not support multiple sub-domains
         *
         *  When redirection occurs, the script checks if its not on the mobile site.
         *  This allows this script to remain and not cause an infinite loop.
         *
         *  Place this function inline and minified at the top of the <head> tag

         *  You can do that here => http://refresh-sf.com/yui/
         */

        var Redirector = {
          regExUA: /ip(hone|od)|android.*(mobile)|blackberry.*applewebkit/i,
    location: window.location,
          mapProxyToOrigin: {"http://m.store.schoolspecialty.com":"http://store.schoolspecialty.com","https://m.store.schoolspecialty.com":"https://store.schoolspecialty.com","http://m.schoolspecialty.com":"http://www.schoolspecialty.com","https://m.schoolspecialty.com":"https://www.schoolspecialty.com"},
          mapOriginToProxy: {"http://store.schoolspecialty.com":"http://m.store.schoolspecialty.com","https://store.schoolspecialty.com":"https://m.store.schoolspecialty.com","http://www.schoolspecialty.com":"http://m.schoolspecialty.com","https://www.schoolspecialty.com":"https://m.schoolspecialty.com"},
          isMobileBrowser: function(userAgent) {
            userAgent = userAgent || navigator.userAgent;
            return userAgent.match(this.regExUA) !== null;
          },
          currentHost: function(){
            var loc = window.location;
            return loc.protocol + "//" + loc.host;
          },
          constructNewLocation: function (hostname){
            var loc = window.location;
      var analytics = this.appendDocumentReferrerAsUtmReferrer();
      return hostname + loc.pathname + this.queryParameters() + loc.hash + analytics;
          },
          redirectTo: function(location){
            window.location.replace(location);
          },
          onMobile: function() {
            var locIndex = this.currentHost();
            return this.mapProxyToOrigin.hasOwnProperty(locIndex)
          },
          redirectToMobile: function() {
            var locIndex = this.currentHost();
            var hostname = this.mapOriginToProxy[locIndex]
            if (hostname != undefined) {
              var newLoc = this.constructNewLocation(hostname);
              this.redirectTo(newLoc);
            }
          },
    queryParameters: function(){
      return window.location.search;
    },
    documentReferrer: function(){
      return document.referrer;
    },
    appendDocumentReferrerAsUtmReferrer: function() {
      var referrer = this.documentReferrer() !== "" ? this.documentReferrer() : "direct/not provided"
      var analytics = "utm_referrer=" + encodeURIComponent(referrer);
      analytics = (this.queryParameters().indexOf("?")!==0) ? ("?" + analytics) : ("&" + analytics);
      return analytics;
    },
          redirectToOrigin: function() {
            var locIndex = this.currentHost();
            var hostname = this.mapProxyToOrigin[locIndex];
            if (hostname != undefined) {
              var newLoc = this.constructNewLocation(hostname);
              // Redirect
              this.redirectTo(newLoc);
            }
          },
          readCookie: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(";");
            for(var i=0;i < ca.length;i++) {
              var c = ca[i];
              while (c.charAt(0)== " ") c = c.substring(1,c.length);
              if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
          },
          mobileCookie: function(){
            return this.readCookie("mw_mobile_site");
          },
    execute: function(){
      // Check for the mobile cookie
      forceMobile = (this.mobileCookie() === "true");
      forceOrigin = (this.mobileCookie() === "false");

      if (!this.onMobile()) {
        // Check if the navigator is supported
        if (window.navigator) {
          if (this.isMobileBrowser() && !forceOrigin) {
            this.redirectToMobile();
          }
        }
      }
      else if(this.onMobile()){
        if (window.navigator) {
          if (!this.isMobileBrowser() && !forceMobile) {
            this.redirectToOrigin();
          }
        }
      }
    }
  };

  Redirector.execute();

  