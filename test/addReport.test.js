const tap = require('tap');
const Reporter = require('../');

tap.test('addReport is method', (t) => {
  const reporter = new Reporter();
  t.equals(typeof reporter.addReport, 'function');
  t.end();
});

tap.test('addReport exposes route', async (t) => {
  const reporter = new Reporter();
  reporter.addReport('test', () => ({ status: 'ok' }));

  await reporter.start();
  const { payload } = await reporter.server.inject({ url: '/test' });
  t.equals(payload, JSON.stringify({ status: 'ok' }));
  await reporter.stop();
  t.end();
});

tap.test('set args', async (t) => {
  const reporter = new Reporter();
  reporter.setArgs({ arg1: true }, { arg2: true });
  reporter.addReport('test', (arg1, arg2) => ({ arg1, arg2 }));

  await reporter.start();
  const { payload } = await reporter.server.inject({ url: '/test' });
  t.equals(payload, JSON.stringify({ arg1: { arg1: true }, arg2: { arg2: true } }));
  await reporter.stop();
  t.end();
});

tap.test('addReport csv', async (t) => {
  const reporter = new Reporter();
  reporter.addReport('test', () => ({ status: 'ok' }));

  await reporter.start();
  const { payload } = await reporter.server.inject({ url: '/test.csv' });
  t.equals(payload, '"status"\n"ok"');
  await reporter.stop();
  t.end();
});
tap.test('addReport html', async (t) => {
  const reporter = new Reporter();
  reporter.addReport('test', () => ({ status: 'ok' }));

  await reporter.start();
  const { payload } = await reporter.server.inject({ url: '/test.html' });
  t.equals(payload, `<table>
<tr><th>status</th></tr>
<tr><td>ok</td></tr>
</table>`);
  await reporter.stop();
  t.end();
});
