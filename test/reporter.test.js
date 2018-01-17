const tap = require('tap');
const Reporter = require('../');

tap.test('reporter constructor', (t) => {
  new Reporter();
  t.end();
});

tap.test('sets up server', (t) => {
  const reporter = new Reporter();
  t.equals(typeof reporter.server, 'object');
  t.end();
});

tap.test('setArgs fn', (t) => {
  const reporter = new Reporter();
  t.equals(typeof reporter.setArgs, 'function');
  t.end();
});

tap.test('start fn', (t) => {
  const reporter = new Reporter();
  t.equals(typeof reporter.start, 'function');
  t.end();
});
