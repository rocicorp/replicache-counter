import { ReplicacheExpressServer } from 'replicache-express';
import express from 'express';
import path from 'path';
import fs from 'fs';
const mutators = {
  increment: async (tx, delta) => {
    const prev = (await tx.get('count')) ?? 0;
    const next = prev + delta;
    await tx.put('count', next);
  },
};

const options = {
  mutators,
  port: process.env.PORT || 3010,
  host: process.env.HOST || '0.0.0.0',
};

const e = express();
/** CORS setting with OPTIONS pre-flight handling */
e.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, accept, access-control-allow-origin, x-replicache-requestid');
  if ('OPTIONS' == req.method) res.send(200);
  else next();
});

e.use(new ReplicacheExpressServer(options).app)
e.get('/', (_req, res) => {
  res.status(200).send('OK');
});

e.listen(options.port, options.host, () => {
  console.log(`Listening at http://${options.host}:${options.port}`);
});
