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
e.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, accept, access-control-allow-origin');
  if ('OPTIONS' == req.method) res.send(200);
  else next();
});

e.use(new ReplicacheExpressServer(options).app)
/** CORS setting with OPTIONS pre-flight handling */

e.use(express.static('static'));
e.use('*', (_req, res) => {
  const index = path.join('pages', 'index.html');
  const html = fs.readFileSync(index, 'utf8');
  res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
});

e.listen(options.port, options.host, () => {
  console.log(`Listening at http://${options.host}:${options.port}`);
});
