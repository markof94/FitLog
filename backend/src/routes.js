import * as uuid from 'uuid';
import Database from '@withkoji/database';
import Auth from '@withkoji/auth';

export default function (app) {
  // Ask a question
  app.post('/submit', async (req, res) => {
    try {
      if (!req.body.value) {
        res.sendStatus(400);
        return;
      }

      const insertData = {
        value: req.body.value,
        dateSubmitted: Math.floor(Date.now() / 1000),
      };

      const db = new Database();
      await db.set('responses', uuid.v4(), insertData);

      // Notify the owner that someone asked them a question
      const auth = new Auth(
        res.locals.KOJI_PROJECT_ID,
        res.locals.KOJI_PROJECT_TOKEN,
      );
      auth.pushNotificationToOwner({
          icon: '🍀',
          appName: 'Contest',
          message: `Someone entered your contest: ${req.body.value}`,
          ref: '?context=admin',
      });

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  //
  // Admin routes
  //
  app.get('/admin/list', async (req, res) => {
    try {
      // Verify admin
      const auth = new Auth(
        res.locals.KOJI_PROJECT_ID,
        res.locals.KOJI_PROJECT_TOKEN,
      );
      const role = await auth.getRole(req.headers.authorization);
      if (role !== 'admin') {
        res.sendStatus(401);
        return;
      }

      const db = new Database();
      const responses = (await db.get('responses'));
      res.status(200).json({
        responses,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
