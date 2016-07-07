// https://developer.mozilla.org/en/New_in_JavaScript_1.6#Array_extras
// https://developer.mozilla.org/en/New_in_JavaScript_1.8#More_Array_extras
if(!Array.prototype.every){Array.prototype.every=function(b){if(typeof b!="function"){throw new TypeError()}var a=this.length,d=arguments[1],c;for(c=0;c<a;c++){if(c in this&&!b.call(d,this[c],c,this)){return false}}return true}};
if(!Array.prototype.filter){Array.prototype.filter=function(b){if(typeof b!="function"){throw new TypeError()}var a=this.length,e=new Array(),d=arguments[1],c,f;for(c=0;c<a;c++){if(c in this){f=this[c];if(b.call(d,f,c,this)){e.push(f)}}}return e}};
if(!Array.prototype.forEach){Array.prototype.forEach=function(b){if(typeof b!="function"){throw new TypeError()}var a=this.length,d=arguments[1],c;for(c=0;c<a;c++){if(c in this){b.call(d,this[c],c,this)}}}};
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(b){var a=this.length,c=Number(arguments[1])||0;c=(c<0)?Math.ceil(c):Math.floor(c);if(c<0){c+=a}for(;c<a;c++){if(c in this&&this[c]===b){return c}}return -1}};
if(!Array.prototype.lastIndexOf){Array.prototype.lastIndexOf=function(b){var a=this.length,c=Number(arguments[1]);if(isNaN(c)){c=a-1}else{c=(c<0)?Math.ceil(c):Math.floor(c);if(c<0){c+=a}else{if(c>=a){c=a-1}}}for(;c>-1;c--){if(c in this&&this[c]===b){return c}}return -1}};
if(!Array.prototype.map){Array.prototype.map=function(b){if(typeof b!="function"){throw new TypeError()}var a=this.length,e=new Array(a),d=arguments[1],c;for(c=0;c<a;c++){if(c in this){e[c]=b.call(d,this[c],c,this)}}return e}};
if(!Array.prototype.reduce){Array.prototype.reduce=function(b){var a=this.length>>>0,c,d;if(typeof b!="function"){throw new TypeError()}if(a==0&&arguments.length==1){throw new TypeError()}c=0;if(arguments.length>=2){d=arguments[1]}else{do{if(c in this){d=this[c++];break}if(++c>=a){throw new TypeError()}}while(true)}for(;c<a;c++){if(c in this){d=b.call(null,d,this[c],c,this)}}return d}};
if(!Array.prototype.reduceRight){Array.prototype.reduceRight=function(b){var a=this.length>>>0,c,d;if(typeof b!="function"){throw new TypeError()}if(a==0&&arguments.length==1){throw new TypeError()}c=a-1;if(arguments.length>=2){d=arguments[1]}else{do{if(c in this){d=this[c--];break}if(--c<0){throw new TypeError()}}while(true)}for(;c>=0;c--){if(c in this){d=b.call(null,d,this[c],c,this)}}return d}};
if(!Array.prototype.some){Array.prototype.some=function(b){if(typeof b!="function"){throw new TypeError()}var a=this.length,d=arguments[1],c;for(c=0;c<a;c++){if(c in this&&b.call(d,this[c],c,this)){return true}}return false}};
// https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/String/Trim
if(!String.prototype.trim){String.prototype.trim=function(){return this.trimLeft().trimRight()}};
if(!String.prototype.trimLeft){String.prototype.trimLeft=function(){return this.replace(/^\s+/,"")}};
if(!String.prototype.trimRight){String.prototype.trimRight=function(){var a=this.length;while(/\s/.test(this.charAt(--a))){}return this.slice(0,a+1)}};
// http://blogger.ziesemer.com/2008/05/javascript-namespace-function.html
var namespace=function(c,f,b){var e=c.split(f||"."),g=b||window,d,a,h;for(d=0,a=e.length;d<a;d++){h=e[d];if(h.length){g=g[h]=g[h]||{}}}return g};
