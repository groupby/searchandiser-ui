//
// Dust - Asynchronous Templating v0.3.0
// http://akdubya.github.com/dustjs
//
// Copyright (c) 2010, Aleksander Williams
// Released under the MIT License.
//

var dust={};
(function(d){function h(a,b,c){this.stack=a;this.global=b;this.blocks=c}function k(a,b,c,e){this.tail=b;this.isObject=!d.isArray(a)&&a&&typeof a==="object";this.head=a;this.index=c;this.of=e}function l(a){this.head=new f(this);this.callback=a;this.out=""}function j(){this.head=new f(this)}function f(a,b,c){this.root=a;this.next=b;this.data="";this.flushable=false;this.taps=c}function m(a,b){this.head=a;this.tail=b}d.cache={};d.register=function(a,b){if(a)d.cache[a]=b};d.render=function(a,b,c){c=(new l(c)).head;
d.load(a,c,h.wrap(b)).end()};d.stream=function(a,b){var c=new j;d.nextTick(function(){d.load(a,c.head,h.wrap(b)).end()});return c};d.renderSource=function(a,b,c){return d.compileFn(a)(b,c)};d.compileFn=function(a,b){var c=d.loadSource(d.compile(a,b));return function(e,g){var i=g?new l(g):new j;d.nextTick(function(){c(i.head,h.wrap(e)).end()});return i}};d.load=function(a,b,c){var e=d.cache[a];if(e)return e(b,c);else{if(d.onLoad)return b.map(function(g){d.onLoad(a,function(i,n){if(i)return g.setError(i);
d.cache[a]||d.loadSource(d.compile(n,a));d.cache[a](g,c).end()})});return b.setError(Error("Template Not Found: "+a))}};d.loadSource=function(a){return eval(a)};d.isArray=Array.isArray?Array.isArray:function(a){return Object.prototype.toString.call(a)=="[object Array]"};d.nextTick=function(a){setTimeout(a,0)};d.isEmpty=function(a){if(d.isArray(a)&&!a.length)return true;if(a===0)return false;return!a};d.filter=function(a,b,c){if(c)for(var e=0,g=c.length;e<g;e++){var i=c[e];if(i==="s")b=null;else a=
d.filters[i](a)}if(b)a=d.filters[b](a);return a};d.filters={h:function(a){return d.escapeHtml(a)},j:function(a){return d.escapeJs(a)},u:encodeURI,uc:encodeURIComponent};d.makeBase=function(a){return new h(new k,a)};h.wrap=function(a){if(a instanceof h)return a;return new h(new k(a))};h.prototype.get=function(a){for(var b=this.stack,c;b;){if(b.isObject){c=b.head[a];if(c!==undefined)return c}b=b.tail}return this.global?this.global[a]:undefined};h.prototype.getPath=function(a,b){var c=this.stack,e=b.length;
if(a&&e===0)return c.head;if(c.isObject){c=c.head;for(var g=0;c&&g<e;){c=c[b[g]];g++}return c}};h.prototype.push=function(a,b,c){return new h(new k(a,this.stack,b,c),this.global,this.blocks)};h.prototype.rebase=function(a){return new h(new k(a),this.global,this.blocks)};h.prototype.current=function(){return this.stack.head};h.prototype.getBlock=function(a){var b=this.blocks;if(b)for(var c=b.length,e;c--;)if(e=b[c][a])return e};h.prototype.shiftBlocks=function(a){var b=this.blocks;if(a){newBlocks=
b?b.concat([a]):[a];return new h(this.stack,this.global,newBlocks)}return this};l.prototype.flush=function(){for(var a=this.head;a;){if(a.flushable)this.out+=a.data;else{if(a.error){this.callback(a.error);this.flush=function(){}}return}this.head=a=a.next}this.callback(null,this.out)};j.prototype.flush=function(){for(var a=this.head;a;){if(a.flushable)this.emit("data",a.data);else{if(a.error){this.emit("error",a.error);this.flush=function(){}}return}this.head=a=a.next}this.emit("end")};j.prototype.emit=
function(a,b){var c=this.events;c&&c[a]&&c[a](b)};j.prototype.on=function(a,b){if(!this.events)this.events={};this.events[a]=b;return this};f.prototype.write=function(a){var b=this.taps;if(b)a=b.go(a);this.data+=a;return this};f.prototype.end=function(a){a&&this.write(a);this.flushable=true;this.root.flush();return this};f.prototype.map=function(a){var b=new f(this.root,this.next,this.taps),c=new f(this.root,b,this.taps);this.next=c;this.flushable=true;a(c);return b};f.prototype.tap=function(a){var b=
this.taps;this.taps=b?b.push(a):new m(a);return this};f.prototype.untap=function(){this.taps=this.taps.tail;return this};f.prototype.render=function(a,b){return a(this,b)};f.prototype.reference=function(a,b,c,e){if(typeof a==="function"){a=a(this,b,null,{auto:c,filters:e});if(a instanceof f)return a}return d.isEmpty(a)?this:this.write(d.filter(a,c,e))};f.prototype.section=function(a,b,c,e){if(typeof a==="function"){a=a(this,b,c,e);if(a instanceof f)return a}var g=c.block;c=c["else"];if(e)b=b.push(e);
if(d.isArray(a)){if(g){e=a.length;c=this;for(var i=0;i<e;i++)c=g(c,b.push(a[i],i,e));return c}}else if(a===true){if(g)return g(this,b)}else if(a||a===0){if(g)return g(this,b.push(a))}else if(c)return c(this,b);return this};f.prototype.exists=function(a,b,c){var e=c.block;c=c["else"];if(d.isEmpty(a)){if(c)return c(this,b)}else if(e)return e(this,b);return this};f.prototype.notexists=function(a,b,c){var e=c.block;c=c["else"];if(d.isEmpty(a)){if(e)return e(this,b)}else if(c)return c(this,b);return this};
f.prototype.block=function(a,b,c){c=c.block;if(a)c=a;if(c)return c(this,b);return this};f.prototype.partial=function(a,b){if(typeof a==="function")return this.capture(a,b,function(c,e){d.load(c,e,b).end()});return d.load(a,this,b)};f.prototype.helper=function(a,b,c,e){return d.helpers[a](this,b,c,e)};f.prototype.capture=function(a,b,c){return this.map(function(e){var g=new l(function(i,n){i?e.setError(i):c(n,e)});a(g.head,b).end()})};f.prototype.setError=function(a){this.error=a;this.root.flush();
return this};d.helpers={sep:function(a,b,c){if(b.stack.index===b.stack.of-1)return a;return c.block(a,b)},idx:function(a,b,c){return c.block(a,b.push(b.stack.index))}};m.prototype.push=function(a){return new m(a,this)};m.prototype.go=function(a){for(var b=this;b;){a=b.head(a);b=b.tail}return a};var o=RegExp(/[&<>\"]/),p=/&/g,q=/</g,r=/>/g,s=/\"/g;d.escapeHtml=function(a){if(typeof a==="string"){if(!o.test(a))return a;return a.replace(p,"&amp;").replace(q,"&lt;").replace(r,"&gt;").replace(s,"&quot;")}return a};
var t=/\\/g,u=/\r/g,v=/\u2028/g,w=/\u2029/g,x=/\n/g,y=/\f/g,z=/'/g,A=/"/g,B=/\t/g;d.escapeJs=function(a){if(typeof a==="string")return a.replace(t,"\\\\").replace(A,'\\"').replace(z,"\\'").replace(u,"\\r").replace(v,"\\u2028").replace(w,"\\u2029").replace(x,"\\n").replace(y,"\\f").replace(B,"\\t");return a}})(dust);if(typeof exports!=="undefined"){typeof process!=="undefined"&&require("./server")(dust);module.exports=dust};

/*
 * ! dustjs-helpers - v1.2.0 https://github.com/linkedin/dustjs-helpers
 * Copyright (c) 2014 Aleksander Williams; Released under the MIT License
 */
!function(dust){function isSelect(a){var b=a.current();return"object"==typeof b&&b.isSelect===!0}function jsonFilter(a,b){return"function"==typeof b?b.toString().replace(/(^\s+|\s+$)/gm,"").replace(/\n/gm,"").replace(/,\s*/gm,", ").replace(/\)\{/gm,") {"):b}function filter(a,b,c,d,e){d=d||{};var f,g,h=c.block,i=d.filterOpType||"";if("undefined"!=typeof d.key)f=dust.helpers.tap(d.key,a,b);else{if(!isSelect(b))return _console.log("No key specified for filter in:"+i+" helper "),a;f=b.current().selectKey,b.current().isResolved&&(e=function(){return!1})}return g=dust.helpers.tap(d.value,a,b),e(coerce(g,d.type,b),coerce(f,d.type,b))?(isSelect(b)&&(b.current().isResolved=!0),h?a.render(h,b):(_console.log("Missing body block in the "+i+" helper "),a)):c["else"]?a.render(c["else"],b):a}function coerce(a,b,c){if(a)switch(b||typeof a){case"number":return+a;case"string":return String(a);case"boolean":return a="false"===a?!1:a,Boolean(a);case"date":return new Date(a);case"context":return c.get(a)}return a}var _console="undefined"!=typeof console?console:{log:function(){}},helpers={tap:function(a,b,c){if("function"!=typeof a)return a;var d,e="";return d=b.tap(function(a){return e+=a,""}).render(a,c),b.untap(),d.constructor!==b.constructor?d:""===e?!1:e},sep:function(a,b,c){var d=c.block;return b.stack.index===b.stack.of-1?a:d?c.block(a,b):a},idx:function(a,b,c){var d=c.block;return d?c.block(a,b.push(b.stack.index)):a},contextDump:function(a,b,c,d){var e,f=d||{},g=f.to||"output",h=f.key||"current";return g=dust.helpers.tap(g,a,b),h=dust.helpers.tap(h,a,b),e="full"===h?JSON.stringify(b.stack,jsonFilter,2):JSON.stringify(b.stack.head,jsonFilter,2),"console"===g?(_console.log(e),a):a.write(e)},"if":function(chunk,context,bodies,params){var body=bodies.block,skip=bodies["else"];if(params&&params.cond){var cond=params.cond;if(cond=dust.helpers.tap(cond,chunk,context),eval(cond))return body?chunk.render(bodies.block,context):(_console.log("Missing body block in the if helper!"),chunk);if(skip)return chunk.render(bodies["else"],context)}else _console.log("No condition given in the if helper!");return chunk},math:function(a,b,c,d){if(d&&"undefined"!=typeof d.key&&d.method){var e=d.key,f=d.method,g=d.operand,h=d.round,i=null;switch(e=dust.helpers.tap(e,a,b),g=dust.helpers.tap(g,a,b),f){case"mod":(0===g||g===-0)&&_console.log("operand for divide operation is 0/-0: expect Nan!"),i=parseFloat(e)%parseFloat(g);break;case"add":i=parseFloat(e)+parseFloat(g);break;case"subtract":i=parseFloat(e)-parseFloat(g);break;case"multiply":i=parseFloat(e)*parseFloat(g);break;case"divide":(0===g||g===-0)&&_console.log("operand for divide operation is 0/-0: expect Nan/Infinity!"),i=parseFloat(e)/parseFloat(g);break;case"ceil":i=Math.ceil(parseFloat(e));break;case"floor":i=Math.floor(parseFloat(e));break;case"round":i=Math.round(parseFloat(e));break;case"abs":i=Math.abs(parseFloat(e));break;default:_console.log("method passed is not supported")}return null!==i?(h&&(i=Math.round(i)),c&&c.block?a.render(c.block,b.push({isSelect:!0,isResolved:!1,selectKey:i})):a.write(i)):a}return _console.log("Key is a required parameter for math helper along with method/operand!"),a},select:function(a,b,c,d){var e=c.block;if(d&&"undefined"!=typeof d.key){var f=dust.helpers.tap(d.key,a,b);return e?a.render(c.block,b.push({isSelect:!0,isResolved:!1,selectKey:f})):(_console.log("Missing body block in the select helper "),a)}return _console.log("No key given in the select helper!"),a},eq:function(a,b,c,d){return d&&(d.filterOpType="eq"),filter(a,b,c,d,function(a,b){return b===a})},ne:function(a,b,c,d){return d?(d.filterOpType="ne",filter(a,b,c,d,function(a,b){return b!==a})):a},lt:function(a,b,c,d){return d?(d.filterOpType="lt",filter(a,b,c,d,function(a,b){return a>b})):void 0},lte:function(a,b,c,d){return d?(d.filterOpType="lte",filter(a,b,c,d,function(a,b){return a>=b})):a},gt:function(a,b,c,d){return d?(d.filterOpType="gt",filter(a,b,c,d,function(a,b){return b>a})):a},gte:function(a,b,c,d){return d?(d.filterOpType="gte",filter(a,b,c,d,function(a,b){return b>=a})):a},"default":function(a,b,c,d){return d&&(d.filterOpType="default"),filter(a,b,c,d,function(){return!0})},size:function(a,b,c,d){var e,f,g,h=0;if(d=d||{},e=d.key,e&&e!==!0)if(dust.isArray(e))h=e.length;else if(!isNaN(parseFloat(e))&&isFinite(e))h=e;else if("object"==typeof e){f=0;for(g in e)Object.hasOwnProperty.call(e,g)&&f++;h=f}else h=(e+"").length;else h=0;return a.write(h)}};dust.helpers=helpers}("undefined"!=typeof exports?module.exports=require("dustjs-linkedin"):dust);

/*
 * ! accounting.js v0.3.2, copyright 2011 Joss Crowcroft, MIT license,
 * http://josscrowcroft.github.com/accounting.js namespaced to dust, i.e.
 * dust.accounting
 */
(function(p,z){function q(a){return!!(""===a||a&&a.charCodeAt&&a.substr)}function m(a){return u?u(a):"[object Array]"===v.call(a)}function r(a){return"[object Object]"===v.call(a)}function s(a,b){var d,a=a||{},b=b||{};for(d in b)b.hasOwnProperty(d)&&null==a[d]&&(a[d]=b[d]);return a}function j(a,b,d){var c=[],e,h;if(!a)return c;if(w&&a.map===w)return a.map(b,d);for(e=0,h=a.length;e<h;e++)c[e]=b.call(d,a[e],e,a);return c}function n(a,b){a=Math.round(Math.abs(a));return isNaN(a)?b:a}function x(a){var b=c.settings.currency.format;"function"===typeof a&&(a=a());return q(a)&&a.match("%v")?{pos:a,neg:a.replace("-","").replace("%v","-%v"),zero:a}:!a||!a.pos||!a.pos.match("%v")?!q(b)?b:c.settings.currency.format={pos:b,neg:b.replace("%v","-%v"),zero:b}:a}var c={version:"0.3.2",settings:{currency:{symbol:"$",format:"%s%v",decimal:".",thousand:",",precision:2,grouping:3},number:{precision:0,grouping:3,thousand:",",decimal:"."}}},w=Array.prototype.map,u=Array.isArray,v=Object.prototype.toString,o=c.unformat=c.parse=function(a,b){if(m(a))return j(a,function(a){return o(a,b)});a=a||0;if("number"===typeof a)return a;var b=b||".",c=RegExp("[^0-9-"+b+"]",["g"]),c=parseFloat((""+a).replace(/\((.*)\)/,"-$1").replace(c,"").replace(b,"."));return!isNaN(c)?c:0},y=c.toFixed=function(a,b){var b=n(b,c.settings.number.precision),d=Math.pow(10,b);return(Math.round(c.unformat(a)*d)/d).toFixed(b)},t=c.formatNumber=function(a,b,d,i){if(m(a))return j(a,function(a){return t(a,b,d,i)});var a=o(a),e=s(r(b)?b:{precision:b,thousand:d,decimal:i},c.settings.number),h=n(e.precision),f=0>a?"-":"",g=parseInt(y(Math.abs(a||0),h),10)+"",l=3<g.length?g.length%3:0;return f+(l?g.substr(0,l)+e.thousand:"")+g.substr(l).replace(/(\d{3})(?=\d)/g,"$1"+e.thousand)+(h?e.decimal+y(Math.abs(a),h).split(".")[1]:"")},A=c.formatMoney=function(a,b,d,i,e,h){if(m(a))return j(a,function(a){return A(a,b,d,i,e,h)});var a=o(a),f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format);return(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal))};c.formatColumn=function(a,b,d,i,e,h){if(!a)return[];var f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format),l=g.pos.indexOf("%s")<g.pos.indexOf("%v")?!0:!1,k=0,a=j(a,function(a){if(m(a))return c.formatColumn(a,f);a=o(a);a=(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal));if(a.length>k)k=a.length;return a});return j(a,function(a){return q(a)&&a.length<k?l?a.replace(f.symbol,f.symbol+Array(k-a.length+1).join(" ")):Array(k-a.length+1).join(" ")+a:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=c;exports.accounting=c}else"function"===typeof define&&define.amd?define([],function(){return c}):(c.noConflict=function(a){return function(){p.accounting=a;c.noConflict=z;return c}}(p.accounting),p.accounting=c)})(dust);

/*
 * GroupBy Dust Helpers (Minified)
 */
!function(d){
	d.helpers.setData = function(a, b, c, e) {
		var f = dust.escapeHtml($.toJSON(e));
		return a.write('data-ui-autocomplete-item="' + f + '"')
	},
	d.helpers.generateId = function(a) {
		for (var b = ""; b.length < 10;)
			b += Math.random().toString(36).substr(2);
		return a.write('id="' + b.substr(0, 10) + '"')
	},
	d.helpers.formatNumber = function(a, b, c, e) {
		return n = e.n || 0, p = e.precision || 0, t = e.thousands || "",
				x = e.decimal || ".", a.write(d.accounting.formatNumber(n, p, t, x))
	};
}("undefined"!=typeof exports?module.exports=require("dustjs-linkedin"):dust);


/* ! jQuery JSON plugin v2.4.0 | github.com/Krinkle/jquery-json */
!function($){"use strict";var escape=/["\\\x00-\x1f\x7f-\x9f]/g,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},hasOwn=Object.prototype.hasOwnProperty;$.toJSON="object"==typeof JSON&&JSON.stringify?JSON.stringify:function(a){if(null===a)return"null";var b,c,d,e,f=$.type(a);if("undefined"===f)return void 0;if("number"===f||"boolean"===f)return String(a);if("string"===f)return $.quoteString(a);if("function"==typeof a.toJSON)return $.toJSON(a.toJSON());if("date"===f){var g=a.getUTCMonth()+1,h=a.getUTCDate(),i=a.getUTCFullYear(),j=a.getUTCHours(),k=a.getUTCMinutes(),l=a.getUTCSeconds(),m=a.getUTCMilliseconds();return 10>g&&(g="0"+g),10>h&&(h="0"+h),10>j&&(j="0"+j),10>k&&(k="0"+k),10>l&&(l="0"+l),100>m&&(m="0"+m),10>m&&(m="0"+m),'"'+i+"-"+g+"-"+h+"T"+j+":"+k+":"+l+"."+m+'Z"'}if(b=[],$.isArray(a)){for(c=0;c<a.length;c++)b.push($.toJSON(a[c])||"null");return"["+b.join(",")+"]"}if("object"==typeof a){for(c in a)if(hasOwn.call(a,c)){if(f=typeof c,"number"===f)d='"'+c+'"';else{if("string"!==f)continue;d=$.quoteString(c)}f=typeof a[c],"function"!==f&&"undefined"!==f&&(e=$.toJSON(a[c]),b.push(d+":"+e))}return"{"+b.join(",")+"}"}},$.evalJSON="object"==typeof JSON&&JSON.parse?JSON.parse:function(str){return eval("("+str+")")},$.secureEvalJSON="object"==typeof JSON&&JSON.parse?JSON.parse:function(str){var filtered=str.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"");if(/^[\],:{}\s]*$/.test(filtered))return eval("("+str+")");throw new SyntaxError("Error parsing JSON, source is not valid.")},$.quoteString=function(a){return a.match(escape)?'"'+a.replace(escape,function(a){var b=meta[a];return"string"==typeof b?b:(b=a.charCodeAt(),"\\u00"+Math.floor(b/16).toString(16)+(b%16).toString(16))})+'"':'"'+a+'"'}}(jQuery);


/*
 * SAYT Widget Definition
 */
$.widget('custom.sayt', $.ui.autocomplete, {
	options: {
		// Triggers
		selectSearchTerm: function (data) {
		},
		selectNavigation: function (data) {
		},
		selectProduct: function (data) {
		},

		// SAYT Options
		domain: '',

		// Search Params - Common
		collection: '',

		// Search Params - Autocomplete
		customerId: '',
		numSearchTerms: 5,
		numNavigations: 5,
		sortAlphabetically: false,

		// Search Params - Product
		area: 'Simple',
		numProducts: 4,
		shouldSearchSuggestionFirst: true,
		hideNoProductsMessage: false,

		// Template Options
		autocompleteTemplate: 'autocompleteTemplate.dust',
		productTemplate: 'productTemplate.dust',
		delay: 250,

		// jQuery Autocomplete Options
		minLength: 3,
		source: function (request, callback) {
			$.getJSON(this._getUrl('/autocomplete?callback=?'), {
				q: request.term,
				c: this._getValue(this.options.customerId),
				s: this._getValue(this.options.collection),
				si: this.options.numSearchTerms,
				ni: this.options.numNavigations,
				al: this.options.sortAlphabetically
			}).done(function (json) {
				callback(json);
			}).fail(function () {
				callback({});
			});
		}
	},

	// Parent Overrides
	_init: function () {
		this.lastFocusedId;
		this.productSearchTimer;
		this.spacePressed = false;
		this.element.context.sayt = this;

		var self = this;
		this.element.keydown(function (event) {
			self._focus(false);
			if (event.keyCode === 32) {
				self.spacePressed = true;
			}
		});

		this.options.focus = function (event, ui) {
			event.preventDefault();
			var item = ui.item;
			if(item === undefined){
				event.stopImmediatePropagation();
			} else if (item.type === 'searchTerm') {
				this.sayt._focusChange(item.value, null, event, item);
			} else if (item.type === 'navigation') {
				this.sayt._focusChange(null, '~' + item.category + '='
						+ item.value, event, item);
			}
		};
		this.options.select = function (event, ui) {
			event.preventDefault();
			var item = ui.item;
			if (item.type === 'searchTerm') {
				this.sayt.options.selectSearchTerm(item);
			} else if (item.type === 'navigation') {
				this.sayt.options.selectNavigation(item);
			} else if (item.type === 'product') {
				this.sayt.options.selectProduct(item);
			}
		};

		this._loadDust(this.options.autocompleteTemplate);
		this._loadDust(this.options.productTemplate);
	},
	_destroy: function () {
		this._clearTimeout();
		this._super('_destroy');
	},
	_suggest: function( items ) {
		var ul = this.menu.element.empty();
		this._renderMenu( ul, items );
		this.isNewMenu = true;
		this.menu.refresh();

		// size and position menu
		ul.css('top', 0);
		ul.css('left', 0);
		this._resizeMenu();
		if ( this.options.autoFocus ) {
			this.menu.next();
		}

		this._styleCleanup();
	},
	_renderMenu: function (ul, items) {
		if(!this._hasValue(items,'stats')){
		    return;
		}

		if (items[0].stats.searchCount > 0) {
			dust.render(this.options.autocompleteTemplate, {
				items: items
			}, function (err, out) {
				ul.css('z-index', '1000000');
				ul.attr('id', 'sayt-menu');
				ul.append(out);
			});
		}

		if (!this.options.shouldSearchSuggestionFirst) {
			this._searchProduct(this.element.val());
		} else if (items[0].stats.searchCount == 0) {
			this._searchProduct(this.element.val());
		} else if (items[0].stats.searchCount > 0) {
			this._searchProduct(items[0].searchTerms[0].value);
		}
	},

	// Private Helper Methods
	_getUrl: function (url) {
		return this.options.domain + url;
	},
	_loadDust: function (filename) {
		$.getScript(this._getUrl('/template?file=' + filename), function (data) {
			dust.loadSource(data);
		});
	},
	_clearTimeout: function () {
		this.productSearchTimer || clearTimeout(this.productSearchTimer);
	},
	_styleCleanup: function () {
		var el = this.element;
		var ul = this.menu.element;
		if(ul.children().length == 0){
			ul.hide();
		} else {
			var autocompletes = ul.find('.ui-menu-item').not('.sayt-product-content');
			if (autocompletes.length == 0) {
				ul.find('.ui-menu-divider').remove();
			}
            ul.position( $.extend({of: el}, this.options.position ) );
			ul.show();
		}
	},
	_focus: function (enable, newId) {
		if (typeof newId !== 'undefined') {
			this.lastFocusedId = newId;
		}
		if (typeof this.lastFocusedId !== 'undefined') {
			var lf = $('#' + this.lastFocusedId);
			(enable ? lf.addClass : lf.removeClass)('ui-state-focus');
		}
	},
	_focusChange: function (searchTerm, refinements, event, item) {
		this._focus(false);
		if (typeof event.keyCode !== 'undefined') { // using keyboard
			this._focus(true, item.id);
			this.element.val(item.value);
			this._searchProduct(searchTerm, refinements);
		}
	},
	_searchProduct: function (searchTerm, refinements) {
		if (this.spacePressed) {
			this._searchProductWithClearedTimer(searchTerm, refinements);
		} else {
			this._clearTimeout();
			var self = this;
			this.productSearchTimer = setTimeout(function () {
				self._searchProductWithClearedTimer(searchTerm, refinements);
			}, this.options.delay);
		}
	},
	_getValue: function (obj) {
		return $.isFunction(obj) ? obj() : obj;
	},
	_searchProductWithClearedTimer: function (searchTerm, refinements) {
		this._clearTimeout();
		this.spacePressed = false;
		var self = this;

		$.getJSON(this._getUrl('/productSearch?callback=?'), {
			q: searchTerm,
			r: refinements,
			s: this._getValue(this.options.collection),
			a: this.options.area,
			pi: this.options.numProducts
		}, function (data) {
			var ul = $(self.menu.element);
			ul.find('.sayt-product-content').remove();
			if(self.options.hideNoProductsMessage &&
					($.isEmptyObject(data) || $.isEmptyObject(data[0]))){
				// do nothing
			} else {
				
				if(ul.is(":visible"))
				{
					dust.render(self.options.productTemplate, {
						items: data
					}, function (err, out) {
						ul.append(out);
					});
					self._styleCleanup();
				}
			}
		});
	},
	_hasValue: function(array, property) {
        if (array.length > 0) {
            for (i = 0; i < array.length; i++) {
                if (array[i][property] === undefined) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }
});