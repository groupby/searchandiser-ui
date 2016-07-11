// Act-On Beacon Library copyright © Act-On Software

(function() {
	window['ActOn'] = window['ActOn'] || {};
	ActOn.Beacon = ActOn.Beacon || {};
	ActOn.Beacon.q = ActOn.Beacon.q || [];

	ActOn.Beacon.mode = ActOn.Beacon.mode || (function() {
		var beaconMode = 0;
		return function(mode) {
			if (mode != null && mode != undefined) {
				beaconMode = Math.max(beaconMode, mode);
			} else {
				return beaconMode;
			}
		};
	})();

	ActOn.Beacon.optIn = ActOn.Beacon.optIn || (function() {
		var optIn = 0;
		return function() {
			if (this.mode() < 1) return true;
			else if (this.mode() === 3) return false;
			else {
				var now = +new Date();
				var expiry = new Date();
				expiry.setDate(expiry.getDate() + 365);
				expiry = expiry.toUTCString();
				if (document.cookie.indexOf('ao_optin=') >= 0) {
					document.cookie = "ao_optin=" + now + ";path=/;expires=" + expiry;
					optIn = 1;
				} else if (document.cookie.indexOf('ao_optout=') >= 0) {
					document.cookie = "ao_optout=" + now + ";path=/;expires=" + expiry;
					optIn = -1;
				}
				if (optIn === 0) {
					if (confirm("This site would like to place a cookie on your browser to help us better deliver relevant and valuable content to you.")) {
						document.cookie = "ao_optin=" + now + ";path=/;expires=" + expiry;
						optIn = 1;
					} else {
						if (this.mode() < 2) document.cookie = "ao_optout=" + now + ";path=/;expires=" + expiry;
						optIn = -1;
					}
				}
				return optIn > 0;
			}
		};
	})();
	
	var buildParameters = function(resource, event, timestamp) {
		event = event || 'page';
		var parameters = "?ref=" + encodeURIComponent(document.referrer) + "&v=2&ts=" + timestamp + "&nc=" + (ActOn.Beacon.optIn() ? "0" : "1");
		if (resource) {
			if (event == 'page') {
				parameters += "&page=" + encodeURIComponent(resource);
			}
		}
		return parameters;
	};
	
	ActOn.Beacon.account = ActOn.Beacon.account || (function() {
		var accounts = {};
		return function(id, mode, target) {
			if (id) {
				if (target) {
					this.mode(mode);
					if (!accounts[id]) {
						for (var i = 0; i < this.q.length; i++) {
							var image = new Image();
							image.src = target + buildParameters(this.q[i].r, this.q[i].e, this.q[i].t);
						}
					}
					accounts[id] = {mode: mode, target: target};
				} else {
					return accounts[id];
				}
			} else {
				return accounts;
			}
		};
	})();
	ActOn.Beacon.account(19145, 0, '//info.schoolspecialtynews.com/acton/bn/19145');
	
	ActOn.Beacon.track = function(resource, event, timestamp) {
		timestamp = timestamp || +new Date();
		var parameters = buildParameters(resource, event, timestamp);
		for (var id in this.account()) {
			var image = new Image();
			image.src = this.account(id).target + parameters;
		}
		this.q.push({r: resource, e: event, t: timestamp});
	};
	
})();

ActOn.Beacon.cookie = ActOn.Beacon.cookie || {};
ActOn.Beacon.cookie['19145'] = '7bb1874c-0d48-47e7-93fe-19d1cc5dfe19';