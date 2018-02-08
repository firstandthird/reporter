const tap = require('tap');
const Reporter = require('../');

tap.test('reporter constructor', (t) => {
  new Reporter();
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

tap.test('reporter wraps server', async (t) => {
  const reporter = new Reporter();
  reporter.setArgs({
    client: 'client',
    auth: 'auth'
  });
  reporter.addReport('test', () => ({ status: 'ok' }));
  await reporter.start();
  const { payload } = await reporter.rapptor.server.inject({ url: '/test' });
  await reporter.stop();
  t.equals(payload, '"status"\n"ok"');
  t.end();
});
