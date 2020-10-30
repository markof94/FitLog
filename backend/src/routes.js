import Database from '@withkoji/database';

export default function (app) {
  app.get('/hits', async (req, res) => {
    try {
      const db = new Database({
        projectId: res.locals.KOJI_PROJECT_ID || process.env.KOJI_PROJECT_ID,
        projectToken: res.locals.KOJI_PROJECT_TOKEN || process.env.KOJI_PROJECT_TOKEN,
      });

      let numHits = 0;
      try {
        const { hits } = await db.get('hits', 'hits');
        numHits = hits;
      } catch (err) {
        //
      }

      res.status(200).json({ hits: numHits });
    } catch (err) {
      res.sendStatus(500);
    }
  })

  app.post('/hit', async (req, res) => {
    try {
      const db = new Database({
        projectId: res.locals.KOJI_PROJECT_ID || process.env.KOJI_PROJECT_ID,
        projectToken: res.locals.KOJI_PROJECT_TOKEN || process.env.KOJI_PROJECT_TOKEN,
      });
      let numHits = 0;
      try {
        const hits = await db.get('hits', 'hits');
        numHits = hits.hits;
      } catch (err) {
        //
      }
      await db.set('hits', 'hits', { hits: numHits + 1 });
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
