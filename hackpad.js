var fs = require('fs');
var _ = require('lodash');

var Hackpad = require('hackpad');

var keys = require('./keys').hackpad;

function hackpad() {
	var client_id = keys.client_id
	var secret = keys.secret;

	var options = {
		site: 'advocate',
	};

	return new Hackpad(client_id, secret, options);
}


var client = hackpad();
var last
var timestamp = new Date.now() / 1000 | 0;

//works better than list
client.editedSince(timestamp, function(err, ids) {
	_.forEach(ids, function(id) {
		client.export(id, 'latest', 'md', function(err, body) {
			fs.writeFileSync(`pads/${id}.md`, body);
		})
	})
});


// // request
// var path, method, headers, body;
// client.request(path, method, headers, body, function(err, response) {
// 	console.log(err, response)
// });

// // get
// var path;
// client.get(path, function(err, response) {
// 	console.log(err, response)
// });

// // post
// var path, headers, body;
// client.post(path, headers, body, function(err, response) {
// 	console.log(err, response)
// });

// // create
// var body, contentType;
// client.create(body, contentType, function(err, response) {
// 	console.log(err, response)
// });

// // import
// var padId, body, contentType;
// client.import(padId, body, contentType, function(err, response) {
// 	console.log(err, response)
// });

// // revert
// var padId, revisionId;
// client.revert(padId, revisionId, function(err, response) {
// 	console.log(err, response)
// });

// // export
// var padId, revisionId, format;
// client.export(padId, revisionId, format, function(err, response) {
// 	console.log(err, response)
// });

// // editedSince
// var timestamp;


// // revisions
// var padId;
// client.revisions(padId, function(err, response) {
// 	console.log(err, response)
// });

// // options
// var padId;
// client.options(padId, function(err, response) {
// 	console.log(err, response)
// });

// // revokeAccess
// var padId, email;
// client.revokeAccess(padId, email, function(err, response) {
// 	console.log(err, response)
// });

// // removeUser
// var email;
// client.removeUser(email, function(err, response) {
// 	console.log(err, response)
// });

// // setEmailEnabled
// var email, setting;
// client.setEmailEnabled(email, setting, function(err, response) {
// 	console.log(err, response)
// });

// // search
// var terms, start, limit;
// client.search(terms, start, limit, function(err, response) {
// 	console.log(err, response)
// });