import {NextApiRequest, NextApiResponse} from 'next';
import {handleRequest} from 'replicache-nextjs/lib/backend';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const mutators = {
    increment: async (tx: any, delta: any) => {
      const prev = (await tx.get('count')) ?? 0;
      const next = prev + delta;
      await tx.put('count', next);
    },
  };
  await handleRequest(req, res, mutators);
};
