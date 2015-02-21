var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var csp = require('js-csp');

var Quip = require('./lib/quip');
var keys = require('./keys').quip;

var accessToken = keys.access_token;


// Channels (API, Folder, Thread)
var chQuip = csp.chan(100);
var chF = csp.chan(10);
var chT = csp.chan(10);

// Works Like this:
// chQuip is a bufferred channel with all remaining requests.
// caller() gradually sends the requests in the chQuip queue (to avoid exceeding api limits)
// fetchFolder() and fetchThreads() makes the actual API call
// if they fail, requeue in chQuip
// if they succeed, put data into chF/chT for response processing
// folderConsumer/threadConsumer waits the data in chF/chT, saves files/folders, and makes recursive calls to chQuip.


var requests = 0;

function inc() {
    requests++;
}

function dec() {
    requests--;
}

function checkDone(log) {
    console.log(`Got ${log}. ${requests} remaining`)
    if (requests === 0) {
        chQuip.close()
        chF.close()
        chT.close()
    }
}

// Consumes Successful API getFolder Responses
function* folderConsumer() {
	for(;;) {

        // when data available
		var data = yield csp.take(chF);
		if (data === csp.CLOSED) break;

        dec();

        // Create Subdirectory
	    var dir = path.resolve(data.dir, _.kebabCase(data.folder.title));

	    if (!fs.existsSync(dir)) {
	    	fs.mkdirSync(dir);
		    fs.writeFileSync(`${dir}/_folder.json`, JSON.stringify(data, null, 4));
	    }

        // Parse Data
	    var children = _.partition(data.children, 'folder_id');
	    var folders = _.map(children[0], function(v) { return v.folder_id; });
	    var threads = _.map(children[1], function(v) { return v.thread_id; });

        // put api calls for subfolders and threads into caller channel
        if (threads.length !== 0) {
            inc();
	       yield csp.put(chQuip, [fetchThreads, threads, dir]);
        }

	    for (var i = folders.length - 1; i >= 0; i--) {
            inc();
		    yield csp.put(chQuip, [fetchFolder, folders[i], dir]);
	    };

        checkDone(`${dir}/_folder.json`);
	}
}

// Consumes Successful API getThread Responses
function* threadConsumer() {
	for(;;) {

        // when data available
		var thread = yield csp.take(chT);
		if (thread === csp.CLOSED) break;

        dec();

		var data = thread.data;
		var dir = thread.dir;

        // Save Response
		fs.writeFileSync(`${dir}/_threads.json`, JSON.stringify(data, null, 4));

        // Save HTML
		_.forEach(data, function(doc) {
			var file = path.resolve(dir, _.kebabCase(doc.thread.title) + '.html');
			fs.writeFileSync(file, doc.html);
		});

        checkDone(`${dir}/_threads.json`);
	}

	console.log('Threads Processed');
}


function fetchFolder(id, dir) {
	client.getFolder(id, function(err, data) {
		csp.go(function* () {
			if (err) {
				console.error('Error for folder %s', id);
                failing = true;
				yield csp.put(chQuip, [fetchFolder, id, dir]);
				return false;
			}
			data.dir = dir;
			yield csp.put(chF, data);
		});
    });
}

function fetchThreads(ids, dir) {
	client.getThreads(ids, function(err, data) {
		csp.go(function* () {
			if (err) {
				console.error('Error fetchin threads', ids);
                failing = true;
				yield csp.put(chQuip, [fetchThreads, ids, dir]);
				return false;
			}
			yield csp.put(chT, {data: data, dir: dir});
		});
	});
}

var failing = false;

function* caller() {
	for(;;) {

        // get next request, when available
		var requests = yield csp.take(chQuip);
		if (requests === csp.CLOSED) break;

        if (failing) {
            yield csp.timeout(20000);
            failing = false;
		}

        // convert [fn, arg, arg, arg ...] and execute
		var fn = requests[0];
		var args = requests.slice(1);
		_.spread(fn)(args);
		yield csp.timeout(3000);
	}

	console.log('Calls Processed');
}

// API Client
var client = new Quip.Client({accessToken: accessToken});

// Main Entry
client.getAuthenticatedUser(function(err, user) {
	if (err) {
		console.error(err);
		return;
	}

    // start channel consumers
	csp.go(caller);
	csp.go(folderConsumer);
	csp.go(threadConsumer);

    inc();
    fetchFolder(user.desktop_folder_id, 'quip');
});