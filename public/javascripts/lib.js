pmt.Cookie = function() {
 
	this.set = function (name, value, seconds) {
		var expires;
		if (typeof(seconds) != 'undefined') {
			var date = new Date();
			date.setTime(date.getTime() + (seconds*1000));
			expires = "; expires=" + date.toGMTString();
		}
		else {
			expires = "";
		}
 
		document.cookie = name+"="+value+expires+"; path=/";
	};
 
	this.get = function (name) {
 
		name = name + "=";
		var carray = document.cookie.split(';');
 
		for(var i=0;i < carray.length;i++) {
			var c = carray[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
		}
 
		return null;
	};
 
	this.del = function (name) {
		this.set(name, "", -1);
	};
 
};

pmt.cookie = new pmt.Cookie();
