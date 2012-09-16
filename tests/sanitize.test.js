var test = require('tap').test;
var sanitize = require('../');

var endpoint = process.env['ENDPOINT'];
if (endpoint)
  sanitize.setEndpoint(endpoint);

test('sanitize: given no html, should be the same', function (t) {
  var str = 'what';
  sanitize(str, function (err, safe) {
    t.notOk(err, 'should not have an error');
    t.same(safe, str, 'should be the same');
    t.end();
  });
});

test('sanitize: given safe html, should be the same', function (t) {
  var str = '<strong>what</strong>';
  sanitize(str, function (err, safe) {
    t.notOk(err, 'should not have an error');
    t.same(safe, str, 'should be the same');
    t.end();
  });
});

test('sanitize: given unsafe html, should be different', function (t) {
  var input = '<script>what</script>';
  var expect = '&lt;script&gt;what&lt;/script&gt;';
  sanitize(input, function (err, safe) {
    t.notOk(err, 'should not have an error');
    t.same(safe, expect, 'should get safe html');
    t.end();
  });
});

test('sanitize: given a tag list, should respect', function (t) {
  var input = '<script>what</script>';
  sanitize({ text: input, tags: ['script'] }, function (err, safe) {
    t.notOk(err, 'should not have an error');
    t.same(safe, input, 'should get same thing back');
    t.end();
  });
});

test('sanitize: strip attrs by default', function (t) {
  var input = '<strong title="awesome">what</strong>';
  var expect = '<strong>what</strong>';
  sanitize({ text: input }, function (err, safe) {
    t.notOk(err, 'should not have an error');
    t.same(safe, expect, 'should get attr-less html');
    t.end();
  });
});

test('sanitize: allow attrs when specificed', function (t) {
  var input = '<strong title="awesome">what</strong>';
  sanitize({ text: input, attributes: { strong: ['title'] } }, function (err, safe) {
    t.notOk(err, 'should not have an error');
    t.same(safe, input, 'should get attr-less html');
    t.end();
  });
});

test('sanitize: strips comments', function (t) {
  var input = '<!-- sup -->';
  sanitize({ text: input, attributes: { strong: ['title'] } }, function (err, safe) {
    t.notOk(err, 'should not have an error');
    t.same(safe, '', 'should get commentless html');
    t.end();
  });
});

test('sanitize: strips comments unless specified not to', function (t) {
  var input = '<!-- sup -->';
  sanitize({ text: input, stripComments: false }, function (err, safe) {
    t.notOk(err, 'should not have an error');
    t.same(safe, input, 'should get commentfull html');
    t.end();
  });
});

test('sanitize: should get an error with bad input', function (t) {
  var input = 'whaaaaaaaat';
  sanitize({ text: input, attributes: {strong: 'huh'} }, function (err, safe) {
    t.ok(err, 'should have an error');
    t.ok(err.message.match(/invalid type/), 'should get the right message');
    t.end();
  });
});
