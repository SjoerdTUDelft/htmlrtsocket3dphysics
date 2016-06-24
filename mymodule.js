	      var fs = require('fs');
	  var path = require('path');
	 
	 module.exports = function(location,extension,func) {

		
		var ext =  '.' + extension;
		 fs.readdir(location, (function(err,data ) {
		 
			if(err) {
				return func(err,k);
			}
			var k = [];
			for(var i = 0; i < data.length; i ++) {
				if(path.extname(data[i]) == ext) {
					k.push(data[i]);
				}
			}
			
			func(err, k);
		}))


	
	 }