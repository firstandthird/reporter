#!/usr/bin/env node

const Rapptor = require('rapptor');

const main = async function() {
  const service = new Rapptor({
    configPath: __dirname,
    configFile: process.cwd(),
    configPrefix: 'reporter',
    context: {
      LIBDIR: __dirname
    }
  });
  await service.start();
};
main();
