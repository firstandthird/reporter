#!/usr/bin/env node

const Rapptor = require('rapptor');

const main = async function() {
  const service = new Rapptor({
    configPrefix: 'reporter'
  });
  await service.start();
};
main();
