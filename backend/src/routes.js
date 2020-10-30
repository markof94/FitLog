import Database from '@withkoji/database';
import Dispatch from '@withkoji/dispatch';

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
      let newHits = 0;
      try {
        const hits = await db.get('hits', 'hits');
        newHits = hits.hits;
      } catch (err) {
        //
      }
      newHits += 1;
      await db.set('hits', 'hits', { hits: newHits });

      // Notify anyone listening
      const dispatch = new Dispatch({
        projectId: res.locals.KOJI_PROJECT_ID || process.env.KOJI_PROJECT_ID,
        options: {
          projectToken: res.locals.KOJI_PROJECT_TOKEN || process.env.KOJI_PROJECT_TOKEN,
        },
      });
      await dispatch.connect();
      console.log('sending', newHits);
      await dispatch.emitEvent('hits_updated', { newHits });

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
