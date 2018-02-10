const Rapptor = require('rapptor');
const tap = require('tap');
/*
tap.test('can start instance', async(t) => {
  const rapptor = new Rapptor({ configPrefix: 'reporter' });
  await rapptor.start();
  await rapptor.stop();
  t.end();
});

tap.test('addReport is method', async(t) => {
  const rapptor = new Rapptor({ configPrefix: 'reporter' });
  await rapptor.start();
  await rapptor.stop();
  t.equals(typeof rapptor.server.methods.addReport, 'function');
  t.end();
});

tap.test('addReport exposes route', async (t) => {
  const rapptor = new Rapptor({ configPrefix: 'reporter' });
  await rapptor.start();
  rapptor.server.methods.addReport('test', () => ({ status: 'ok' }));
  const { payload } = await rapptor.server.inject({ url: '/test' });
  t.equals(payload, JSON.stringify({ status: 'ok' }));
  await rapptor.stop();
  t.end();
});

tap.test('set args', async (t) => {
  const rapptor = new Rapptor({ configPrefix: 'reporter' });
  await rapptor.start();
  rapptor.server.methods.setArgs({ arg1: true }, { arg2: true });
  rapptor.server.methods.addReport('test', (arg1, arg2) => ({ arg1, arg2 }));
  const { payload } = await rapptor.server.inject({ url: '/test' });
  t.equals(payload, JSON.stringify({ arg1: { arg1: true }, arg2: { arg2: true } }));
  await rapptor.stop();
  t.end();
});

tap.test('addReport csv', async (t) => {
  const rapptor = new Rapptor({ configPrefix: 'reporter' });
  await rapptor.start();
  rapptor.server.methods.addReport('test', () => ({ status: 'ok' }));
  const { payload } = await rapptor.server.inject({ url: '/test.csv' });
  t.equals(payload, '"status"\n"ok"');
  await rapptor.stop();
  t.end();
});

tap.test('addReport html', async (t) => {
  const rapptor = new Rapptor({ configPrefix: 'reporter' });
  await rapptor.start();
  rapptor.server.methods.addReport('test', () => ({ status: 'ok' }));
  const { payload } = await rapptor.server.inject({ url: '/test.html' });
  t.equals(payload, `<table>
<tr><th>status</th></tr>
<tr><td>ok</td></tr>
</table>`);
  await rapptor.stop();
  t.end();
});

tap.test('loads reports from file', async (t) => {
  const rapptor = new Rapptor({
    configPrefix: 'reporter',
  });
  await rapptor.start();
  const { payload } = await rapptor.server.inject({ url: '/testreport.csv' });
  t.equals(payload, '"status"\n"ok"');
  await rapptor.stop();
  t.end();
});
*/
tap.test('can save things to s3', async (t) => {
  const rapptor = new Rapptor({
    configPrefix: 'reporter',
  });
  await rapptor.start();
  rapptor.server.uploadToS3('reporter_test', 'this is some stuff I am saving');
  await rapptor.stop();
  t.end();
});
