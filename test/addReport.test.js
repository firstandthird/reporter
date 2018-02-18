const Rapptor = require('rapptor');
const tap = require('tap');
const os = require('os');

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
  t.equals(payload, `"status"${os.EOL}"ok"`);
  await rapptor.stop();
  t.end();
});

tap.test('addReport html', async (t) => {
  const rapptor = new Rapptor({ configPrefix: 'reporter' });
  await rapptor.start();
  rapptor.server.methods.addReport('test', () => ({ status: 'ok' }));
  const { payload } = await rapptor.server.inject({ url: '/test.html' });
  t.equals(payload, `<table>${os.EOL}<tr><th>status</th></tr>${os.EOL}<tr><td>ok</td></tr>${os.EOL}</table>`);
  await rapptor.stop();
  t.end();
});

tap.test('reports can have caching', async (t) => {
  const rapptor = new Rapptor({ configPrefix: 'reporter' });
  await rapptor.start();
  let count = 0;
  let cacheSetup = false;
  const testMethod = {
    method() {
      count++;
      return { count };
    },
    options: {
      cache: (serverToCache, options) => {
        cacheSetup = true;
        return {
          expiresIn: 1000,
          generateTimeout: 500
        };
      }
    }
  };
  rapptor.server.methods.addReport('test', testMethod);
  t.equal(cacheSetup, true, 'calls options.cache to set up server cache');
  const response1 = await rapptor.server.inject({ method: 'get', url: '/test.csv' });
  const response2 = await rapptor.server.inject({ method: 'get', url: '/test.csv' });
  t.equal(count, 1, 'only calls the method once');
  t.equal(response1.payload, response2.payload, 'caches results from previous call');
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  await wait(2000);
  const response3 = await rapptor.server.inject({ method: 'get', url: '/test.csv' });
  t.notEqual(response1.payload, response3.payload, 'refreshes cache after expiresIn has elapsed');
  t.equal(count, 2, 'refreshes cache after expiresIn has elapsed');
  await rapptor.stop();
  t.end();
});

tap.test('auto-load reports from file', async (t) => {
  const rapptor = new Rapptor({
    configPrefix: 'reporter',
  });
  await rapptor.start();
  const { payload } = await rapptor.server.inject({ url: '/testreport.csv' });
  t.equals(payload, `"status"${os.EOL}"ok"`);
  await rapptor.stop();
  t.end();
});

// This test just verifies that calls to uploadToS3 don't throw errors.
// You may want to verify the reporter_test.csv and .html files were uploaded to your bucket:
tap.test('can save things to s3', async (t) => {
  const rapptor = new Rapptor({
    configPrefix: 'reporter',
  });
  await rapptor.start();
  await rapptor.server.uploadToS3('reporter_test.csv', 'this,is,some,stuff,I,am,saving');
  await rapptor.server.uploadToS3('reporter_test.html', '<h1>this</h1><table style="width:100%"><tr><td>is</td><td>some</td><td>stuff</td></tr><td>I</td><td>am</td><td>saving</td></tr></table>');
  await rapptor.stop();
  t.end();
});

tap.test('can run a report and pass the results to uploadToS3', async (t) => {
  const rapptor = new Rapptor({
    configPrefix: 'reporter',
  });
  await rapptor.start();
  await rapptor.server.methods.executeAndSaveReport('/testreport.html');
  await rapptor.server.methods.executeAndSaveReport('/testreport'); // should default to testreport.csv
  try {
    await rapptor.server.methods.executeAndSaveReport('/gibberish');
  } catch (e) {
    t.equal(e.toString(), 'Error: there was an error while executing report /gibberish.csv');
  }
  await rapptor.stop();
  t.end();
});
