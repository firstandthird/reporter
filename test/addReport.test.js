const Rapptor = require('rapptor');
const tap = require('tap');

tap.test('can start instance', async(t) => {
  const rapptor = new Rapptor({});
  await rapptor.start();
  await rapptor.stop();
  t.end();
});

// tap.test('setArgs fn', async(t) => {
//   const rapptor = new Rapptor({});
//   await rapptor.start();
//   await rapptor.stop();
//   t.equals(typeof rapptor.m.setArgs, 'function');
//   t.end();
// });

tap.test('addReport is method', async(t) => {
  const rapptor = new Rapptor({});
  await rapptor.start();
  await rapptor.stop();
  t.equals(typeof rapptor.server.methods.addReport, 'function');
  t.end();
});

tap.test('addReport exposes route', async (t) => {
  const rapptor = new Rapptor({});
  await rapptor.start();
  rapptor.server.methods.addReport('test', () => ({ status: 'ok' }));
  const { payload } = await rapptor.server.inject({ url: '/test' });
  t.equals(payload, JSON.stringify({ status: 'ok' }));
  await rapptor.stop();
  t.end();
});

tap.test('set args', async (t) => {
  const rapptor = new Rapptor({});
  await rapptor.start();
  rapptor.server.methods.setArgs({ arg1: true }, { arg2: true });
  rapptor.server.methods.addReport('test', (arg1, arg2) => ({ arg1, arg2 }));

  const { payload } = await rapptor.server.inject({ url: '/test' });
  t.equals(payload, JSON.stringify({ arg1: { arg1: true }, arg2: { arg2: true } }));
  await rapptor.stop();
  t.end();
});
/*
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
*/
