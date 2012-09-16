var util = require('util');
var url = require('url');
var http = require('http');

var SANITIZATION_ENDPOINT = 'http://htmlsanitizer.org';

function sanitize(stringOrOptions, callback) {
  var options = stringOrOptions;
  if (typeof stringOrOptions === 'string')
    options = { text: stringOrOptions };
  sanitize.request(options, callback)
}
sanitize.ENDPOINT = SANITIZATION_ENDPOINT;

sanitize.request = function request(options, callback) {
  var json = sanitize.prepareJson(options);
  var endpoint = options.endpoint || sanitize.ENDPOINT;
  var requestOptions = url.parse(endpoint);
  requestOptions.headers = {
    'Content-Type': 'application/json',
    'Content-Length': json.length
  };
  requestOptions.method = 'POST';
  http.request(requestOptions, function (res) {
    var fullResponse = '';
    res.on('data', function (buf) { fullResponse += buf });
    res.on('end', function () {
      var status = res.statusCode;
      if (status !== 200)
        return handleError(status, callback);
      return callback(null, fullResponse)
    });
  }).on('error', function (err) {
    return callback(err);
  }).write(json);
};

sanitize.setEndpoint = function setEndpoint(endpoint) {
  return sanitize.ENDPOINT = endpoint;
};

sanitize.prepareJson = function prepareJson(options) {
  var result = Object.keys(options).reduce(function (accum, key) {
    accum[toUnderscore(key)] = options[key];
    return accum;
  }, {})
  return JSON.stringify(result);
};

function handleError(status, callback) {
  var msg = 'Request returned %s: %s ';
  var err = new Error(util.format(msg, status, fullResponse));
  return callback(err);
};

function toUnderscore(input) {
  var expression = /([a-z])([A-Z])/g;
  return input.replace(expression, function (_, lower, upper) {
    return lower + '_' + upper.toLowerCase();
  });
}

module.exports = sanitize