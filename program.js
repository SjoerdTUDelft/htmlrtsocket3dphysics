http = require('http');
concat = require('concat-stream');
http.get(process.argv[2],(function (response) {

	response.setEncoding('utf8');
	
	var len = 0;
	var string = "";
	var z =response.pipe(concat(function (data,err) {
	
	data.toString();
		string += data;
		len += data.length;
		console.log(len);
	console.log(string);
		
	}))

 
		//z.end();
	//console.log(z);
	/*
	response.on("data", function(data) {
		console.log(data);
	});
	*/
	
	
}));