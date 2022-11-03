import {NextApiRequest, NextApiResponse} from 'next';
import {
  createSpace,
  handleRequest,
  spaceExists,
} from 'replicache-nextjs/lib/backend';
import NextCors from 'nextjs-cors';
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const mutators = {
    increment: async (tx: any, delta: any) => {
      const prev = (await tx.get('count')) ?? 0;
      const next = prev + delta;
      await tx.put('count', next);
    },
  };

  const spaceID = req.query.spaceID as string;
  if (spaceID) {
    if (!(await spaceExists(spaceID))) {
      await createSpace(spaceID);
    }
  } else { 
    res.status(400).send('missing spaceID');
    return;
  }

  await handleRequest(req, res, mutators);
};
