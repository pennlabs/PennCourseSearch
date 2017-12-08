module.exports = function(AB, AT, IFTTT) {
	var request = require('request');
	var parse = require('./parse.js');
	var opendata = {};

	var IFTTTMaker = require('iftttmaker')(IFTTT);
	function SendError(errmsg) { // Send an email to Ben through IFTTT when there is a server error
		IFTTTMaker.send('PCSError', errmsg).then(function () {
		}).catch(function (error) {
		  console.log('The error request could not be sent:', error);
		});
	}

	// API should limit to 100 requests a minute -> 600 ms between requests
	function SendPennReq(url, resultType, res) {
		request({
			uri: url,
			method: "GET",headers: {"Authorization-Bearer": AB, "Authorization-Token": AT}, // Send authorization headers
		}, function(error, response, body) {
			if (error || response.statusCode >= 500) {
				// This is triggered if the OpenData API returns an error or never responds
				console.log(JSON.stringify(response));
				console.log('OpenData Request failed:', error);
				SendError('OpenData Request failed');
				res.statusCode = 512; // Reserved error code to tell front end that its a Penn InTouch problem, not a PCS problem
				return res.send('PCSERROR: request failed');
			}

			var parsedRes, rawResp = {};
			try { // Try to make body into valid JSON
				rawResp = JSON.parse(body);
				if (rawResp.statusCode) {
					SendError('Status Code');
					res.statusCode = 512; // Reserved error code to tell front end that its a Penn InTouch problem, not a PCS problem
					return res.send('status code error');
				}
			} catch(err) { // Could not parse the JSON for some reason
				console.log('Resp parse error ' + err);
				SendError('Parse Error!!!');
				console.log(JSON.stringify(response));
				return res.send({});
			}

			try {
				if (rawResp.service_meta.error_text) { // If the API returned an error
					console.log('Resp Err: ' + rawResp.service_meta.error_text);
					SendError('Error Text');
					res.statusCode = 513; // Reserved error code to tell front end that its a Penn InTouch problem, not a PCS problem
					return res.send(rawResp.service_meta.error_text);
				}
				parsedRes = rawResp.result_data;
			} catch(err) {
				console.log(err);
				SendError('Other Error!!!');
				res.statusCode = 500;
				return res.send(err);
			}
			RouteAPIResp(resultType, parsedRes, res)
		});
	}

	function RouteAPIResp(resultType, parsedRes, res) { // Send the raw data to the appropriate formatting function
		var resultTypes = {
			deptSearch: parse.CourseList,
			numbSearch: parse.SectionList,
			sectSearch: parse.SectionInfo,
			schedInfo:  parse.SchedInfo,
			registrar:  parse.RecordRegistrar
		};

		var searchResponse;
		if (resultType in resultTypes) {
			searchResponse = resultTypes[resultType](parsedRes);
		} else {
			searchResponse = {};
		}
		if (res) {return res.send(JSON.stringify(searchResponse));} // return correct info
	}

	var rpm = 95;

	opendata.RateLimitReq = function(url, resultType, res, lastRT) {
		var period = 60 / rpm;
		var now = new Date().getTime();
		var diff = now - lastRT; // how long ago was the last request point
		var delay = (period - diff) * (diff < period); // How long to delay the request (if diff is > period, no need to delay)
		var lastRequestTime = now+delay; // Update the latest request timestamp

		setTimeout(function() {
			SendPennReq(url, resultType, res) // Send the request after the delay
		}, delay);
		return lastRequestTime;
	}

	return opendata
}